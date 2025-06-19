"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Share2, Video, Play } from "lucide-react"
import { aiRequest } from '@/hooks/useAIClient'

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("")
  const [duration, setDuration] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setError(null)
    try {
      const videos = await aiRequest({
        type: 'video',
        params: { prompt, style, duration },
      })
      setGeneratedVideos(videos)
    } catch (err: any) {
      setError(err.message)
      setGeneratedVideos([])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <AppShell title="AI Video Generator">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Video className="h-5 w-5" />
                <span>Video Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="prompt">Video Description</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the video you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="style">Video Style</Label>
                <Select value={style} onValueChange={setStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="animated">Animated</SelectItem>
                    <SelectItem value="cartoon">Cartoon</SelectItem>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="documentary">Documentary</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15s">15 seconds</SelectItem>
                    <SelectItem value="30s">30 seconds</SelectItem>
                    <SelectItem value="60s">1 minute</SelectItem>
                    <SelectItem value="120s">2 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="format">Format</Label>
                <Select defaultValue="square">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="square">Square (1:1)</SelectItem>
                    <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                    <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="mr-2 h-4 w-4" />
                    Generate Video
                  </>
                )}
              </Button>

              <div className="space-y-2">
                <Label>Quick Ideas</Label>
                <div className="flex flex-wrap gap-2">
                  {["Product demo", "Behind the scenes", "Tutorial", "Testimonial", "Brand story"].map(
                    (quickPrompt) => (
                      <Badge
                        key={quickPrompt}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => setPrompt(quickPrompt)}
                      >
                        {quickPrompt}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm mb-2">{error}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Generated Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {isGenerating ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Generating your video...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few minutes</p>
                  </div>
                </div>
              ) : generatedVideos.length > 0 ? (
                <div className="grid gap-4">
                  {generatedVideos.map((video, index) => (
                    <div key={index} className="relative group border rounded-lg overflow-hidden">
                      <div className="relative">
                        <img
                          src={video || "/placeholder.svg"}
                          alt={`Generated video ${index + 1}`}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <Button size="lg" variant="secondary" className="rounded-full">
                            <Play className="h-6 w-6 mr-2" />
                            Play Video
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Generated Video {index + 1}</h4>
                            <p className="text-sm text-gray-500">Duration: {duration || "30s"}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline">
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Enter a description and click generate to create videos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
