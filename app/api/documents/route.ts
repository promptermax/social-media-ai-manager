export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { routeAIRequest } from '@/lib/ai-task-engine'
import { z } from 'zod'

// Security: Input validation schemas
const documentCreateSchema = z.object({
  name: z.string().min(1).max(255),
  type: z.enum(['BUSINESS_PLAN', 'BRAND_GUIDELINES', 'MARKET_RESEARCH', 'COMPETITOR_ANALYSIS', 'CONTENT_STRATEGY']),
  description: z.string().max(1000).optional(),
})

// Security: File type validation using magic numbers
const FILE_SIGNATURES = {
  pdf: [0x25, 0x50, 0x44, 0x46], // %PDF
  docx: [0x50, 0x4B, 0x03, 0x04], // PK\x03\x04
  pptx: [0x50, 0x4B, 0x03, 0x04], // PK\x03\x04
  txt: [], // No specific signature for text files
}

// Security: Validate file type by checking file signature
async function validateFileType(file: File): Promise<{ valid: boolean; type?: string; error?: string }> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const signature = Array.from(buffer.slice(0, 4))
  
  // Check for PDF
  if (signature.every((byte, index) => byte === FILE_SIGNATURES.pdf[index])) {
    return { valid: true, type: 'pdf' }
  }
  
  // Check for DOCX/PPTX (ZIP-based formats)
  if (signature.every((byte, index) => byte === FILE_SIGNATURES.docx[index])) {
    // Additional check for DOCX/PPTX specific content
    const zipContent = buffer.toString('utf8', 0, 1000)
    if (zipContent.includes('[Content_Types].xml')) {
      if (zipContent.includes('word/')) {
        return { valid: true, type: 'docx' }
      } else if (zipContent.includes('ppt/')) {
        return { valid: true, type: 'pptx' }
      }
    }
  }
  
  // For text files, check if content is readable text
  if (file.name.toLowerCase().endsWith('.txt')) {
    const textContent = buffer.toString('utf8', 0, 1000)
    if (textContent.length > 0) {
      return { valid: true, type: 'txt' }
    }
  }
  
  return { valid: false, error: 'Invalid or unsupported file type' }
}

// Security: Sanitize file content
function sanitizeContent(content: string): string {
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 1000000) // Limit content size to 1MB
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const name = formData.get('name') as string
    const type = formData.get('type') as string
    const description = formData.get('description') as string

    // Security: Validate required fields
    if (!file || !name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Security: Validate input data
    const validatedData = documentCreateSchema.parse({ name, type, description })

    // Security: Validate file type using signatures
    const fileValidation = await validateFileType(file)
    if (!fileValidation.valid) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 })
    }

    // Security: Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024 // 25MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size too large. Maximum size is 25MB.' }, { status: 400 })
    }

    // Security: Sanitize file content
    let fileContent: string
    try {
      fileContent = await file.text()
      fileContent = sanitizeContent(fileContent)
    } catch (error) {
      return NextResponse.json({ error: 'Failed to read file content' }, { status: 400 })
    }

    // Create document record
    const document = await prisma.document.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        content: fileContent,
        userId: session.user.id,
        isProcessed: false,
      },
      select: {
        id: true,
        name: true,
        type: true,
        isProcessed: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ 
      success: true, 
      document,
      message: 'Document uploaded successfully'
    })

  } catch (error: any) {
    console.error('Error uploading document:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Invalid document data',
        details: error.errors 
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const type = searchParams.get('type')
    const search = searchParams.get('search')

    // Security: Sanitize search query
    const sanitizedSearch = search ? search.replace(/[<>:"/\\|?*\x00-\x1f]/g, '').substring(0, 500) : null

    const where: any = {
      userId: session.user.id,
    }

    if (type) {
      where.type = type
    }

    if (sanitizedSearch) {
      where.OR = [
        { name: { contains: sanitizedSearch, mode: 'insensitive' } },
        { content: { contains: sanitizedSearch, mode: 'insensitive' } },
      ]
    }

    const skip = (page - 1) * limit

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        select: {
          id: true,
          name: true,
          type: true,
          isProcessed: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.document.count({ where }),
    ])

    return NextResponse.json({
      documents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      }
    })

  } catch (error: any) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}

async function processDocumentWithAI(content: string, name: string, type: string) {
  const prompt = `Analyze the following business document and extract key insights that would be useful for social media content generation and strategy planning.

Document Name: ${name}
Document Type: ${type}
Content: ${content.substring(0, 8000)} // Limit content length

Please provide:
1. Key business insights (target audience, goals, differentiators)
2. Brand voice and tone indicators
3. Important messaging themes
4. Market positioning insights
5. Content opportunities

Format the response as a JSON object with these keys:
- businessInsights: array of key business points
- brandVoice: string describing brand voice
- messagingThemes: array of key themes
- marketPositioning: string describing market position
- contentOpportunities: array of content ideas
- summary: brief summary of the document

Keep each insight concise and actionable.`

  const result = await routeAIRequest({
    type: 'text',
    params: {
      prompt,
      maxTokens: 2000,
      temperature: 0.3,
    },
  })

  try {
    return JSON.parse(result.text || result)
  } catch (error) {
    // If AI response isn't valid JSON, create a basic structure
    return {
      businessInsights: ['Document processed successfully'],
      brandVoice: 'Professional',
      messagingThemes: ['Business growth'],
      marketPositioning: 'Competitive market',
      contentOpportunities: ['Share business insights'],
      summary: 'Document uploaded and processed',
    }
  }
} 