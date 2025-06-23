import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, teamId, role } = await req.json()
    if (!email || !teamId) {
      return NextResponse.json({ error: 'Email and teamId are required' }, { status: 400 })
    }

    // Check if user is already a member
    const existingMember = await prisma.teamMember.findFirst({
      where: { teamId, user: { email } },
    })
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 })
    }

    // Check for existing pending invite
    const existingInvite = await prisma.teamInvite.findFirst({
      where: { teamId, email, status: 'PENDING' },
    })
    if (existingInvite) {
      return NextResponse.json({ error: 'Invite already sent to this email' }, { status: 400 })
    }

    const token = uuidv4()
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days

    const invite = await prisma.teamInvite.create({
      data: {
        email,
        teamId,
        invitedBy: session.user.id,
        role: role || 'TEAM_MEMBER',
        token,
        expiresAt,
      },
    })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'invited',
        resource: 'TeamMember',
        resourceId: invite.id,
        details: `Invited ${email} to team ${teamId} as ${role || 'TEAM_MEMBER'}`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    // TODO: Send invite email with token link

    return NextResponse.json({ success: true, invite })
  } catch (error: any) {
    console.error('Error inviting team member:', error)
    return NextResponse.json({ error: error.message || 'Failed to invite member' }, { status: 500 })
  }
} 