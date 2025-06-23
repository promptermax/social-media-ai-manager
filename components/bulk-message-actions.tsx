"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Brain, 
  MessageSquare, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Send,
  Undo2,
  Archive,
  Trash2,
  Flag,
  FlagOff,
  Reply,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react"
import { toast } from "sonner"

interface BulkMessageActionsProps {
  messages: Array<{
    id: string
    content: string
    platform: string
    type: string
    senderName: string
    isRead: boolean
    isReplied: boolean
    sentiment: string
  }>
  onRefresh: () => void
}

export function BulkMessageActions({ messages, onRefresh }: BulkMessageActionsProps) {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [showSelectAll, setShowSelectAll] = useState(false)

  const unreadMessages = messages.filter(m => !m.isRead)
  const unprocessedMessages = messages.filter(m => !m.isReplied && m.sentiment === 'NEUTRAL')

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(messages.map(m => m.id))
    } else {
      setSelectedMessages([])
    }
  }

  const handleSelectMessage = (messageId: string, checked: boolean) => {
    if (checked) {
      setSelectedMessages(prev => [...prev, messageId])
    } else {
      setSelectedMessages(prev => prev.filter(id => id !== messageId))
    }
  }

  const bulkAction = async (action: string, data?: any, confirmMsg?: string) => {
    if (selectedMessages.length === 0) {
      toast.error("Please select messages to perform this action")
      return
    }
    if (confirmMsg && !window.confirm(confirmMsg)) return
    setProcessing(true)
    try {
      const response = await fetch("/api/messages/bulk-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageIds: selectedMessages,
          action,
          data,
        }),
      })
      if (response.ok) {
        const res = await response.json()
        toast.success(`Bulk action '${action}' completed (${res.processed})`)
        setSelectedMessages([])
        onRefresh()
      } else {
        toast.error("Bulk action failed")
      }
    } catch (error) {
      toast.error("Error performing bulk action")
    }
    setProcessing(false)
  }

  const markSelectedAsRead = () => bulkAction("mark_as_read")
  const markSelectedAsUnread = () => bulkAction("mark_as_unread")
  const markSelectedAsReplied = () => bulkAction("mark_as_replied")
  const flagSelected = () => bulkAction("flag")
  const unflagSelected = () => bulkAction("unflag")
  const archiveSelected = () => bulkAction("archive")
  const unarchiveSelected = () => bulkAction("unarchive")
  const deleteSelected = () => bulkAction("delete", undefined, "Are you sure you want to delete the selected messages? This cannot be undone.")
  const setSentiment = (sentiment: string) => bulkAction("update_sentiment", { sentiment })
  const setPriority = (priority: string) => bulkAction("update_priority", { priority })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Bulk Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{unreadMessages.length}</div>
            <div className="text-sm text-blue-800">Unread</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{unprocessedMessages.length}</div>
            <div className="text-sm text-yellow-800">Need Analysis</div>
          </div>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedMessages.length === messages.length && messages.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm">
              {selectedMessages.length} of {messages.length} selected
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSelectAll(!showSelectAll)}
          >
            {showSelectAll ? "Hide" : "Show"} All
          </Button>
        </div>

        {/* Message Selection */}
        {showSelectAll && (
          <div className="max-h-40 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div key={message.id} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <Checkbox
                  checked={selectedMessages.includes(message.id)}
                  onCheckedChange={(checked) => handleSelectMessage(message.id, checked as boolean)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{message.senderName}</span>
                    <Badge variant="outline" className="text-xs">
                      {message.platform}
                    </Badge>
                    {!message.isRead && (
                      <Badge variant="destructive" className="text-xs">
                        Unread
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button onClick={markSelectedAsRead} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark as Read
          </Button>
          <Button onClick={markSelectedAsUnread} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <Undo2 className="h-4 w-4 mr-2" />
            Mark as Unread
          </Button>
          <Button onClick={markSelectedAsReplied} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <Reply className="h-4 w-4 mr-2" />
            Mark as Replied
          </Button>
          <Button onClick={flagSelected} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <Flag className="h-4 w-4 mr-2" />
            Flag
          </Button>
          <Button onClick={unflagSelected} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <FlagOff className="h-4 w-4 mr-2" />
            Unflag
          </Button>
          <Button onClick={archiveSelected} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <Archive className="h-4 w-4 mr-2" />
            Archive
          </Button>
          <Button onClick={unarchiveSelected} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
            <Undo2 className="h-4 w-4 mr-2" />
            Unarchive
          </Button>
          <Button onClick={deleteSelected} disabled={processing || selectedMessages.length === 0} className="w-full" variant="destructive">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button onClick={() => setSentiment('POSITIVE')} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
              <ArrowUpCircle className="h-4 w-4 mr-2 text-green-600" />
              Set Positive
            </Button>
            <Button onClick={() => setSentiment('NEGATIVE')} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
              <ArrowDownCircle className="h-4 w-4 mr-2 text-red-600" />
              Set Negative
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setPriority('HIGH')} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
              <ArrowUpCircle className="h-4 w-4 mr-2 text-blue-600" />
              High Priority
            </Button>
            <Button onClick={() => setPriority('LOW')} disabled={processing || selectedMessages.length === 0} className="w-full" variant="outline">
              <ArrowDownCircle className="h-4 w-4 mr-2 text-gray-600" />
              Low Priority
            </Button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const urgentIds = messages
                  .filter(m => m.sentiment === 'URGENT' || m.sentiment === 'NEGATIVE')
                  .map(m => m.id)
                setSelectedMessages(urgentIds)
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Select Urgent Messages
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                const unreadIds = unreadMessages.map(m => m.id)
                setSelectedMessages(unreadIds)
              }}
            >
              <Clock className="h-4 w-4 mr-2" />
              Select Unread Messages
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 