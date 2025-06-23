import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { content } = body
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Reply content required' }, { status: 400 })
    }

    const message = await prisma.message.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Save reply
    const reply = await prisma.messageReply.create({
      data: {
        content,
        isDraft: false,
        isSent: true,
        sentAt: new Date(),
        messageId: message.id,
        userId: session.user.id,
      },
    })

    // Mark message as replied
    await prisma.message.update({
      where: { id: message.id },
      data: { isReplied: true },
    })

    // Return updated message with replies
    const updatedMessage = await prisma.message.findFirst({
      where: { id: message.id },
      include: {
        replies: { orderBy: { createdAt: 'asc' } },
        socialAccount: true,
      },
    })

    return NextResponse.json({ success: true, reply, message: updatedMessage })
  } catch (error: any) {
    console.error('Error sending reply:', error)
    return NextResponse.json({ error: error.message || 'Failed to send reply' }, { status: 500 })
  }
} 