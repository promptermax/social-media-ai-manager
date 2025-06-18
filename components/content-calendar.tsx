"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useState } from "react"

const mockPosts = [
  {
    id: 1,
    title: "Product Launch Announcement",
    platform: "Instagram",
    scheduledFor: "2024-01-15T10:00:00",
    status: "scheduled",
    type: "image",
  },
  {
    id: 2,
    title: "Behind the Scenes Video",
    platform: "TikTok",
    scheduledFor: "2024-01-15T14:00:00",
    status: "scheduled",
    type: "video",
  },
  {
    id: 3,
    title: "Industry Insights Blog",
    platform: "LinkedIn",
    scheduledFor: "2024-01-16T09:00:00",
    status: "draft",
    type: "text",
  },
  {
    id: 4,
    title: "Customer Testimonial",
    platform: "Facebook",
    scheduledFor: "2024-01-16T16:00:00",
    status: "scheduled",
    type: "image",
  },
]

const platformColors = {
  Instagram: "bg-pink-100 text-pink-800",
  TikTok: "bg-black text-white",
  LinkedIn: "bg-blue-100 text-blue-800",
  Facebook: "bg-blue-100 text-blue-800",
  Twitter: "bg-sky-100 text-sky-800",
}

const statusColors = {
  scheduled: "bg-green-100 text-green-800",
  draft: "bg-yellow-100 text-yellow-800",
  published: "bg-blue-100 text-blue-800",
}

export function ContentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Content Calendar</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </span>
            <Button variant="outline" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium">{post.title}</h4>
                  <Badge variant="secondary" className={platformColors[post.platform as keyof typeof platformColors]}>
                    {post.platform}
                  </Badge>
                  <Badge variant="outline" className={statusColors[post.status as keyof typeof statusColors]}>
                    {post.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(post.scheduledFor).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Preview
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
