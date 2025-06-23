'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Download, FileText, BarChart3, Users, MessageSquare, TrendingUp, Clock, Settings } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'
import { ScheduledReportsManager } from '@/components/scheduled-reports-manager'

interface ReportConfig {
  type: string
  format: 'json' | 'csv' | 'pdf'
  dateFrom?: string
  dateTo?: string
  platform?: string
  includeCharts: boolean
}

interface ReportHistory {
  id: string
  type: string
  format: string
  generatedAt: string
  status: 'completed' | 'processing' | 'failed'
  downloadUrl?: string
}

export default function AnalyticsReportsPage() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: 'campaign',
    format: 'json',
    includeCharts: true,
  })
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportHistory, setReportHistory] = useState<ReportHistory[]>([
    {
      id: '1',
      type: 'campaign',
      format: 'pdf',
      generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      downloadUrl: '/api/analytics/reports/download?type=campaign&format=pdf',
    },
    {
      id: '2',
      type: 'posts',
      format: 'csv',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      downloadUrl: '/api/analytics/reports/download?type=posts&format=csv',
    },
    {
      id: '3',
      type: 'audience',
      format: 'json',
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      downloadUrl: '/api/analytics/reports/download?type=audience&format=json',
    },
  ])

  const reportTypes = [
    {
      value: 'campaign',
      label: 'Campaign Report',
      description: 'Comprehensive campaign performance analysis',
      icon: TrendingUp,
    },
    {
      value: 'posts',
      label: 'Posts Report',
      description: 'Detailed post performance and engagement metrics',
      icon: FileText,
    },
    {
      value: 'audience',
      label: 'Audience Report',
      description: 'Audience demographics and growth insights',
      icon: Users,
    },
    {
      value: 'engagement',
      label: 'Engagement Report',
      description: 'Engagement patterns and interaction analysis',
      icon: BarChart3,
    },
    {
      value: 'messages',
      label: 'Messages Report',
      description: 'Message analytics and response metrics',
      icon: MessageSquare,
    },
  ]

  const platforms = [
    { value: 'all', label: 'All Platforms' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
  ]

  const formats = [
    { value: 'json', label: 'JSON', description: 'Structured data format' },
    { value: 'csv', label: 'CSV', description: 'Spreadsheet compatible' },
    { value: 'pdf', label: 'PDF', description: 'Printable report format' },
  ]

  const generateReport = async () => {
    setIsGenerating(true)
    
    try {
      const config = {
        ...reportConfig,
        dateFrom: dateFrom?.toISOString(),
        dateTo: dateTo?.toISOString(),
      }

      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      const result = await response.json()
      
      // Add to history
      const newReport: ReportHistory = {
        id: Date.now().toString(),
        type: reportConfig.type,
        format: reportConfig.format,
        generatedAt: new Date().toISOString(),
        status: 'completed',
        downloadUrl: result.downloadUrl,
      }

      setReportHistory([newReport, ...reportHistory])
      
      toast({
        title: 'Report Generated',
        description: `Your ${reportConfig.type} report has been generated successfully.`,
      })

    } catch (error) {
      console.error('Error generating report:', error)
      toast({
        title: 'Generation Failed',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadReport = async (report: ReportHistory) => {
    if (!report.downloadUrl) return

    try {
      const response = await fetch(report.downloadUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${report.type}-report-${new Date(report.generatedAt).toISOString().split('T')[0]}.${report.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading report:', error)
      toast({
        title: 'Download Failed',
        description: 'Failed to download report. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics Reports</h1>
          <p className="text-muted-foreground">
            Generate comprehensive reports for campaigns, posts, and audience insights
          </p>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Report Configuration */}
            <Card>
              <CardHeader>
                <CardTitle>Report Configuration</CardTitle>
                <CardDescription>
                  Configure your report parameters and filters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Report Type */}
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select
                    value={reportConfig.type}
                    onValueChange={(value) => setReportConfig({ ...reportConfig, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <type.icon className="h-4 w-4" />
                            <span>{type.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {reportTypes.find(t => t.value === reportConfig.type)?.description}
                  </p>
                </div>

                {/* Format */}
                <div className="space-y-2">
                  <Label>Export Format</Label>
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value: 'json' | 'csv' | 'pdf') => 
                      setReportConfig({ ...reportConfig, format: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{format.label}</span>
                            <span className="text-xs text-muted-foreground">{format.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Platform Filter */}
                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select
                    value={reportConfig.platform || 'all'}
                    onValueChange={(value) => 
                      setReportConfig({ ...reportConfig, platform: value === 'all' ? undefined : value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !dateFrom && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, 'PPP') : 'Start date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'justify-start text-left font-normal',
                            !dateTo && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, 'PPP') : 'End date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button 
                  onClick={generateReport} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
                <CardDescription>
                  Preview of what your report will include
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {reportTypes.find(t => t.value === reportConfig.type)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {reportConfig.format.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Report Contents:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {reportConfig.type === 'campaign' && (
                        <>
                          <li>• Campaign performance summary</li>
                          <li>• Post engagement metrics</li>
                          <li>• Platform breakdown</li>
                          <li>• Sentiment analysis</li>
                        </>
                      )}
                      {reportConfig.type === 'posts' && (
                        <>
                          <li>• Individual post performance</li>
                          <li>• Engagement rates by platform</li>
                          <li>• Performance trends</li>
                          <li>• Top performing content</li>
                        </>
                      )}
                      {reportConfig.type === 'audience' && (
                        <>
                          <li>• Follower demographics</li>
                          <li>• Growth metrics</li>
                          <li>• Geographic distribution</li>
                          <li>• Engagement patterns</li>
                        </>
                      )}
                      {reportConfig.type === 'engagement' && (
                        <>
                          <li>• Engagement rate analysis</li>
                          <li>• Platform comparison</li>
                          <li>• Time-based trends</li>
                          <li>• Content performance</li>
                        </>
                      )}
                      {reportConfig.type === 'messages' && (
                        <>
                          <li>• Message volume analysis</li>
                          <li>• Response metrics</li>
                          <li>• Sentiment breakdown</li>
                          <li>• Platform distribution</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {reportConfig.platform && reportConfig.platform !== 'all' && (
                    <div className="text-sm">
                      <span className="font-medium">Platform Filter:</span>{' '}
                      <Badge variant="outline">{reportConfig.platform}</Badge>
                    </div>
                  )}

                  {dateFrom && dateTo && (
                    <div className="text-sm">
                      <span className="font-medium">Date Range:</span>{' '}
                      {format(dateFrom, 'MMM dd')} - {format(dateTo, 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                Previously generated reports and their download links
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportHistory.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium capitalize">
                            {report.type} Report
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Generated {format(new Date(report.generatedAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="uppercase">
                        {report.format}
                      </Badge>
                      <Badge
                        variant={report.status === 'completed' ? 'default' : 'secondary'}
                      >
                        {report.status}
                      </Badge>
                    </div>
                    
                    {report.status === 'completed' && report.downloadUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadReport(report)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <ScheduledReportsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
} 