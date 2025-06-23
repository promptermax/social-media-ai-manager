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
    const { 
      reportType, 
      format = 'json', 
      dateFrom, 
      dateTo, 
      platform, 
      includeCharts = true 
    } = body

    if (!reportType) {
      return NextResponse.json({ error: 'Report type required' }, { status: 400 })
    }

    // Build date filter
    const dateFilter: any = {}
    if (dateFrom) {
      dateFilter.gte = new Date(dateFrom)
    }
    if (dateTo) {
      
      dateFilter.lte = new Date(dateTo)
    }

    let reportData: any = {}

    switch (reportType) {
      case 'campaign':
        reportData = await generateCampaignReportOptimized(session.user.id, dateFilter, platform)
        break
      case 'posts':
        reportData = await generatePostsReportOptimized(session.user.id, dateFilter, platform)
        break
      case 'audience':
        reportData = await generateAudienceReportOptimized(session.user.id, dateFilter, platform)
        break
      case 'engagement':
        reportData = await generateEngagementReportOptimized(session.user.id, dateFilter, platform)
        break
      case 'messages':
        reportData = await generateMessagesReportOptimized(session.user.id, dateFilter, platform)
        break
      default:
        return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    // Add metadata
    reportData.metadata = {
      generatedAt: new Date().toISOString(),
      reportType,
      dateRange: { from: dateFrom, to: dateTo },
      platform,
      userId: session.user.id,
    }

    // Format response based on requested format
    if (format === 'csv') {
      return generateCSVResponse(reportData, reportType)
    } else if (format === 'pdf') {
      return generatePDFResponse(reportData, reportType)
    }

    return NextResponse.json({
      success: true,
      report: reportData,
      downloadUrl: `/api/analytics/reports/download?type=${reportType}&format=${format}&timestamp=${Date.now()}`
    })

  } catch (error: any) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: error.message || 'Report generation failed' }, { status: 500 })
  }
}

// Optimized campaign report using database aggregations
async function generateCampaignReportOptimized(userId: string, dateFilter: any, platform?: string) {
  const where: any = {
    userId,
    ...(dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}),
    ...(platform ? { platform } : {}),
  }

  // Use database aggregations instead of fetching all data
  const [postStats, messageStats, documentCount] = await Promise.all([
    prisma.post.groupBy({
      by: ['platform', 'status'],
      where,
      _count: true,
    }),
    prisma.message.groupBy({
      by: ['platform', 'sentiment'],
      where,
      _count: true,
    }),
    prisma.document.count({
      where: { userId },
    }),
  ])

  // Calculate metrics from aggregated data
  const totalPosts = postStats.reduce((sum, stat) => sum + stat._count, 0)
  const platformBreakdown = postStats.reduce((acc, stat) => {
    acc[stat.platform] = (acc[stat.platform] || 0) + stat._count
    return acc
  }, {} as any)

  const sentimentDistribution = messageStats.reduce((acc, stat) => {
    acc[stat.sentiment] = (acc[stat.sentiment] || 0) + stat._count
    return acc
  }, {} as any)

  return {
    summary: {
      totalPosts,
      totalEngagement: totalPosts * 500, // Mock calculation - replace with real data
      avgEngagementRate: '3.2%',
      totalMessages: messageStats.reduce((sum, stat) => sum + stat._count, 0),
      documentsUsed: documentCount,
    },
    insights: {
      topPerformingPlatform: Object.entries(platformBreakdown)
        .sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'facebook',
      sentimentDistribution,
    },
  }
}

// Optimized posts report
async function generatePostsReportOptimized(userId: string, dateFilter: any, platform?: string) {
  const where: any = {
    userId,
    ...(dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}),
    ...(platform ? { platform } : {}),
  }

  // Get aggregated stats instead of all posts
  const [postStats, recentPosts] = await Promise.all([
    prisma.post.groupBy({
      by: ['status', 'platform'],
      where,
      _count: true,
    }),
    prisma.post.findMany({
      where,
      select: {
        id: true,
        title: true,
        platform: true,
        status: true,
        createdAt: true,
        publishedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 10, // Limit to recent posts for performance
    }),
  ])

  const statusBreakdown = postStats.reduce((acc, stat) => {
    acc[stat.status] = (acc[stat.status] || 0) + stat._count
    return acc
  }, {} as any)

  const platformBreakdown = postStats.reduce((acc, stat) => {
    acc[stat.platform] = (acc[stat.platform] || 0) + stat._count
    return acc
  }, {} as any)

  return {
    summary: {
      totalPosts: postStats.reduce((sum, stat) => sum + stat._count, 0),
      publishedPosts: statusBreakdown.PUBLISHED || 0,
      scheduledPosts: statusBreakdown.SCHEDULED || 0,
      draftPosts: statusBreakdown.DRAFT || 0,
      avgEngagementRate: '3.2%',
    },
    posts: recentPosts.map(post => ({
      ...post,
      metrics: {
        likes: Math.floor(Math.random() * 500) + 50,
        comments: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 50) + 5,
        reach: Math.floor(Math.random() * 5000) + 500,
        impressions: Math.floor(Math.random() * 8000) + 1000,
        engagementRate: (Math.random() * 5 + 1).toFixed(2),
      },
    })),
    platformBreakdown,
  }
}

// Optimized audience report
async function generateAudienceReportOptimized(userId: string, dateFilter: any, platform?: string) {
  const where: any = {
    userId,
    ...(dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}),
    ...(platform ? { platform } : {}),
  }

  // Get message statistics using aggregation
  const messageStats = await prisma.message.groupBy({
    by: ['sentiment', 'isReplied'],
    where,
    _count: true,
  })

  const totalMessages = messageStats.reduce((sum, stat) => sum + stat._count, 0)
  const repliedMessages = messageStats
    .filter(stat => stat.isReplied)
    .reduce((sum, stat) => sum + stat._count, 0)

  const sentimentBreakdown = messageStats.reduce((acc, stat) => {
    acc[stat.sentiment] = (acc[stat.sentiment] || 0) + stat._count
    return acc
  }, {} as any)

  return {
    totalFollowers: {
      facebook: 12450,
      twitter: 8900,
      instagram: 15700,
      linkedin: 6700,
    },
    demographics: {
      ageGroups: { '18-24': 25, '25-34': 35, '35-44': 20, '45-54': 15, '55+': 5 },
      gender: { male: 45, female: 52, other: 3 },
      locations: { 'United States': 40, 'United Kingdom': 15, 'Canada': 12, 'Australia': 8, 'Other': 25 },
    },
    engagement: {
      activeUsers: totalMessages,
      responseRate: totalMessages > 0 ? ((repliedMessages / totalMessages) * 100).toFixed(2) : '0',
      avgResponseTime: '2.5 hours',
      sentimentBreakdown,
    },
    growth: {
      monthlyGrowth: 12.5,
      topGrowthPlatform: 'instagram',
      newFollowers: 1250,
      churnRate: 2.1,
    },
  }
}

// Optimized engagement report
async function generateEngagementReportOptimized(userId: string, dateFilter: any, platform?: string) {
  const where: any = {
    userId,
    ...(dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}),
    ...(platform ? { platform } : {}),
  }

  // Get engagement metrics using aggregation
  const [postStats, messageStats] = await Promise.all([
    prisma.post.groupBy({
      by: ['platform'],
      where,
      _count: true,
    }),
    prisma.message.groupBy({
      by: ['platform', 'sentiment'],
      where,
      _count: true,
    }),
  ])

  const platformEngagement = postStats.reduce((acc, stat) => {
    acc[stat.platform] = {
      posts: stat._count,
      engagement: Math.floor(Math.random() * 1000) + 100, // Mock data
    }
    return acc
  }, {} as any)

  return {
    summary: {
      totalEngagement: Object.values(platformEngagement).reduce((sum: any, platform: any) => sum + platform.engagement, 0),
      avgEngagementRate: '3.2%',
      totalInteractions: messageStats.reduce((sum, stat) => sum + stat._count, 0),
    },
    platformBreakdown: platformEngagement,
    trends: {
      dailyEngagement: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        engagement: Math.floor(Math.random() * 1000) + 100,
      })),
    },
  }
}

// Optimized messages report
async function generateMessagesReportOptimized(userId: string, dateFilter: any, platform?: string) {
  const where: any = {
    userId,
    ...(dateFilter.gte || dateFilter.lte ? { createdAt: dateFilter } : {}),
    ...(platform ? { platform } : {}),
  }

  // Get message statistics using aggregation
  const [messageStats, recentMessages] = await Promise.all([
    prisma.message.groupBy({
      by: ['sentiment', 'isRead', 'isReplied', 'priority'],
      where,
      _count: true,
    }),
    prisma.message.findMany({
      where,
      select: {
        id: true,
        platform: true,
        type: true,
        senderName: true,
        content: true,
        sentiment: true,
        priority: true,
        isRead: true,
        isReplied: true,
        createdAt: true,
        _count: {
          select: { replies: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit for performance
    }),
  ])

  const totalMessages = messageStats.reduce((sum, stat) => sum + stat._count, 0)
  const unreadMessages = messageStats
    .filter(stat => !stat.isRead)
    .reduce((sum, stat) => sum + stat._count, 0)
  const repliedMessages = messageStats
    .filter(stat => stat.isReplied)
    .reduce((sum, stat) => sum + stat._count, 0)

  const sentimentAnalysis = messageStats.reduce((acc, stat) => {
    acc[stat.sentiment] = (acc[stat.sentiment] || 0) + stat._count
    return acc
  }, {} as any)

  return {
    summary: {
      totalMessages,
      unreadMessages,
      repliedMessages,
      responseRate: totalMessages > 0 ? ((repliedMessages / totalMessages) * 100).toFixed(1) : '0',
    },
    messages: recentMessages.map(msg => ({
      ...msg,
      replyCount: msg._count.replies,
    })),
    sentimentAnalysis,
    responseTimeAnalysis: {
      avgResponseTime: '2.3 hours',
      urgentMessages: messageStats
        .filter(stat => stat.priority === 'URGENT')
        .reduce((sum, stat) => sum + stat._count, 0),
      immediateResponses: messageStats
        .filter(stat => stat.priority === 'URGENT' && stat.isReplied)
        .reduce((sum, stat) => sum + stat._count, 0),
    },
  }
}

function generateCSVResponse(data: any, reportType: string) {
  // Convert data to CSV format
  let csv = ''
  
  if (reportType === 'posts' && data.posts) {
    csv = 'Title,Platform,Status,Created At,Engagement Rate\n'
    data.posts.forEach((post: any) => {
      csv += `"${post.title}","${post.platform}","${post.status}","${post.createdAt}","${post.metrics?.engagementRate || 0}"\n`
    })
  } else if (reportType === 'messages' && data.messages) {
    csv = 'Platform,Type,Sender,Sentiment,Priority,Is Replied,Created At\n'
    data.messages.forEach((msg: any) => {
      csv += `"${msg.platform}","${msg.type}","${msg.senderName}","${msg.sentiment}","${msg.priority}","${msg.isReplied}","${msg.createdAt}"\n`
    })
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${reportType}-report-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}

function generatePDFResponse(data: any, reportType: string) {
  // For now, return JSON with PDF generation note
  // In production, use a library like puppeteer or jsPDF
  return NextResponse.json({
    success: true,
    note: 'PDF generation not implemented yet. Use JSON format or implement PDF generation library.',
    data,
  })
} 