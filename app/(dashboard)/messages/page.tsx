"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Search, Filter, Reply, Heart, Flag, Send, Brain } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { AIMessageInsights } from "@/components/ai-message-insights"
import { BulkMessageActions } from "@/components/bulk-message-actions"

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
  POSITIVE: "bg-green-100 text-green-800",
  NEUTRAL: "bg-gray-100 text-gray-800",
  NEGATIVE: "bg-red-100 text-red-800",
  URGENT: "bg-yellow-100 text-yellow-800",
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [messages, setMessages] = useState([])
  const [stats, setStats] = useState({ unread: 0, positive: 0, negative: 0, urgent: 0 })
  const [tab, setTab] = useState("all")
  const [loading, setLoading] = useState(false)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [error, setError] = useState("")

  const fetchMessages = async () => {
    setLoading(true)
    let url = "/api/messages?limit=50"
    if (tab === "unread") url += "&status=unread"
    if (tab === "comments") url += "&type=COMMENT"
    if (tab === "messages") url += "&type=DIRECT_MESSAGE"
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`
    const res = await fetch(url)
    const data = await res.json()
    setMessages(data.messages || [])
    setStats(data.stats || { unread: 0, positive: 0, negative: 0, urgent: 0 })
    setLoading(false)
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line
  }, [tab, searchTerm])

  const handleReply = (message) => {
    setReplyingTo(message)
    setReplyContent("")
    setReplyDialogOpen(true)
  }

  const sendReply = async () => {
    if (!replyContent.trim()) return
    setLoading(true)
    const res = await fetch(`/api/messages/${replyingTo.id}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent }),
    })
    if (res.ok) {
      setReplyDialogOpen(false)
      setReplyContent("")
      setReplyingTo(null)
      fetchMessages()
    } else {
      setError("Failed to send reply.")
    }
    setLoading(false)
  }

  const markAsRead = async (id) => {
    await fetch(`/api/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true }),
    })
    fetchMessages()
  }

  const useAIReply = (content: string) => {
    setReplyContent(content)
    setReplyDialogOpen(true)
  }

  const selectedMessageData = selectedMessage ? messages.find(m => m.id === selectedMessage) : null

  return (
    <AppShell title="Message Management">
      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
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
              <Tabs defaultValue="all" value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All ({messages.length})</TabsTrigger>
                  <TabsTrigger value="unread">
                    Unread ({messages.filter((m) => !m.isRead).length})
                  </TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value={tab} className="space-y-4 mt-6">
                  {loading ? (
                    <div>Loading...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">No messages found.</div>
                  ) : (
                    messages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedMessage === message.id ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
                      }`}
                        onClick={() => {
                          setSelectedMessage(message.id)
                          if (!message.isRead) markAsRead(message.id)
                        }}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={message.senderAvatar || "/placeholder.svg"} />
                            <AvatarFallback>{message.senderName[0]?.toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-sm">{message.senderName}</span>
                            <Badge
                              variant="secondary"
                                className={platformColors[message.platform]}
                            >
                              {message.platform}
                            </Badge>
                            <Badge
                              variant="outline"
                                className={message.isReplied ? statusColors.replied : message.isRead ? statusColors.read : statusColors.unread}
                            >
                                {message.isReplied ? "replied" : message.isRead ? "read" : "unread"}
                            </Badge>
                            <Badge
                              variant="outline"
                                className={sentimentColors[message.sentiment]}
                            >
                                {message.sentiment?.toLowerCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 mb-2">{message.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>{new Date(message.createdAt).toLocaleString()}</span>
                                {message.postTitle && <span>on "{message.postTitle}"</span>}
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleReply(message)}>
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
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <BulkMessageActions messages={messages} onRefresh={fetchMessages} />

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Unread Messages</span>
                  <Badge variant="destructive">{stats.unread}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Positive Sentiment</span>
                  <Badge className="bg-green-100 text-green-800">{stats.positive}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Needs Attention</span>
                  <Badge variant="outline" className="bg-red-100 text-red-800">{stats.negative}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Urgent</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">{stats.urgent}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {selectedMessageData && (
            <AIMessageInsights 
              message={selectedMessageData} 
              onUseReply={useAIReply}
            />
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Send a reply to <span className="font-semibold">{replyingTo?.senderName}</span>
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Type your reply..."
            rows={4}
          />
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendReply} disabled={loading || !replyContent.trim()}>
              <Send className="h-4 w-4 mr-1" />
              {loading ? "Sending..." : "Send Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
