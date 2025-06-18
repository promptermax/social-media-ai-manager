import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, PenTool, MessageCircle, Calendar, Sparkles } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Generate Image",
    description: "Create AI-powered graphics",
    icon: ImageIcon,
    href: "/ai-generator/image",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Create Video",
    description: "Generate reels and videos",
    icon: Video,
    href: "/ai-generator/video",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Write Content",
    description: "AI captions and posts",
    icon: PenTool,
    href: "/ai-generator/content",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Manage Messages",
    description: "Handle comments & DMs",
    icon: MessageCircle,
    href: "/messages",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Schedule Posts",
    description: "Plan your content",
    icon: Calendar,
    href: "/scheduler",
    color: "bg-indigo-500 hover:bg-indigo-600",
  },
  {
    title: "AI Assistant",
    description: "Get content ideas",
    icon: Sparkles,
    href: "/ai-assistant",
    color: "bg-pink-500 hover:bg-pink-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
