import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { routeAIRequest } from '@/lib/ai-task-engine'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { messageId, tone, includeEmoji, maxLength } = body

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    // Get the message and user's business documents for context
    const [message, documents] = await Promise.all([
      prisma.message.findFirst({
        where: {
          id: messageId,
          userId: session.user.id,
        },
      }),
      prisma.document.findMany({
        where: {
          userId: session.user.id,
          isProcessed: true,
        },
        take: 3, // Get most recent documents
        orderBy: { updatedAt: 'desc' },
      }),
    ])

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Extract business context from documents
    let businessContext = ''
    if (documents.length > 0) {
      const insights = documents.map((doc: any) => {
        try {
          return JSON.parse(doc.insights || '{}')
        } catch {
          return {}
        }
      })
      
      businessContext = insights.map((insight: any) => 
        `Brand Voice: ${insight.brandVoice || 'Professional'}, ` +
        `Key Themes: ${insight.messagingThemes?.join(', ') || 'Business growth'}, ` +
        `Target Audience: ${insight.businessInsights?.[0] || 'General customers'}`
      ).join('; ')
    }

    const autoReplyPrompt = `Generate a professional auto-reply for this social media message:

Original Message: "${message.content}"
Platform: ${message.platform}
Message Type: ${message.type}
Sender: ${message.senderName}
Post Context: ${message.postTitle || 'N/A'}

Business Context: ${businessContext || 'Professional, customer-focused business'}

Requirements:
- Tone: ${tone || 'Professional and friendly'}
- Include emojis: ${includeEmoji ? 'Yes' : 'No'}
- Max length: ${maxLength || 200} characters
- Platform-appropriate for ${message.platform}
- Address the sender's intent
- Maintain brand voice
- Be helpful and engaging

Generate 3 different reply options:
1. Quick acknowledgment
2. Detailed response
3. Conversational engagement

Format as JSON:
{
  "options": [
    {"type": "quick", "content": "..."},
    {"type": "detailed", "content": "..."},
    {"type": "conversational", "content": "..."}
  ]
}`

    const result = await routeAIRequest({
      type: 'text',
      params: {
        prompt: autoReplyPrompt,
        maxTokens: 800,
        temperature: 0.7,
      },
    })

    let autoReplies
    try {
      autoReplies = JSON.parse(result.text || result)
    } catch (error) {
      // Fallback auto-replies
      autoReplies = {
        options: [
          {
            type: 'quick',
            content: 'Thank you for reaching out! We appreciate your message and will get back to you soon.',
          },
          {
            type: 'detailed',
            content: 'Thank you for your message! We\'re here to help and will respond with more details shortly. Is there anything specific you\'d like to know?',
          },
          {
            type: 'conversational',
            content: 'Thanks for getting in touch! We love hearing from our community. What can we help you with today?',
          },
        ],
      }
    }

    return NextResponse.json({ success: true, autoReplies })
  } catch (error: any) {
    console.error('Error generating auto-reply:', error)
    return NextResponse.json({ error: error.message || 'Auto-reply generation failed' }, { status: 500 })
  }
} 