"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Users, BarChart2, RefreshCw } from "lucide-react"

interface SocialStatsWidgetProps {
  platform: "facebook" | "twitter" | "instagram" | "linkedin"
}

export function SocialStatsWidget({ platform }: SocialStatsWidgetProps) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchStats = async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`/api/social/${platform}/stats`)
      if (!res.ok) throw new Error("Failed to fetch stats")
      const data = await res.json()
      setStats(data)
    } catch (err: any) {
      setError(err.message || "Error fetching stats")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchStats()
    // eslint-disable-next-line
  }, [platform])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg capitalize">
          <BarChart2 className="h-5 w-5" />
          {platform}
        </CardTitle>
        <button onClick={fetchStats} title="Refresh" className="text-gray-400 hover:text-blue-600">
          <RefreshCw className="h-4 w-4" />
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Sparkles className="h-4 w-4 animate-spin" />
            Loading stats...
          </div>
        ) : error ? (
          <div className="text-red-500 text-sm">{error}</div>
        ) : stats ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-lg">{stats.followers.toLocaleString()}</span>
              <span className="text-xs text-gray-500">Followers</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-800">
                Engagement: {stats.engagementRate}%
              </Badge>
            </div>
            <div>
              <div className="font-medium text-sm mb-1">Recent Posts</div>
              <div className="space-y-2">
                {stats.posts?.map((post: any) => (
                  <div key={post.id} className="p-2 bg-gray-50 rounded flex flex-col gap-1">
                    <div className="font-semibold text-xs truncate">{post.title}</div>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {post.likes !== undefined && <span>👍 {post.likes}</span>}
                      {post.comments !== undefined && <span>💬 {post.comments}</span>}
                      {post.shares !== undefined && <span>🔁 {post.shares}</span>}
                      {post.retweets !== undefined && <span>🔁 {post.retweets}</span>}
                      {post.replies !== undefined && <span>💬 {post.replies}</span>}
                      {post.saves !== undefined && <span>💾 {post.saves}</span>}
                      {post.reach !== undefined && <span>📈 {post.reach}</span>}
                      {post.impressions !== undefined && <span>👁️ {post.impressions}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {stats.note && <div className="text-xs text-gray-400 mt-2">{stats.note}</div>}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
} 