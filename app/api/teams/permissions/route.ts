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
    const role = searchParams.get('role')
    if (!teamId) {
      return NextResponse.json({ error: 'teamId required' }, { status: 400 })
    }
    const where: any = { teamId }
    if (role) where.role = role
    const permissions = await prisma.teamPermission.findMany({
      where,
      orderBy: { resource: 'asc' },
    })
    return NextResponse.json({ permissions })
  } catch (error: any) {
    console.error('Error listing permissions:', error)
    return NextResponse.json({ error: error.message || 'Failed to list permissions' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { teamId, role, resource, action, allowed } = await req.json()
    if (!teamId || !role || !resource || !action) {
      return NextResponse.json({ error: 'teamId, role, resource, and action required' }, { status: 400 })
    }
    const permission = await prisma.teamPermission.upsert({
      where: { teamId_role_resource_action: { teamId, role, resource, action } },
      update: { allowed: allowed ?? true },
      create: { teamId, role, resource, action, allowed: allowed ?? true },
    })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'changed-permission',
        resource: 'TeamPermission',
        resourceId: permission.id,
        details: `Set ${role} permission for ${resource}/${action} to ${allowed ?? true}`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true, permission })
  } catch (error: any) {
    console.error('Error saving permission:', error)
    return NextResponse.json({ error: error.message || 'Failed to save permission' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const teamId = searchParams.get('teamId')
    const role = searchParams.get('role')
    const resource = searchParams.get('resource')
    const action = searchParams.get('action')
    if (!teamId || !role || !resource || !action) {
      return NextResponse.json({ error: 'teamId, role, resource, and action required' }, { status: 400 })
    }
    await prisma.teamPermission.delete({
      where: { teamId_role_resource_action: { teamId, role, resource, action } },
    })

    // Audit log
    await prisma.activity.create({
      data: {
        action: 'removed-permission',
        resource: 'TeamPermission',
        resourceId: `${teamId}-${role}-${resource}-${action}`,
        details: `Removed ${role} permission for ${resource}/${action}`,
        userId: session.user.id,
        createdAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting permission:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete permission' }, { status: 500 })
  }
} 