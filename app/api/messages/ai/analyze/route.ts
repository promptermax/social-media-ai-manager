import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { routeAIRequest } from '@/lib/ai-task-engine'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { messageContent, platform, messageType, senderName, postTitle } = body

    if (!messageContent) {
      return NextResponse.json({ error: 'Message content required' }, { status: 400 })
    }

    // Analyze sentiment and generate suggestions
    const analysisPrompt = `Analyze the following social media message and provide insights:

Message: "${messageContent}"
Platform: ${platform || 'Unknown'}
Type: ${messageType || 'Unknown'}
Sender: ${senderName || 'Unknown'}
Post Context: ${postTitle || 'N/A'}

Please provide a JSON response with:
1. sentiment: "POSITIVE", "NEUTRAL", "NEGATIVE", or "URGENT"
2. priority: "LOW", "MEDIUM", "HIGH", or "URGENT"
3. suggestedResponse: A professional, helpful reply (max 200 characters)
4. engagementType: "REPLY", "LIKE", "IGNORE", or "ESCALATE"
5. responseUrgency: "IMMEDIATE", "WITHIN_HOUR", "WITHIN_DAY", or "LOW_PRIORITY"
6. keyTopics: Array of main topics mentioned
7. customerIntent: What the customer is trying to achieve
8. suggestedActions: Array of recommended actions

Keep the response concise and actionable.`

    const result = await routeAIRequest({
      type: 'text',
      params: {
        prompt: analysisPrompt,
        maxTokens: 1000,
        temperature: 0.3,
      },
    })

    let analysis
    try {
      analysis = JSON.parse(result.text || result)
    } catch (error) {
      // Fallback analysis if AI response isn't valid JSON
      analysis = {
        sentiment: 'NEUTRAL',
        priority: 'MEDIUM',
        suggestedResponse: 'Thank you for your message. We appreciate your feedback and will get back to you soon.',
        engagementType: 'REPLY',
        responseUrgency: 'WITHIN_DAY',
        keyTopics: ['general inquiry'],
        customerIntent: 'seeking information',
        suggestedActions: ['respond professionally'],
      }
    }

    return NextResponse.json({ success: true, analysis })
  } catch (error: any) {
    console.error('Error analyzing message:', error)
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
} 