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

    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ error: 'Invite token required' }, { status: 400 })
    }

    const invite = await prisma.teamInvite.findUnique({ where: { token } })
    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired invite' }, { status: 400 })
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: { teamId: invite.teamId, userId: session.user.id },
    })
    if (existingMember) {
      return NextResponse.json({ error: 'Already a team member' }, { status: 400 })
    }

    // Add user to team
    await prisma.teamMember.create({
      data: {
        userId: session.user.id,
        teamId: invite.teamId,
        role: invite.role,
      },
    })

    await prisma.teamInvite.update({
      where: { token },
      data: { status: 'ACCEPTED', acceptedAt: new Date() },
    })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'accepted-invite',
        resource: 'TeamInvite',
        resourceId: invite.id,
        details: `User accepted invite to team ${invite.teamId} as ${invite.role}`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error accepting invite:', error)
    return NextResponse.json({ error: error.message || 'Failed to accept invite' }, { status: 500 })
  }
} 