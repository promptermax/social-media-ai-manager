"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { aiRequest } from '@/hooks/useAIClient'

const ContentPage = () => {
  const [prompt, setPrompt] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateContent = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await aiRequest({
        type: 'text',
        params: { prompt }, // Add other params as needed
      })
      setGeneratedContent(result)
    } catch (err: any) {
      setGeneratedContent('')
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Content Generator</CardTitle>
          <CardDescription>Generate engaging content for your marketing needs.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Enter your content idea</Label>
            <Input
              id="prompt"
              placeholder="e.g., Write a blog post about the benefits of using our product"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Content Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select Tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                    <SelectItem value="persuasive">Persuasive</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Target Audience</Label>
                <Input placeholder="e.g., Small business owners" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Keywords</Label>
              <Input placeholder="e.g., AI, Content Generation, Marketing" />
            </div>

            <div className="space-y-2">
              <Label>Content Length</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="long">Long</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Language</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="social-media-post">Social Media Post</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="ad-copy">Ad Copy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Call to Action</Label>
              <Input placeholder="e.g., Visit our website today!" />
            </div>

            <div className="space-y-2">
              <Label>Reference Business Knowledge</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="use-business-plan" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="use-business-plan" className="text-sm">
                    Use Business Plan insights
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="use-brand-voice" className="rounded border-gray-300" defaultChecked />
                  <Label htmlFor="use-brand-voice" className="text-sm">
                    Apply Brand Guidelines
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="use-market-data" className="rounded border-gray-300" />
                  <Label htmlFor="use-market-data" className="text-sm">
                    Include Market Research
                  </Label>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Content will be tailored based on your uploaded business documents
              </p>
            </div>
          </div>

          <Button onClick={handleGenerateContent} disabled={loading || !prompt.trim()}>
            {loading ? 'Generating...' : 'Generate Content'}
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          {generatedContent && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold">Generated Content</h2>
              <p>{generatedContent}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ContentPage
