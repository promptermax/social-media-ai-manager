"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: number
  user: {
    name: string
    avatar: string
  }
  action: string
  resource: string
  details: string
  timestamp: Date
  severity: "info" | "warning" | "error" | "success"
  category: string
}

interface ActivityTrackerProps {
  maxItems?: number
  showNotifications?: boolean
}

export function ActivityTracker({ maxItems = 5, showNotifications = true }: ActivityTrackerProps) {
  const [activities, setActivities] = useState<Activity[]>([])
  const [notifications, setNotifications] = useState<Activity[]>([])

  // Mock real-time activity updates
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: Date.now(),
        user: {
          name: "Sarah Wilson",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: "created",
        resource: "Instagram Post",
        details: "Created new product showcase post",
        timestamp: new Date(),
        severity: "info",
        category: "content",
      },
    ]

    setActivities(mockActivities)

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newActivity: Activity = {
        id: Date.now(),
        user: {
          name: ["John Doe", "Mike Chen", "Emma Davis"][Math.floor(Math.random() * 3)],
          avatar: "/placeholder.svg?height=32&width=32",
        },
        action: ["created", "updated", "deleted", "viewed"][Math.floor(Math.random() * 4)],
        resource: ["Post", "Template", "Document", "Strategy"][Math.floor(Math.random() * 4)],
        details: "Performed action on resource",
        timestamp: new Date(),
        severity: ["info", "warning", "error", "success"][Math.floor(Math.random() * 4)] as any,
        category: ["content", "document", "template", "ai"][Math.floor(Math.random() * 4)],
      }

      setActivities((prev) => [newActivity, ...prev.slice(0, maxItems - 1)])

      if (showNotifications && newActivity.severity === "error") {
        setNotifications((prev) => [newActivity, ...prev])
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [maxItems, showNotifications])

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const severityColors = {
    info: "bg-blue-100 text-blue-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
  }

  return (
    <div className="space-y-4">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Bell className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-red-900">{notification.details}</p>
                  <p className="text-xs text-red-700">
                    {notification.user.name} • {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissNotification(notification.id)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.slice(0, maxItems).map((activity) => (
              <div key={activity.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-medium">{activity.user.name}</span>
                    <span className="text-sm text-gray-500">{activity.action}</span>
                    <span className="text-sm font-medium">{activity.resource}</span>
                    <Badge variant="outline" className={severityColors[activity.severity]}>
                      {activity.severity}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{activity.details}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
