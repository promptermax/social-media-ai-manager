import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { routeAIRequest } from '@/lib/ai-task-engine'

// Cache for AI responses to avoid redundant API calls
const aiResponseCache = new Map<string, any>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { 
      messageIds, 
      action, 
      batchSize = 10, // Process in smaller batches
      platform 
    } = body

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: 'Message IDs required' }, { status: 400 })
    }

    if (!action || !['analyze', 'auto-reply', 'categorize'].includes(action)) {
      return NextResponse.json({ error: 'Valid action required' }, { status: 400 })
    }

    // Limit batch size to prevent memory issues
    const limitedMessageIds = messageIds.slice(0, 100)
    
    // Process messages in batches
    const results = []
    const errors = []
    
    for (let i = 0; i < limitedMessageIds.length; i += batchSize) {
      const batch = limitedMessageIds.slice(i, i + batchSize)
      
      try {
        const batchResults = await processMessageBatch(
          batch, 
          action, 
          session.user.id, 
          platform
        )
        results.push(...batchResults)
      } catch (error: any) {
        console.error(`Batch processing error (${i}-${i + batchSize}):`, error)
        errors.push({
          batch: `${i}-${i + batchSize}`,
          error: error.message
        })
      }
    }

    // Clean up old cache entries
    cleanupCache()

    return NextResponse.json({
      success: true,
      processed: results.length,
      errors: errors.length,
      results,
      errorDetails: errors
    })

  } catch (error: any) {
    console.error('Bulk processing error:', error)
    return NextResponse.json({ error: error.message || 'Bulk processing failed' }, { status: 500 })
  }
}

async function processMessageBatch(
  messageIds: string[], 
  action: string, 
  userId: string, 
  platform?: string
) {
  // Fetch messages with optimized query
  const messages = await prisma.message.findMany({
    where: {
      id: { in: messageIds },
      userId,
      ...(platform ? { platform } : {}),
    },
    select: {
      id: true,
      content: true,
      platform: true,
      type: true,
      senderName: true,
      sentiment: true,
      priority: true,
    },
  })

  if (messages.length === 0) {
    return []
  }

  const results = []

  // Process messages in parallel with concurrency limit
  const concurrencyLimit = 5
  for (let i = 0; i < messages.length; i += concurrencyLimit) {
    const batch = messages.slice(i, i + concurrencyLimit)
    
    const batchPromises = batch.map(async (message) => {
      try {
        const cacheKey = `${action}-${message.content.substring(0, 100)}`
        
        // Check cache first
        if (aiResponseCache.has(cacheKey)) {
          const cached = aiResponseCache.get(cacheKey)
          if (Date.now() - cached.timestamp < CACHE_TTL) {
            return {
              messageId: message.id,
              success: true,
              result: cached.data,
              cached: true
            }
          }
        }

        // Process with AI
        const result = await processMessageWithAI(message, action)
        
        // Cache the result
        aiResponseCache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        })

        // Update database in batch
        await updateMessageWithResult(message.id, action, result)

        return {
          messageId: message.id,
          success: true,
          result,
          cached: false
        }
      } catch (error: any) {
        console.error(`Error processing message ${message.id}:`, error)
        return {
          messageId: message.id,
          success: false,
          error: error.message
        }
      }
    })

    const batchResults = await Promise.all(batchPromises)
    results.push(...batchResults)
  }

  return results
}

async function processMessageWithAI(message: any, action: string) {
  // Simulate AI processing with different actions
  switch (action) {
    case 'analyze':
      return {
        sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)],
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)],
        category: ['support', 'feedback', 'complaint', 'question'][Math.floor(Math.random() * 4)],
        keywords: ['customer', 'service', 'product', 'help'].slice(0, Math.floor(Math.random() * 3) + 1),
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
      }
    
    case 'auto-reply':
      const templates = {
        positive: 'Thank you for your positive feedback! We appreciate your support.',
        negative: 'We apologize for the inconvenience. Our team will look into this matter.',
        neutral: 'Thank you for reaching out. We\'ll get back to you soon.',
      }
      return {
        suggestedReply: templates[message.sentiment as keyof typeof templates] || templates.neutral,
        tone: 'professional',
        urgency: message.priority === 'urgent' ? 'high' : 'normal',
      }
    
    case 'categorize':
      return {
        category: ['support', 'feedback', 'complaint', 'question', 'general'][Math.floor(Math.random() * 5)],
        subcategory: ['technical', 'billing', 'product', 'service'][Math.floor(Math.random() * 4)],
        tags: ['urgent', 'follow-up', 'escalate'].slice(0, Math.floor(Math.random() * 2) + 1),
      }
    
    default:
      throw new Error(`Unknown action: ${action}`)
  }
}

async function updateMessageWithResult(messageId: string, action: string, result: any) {
  const updateData: any = {}
  
  switch (action) {
    case 'analyze':
      updateData.sentiment = result.sentiment
      updateData.priority = result.priority
      updateData.category = result.category
      updateData.keywords = result.keywords
      updateData.confidence = result.confidence
      break
    
    case 'auto-reply':
      updateData.suggestedReply = result.suggestedReply
      updateData.replyTone = result.tone
      updateData.replyUrgency = result.urgency
      break
    
    case 'categorize':
      updateData.category = result.category
      updateData.subcategory = result.subcategory
      updateData.tags = result.tags
      break
  }

  // Use updateMany for better performance
  await prisma.message.updateMany({
    where: { id: messageId },
    data: updateData,
  })
}

function cleanupCache() {
  const now = Date.now()
  for (const [key, value] of aiResponseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      aiResponseCache.delete(key)
    }
  }
} 