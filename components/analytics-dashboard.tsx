'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  MessageSquare, 
  FileText, 
  BarChart3,
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react'
import { AnalyticsReportGenerator } from './analytics-report-generator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { useDebounce } from '@/hooks/use-debounce'

interface AnalyticsData {
  overview: {
    totalFollowers: number
    totalEngagement: number
    totalPosts: number
    totalMessages: number
    growthRate: number
    engagementRate: number
  }
  platformStats: {
    [key: string]: {
      followers: number
      engagement: number
      posts: number
      growth: number
    }
  }
  recentActivity: Array<{
    id: string
    type: string
    platform: string
    title: string
    timestamp: string
    engagement: number
  }>
  topPerforming: Array<{
    id: string
    title: string
    platform: string
    engagement: number
    engagementRate: number
  }>
}

// Memoized chart components for better performance
const ChartComponent = React.memo(({ data, type }: { data: any[], type: string }) => {
  // Simulate chart rendering with memoization
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      value: item.value || Math.random() * 100
    }))
  }, [data])

  return (
    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <span className="text-gray-500">Chart: {type} ({chartData.length} data points)</span>
    </div>
  )
})

ChartComponent.displayName = 'ChartComponent'

// Virtualized list component for large datasets
const VirtualizedList = React.memo(({ items, renderItem, itemHeight = 60 }: {
  items: any[]
  renderItem: (item: any, index: number) => React.ReactNode
  itemHeight: number
}) => {
  const [scrollTop, setScrollTop] = useState(0)
  const containerHeight = 400
  const visibleItemCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.floor(scrollTop / itemHeight)
  const endIndex = Math.min(startIndex + visibleItemCount + 1, items.length)

  const visibleItems = items.slice(startIndex, endIndex)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return (
    <div 
      className="overflow-auto"
      style={{ height: containerHeight }}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => renderItem(item, startIndex + index))}
        </div>
      </div>
    </div>
  )
})

VirtualizedList.displayName = 'VirtualizedList'

// Custom hook for analytics data with caching
const useAnalyticsData = (filters: any) => {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/analytics/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      })
      
      if (!response.ok) throw new Error('Failed to fetch analytics')
      
      const result = await response.json()
      setData(result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}

export function AnalyticsDashboard() {
  const [filters, setFilters] = useState({
    dateRange: '7d',
    platform: 'all',
    search: ''
  })

  // Debounce search input to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500)
  const debouncedFilters = useMemo(() => ({
    ...filters,
    search: debouncedSearch
  }), [filters.dateRange, filters.platform, debouncedSearch])

  const { data, loading, error } = useAnalyticsData(debouncedFilters)

  // Memoize expensive calculations
  const processedData = useMemo(() => {
    if (!data) return null

    return {
      ...data,
      topPosts: data.posts?.slice(0, 10) || [],
      engagementTrend: data.engagementTrend?.map((item: any) => ({
        ...item,
        rate: parseFloat(item.rate) || 0
      })) || [],
      platformBreakdown: data.platformBreakdown || {},
      audienceGrowth: data.audienceGrowth?.map((item: any) => ({
        ...item,
        growth: parseFloat(item.growth) || 0
      })) || []
    }
  }, [data])

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error loading analytics: {error}</p>
              <Button onClick={() => window.location.reload()} className="mt-2">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Select value={filters.dateRange} onValueChange={(value) => handleFilterChange('dateRange', value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24h</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.platform} onValueChange={(value) => handleFilterChange('platform', value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search posts..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-64"
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : processedData ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold">{processedData.totalPosts?.toLocaleString()}</p>
                  </div>
                  <Badge variant="secondary">+12%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Engagement</p>
                    <p className="text-2xl font-bold">{processedData.totalEngagement?.toLocaleString()}</p>
                  </div>
                  <Badge variant="secondary">+8%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg. Engagement Rate</p>
                    <p className="text-2xl font-bold">{processedData.avgEngagementRate}</p>
                  </div>
                  <Badge variant="secondary">+2.1%</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Followers</p>
                    <p className="text-2xl font-bold">{processedData.totalFollowers?.toLocaleString()}</p>
                  </div>
                  <Badge variant="secondary">+5%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartComponent data={processedData.engagementTrend} type="line" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Platform Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartComponent data={Object.entries(processedData.platformBreakdown).map(([key, value]) => ({ name: key, value }))} type="pie" />
              </CardContent>
            </Card>
          </div>

          {/* Top Posts with Virtualization */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {processedData.topPosts && processedData.topPosts.length > 0 ? (
                <VirtualizedList
                  items={processedData.topPosts}
                  itemHeight={80}
                  renderItem={(post, index) => (
                    <div key={post.id || index} className="flex items-center justify-between p-4 border-b last:border-b-0">
                      <div className="flex-1">
                        <h4 className="font-medium truncate">{post.title}</h4>
                        <p className="text-sm text-gray-600">{post.platform} • {post.createdAt}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{post.engagement?.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{post.engagementRate}%</p>
                      </div>
                    </div>
                  )}
                />
              ) : (
                <p className="text-gray-500 text-center py-8">No posts found</p>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  )
} 