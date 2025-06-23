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

    const preferences = await prisma.dashboardPreference.findUnique({
      where: { userId: session.user.id },
    })

    const widgetConfigs = await prisma.widgetConfig.findMany({
      where: { userId: session.user.id },
      orderBy: { position: 'asc' },
    })

    return NextResponse.json({
      preferences: preferences || {
        layout: 'default',
        theme: 'light',
        widgets: '[]',
        refreshInterval: 300,
        autoRefresh: true,
      },
      widgetConfigs,
    })
  } catch (error: any) {
    console.error('Error fetching dashboard preferences:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch preferences' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { layout, theme, widgets, refreshInterval, autoRefresh } = body

    const preferences = await prisma.dashboardPreference.upsert({
      where: { userId: session.user.id },
      update: {
        layout: layout || 'default',
        theme: theme || 'light',
        widgets: widgets || '[]',
        refreshInterval: refreshInterval ?? 300,
        autoRefresh: autoRefresh ?? true,
      },
      create: {
        userId: session.user.id,
        layout: layout || 'default',
        theme: theme || 'light',
        widgets: widgets || '[]',
        refreshInterval: refreshInterval ?? 300,
        autoRefresh: autoRefresh ?? true,
      },
    })

    return NextResponse.json({
      success: true,
      preferences,
      message: 'Dashboard preferences updated successfully',
    })
  } catch (error: any) {
    console.error('Error updating dashboard preferences:', error)
    return NextResponse.json({ error: error.message || 'Failed to update preferences' }, { status: 500 })
  }
} 