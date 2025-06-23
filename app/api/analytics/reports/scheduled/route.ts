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

    const scheduledReports = await prisma.scheduledReport.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ scheduledReports })
  } catch (error: any) {
    console.error('Error fetching scheduled reports:', error)
    return NextResponse.json({ error: error.message || 'Failed to fetch scheduled reports' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const {
      name,
      reportType,
      format,
      frequency,
      dayOfWeek,
      dayOfMonth,
      time,
      platform,
      includeCharts,
      emailRecipients,
      isActive = true,
    } = body

    if (!name || !reportType || !frequency) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const scheduledReport = await prisma.scheduledReport.create({
      data: {
        userId: session.user.id,
        name,
        reportType,
        format,
        frequency,
        dayOfWeek,
        dayOfMonth,
        time,
        platform,
        includeCharts,
        emailRecipients: emailRecipients || [],
        isActive,
        nextRun: calculateNextRun(frequency, dayOfWeek, dayOfMonth, time),
      },
    })

    return NextResponse.json({ 
      success: true, 
      scheduledReport,
      message: 'Scheduled report created successfully' 
    })

  } catch (error: any) {
    console.error('Error creating scheduled report:', error)
    return NextResponse.json({ error: error.message || 'Failed to create scheduled report' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingReport = await prisma.scheduledReport.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existingReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    // Calculate next run if frequency changed
    if (updateData.frequency || updateData.dayOfWeek || updateData.dayOfMonth || updateData.time) {
      updateData.nextRun = calculateNextRun(
        updateData.frequency || existingReport.frequency,
        updateData.dayOfWeek || existingReport.dayOfWeek,
        updateData.dayOfMonth || existingReport.dayOfMonth,
        updateData.time || existingReport.time
      )
    }

    const updatedReport = await prisma.scheduledReport.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ 
      success: true, 
      scheduledReport: updatedReport,
      message: 'Scheduled report updated successfully' 
    })

  } catch (error: any) {
    console.error('Error updating scheduled report:', error)
    return NextResponse.json({ error: error.message || 'Failed to update scheduled report' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Report ID required' }, { status: 400 })
    }

    // Verify ownership
    const existingReport = await prisma.scheduledReport.findFirst({
      where: { id, userId: session.user.id },
    })

    if (!existingReport) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 })
    }

    await prisma.scheduledReport.delete({
      where: { id },
    })

    return NextResponse.json({ 
      success: true,
      message: 'Scheduled report deleted successfully' 
    })

  } catch (error: any) {
    console.error('Error deleting scheduled report:', error)
    return NextResponse.json({ error: error.message || 'Failed to delete scheduled report' }, { status: 500 })
  }
}

function calculateNextRun(frequency: string, dayOfWeek?: number, dayOfMonth?: number, time?: string): Date {
  const now = new Date()
  const nextRun = new Date(now)

  // Set time if provided
  if (time) {
    const [hours, minutes] = time.split(':').map(Number)
    nextRun.setHours(hours, minutes, 0, 0)
  }

  switch (frequency) {
    case 'daily':
      nextRun.setDate(nextRun.getDate() + 1)
      break
    case 'weekly':
      if (dayOfWeek !== undefined) {
        const currentDay = nextRun.getDay()
        const daysToAdd = (dayOfWeek - currentDay + 7) % 7
        nextRun.setDate(nextRun.getDate() + daysToAdd)
      } else {
        nextRun.setDate(nextRun.getDate() + 7)
      }
      break
    case 'monthly':
      if (dayOfMonth !== undefined) {
        nextRun.setDate(dayOfMonth)
        if (nextRun <= now) {
          nextRun.setMonth(nextRun.getMonth() + 1)
        }
      } else {
        nextRun.setMonth(nextRun.getMonth() + 1)
      }
      break
    default:
      nextRun.setDate(nextRun.getDate() + 1)
  }

  return nextRun
} 