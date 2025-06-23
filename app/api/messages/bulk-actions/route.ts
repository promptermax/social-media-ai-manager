import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { messageIds, action, data } = body

    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return NextResponse.json({ error: 'Message IDs array required' }, { status: 400 })
    }

    if (!action) {
      return NextResponse.json({ error: 'Action required' }, { status: 400 })
    }

    // Verify all messages belong to the user
    const messages = await prisma.message.findMany({
      where: {
        id: { in: messageIds },
        userId: session.user.id,
      },
    })

    if (messages.length !== messageIds.length) {
      return NextResponse.json({ error: 'Some messages not found or unauthorized' }, { status: 404 })
    }

    let result
    const messageIdsArray = messageIds

    switch (action) {
      case 'mark_as_read':
        result = await prisma.message.updateMany({
          where: {
            id: { in: messageIdsArray },
            userId: session.user.id,
          },
          data: { isRead: true },
        })
        break

      case 'mark_as_unread':
        result = await prisma.message.updateMany({
          where: {
            id: { in: messageIdsArray },
            userId: session.user.id,
          },
          data: { isRead: false },
        })
        break

      case 'mark_as_replied':
        result = await prisma.message.updateMany({
          where: {
            id: { in: messageIdsArray },
            userId: session.user.id,
          },
          data: { isReplied: true },
        })
        break

      case 'update_sentiment':
        if (!data?.sentiment) {
          return NextResponse.json({ error: 'Sentiment value required' }, { status: 400 })
        }
        result = await prisma.message.updateMany({
          where: {
            id: { in: messageIdsArray },
            userId: session.user.id,
          },
          data: { sentiment: data.sentiment },
        })
        break

      case 'update_priority':
        if (!data?.priority) {
          return NextResponse.json({ error: 'Priority value required' }, { status: 400 })
        }
        result = await prisma.message.updateMany({
          where: {
            id: { in: messageIdsArray },
            userId: session.user.id,
          },
          data: { priority: data.priority },
        })
        break

      case 'flag':
        // Add flag to metadata
        const flagPromises = messageIdsArray.map(async (id) => {
          const message = await prisma.message.findUnique({
            where: { id },
          })
          
          let metadata = {}
          try {
            metadata = message?.metadata ? JSON.parse(message.metadata) : {}
          } catch {
            metadata = {}
          }
          
          metadata.flagged = true
          metadata.flaggedAt = new Date().toISOString()
          metadata.flaggedBy = session.user.id
          
          return prisma.message.update({
            where: { id },
            data: { metadata: JSON.stringify(metadata) },
          })
        })
        await Promise.all(flagPromises)
        result = { count: messageIdsArray.length }
        break

      case 'unflag':
        // Remove flag from metadata
        const unflagPromises = messageIdsArray.map(async (id) => {
          const message = await prisma.message.findUnique({
            where: { id },
          })
          
          let metadata = {}
          try {
            metadata = message?.metadata ? JSON.parse(message.metadata) : {}
          } catch {
            metadata = {}
          }
          
          delete metadata.flagged
          delete metadata.flaggedAt
          delete metadata.flaggedBy
          
          return prisma.message.update({
            where: { id },
            data: { metadata: JSON.stringify(metadata) },
          })
        })
        await Promise.all(unflagPromises)
        result = { count: messageIdsArray.length }
        break

      case 'delete':
        result = await prisma.message.deleteMany({
          where: {
            id: { in: messageIdsArray },
            userId: session.user.id,
          },
        })
        break

      case 'archive':
        // Add archive to metadata
        const archivePromises = messageIdsArray.map(async (id) => {
          const message = await prisma.message.findUnique({
            where: { id },
          })
          
          let metadata = {}
          try {
            metadata = message?.metadata ? JSON.parse(message.metadata) : {}
          } catch {
            metadata = {}
          }
          
          metadata.archived = true
          metadata.archivedAt = new Date().toISOString()
          metadata.archivedBy = session.user.id
          
          return prisma.message.update({
            where: { id },
            data: { metadata: JSON.stringify(metadata) },
          })
        })
        await Promise.all(archivePromises)
        result = { count: messageIdsArray.length }
        break

      case 'unarchive':
        // Remove archive from metadata
        const unarchivePromises = messageIdsArray.map(async (id) => {
          const message = await prisma.message.findUnique({
            where: { id },
          })
          
          let metadata = {}
          try {
            metadata = message?.metadata ? JSON.parse(message.metadata) : {}
          } catch {
            metadata = {}
          }
          
          delete metadata.archived
          delete metadata.archivedAt
          delete metadata.archivedBy
          
          return prisma.message.update({
            where: { id },
            data: { metadata: JSON.stringify(metadata) },
          })
        })
        await Promise.all(unarchivePromises)
        result = { count: messageIdsArray.length }
        break

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      action,
      processed: result.count || messageIdsArray.length,
      messageIds: messageIdsArray,
    })
  } catch (error: any) {
    console.error('Error in bulk actions:', error)
    return NextResponse.json({ error: error.message || 'Bulk action failed' }, { status: 500 })
  }
} 