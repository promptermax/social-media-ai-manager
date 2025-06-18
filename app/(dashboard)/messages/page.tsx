"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Search, Filter, Reply, Heart, Flag } from "lucide-react"

const messages = [
  {
    id: 1,
    platform: "Instagram",
    type: "comment",
    user: "sarah_johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Love this product! Where can I buy it?",
    timestamp: "2 hours ago",
    post: "New Product Launch",
    status: "unread",
    sentiment: "positive",
  },
  {
    id: 2,
    platform: "Facebook",
    type: "message",
    user: "Mike Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Hi, I have a question about your return policy. Can you help?",
    timestamp: "4 hours ago",
    post: null,
    status: "unread",
    sentiment: "neutral",
  },
  {
    id: 3,
    platform: "Twitter",
    type: "mention",
    user: "@techreview",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Great review of @yourcompany latest update! Really impressed with the new features.",
    timestamp: "6 hours ago",
    post: "Feature Update",
    status: "read",
    sentiment: "positive",
  },
  {
    id: 4,
    platform: "LinkedIn",
    type: "comment",
    user: "Emma Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "This is exactly what our industry needed. When will this be available?",
    timestamp: "8 hours ago",
    post: "Industry Insights",
    status: "replied",
    sentiment: "positive",
  },
  {
    id: 5,
    platform: "Instagram",
    type: "comment",
    user: "alex_dev",
    avatar: "/placeholder.svg?height=40&width=40",
    content: "Having issues with the latest update. Can someone help?",
    timestamp: "1 day ago",
    post: "Update Announcement",
    status: "unread",
    sentiment: "negative",
  },
]

const platformColors = {
  Instagram: "bg-pink-100 text-pink-800",
  Facebook: "bg-blue-100 text-blue-800",
  Twitter: "bg-sky-100 text-sky-800",
  LinkedIn: "bg-indigo-100 text-indigo-800",
}

const statusColors = {
  unread: "bg-red-100 text-red-800",
  read: "bg-gray-100 text-gray-800",
  replied: "bg-green-100 text-green-800",
}

const sentimentColors = {
  positive: "bg-green-100 text-green-800",
  neutral: "bg-gray-100 text-gray-800",
  negative: "bg-red-100 text-red-800",
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)

  const filteredMessages = messages.filter(
    (message) =>
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.user.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AppShell title="Message Management">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages & Comments</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({filteredMessages.length})</TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({filteredMessages.filter((m) => m.status === "unread").length})
                  </TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-6">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMessage === message.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedMessage(message.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={message.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{message.user[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{message.user}</span>
                            <Badge
                              variant="secondary"
                              className={platformColors[message.platform as keyof typeof platformColors]}
                            >
                              {message.platform}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={statusColors[message.status as keyof typeof statusColors]}
                            >
                              {message.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={sentimentColors[message.sentiment as keyof typeof sentimentColors]}
                            >
                              {message.sentiment}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 mb-2">{message.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{message.timestamp}</span>
                              {message.post && <span>on "{message.post}"</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Reply className="h-4 w-4 mr-1" />
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Heart className="h-4 w-4 mr-1" />
                                Like
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Flag className="h-4 w-4 mr-1" />
                                Flag
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unread Messages</span>
                  <Badge variant="destructive">{messages.filter((m) => m.status === "unread").length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Positive Sentiment</span>
                  <Badge className="bg-green-100 text-green-800">
                    {messages.filter((m) => m.sentiment === "positive").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Needs Attention</span>
                  <Badge variant="outline" className="bg-red-100 text-red-800">
                    {messages.filter((m) => m.sentiment === "negative").length}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">Auto-Reply Ready</p>
                  <p className="text-xs text-blue-700 mt-1">3 messages can be auto-replied with AI</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm font-medium text-yellow-900">Urgent Response</p>
                  <p className="text-xs text-yellow-700 mt-1">1 negative comment needs immediate attention</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-900">Engagement Opportunity</p>
                  <p className="text-xs text-green-700 mt-1">2 positive comments perfect for engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
