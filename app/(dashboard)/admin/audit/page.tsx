"use client"

import { useState, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, Activity, FileText, Download, Search, TrendingUp, TrendingDown } from "lucide-react"
import { format, isAfter, isBefore, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'

// Add these imports for server-side session and redirect
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

const SEVERITY_OPTIONS = [
  { value: '', label: 'All Severities' },
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
  { value: 'success', label: 'Success' },
]

export default async function AdminAuditPage() {
  // Server-side role check
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userFilter, setUserFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [resourceFilter, setResourceFilter] = useState('')
  const [severityFilter, setSeverityFilter] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState<string>('')
  const [dateTo, setDateTo] = useState<string>('')

  useEffect(() => {
    fetchLogs()
  }, [])

  async function fetchLogs() {
    setLoading(true)
    try {
      const res = await fetch('/api/audit/logs')
      const data = await res.json()
      setLogs(data.logs || [])
    } finally {
      setLoading(false)
    }
  }

  function filteredLogs() {
    return logs.filter((log) => {
      const created = new Date(log.createdAt)
      return (
        (!userFilter || log.user?.email === userFilter) &&
        (!actionFilter || log.action === actionFilter) &&
        (!resourceFilter || log.resource === resourceFilter) &&
        (!severityFilter || log.severity === severityFilter) &&
        (!dateFrom || isAfter(created, startOfDay(new Date(dateFrom)))) &&
        (!dateTo || isBefore(created, endOfDay(new Date(dateTo)))) &&
        (!search ||
          log.details?.toLowerCase().includes(search.toLowerCase()) ||
          log.resource?.toLowerCase().includes(search.toLowerCase()) ||
          log.action?.toLowerCase().includes(search.toLowerCase()) ||
          log.user?.name?.toLowerCase().includes(search.toLowerCase())
        )
      )
    })
  }

  function exportCSV() {
    const csv = [
      ['Timestamp', 'User', 'Action', 'Resource', 'Details', 'Severity', 'IP', 'User Agent'].join(','),
      ...filteredLogs().map((log) =>
        [
          format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss'),
          log.user?.email || '',
          log.action,
          log.resource,
          '"' + (log.details || '').replace(/"/g, '""') + '"',
          log.severity || '',
          log.ip || '',
          log.userAgent || '',
        ].join(',')
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  function setPreset(preset: 'today' | 'week' | 'month') {
    const now = new Date()
    if (preset === 'today') {
      setDateFrom(format(startOfDay(now), 'yyyy-MM-dd'))
      setDateTo(format(endOfDay(now), 'yyyy-MM-dd'))
    } else if (preset === 'week') {
      setDateFrom(format(startOfWeek(now), 'yyyy-MM-dd'))
      setDateTo(format(endOfWeek(now), 'yyyy-MM-dd'))
    } else if (preset === 'month') {
      setDateFrom(format(startOfMonth(now), 'yyyy-MM-dd'))
      setDateTo(format(endOfMonth(now), 'yyyy-MM-dd'))
    }
  }

  // Mock security events
  const securityEvents = [
    {
      id: 1,
      type: "failed_login",
      severity: "warning",
      user: "unknown@example.com",
      ip: "192.168.1.999",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      details: "Multiple failed login attempts",
      location: "New York, US",
    },
    {
      id: 2,
      type: "permission_escalation",
      severity: "error",
      user: "admin@acme.com",
      ip: "192.168.1.100",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      details: "User role changed from Editor to Admin",
      location: "San Francisco, US",
    },
    {
      id: 3,
      type: "suspicious_activity",
      severity: "warning",
      user: "john@acme.com",
      ip: "10.0.0.1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      details: "Unusual API usage pattern detected",
      location: "London, UK",
    },
  ]

  // Mock compliance data
  const complianceMetrics = {
    dataRetention: {
      status: "compliant",
      percentage: 98,
      details: "Data retention policies followed",
    },
    accessControl: {
      status: "warning",
      percentage: 85,
      details: "Some users have excessive permissions",
    },
    auditCoverage: {
      status: "compliant",
      percentage: 100,
      details: "All critical actions are logged",
    },
    encryption: {
      status: "compliant",
      percentage: 100,
      details: "All data encrypted at rest and in transit",
    },
  }

  const exportAuditReport = () => {
    // Generate comprehensive audit report
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      securityEvents: securityEvents.length,
      complianceStatus: complianceMetrics,
      summary: "Comprehensive audit report for compliance review",
    }

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `audit-report-${new Date().toISOString().split("T")[0]}.json`
    a.click()
  }

  const users = Array.from(new Set(logs.map((l) => l.user?.email).filter(Boolean)))
  const actions = Array.from(new Set(logs.map((l) => l.action).filter(Boolean)))
  const resources = Array.from(new Set(logs.map((l) => l.resource).filter(Boolean)))

  return (
    <AppShell title="Admin Audit & Compliance">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search audit logs..."
                className="pl-10 w-full md:w-80"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={exportAuditReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="security">Security Events</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Security Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">94%</div>
                  <p className="text-xs text-gray-600 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    +2% from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Security Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{securityEvents.length}</div>
                  <p className="text-xs text-gray-600">Requires review</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Activity className="mr-2 h-4 w-4" />
                    Active Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-gray-600">Current users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Audit Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,247</div>
                  <p className="text-xs text-gray-600 flex items-center">
                    <TrendingDown className="mr-1 h-3 w-3" />
                    -5% from yesterday
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Security Events</CardTitle>
                  <CardDescription>Critical security events requiring attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.slice(0, 3).map((event) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <AlertTriangle
                            className={`h-5 w-5 ${event.severity === "error" ? "text-red-500" : "text-yellow-500"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{event.type.replace("_", " ")}</span>
                            <Badge
                              variant="outline"
                              className={
                                event.severity === "error" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {event.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{event.details}</p>
                          <div className="text-xs text-gray-500 mt-1">
                            {event.user} • {event.ip} • {event.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Compliance Status</CardTitle>
                  <CardDescription>Current compliance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(complianceMetrics).map(([key, metric]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              metric.status === "compliant"
                                ? "bg-green-500"
                                : metric.status === "warning"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                          />
                          <span className="text-sm font-medium">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{metric.percentage}%</div>
                          <div className="text-xs text-gray-500">{metric.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Events</CardTitle>
                <CardDescription>Detailed security event log</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle
                            className={`h-5 w-5 ${event.severity === "error" ? "text-red-500" : "text-yellow-500"}`}
                          />
                          <div>
                            <h4 className="font-medium">{event.type.replace("_", " ").toUpperCase()}</h4>
                            <p className="text-sm text-gray-500">{event.details}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            event.severity === "error" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {event.severity}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">User:</span>
                          <p className="font-medium">{event.user}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">IP Address:</span>
                          <p className="font-medium">{event.ip}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium">{event.location}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <p className="font-medium">{event.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(complianceMetrics).map(([key, metric]) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{key.replace(/([A-Z])/g, " $1")}</span>
                      <Badge
                        variant="outline"
                        className={
                          metric.status === "compliant"
                            ? "bg-green-100 text-green-800"
                            : metric.status === "warning"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }
                      >
                        {metric.status}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Compliance Score</span>
                        <span className="text-2xl font-bold">{metric.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            metric.status === "compliant"
                              ? "bg-green-500"
                              : metric.status === "warning"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${metric.percentage}%` }}
                        />
                      </div>
                      <p className="text-sm text-gray-600">{metric.details}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245ms</div>
                  <p className="text-xs text-gray-600 flex items-center">
                    <TrendingDown className="mr-1 h-3 w-3 text-green-500" />
                    -12ms from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0.02%</div>
                  <p className="text-xs text-gray-600 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3 text-red-500" />
                    +0.01% from yesterday
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Uptime</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">99.98%</div>
                  <p className="text-xs text-gray-600">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Audit Trail</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4 items-center">
              <Input
                placeholder="Search details, user, action..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-64"
              />
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-48"><SelectValue placeholder="User" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Users</SelectItem>
                  {users.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Action" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={resourceFilter} onValueChange={setResourceFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Resource" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Resources</SelectItem>
                  {resources.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-40"><SelectValue placeholder="Severity" /></SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="w-36"
                title="From date"
              />
              <Input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="w-36"
                title="To date"
              />
              <Button variant="outline" onClick={() => setPreset('today')}>Today</Button>
              <Button variant="outline" onClick={() => setPreset('week')}>This Week</Button>
              <Button variant="outline" onClick={() => setPreset('month')}>This Month</Button>
              <Button variant="outline" onClick={exportCSV}>
                <Download className="mr-2 h-4 w-4" /> Export CSV
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2 text-left">Timestamp</th>
                    <th className="py-2 px-2 text-left">User</th>
                    <th className="py-2 px-2 text-left">Action</th>
                    <th className="py-2 px-2 text-left">Resource</th>
                    <th className="py-2 px-2 text-left">Details</th>
                    <th className="py-2 px-2 text-left">Severity</th>
                    <th className="py-2 px-2 text-left">IP</th>
                    <th className="py-2 px-2 text-left">User Agent</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</td></tr>
                  ) : filteredLogs().length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">No audit log entries found.</td></tr>
                  ) : (
                    filteredLogs().map((log) => (
                      <tr key={log.id} className="border-b">
                        <td className="py-2 px-2">{format(new Date(log.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                        <td className="py-2 px-2">{log.user?.email}</td>
                        <td className="py-2 px-2">{log.action}</td>
                        <td className="py-2 px-2">{log.resource}</td>
                        <td className="py-2 px-2">{log.details}</td>
                        <td className="py-2 px-2">{log.severity}</td>
                        <td className="py-2 px-2">{log.ip}</td>
                        <td className="py-2 px-2">{log.userAgent}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}


