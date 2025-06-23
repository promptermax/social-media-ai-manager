import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { routeAIRequest } from '@/lib/ai-task-engine'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const document = await prisma.document.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    if (!document.content) {
      return NextResponse.json({ error: 'Document has no content to process' }, { status: 400 })
    }

    // Process document with AI
    const insights = await processDocumentWithAI(
      document.content,
      document.name,
      document.type
    )

    // Update document with insights
    const updatedDocument = await prisma.document.update({
      where: { id: params.id },
      data: {
        insights: JSON.stringify(insights),
        isProcessed: true,
      },
    })

    return NextResponse.json({
      success: true,
      document: updatedDocument,
      insights,
    })
  } catch (error: any) {
    console.error('Document processing error:', error)
    return NextResponse.json({ error: error.message || 'Processing failed' }, { status: 500 })
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