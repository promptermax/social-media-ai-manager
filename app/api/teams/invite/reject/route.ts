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

    await prisma.teamInvite.update({
      where: { token },
      data: { status: 'REJECTED', rejectedAt: new Date() },
    })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'rejected-invite',
        resource: 'TeamInvite',
        resourceId: invite.id,
        details: `User rejected invite to team ${invite.teamId}`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error rejecting invite:', error)
    return NextResponse.json({ error: error.message || 'Failed to reject invite' }, { status: 500 })
  }
} 