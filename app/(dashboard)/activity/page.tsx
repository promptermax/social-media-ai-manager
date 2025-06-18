"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Download, FileText, Settings, Trash2, Edit, Plus, Eye, Share2, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// Mock activity data
const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      email: "john@acme.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "created",
    resource: "Social Media Post",
    resourceId: "post-123",
    details: "Created Instagram post for product launch",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    ip: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0",
    company: "Acme Corporation",
    category: "content",
    severity: "info",
    metadata: {
      platform: "Instagram",
      contentType: "image",
      scheduled: true,
    },
  },
  {
    id: 2,
    user: {
      name: "Sarah Wilson",
      email: "sarah@acme.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "uploaded",
    resource: "Business Document",
    resourceId: "doc-456",
    details: "Uploaded Business Plan 2024.pdf",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    ip: "192.168.1.101",
    userAgent: "Firefox 121.0.0.0",
    company: "Acme Corporation",
    category: "document",
    severity: "info",
    metadata: {
      fileSize: "2.4 MB",
      fileType: "PDF",
      pages: 45,
    },
  },
  {
    id: 3,
    user: {
      name: "Mike Chen",
      email: "mike@acme.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "deleted",
    resource: "Content Template",
    resourceId: "template-789",
    details: "Deleted outdated product launch template",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    ip: "192.168.1.102",
    userAgent: "Safari 17.2.0",
    company: "Acme Corporation",
    category: "template",
    severity: "warning",
    metadata: {
      templateName: "Old Product Launch",
      reason: "Outdated content",
    },
  },
  {
    id: 4,
    user: {
      name: "Admin System",
      email: "system@platform.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "processed",
    resource: "AI Generation",
    resourceId: "gen-101",
    details: "Generated social media strategy using business documents",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    ip: "10.0.0.1",
    userAgent: "System Process",
    company: "Acme Corporation",
    category: "ai",
    severity: "info",
    metadata: {
      documentsUsed: 3,
      generationType: "strategy",
      processingTime: "2.3s",
    },
  },
  {
    id: 5,
    user: {
      name: "Emma Davis",
      email: "emma@acme.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "updated",
    resource: "User Permissions",
    resourceId: "user-202",
    details: "Updated role permissions for content manager",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
    ip: "192.168.1.103",
    userAgent: "Chrome 120.0.0.0",
    company: "Acme Corporation",
    category: "admin",
    severity: "warning",
    metadata: {
      previousRole: "Editor",
      newRole: "Content Manager",
      permissions: ["create", "edit", "publish"],
    },
  },
  {
    id: 6,
    user: {
      name: "Alex Johnson",
      email: "alex@acme.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "failed",
    resource: "Content Publishing",
    resourceId: "publish-303",
    details: "Failed to publish post to Instagram - API rate limit exceeded",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    ip: "192.168.1.104",
    userAgent: "Chrome 120.0.0.0",
    company: "Acme Corporation",
    category: "publishing",
    severity: "error",
    metadata: {
      platform: "Instagram",
      errorCode: "RATE_LIMIT_EXCEEDED",
      retryAfter: "3600s",
    },
  },
]

const actionIcons = {
  created: Plus,
  uploaded: FileText,
  deleted: Trash2,
  updated: Edit,
  viewed: Eye,
  shared: Share2,
  processed: Settings,
  failed: Trash2,
}

const categoryColors = {
  content: "bg-blue-100 text-blue-800",
  document: "bg-green-100 text-green-800",
  template: "bg-purple-100 text-purple-800",
  ai: "bg-orange-100 text-orange-800",
  admin: "bg-red-100 text-red-800",
  publishing: "bg-yellow-100 text-yellow-800",
}

const severityColors = {
  info: "bg-gray-100 text-gray-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  success: "bg-green-100 text-green-800",
}

export default function ActivityPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedUser, setSelectedUser] = useState("all")
  const [dateRange, setDateRange] = useState("all")

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch =
      activity.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.resource.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = selectedCategory === "all" || activity.category === selectedCategory
    const matchesSeverity = selectedSeverity === "all" || activity.severity === selectedSeverity
    const matchesUser = selectedUser === "all" || activity.user.email === selectedUser

    return matchesSearch && matchesCategory && matchesSeverity && matchesUser
  })

  const exportActivities = () => {
    const csvContent = [
      ["Timestamp", "User", "Action", "Resource", "Details", "IP", "Severity", "Category"].join(","),
      ...filteredActivities.map((activity) =>
        [
          activity.timestamp.toISOString(),
          activity.user.name,
          activity.action,
          activity.resource,
          `"${activity.details}"`,
          activity.ip,
          activity.severity,
          activity.category,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <AppShell title="Activity & Audit Trail">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search activities..."
                className="pl-10 w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="content">Content</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
                <SelectItem value="ai">AI Generation</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="publishing">Publishing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={exportActivities}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue="timeline" className="w-full">
          <TabsList>
            <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="system">System Events</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>
                  Showing {filteredActivities.length} of {activities.length} activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredActivities.map((activity) => {
                    const ActionIcon = actionIcons[activity.action as keyof typeof actionIcons] || Settings
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
                            <ActionIcon className="h-5 w-5 text-gray-600" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-sm">{activity.user.name}</span>
                              <span className="text-sm text-gray-500">{activity.action}</span>
                              <span className="font-medium text-sm">{activity.resource}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="secondary"
                                className={categoryColors[activity.category as keyof typeof categoryColors]}
                              >
                                {activity.category}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={severityColors[activity.severity as keyof typeof severityColors]}
                              >
                                {activity.severity}
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-gray-900 mb-2">{activity.details}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                              </span>
                              <span>IP: {activity.ip}</span>
                              <span>{activity.userAgent}</span>
                            </div>
                            <span>ID: {activity.resourceId}</span>
                          </div>

                          {activity.metadata && (
                            <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                              <strong>Metadata:</strong>{" "}
                              {Object.entries(activity.metadata)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.length}</div>
                  <p className="text-xs text-gray-600">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{new Set(activities.map((a) => a.user.email)).size}</div>
                  <p className="text-xs text-gray-600">Unique users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Errors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    {activities.filter((a) => a.severity === "error").length}
                  </div>
                  <p className="text-xs text-gray-600">Requires attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">AI Generations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activities.filter((a) => a.category === "ai").length}</div>
                  <p className="text-xs text-gray-600">AI operations</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      activities.reduce(
                        (acc, activity) => {
                          acc[activity.category] = (acc[activity.category] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    ).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="secondary"
                            className={categoryColors[category as keyof typeof categoryColors]}
                          >
                            {category}
                          </Badge>
                        </div>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Active Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(
                      activities.reduce(
                        (acc, activity) => {
                          const key = activity.user.name
                          acc[key] = (acc[key] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([userName, count]) => {
                        const user = activities.find((a) => a.user.name === userName)?.user
                        return (
                          <div key={userName} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={user?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{userName[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{userName}</span>
                            </div>
                            <span className="font-medium">{count}</span>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Activity Breakdown</CardTitle>
                <CardDescription>Activity summary by user</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    activities.reduce(
                      (acc, activity) => {
                        const key = activity.user.email
                        if (!acc[key]) {
                          acc[key] = {
                            user: activity.user,
                            activities: [],
                            totalActions: 0,
                            lastActive: activity.timestamp,
                          }
                        }
                        acc[key].activities.push(activity)
                        acc[key].totalActions++
                        if (activity.timestamp > acc[key].lastActive) {
                          acc[key].lastActive = activity.timestamp
                        }
                        return acc
                      },
                      {} as Record<string, any>,
                    ),
                  ).map(([email, userData]) => (
                    <div key={email} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={userData.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{userData.user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{userData.user.name}</h4>
                            <p className="text-sm text-gray-500">{userData.user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{userData.totalActions} actions</div>
                          <div className="text-sm text-gray-500">
                            Last active {formatDistanceToNow(userData.lastActive, { addSuffix: true })}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {Object.entries(
                          userData.activities.reduce((acc: Record<string, number>, activity: any) => {
                            acc[activity.category] = (acc[activity.category] || 0) + 1
                            return acc
                          }, {}),
                        ).map(([category, count]) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className={categoryColors[category as keyof typeof categoryColors]}
                          >
                            {category}: {count}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Events</CardTitle>
                <CardDescription>Automated system activities and processes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities
                    .filter((activity) => activity.user.email.includes("system"))
                    .map((activity) => {
                      const ActionIcon = actionIcons[activity.action as keyof typeof actionIcons] || Settings
                      return (
                        <div key={activity.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                              <ActionIcon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-sm">System</span>
                                <span className="text-sm text-gray-500">{activity.action}</span>
                                <span className="font-medium text-sm">{activity.resource}</span>
                              </div>
                              <Badge
                                variant="outline"
                                className={severityColors[activity.severity as keyof typeof severityColors]}
                              >
                                {activity.severity}
                              </Badge>
                            </div>

                            <p className="text-sm text-gray-900 mb-2">{activity.details}</p>

                            <div className="text-xs text-gray-500">
                              {formatDistanceToNow(activity.timestamp, { addSuffix: true })} • ID: {activity.resourceId}
                            </div>

                            {activity.metadata && (
                              <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                                <strong>System Data:</strong>{" "}
                                {Object.entries(activity.metadata)
                                  .map(([key, value]) => `${key}: ${value}`)
                                  .join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
