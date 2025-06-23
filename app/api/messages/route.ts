import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Security: Input validation schemas
const messageQuerySchema = z.object({
  page: z.string().optional().transform(val => Math.max(1, parseInt(val || '1'))),
  limit: z.string().optional().transform(val => Math.min(100, Math.max(1, parseInt(val || '20')))),
  platform: z.enum(['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN']).optional(),
  status: z.string().optional(),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'URGENT']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  isRead: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  isReplied: z.enum(['true', 'false']).optional().transform(val => val === 'true'),
  search: z.string().max(500).optional().transform(val => val?.trim()),
})

const messageCreateSchema = z.object({
  platform: z.enum(['INSTAGRAM', 'FACEBOOK', 'TWITTER', 'LINKEDIN']),
  type: z.enum(['COMMENT', 'DIRECT_MESSAGE', 'MENTION', 'REPLY', 'REACTION']),
  senderName: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(10000),
  sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'URGENT']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  metadata: z.record(z.any()).optional(),
})

const messageUpdateSchema = z.object({
  messageIds: z.array(z.string().cuid()).min(1).max(100),
  updates: z.object({
    isRead: z.boolean().optional(),
    isReplied: z.boolean().optional(),
    sentiment: z.enum(['POSITIVE', 'NEUTRAL', 'NEGATIVE', 'URGENT']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    status: z.string().optional(),
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  }),
})

// Security: Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: number = 100, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

// Security: Sanitize search query
function sanitizeSearchQuery(query: string): string {
  return query
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, '')
    .substring(0, 500)
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Security: Rate limiting
    const clientId = session.user.id
    if (!checkRateLimit(clientId)) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const { searchParams } = new URL(req.url)
    
    // Security: Validate and sanitize query parameters
    const queryData = messageQuerySchema.parse({
      page: searchParams.get('page'),
      limit: searchParams.get('limit'),
      platform: searchParams.get('platform'),
      status: searchParams.get('status'),
      sentiment: searchParams.get('sentiment'),
      priority: searchParams.get('priority'),
      isRead: searchParams.get('isRead'),
      isReplied: searchParams.get('isReplied'),
      search: searchParams.get('search'),
    })

    // Build optimized where clause
    const where: any = {
      userId: session.user.id,
    }

    if (queryData.platform) where.platform = queryData.platform
    if (queryData.status) where.status = queryData.status
    if (queryData.sentiment) where.sentiment = queryData.sentiment
    if (queryData.priority) where.priority = queryData.priority
    if (queryData.isRead !== undefined) where.isRead = queryData.isRead
    if (queryData.isReplied !== undefined) where.isReplied = queryData.isReplied
    if (queryData.search) {
      // Security: Sanitize search query
      const sanitizedSearch = sanitizeSearchQuery(queryData.search)
      where.OR = [
        { content: { contains: sanitizedSearch, mode: 'insensitive' } },
        { senderName: { contains: sanitizedSearch, mode: 'insensitive' } },
      ]
    }

    // Calculate pagination
    const skip = (queryData.page - 1) * queryData.limit

    // Use Promise.all for parallel execution
    const [messages, totalCount, unreadCount] = await Promise.all([
      prisma.message.findMany({
        where,
        select: {
          id: true,
          platform: true,
          type: true,
          senderName: true,
          content: true,
          sentiment: true,
          priority: true,
          isRead: true,
          isReplied: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: { replies: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: queryData.limit,
      }),
      prisma.message.count({ where }),
      prisma.message.count({ 
        where: { 
          userId: session.user.id, 
          isRead: false 
        } 
      }),
    ])

    // Transform data efficiently
    const transformedMessages = messages.map(msg => ({
      ...msg,
      replyCount: msg._count.replies,
      _count: undefined, // Remove the _count object
    }))

    return NextResponse.json({
      messages: transformedMessages,
      pagination: {
        page: queryData.page,
        limit: queryData.limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / queryData.limit),
        hasNext: queryData.page * queryData.limit < totalCount,
        hasPrev: queryData.page > 1,
      },
      summary: {
        total: totalCount,
        unread: unreadCount,
        replied: await prisma.message.count({
          where: { userId: session.user.id, isReplied: true }
        }),
      }
    })

  } catch (error: any) {
    // Security: Don't expose internal errors
    console.error('Error fetching messages:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid request parameters',
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Security: Rate limiting
    const clientId = session.user.id
    if (!checkRateLimit(clientId, 50, 60 * 1000)) { // 50 requests per minute for POST
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await req.json()
    
    // Security: Validate input data
    const validatedData = messageCreateSchema.parse(body)

    // Use create with minimal data
    const message = await prisma.message.create({
      data: {
        platform: validatedData.platform,
        type: validatedData.type,
        senderName: validatedData.senderName || 'Unknown',
        content: validatedData.content,
        sentiment: validatedData.sentiment || 'NEUTRAL',
        priority: validatedData.priority || 'MEDIUM',
        metadata: validatedData.metadata || {},
        userId: session.user.id,
      },
      select: {
        id: true,
        platform: true,
        type: true,
        senderName: true,
        content: true,
        sentiment: true,
        priority: true,
        isRead: true,
        isReplied: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ success: true, message })

  } catch (error: any) {
    console.error('Error creating message:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid message data',
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Security: Rate limiting
    const clientId = session.user.id
    if (!checkRateLimit(clientId, 30, 60 * 1000)) { // 30 requests per minute for PATCH
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    const body = await req.json()
    
    // Security: Validate input data
    const validatedData = messageUpdateSchema.parse(body)

    // Use updateMany for better performance
    const result = await prisma.message.updateMany({
      where: {
        id: { in: validatedData.messageIds },
        userId: session.user.id, // Security: ensure user owns the messages
      },
      data: validatedData.updates,
    })

    return NextResponse.json({
      success: true,
      updated: result.count,
      message: `Updated ${result.count} messages`
    })

  } catch (error: any) {
    console.error('Error updating messages:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid update data',
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to update messages' }, { status: 500 })
  }
} 