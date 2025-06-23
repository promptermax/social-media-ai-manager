'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Download, FileText, BarChart3, Users, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from '@/hooks/use-toast'

interface ReportGeneratorProps {
  defaultType?: string
  defaultPlatform?: string
  onReportGenerated?: (reportUrl: string) => void
  className?: string
}

interface ReportConfig {
  type: string
  format: 'json' | 'csv' | 'pdf'
  dateFrom?: string
  dateTo?: string
  platform?: string
  includeCharts: boolean
}

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

export function AnalyticsReportGenerator({
  defaultType = 'campaign',
  defaultPlatform,
  onReportGenerated,
  className,
}: ReportGeneratorProps) {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    type: defaultType,
    format: 'json',
    platform: defaultPlatform,
    includeCharts: true,
  })
  const [dateFrom, setDateFrom] = useState<Date>()
  const [dateTo, setDateTo] = useState<Date>()
  const [isGenerating, setIsGenerating] = useState(false)

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
      
      toast({
        title: 'Report Generated',
        description: `Your ${reportConfig.type} report has been generated successfully.`,
      })

      if (onReportGenerated && result.downloadUrl) {
        onReportGenerated(result.downloadUrl)
      }

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

  const downloadReport = async (downloadUrl: string) => {
    try {
      const response = await fetch(downloadUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${reportConfig.type}-report-${new Date().toISOString().split('T')[0]}.${reportConfig.format}`
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
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5" />
          <span>Generate Report</span>
        </CardTitle>
        <CardDescription>
          Create a comprehensive analytics report for your data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Report Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
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
        </div>

        {/* Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Format</label>
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
          <label className="text-sm font-medium">Platform</label>
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
          <label className="text-sm font-medium">Date Range (Optional)</label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dateFrom && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, 'MMM dd') : 'Start'}
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
                  size="sm"
                  className={cn(
                    'justify-start text-left font-normal',
                    !dateTo && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, 'MMM dd') : 'End'}
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

        {/* Report Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Preview</label>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {reportTypes.find(t => t.value === reportConfig.type)?.label}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {reportConfig.format.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {reportTypes.find(t => t.value === reportConfig.type)?.description}
            </p>
            {reportConfig.platform && reportConfig.platform !== 'all' && (
              <p className="text-xs text-muted-foreground">
                Platform: {reportConfig.platform}
              </p>
            )}
            {dateFrom && dateTo && (
              <p className="text-xs text-muted-foreground">
                Date Range: {format(dateFrom, 'MMM dd')} - {format(dateTo, 'MMM dd, yyyy')}
              </p>
            )}
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
  )
} 