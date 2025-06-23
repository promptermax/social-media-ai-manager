'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, FileText, BarChart3, Users, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface QuickReportWidgetProps {
  defaultType?: string
  className?: string
  title?: string
  description?: string
}

const reportTypes = [
  {
    value: 'campaign',
    label: 'Campaign Report',
    icon: TrendingUp,
    description: 'Campaign performance analysis',
  },
  {
    value: 'posts',
    label: 'Posts Report',
    icon: FileText,
    description: 'Post engagement metrics',
  },
  {
    value: 'audience',
    label: 'Audience Report',
    icon: Users,
    description: 'Audience demographics',
  },
  {
    value: 'engagement',
    label: 'Engagement Report',
    icon: BarChart3,
    description: 'Engagement patterns',
  },
  {
    value: 'messages',
    label: 'Messages Report',
    icon: MessageSquare,
    description: 'Message analytics',
  },
]

const formats = [
  { value: 'pdf', label: 'PDF', description: 'Printable format' },
  { value: 'csv', label: 'CSV', description: 'Spreadsheet format' },
  { value: 'json', label: 'JSON', description: 'Data format' },
]

export function QuickReportWidget({
  defaultType = 'campaign',
  className,
  title = 'Quick Report',
  description = 'Generate a report instantly',
}: QuickReportWidgetProps) {
  const [reportType, setReportType] = useState(defaultType)
  const [format, setFormat] = useState('pdf')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = async () => {
    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/analytics/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType,
          format,
          includeCharts: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate report')
      }

      const result = await response.json()
      
      // Trigger download
      if (result.downloadUrl) {
        const downloadResponse = await fetch(result.downloadUrl)
        const blob = await downloadResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
      
      toast({
        title: 'Report Generated',
        description: `Your ${reportType} report has been downloaded.`,
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

  const selectedReport = reportTypes.find(type => type.value === reportType)
  const IconComponent = selectedReport?.icon || FileText

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <IconComponent className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <label className="text-sm font-medium">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
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
          <p className="text-xs text-muted-foreground">
            {selectedReport?.description}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Format</label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {formats.map((fmt) => (
                <SelectItem key={fmt.value} value={fmt.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{fmt.label}</span>
                    <span className="text-xs text-muted-foreground">{fmt.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Badge variant="outline" className="text-xs">
            {selectedReport?.label}
          </Badge>
          <Badge variant="outline" className="text-xs uppercase">
            {format}
          </Badge>
        </div>

        <Button 
          onClick={generateReport} 
          disabled={isGenerating}
          className="w-full"
          size="sm"
        >
          {isGenerating ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate & Download
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
} 