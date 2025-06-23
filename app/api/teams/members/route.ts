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
    const teamId = searchParams.get('teamId')
    if (!teamId) {
      return NextResponse.json({ error: 'teamId required' }, { status: 400 })
    }
    const members = await prisma.teamMember.findMany({
      where: { teamId },
      include: { user: true },
      orderBy: { joinedAt: 'asc' },
    })
    return NextResponse.json({ members })
  } catch (error: any) {
    console.error('Error listing team members:', error)
    return NextResponse.json({ error: error.message || 'Failed to list members' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { memberId, role } = await req.json()
    if (!memberId || !role) {
      return NextResponse.json({ error: 'memberId and role required' }, { status: 400 })
    }
    const updated = await prisma.teamMember.update({
      where: { id: memberId },
      data: { role },
    })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'changed-role',
        resource: 'TeamMember',
        resourceId: memberId,
        details: `Changed role to ${role}`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, member: updated })
  } catch (error: any) {
    console.error('Error updating member role:', error)
    return NextResponse.json({ error: error.message || 'Failed to update role' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const memberId = searchParams.get('memberId')
    if (!memberId) {
      return NextResponse.json({ error: 'memberId required' }, { status: 400 })
    }
    await prisma.teamMember.delete({ where: { id: memberId } })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'removed-member',
        resource: 'TeamMember',
        resourceId: memberId,
        details: `Removed member from team`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error removing member:', error)
    return NextResponse.json({ error: error.message || 'Failed to remove member' }, { status: 500 })
  }
} 