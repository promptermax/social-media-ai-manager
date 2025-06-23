'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { 
  Clock, 
  Calendar, 
  Mail, 
  FileText, 
  Edit, 
  Trash2, 
  Play, 
  Pause,
  Plus,
  Settings
} from 'lucide-react'
import { format } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface ScheduledReport {
  id: string
  name: string
  reportType: string
  format: string
  frequency: string
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  platform?: string
  includeCharts: boolean
  emailRecipients: string[]
  isActive: boolean
  nextRun: string
  lastRun?: string
  createdAt: string
}

interface ScheduledReportForm {
  name: string
  reportType: string
  format: string
  frequency: string
  dayOfWeek?: number
  dayOfMonth?: number
  time: string
  platform?: string
  includeCharts: boolean
  emailRecipients: string[]
}

const reportTypes = [
  { value: 'campaign', label: 'Campaign Report' },
  { value: 'posts', label: 'Posts Report' },
  { value: 'audience', label: 'Audience Report' },
  { value: 'engagement', label: 'Engagement Report' },
  { value: 'messages', label: 'Messages Report' },
]

const formats = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
  { value: 'pdf', label: 'PDF' },
]

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
]

const platforms = [
  { value: 'all', label: 'All Platforms' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
]

const daysOfWeek = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
]

const daysOfMonth = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}${i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}`,
}))

export function ScheduledReportsManager() {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null)
  const [formData, setFormData] = useState<ScheduledReportForm>({
    name: '',
    reportType: 'campaign',
    format: 'pdf',
    frequency: 'weekly',
    time: '09:00',
    includeCharts: true,
    emailRecipients: [],
  })

  useEffect(() => {
    fetchScheduledReports()
  }, [])

  const fetchScheduledReports = async () => {
    try {
      const response = await fetch('/api/analytics/reports/scheduled')
      if (response.ok) {
        const data = await response.json()
        setScheduledReports(data.scheduledReports || [])
      }
    } catch (error) {
      console.error('Error fetching scheduled reports:', error)
      toast({
        title: 'Error',
        description: 'Failed to load scheduled reports',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingReport 
        ? `/api/analytics/reports/scheduled`
        : '/api/analytics/reports/scheduled'
      
      const method = editingReport ? 'PUT' : 'POST'
      const body = editingReport 
        ? { id: editingReport.id, ...formData }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Success',
          description: result.message,
        })
        setIsDialogOpen(false)
        resetForm()
        fetchScheduledReports()
      } else {
        throw new Error('Failed to save scheduled report')
      }
    } catch (error) {
      console.error('Error saving scheduled report:', error)
      toast({
        title: 'Error',
        description: 'Failed to save scheduled report',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (reportId: string) => {
    try {
      const response = await fetch(`/api/analytics/reports/scheduled?id=${reportId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Success',
          description: result.message,
        })
        fetchScheduledReports()
      } else {
        throw new Error('Failed to delete scheduled report')
      }
    } catch (error) {
      console.error('Error deleting scheduled report:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete scheduled report',
        variant: 'destructive',
      })
    }
  }

  const handleToggleActive = async (report: ScheduledReport) => {
    try {
      const response = await fetch('/api/analytics/reports/scheduled', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: report.id,
          isActive: !report.isActive,
        }),
      })

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Report ${report.isActive ? 'paused' : 'activated'} successfully`,
        })
        fetchScheduledReports()
      } else {
        throw new Error('Failed to update report status')
      }
    } catch (error) {
      console.error('Error updating report status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update report status',
        variant: 'destructive',
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      reportType: 'campaign',
      format: 'pdf',
      frequency: 'weekly',
      time: '09:00',
      includeCharts: true,
      emailRecipients: [],
    })
    setEditingReport(null)
  }

  const openEditDialog = (report: ScheduledReport) => {
    setEditingReport(report)
    setFormData({
      name: report.name,
      reportType: report.reportType,
      format: report.format,
      frequency: report.frequency,
      dayOfWeek: report.dayOfWeek,
      dayOfMonth: report.dayOfMonth,
      time: report.time,
      platform: report.platform,
      includeCharts: report.includeCharts,
      emailRecipients: report.emailRecipients,
    })
    setIsDialogOpen(true)
  }

  const openCreateDialog = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading scheduled reports...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Scheduled Reports</h2>
          <p className="text-muted-foreground">
            Manage automated report generation schedules
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingReport ? 'Edit Scheduled Report' : 'Create Scheduled Report'}
              </DialogTitle>
              <DialogDescription>
                Configure automated report generation with custom schedules
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Report Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Weekly Campaign Report"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    value={formData.reportType}
                    onValueChange={(value) => setFormData({ ...formData, reportType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Select
                    value={formData.format}
                    onValueChange={(value) => setFormData({ ...formData, format: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select
                    value={formData.platform || 'all'}
                    onValueChange={(value) => setFormData({ ...formData, platform: value === 'all' ? undefined : value })}
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.frequency === 'weekly' && (
                  <div className="space-y-2">
                    <Label htmlFor="dayOfWeek">Day of Week</Label>
                    <Select
                      value={formData.dayOfWeek?.toString() || '1'}
                      onValueChange={(value) => setFormData({ ...formData, dayOfWeek: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {formData.frequency === 'monthly' && (
                  <div className="space-y-2">
                    <Label htmlFor="dayOfMonth">Day of Month</Label>
                    <Select
                      value={formData.dayOfMonth?.toString() || '1'}
                      onValueChange={(value) => setFormData({ ...formData, dayOfMonth: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfMonth.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {day.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailRecipients">Email Recipients (comma-separated)</Label>
                <Input
                  id="emailRecipients"
                  value={formData.emailRecipients.join(', ')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    emailRecipients: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                  })}
                  placeholder="user@example.com, admin@company.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeCharts"
                  checked={formData.includeCharts}
                  onCheckedChange={(checked) => setFormData({ ...formData, includeCharts: checked })}
                />
                <Label htmlFor="includeCharts">Include charts and visualizations</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingReport ? 'Update Schedule' : 'Create Schedule'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {scheduledReports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No scheduled reports</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first scheduled report to automate analytics delivery
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Schedule
              </Button>
            </CardContent>
          </Card>
        ) : (
          scheduledReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-medium">{report.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                        <Badge variant="outline" className="capitalize">
                          {report.reportType}
                        </Badge>
                        <Badge variant="outline" className="uppercase">
                          {report.format}
                        </Badge>
                        <Badge variant={report.isActive ? 'default' : 'secondary'}>
                          {report.isActive ? 'Active' : 'Paused'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-right text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Next: {format(new Date(report.nextRun), 'MMM dd, HH:mm')}</span>
                      </div>
                      {report.lastRun && (
                        <div className="text-muted-foreground">
                          Last: {format(new Date(report.lastRun), 'MMM dd, HH:mm')}
                        </div>
                      )}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(report)}
                    >
                      {report.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(report)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Scheduled Report</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{report.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(report.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span className="capitalize">{report.frequency}</span>
                      {report.frequency === 'weekly' && report.dayOfWeek !== undefined && (
                        <span>on {daysOfWeek[report.dayOfWeek].label}</span>
                      )}
                      {report.frequency === 'monthly' && report.dayOfMonth && (
                        <span>on the {daysOfMonth[report.dayOfMonth - 1].label}</span>
                      )}
                    </span>
                    <span>at {report.time}</span>
                    {report.emailRecipients.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{report.emailRecipients.length} recipient(s)</span>
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
} 