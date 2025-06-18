import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

const activities = [
  {
    id: 1,
    type: "post",
    platform: "Instagram",
    content: "New product launch post published",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    status: "published",
    engagement: "1.2K likes",
  },
  {
    id: 2,
    type: "comment",
    platform: "Facebook",
    content: "Replied to 5 customer comments",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "completed",
    engagement: "12 responses",
  },
  {
    id: 3,
    type: "schedule",
    platform: "Twitter",
    content: "Scheduled 3 tweets for tomorrow",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    status: "scheduled",
    engagement: "Pending",
  },
  {
    id: 4,
    type: "ai_content",
    platform: "LinkedIn",
    content: "Generated blog post with AI",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    status: "draft",
    engagement: "Draft saved",
  },
]

const platformColors = {
  Instagram: "bg-pink-100 text-pink-800",
  Facebook: "bg-blue-100 text-blue-800",
  Twitter: "bg-sky-100 text-sky-800",
  LinkedIn: "bg-indigo-100 text-indigo-800",
}

const statusColors = {
  published: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  scheduled: "bg-yellow-100 text-yellow-800",
  draft: "bg-gray-100 text-gray-800",
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                <AvatarFallback>{activity.platform[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge
                    variant="secondary"
                    className={platformColors[activity.platform as keyof typeof platformColors]}
                  >
                    {activity.platform}
                  </Badge>
                  <Badge variant="outline" className={statusColors[activity.status as keyof typeof statusColors]}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-900">{activity.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                  <p className="text-xs text-gray-500">{activity.engagement}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
