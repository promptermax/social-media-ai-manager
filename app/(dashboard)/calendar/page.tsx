"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter, Download } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"

// Mock data for calendar events
const events = [
  {
    id: 1,
    title: "Product Launch Post",
    date: "2024-06-18",
    time: "10:00 AM",
    platform: "Instagram",
    status: "scheduled",
    type: "image",
  },
  {
    id: 2,
    title: "Behind the Scenes Video",
    date: "2024-06-18",
    time: "2:00 PM",
    platform: "TikTok",
    status: "draft",
    type: "video",
  },
  {
    id: 3,
    title: "Industry Insights Blog",
    date: "2024-06-19",
    time: "9:00 AM",
    platform: "LinkedIn",
    status: "scheduled",
    type: "text",
  },
  {
    id: 4,
    title: "Customer Testimonial",
    date: "2024-06-20",
    time: "11:00 AM",
    platform: "Facebook",
    status: "scheduled",
    type: "image",
  },
  {
    id: 5,
    title: "Product Feature Highlight",
    date: "2024-06-21",
    time: "3:00 PM",
    platform: "Instagram",
    status: "draft",
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

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState("month")

  return (
    <AppShell title="Content Calendar">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-lg font-medium">
              {date?.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="ml-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Today
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Tabs defaultValue="month" onValueChange={setView}>
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>

              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="md:col-span-3">
            <CardContent className="p-0">
              <div className="p-4">
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="secondary"
                        className={platformColors[event.platform as keyof typeof platformColors]}
                      >
                        {event.platform}
                      </Badge>
                      <Badge variant="outline" className={statusColors[event.status as keyof typeof statusColors]}>
                        {event.status}
                      </Badge>
                    </div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.date} • {event.time}
                    </p>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Content Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge
                        variant="secondary"
                        className={platformColors[event.platform as keyof typeof platformColors]}
                      >
                        {event.platform}
                      </Badge>
                      <Badge variant="outline" className={statusColors[event.status as keyof typeof statusColors]}>
                        {event.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      {event.date} • {event.time}
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
      </div>
    </AppShell>
  )
}
