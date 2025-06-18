"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Plus, FileText, ImageIcon, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock template data
const templates = [
  {
    id: 1,
    name: "Product Launch",
    type: "post",
    platform: "Instagram",
    tags: ["product", "launch", "marketing"],
    content:
      "🚀 Exciting news! We're thrilled to announce the launch of [PRODUCT NAME]! [PRODUCT DESCRIPTION]\n\nAvailable now at [LINK]. Tag someone who needs this in their life!\n\n#NewProduct #ProductLaunch #[INDUSTRY]",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 2,
    name: "Customer Testimonial",
    type: "post",
    platform: "Facebook",
    tags: ["testimonial", "customer", "review"],
    content:
      "❤️ Here's what our customers are saying:\n\n\"[TESTIMONIAL]\"\n\n- [CUSTOMER NAME], [LOCATION/TITLE]\n\nWe're committed to providing the best experience for all our customers. Have you tried [PRODUCT/SERVICE] yet?",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 3,
    name: "Weekly Tips",
    type: "post",
    platform: "LinkedIn",
    tags: ["tips", "advice", "weekly"],
    content:
      "📌 [INDUSTRY] Tip of the Week:\n\n[TIP TITLE]\n\n[TIP CONTENT - 3-5 BULLET POINTS]\n\nWhat other tips would you add to this list? Share in the comments below!\n\n#[INDUSTRY]Tips #ProfessionalDevelopment",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 4,
    name: "Behind the Scenes",
    type: "video",
    platform: "Instagram",
    tags: ["bts", "team", "company"],
    content:
      "✨ Take a peek behind the curtain! Here's what goes into [PROCESS/PRODUCT].\n\nOur amazing team works hard to bring you the best [PRODUCTS/SERVICES] possible.\n\n#BehindTheScenes #MeetTheTeam #[COMPANY]Life",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 5,
    name: "Industry News",
    type: "article",
    platform: "Twitter",
    tags: ["news", "industry", "update"],
    content:
      "📰 [HEADLINE]: [BRIEF SUMMARY]\n\nOur thoughts: [COMPANY PERSPECTIVE]\n\nRead the full story: [LINK]\n\nWhat's your take on this news? Let us know!\n\n#[INDUSTRY]News #IndustryUpdate",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
  {
    id: 6,
    name: "Holiday Promotion",
    type: "post",
    platform: "Multiple",
    tags: ["holiday", "promotion", "sale"],
    content:
      "🎉 [HOLIDAY] SPECIAL!\n\nCelebrate [HOLIDAY] with [DISCOUNT]% off all [PRODUCTS/SERVICES]!\n\nUse code: [CODE] at checkout.\nValid until: [DATE]\n\nShop now: [LINK]\n\n#[HOLIDAY]Sale #SpecialOffer #LimitedTimeOffer",
    imageUrl: "/placeholder.svg?height=300&width=300",
  },
]

const typeIcons = {
  post: FileText,
  image: ImageIcon,
  video: Video,
  article: FileText,
}

const platformColors = {
  Instagram: "bg-pink-100 text-pink-800",
  Facebook: "bg-blue-100 text-blue-800",
  Twitter: "bg-sky-100 text-sky-800",
  LinkedIn: "bg-indigo-100 text-indigo-800",
  TikTok: "bg-black text-white",
  Multiple: "bg-purple-100 text-purple-800",
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.includes(searchTerm.toLowerCase())) ||
      template.platform.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <AppShell title="Content Templates">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-10 w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Template</DialogTitle>
                <DialogDescription>Create a reusable template for your social media content</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input id="name" placeholder="e.g., Product Launch" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="multiple">Multiple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Content Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Text Post</SelectItem>
                      <SelectItem value="image">Image Post</SelectItem>
                      <SelectItem value="video">Video Post</SelectItem>
                      <SelectItem value="article">Article</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input id="tags" placeholder="e.g., product, launch, marketing" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Template Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter your template content with [PLACEHOLDERS] for customizable text"
                    rows={6}
                  />
                  <p className="text-xs text-gray-500">
                    Use [PLACEHOLDERS] for text that will be replaced when using the template
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Template Image (optional)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImageIcon className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 2MB)</p>
                      </div>
                      <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button>Create Template</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const TypeIcon = typeIcons[template.type as keyof typeof typeIcons] || FileText
            return (
              <Card
                key={template.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4" />
                        {template.name}
                      </CardTitle>
                      <CardDescription>
                        {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="secondary"
                      className={platformColors[template.platform as keyof typeof platformColors]}
                    >
                      {template.platform}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 overflow-hidden bg-gray-50 rounded-md flex items-center justify-center">
                      {template.imageUrl ? (
                        <img
                          src={template.imageUrl || "/placeholder.svg"}
                          alt={template.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <TypeIcon className="h-12 w-12 text-gray-300" />
                      )}
                    </div>
                    <div className="text-sm text-gray-600 line-clamp-3">{template.content.substring(0, 100)}...</div>
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between pt-2">
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                      <Button size="sm">Use Template</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search or create a new template</p>
          </div>
        )}
      </div>
    </AppShell>
  )
}
