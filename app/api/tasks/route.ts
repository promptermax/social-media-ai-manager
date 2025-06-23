import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const assignedToId = searchParams.get('assignedToId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const teamId = searchParams.get('teamId')
    const where: any = {}
    if (assignedToId) where.assignedToId = assignedToId
    if (status) where.status = status
    if (type) where.type = type
    // Optionally filter by team (if you have teamId on Task or via user/team membership)
    const tasks = await prisma.task.findMany({
      where,
      include: { assignedTo: true, user: true },
      orderBy: { dueDate: 'asc' },
    })
    return NextResponse.json({ tasks })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch tasks' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { title, description, type, dueDate, assignedToId, priority } = await req.json()
    if (!title || !assignedToId || !type) {
      return NextResponse.json({ error: 'title, assignedToId, and type are required' }, { status: 400 })
    }
    const task = await prisma.task.create({
      data: {
        title,
        description,
        type: type.toUpperCase(),
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedToId,
        userId: session.user.id,
        priority: priority ? priority.toUpperCase() : 'MEDIUM',
      },
      include: { assignedTo: true },
    })
    // Send notification to assignee
    if (task.assignedToId) {
      await prisma.notification.create({
        data: {
          userId: task.assignedToId,
          title: 'New Task Assigned',
          message: `You have been assigned a new ${task.type.toLowerCase()} task: ${title}`,
          type: 'INFO',
        },
      })
    }
    return NextResponse.json({ success: true, task })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create task' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id, ...update } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Task id required' }, { status: 400 })
    }
    const task = await prisma.task.update({
      where: { id },
      data: update,
      include: { assignedTo: true },
    })
    // Notify new assignee if changed
    if (update.assignedToId && update.assignedToId !== task.assignedToId) {
      await prisma.notification.create({
        data: {
          userId: update.assignedToId,
          title: 'Task Assigned',
          message: `You have been assigned a new task: ${task.title}`,
          type: 'INFO',
        },
      })
    }
    return NextResponse.json({ success: true, task })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update task' }, { status: 500 })
  }
} 