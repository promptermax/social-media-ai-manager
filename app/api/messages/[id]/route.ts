import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const message = await prisma.message.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        socialAccount: true,
      },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    return NextResponse.json({ message })
  } catch (error: any) {
    console.error('Error fetching message:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch message' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { isRead, isReplied, sentiment, priority } = body

    const message = await prisma.message.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    const updatedMessage = await prisma.message.update({
      where: { id: params.id },
      data: {
        ...(isRead !== undefined && { isRead }),
        ...(isReplied !== undefined && { isReplied }),
        ...(sentiment && { sentiment }),
        ...(priority && { priority }),
      },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
        socialAccount: true,
      },
    })

    return NextResponse.json({ success: true, message: updatedMessage })
  } catch (error: any) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: error.message || 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    await prisma.message.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete message' }, { status: 500 })
  }
} 