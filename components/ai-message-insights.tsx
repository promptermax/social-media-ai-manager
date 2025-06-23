"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  MessageSquare, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Sparkles,
  Copy,
  Send
} from "lucide-react"
import { toast } from "sonner"

interface MessageInsightsProps {
  message: {
    id: string
    content: string
    platform: string
    type: string
    senderName: string
    postTitle?: string
  }
  onUseReply?: (content: string) => void
}

interface Analysis {
  sentiment: string
  priority: string
  suggestedResponse: string
  engagementType: string
  responseUrgency: string
  keyTopics: string[]
  customerIntent: string
  suggestedActions: string[]
}

interface AutoReply {
  options: Array<{
    type: string
    content: string
  }>
}

export function AIMessageInsights({ message, onUseReply }: MessageInsightsProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [autoReplies, setAutoReplies] = useState<AutoReply | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("insights")

  const urgencyColors = {
    IMMEDIATE: "bg-red-100 text-red-800",
    WITHIN_HOUR: "bg-orange-100 text-orange-800",
    WITHIN_DAY: "bg-yellow-100 text-yellow-800",
    LOW_PRIORITY: "bg-gray-100 text-gray-800",
  }

  const engagementColors = {
    REPLY: "bg-blue-100 text-blue-800",
    LIKE: "bg-green-100 text-green-800",
    IGNORE: "bg-gray-100 text-gray-800",
    ESCALATE: "bg-red-100 text-red-800",
  }

  const analyzeMessage = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/messages/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageContent: message.content,
          platform: message.platform,
          messageType: message.type,
          senderName: message.senderName,
          postTitle: message.postTitle,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnalysis(data.analysis)
      } else {
        toast.error("Failed to analyze message")
      }
    } catch (error) {
      toast.error("Error analyzing message")
    }
    setLoading(false)
  }

  const generateAutoReplies = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/messages/ai/auto-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: message.id,
          tone: "Professional and friendly",
          includeEmoji: true,
          maxLength: 200,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setAutoReplies(data.autoReplies)
      } else {
        toast.error("Failed to generate auto-replies")
      }
    } catch (error) {
      toast.error("Error generating auto-replies")
    }
    setLoading(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const useReply = (content: string) => {
    if (onUseReply) {
      onUseReply(content)
    }
  }

  useEffect(() => {
    if (message) {
      analyzeMessage()
    }
  }, [message])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Message Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="replies">Auto-Replies</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4 mt-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Sparkles className="h-6 w-6 animate-spin mr-2" />
                Analyzing message...
              </div>
            ) : analysis ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Sentiment</h4>
                    <Badge variant="outline" className="capitalize">
                      {analysis.sentiment.toLowerCase()}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Priority</h4>
                    <Badge variant="outline" className="capitalize">
                      {analysis.priority.toLowerCase()}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Response Urgency</h4>
                  <Badge 
                    variant="outline" 
                    className={urgencyColors[analysis.responseUrgency as keyof typeof urgencyColors]}
                  >
                    {analysis.responseUrgency.replace('_', ' ')}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Recommended Action</h4>
                  <Badge 
                    variant="outline" 
                    className={engagementColors[analysis.engagementType as keyof typeof engagementColors]}
                  >
                    {analysis.engagementType}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Customer Intent</h4>
                  <p className="text-sm text-gray-600">{analysis.customerIntent}</p>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keyTopics.map((topic, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Suggested Response</h4>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{analysis.suggestedResponse}</p>
                    <div className="flex gap-2 mt-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(analysis.suggestedResponse)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => useReply(analysis.suggestedResponse)}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No insights available
              </div>
            )}
          </TabsContent>

          <TabsContent value="replies" className="space-y-4 mt-4">
            {!autoReplies && (
              <Button 
                onClick={generateAutoReplies} 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Auto-Replies
                  </>
                )}
              </Button>
            )}

            {autoReplies && (
              <div className="space-y-4">
                {autoReplies.options.map((reply, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {reply.type}
                      </Badge>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => copyToClipboard(reply.content)}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => useReply(reply.content)}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Use
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="actions" className="space-y-4 mt-4">
            {analysis && (
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recommended Actions</h4>
                {analysis.suggestedActions.map((action, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 