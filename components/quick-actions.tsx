import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon, Video, PenTool, MessageCircle } from "lucide-react"
import Link from "next/link"

const actions = [
  {
    title: "Generate Image",
    description: "AI-powered graphics",
    icon: ImageIcon,
    href: "/ai-generator/image",
  },
  {
    title: "Create Video",
    description: "Generate reels and videos",
    icon: Video,
    href: "/ai-generator/video",
  },
  {
    title: "Write Content",
    description: "AI captions and posts",
    icon: PenTool,
    href: "/ai-generator/content",
  },
  {
    title: "Manage Messages",
    description: "Handle comments & DMs",
    icon: MessageCircle,
    href: "/messages",
  },
]

export function QuickActions() {
  return (
    <Card className="rounded-2xl border border-gray-200">
      <CardHeader>
        <CardTitle className="font-bold text-xl">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href} className="block">
              <div className="flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200 h-full cursor-pointer transition-none">
                <div className="p-3 mb-3 rounded-lg bg-blue-50 flex items-center justify-center">
                  <action.icon className="h-7 w-7 text-blue-500" />
                </div>
                <div className="text-center">
                  <div className="font-bold text-base mb-1">{action.title}</div>
                  <div className="text-sm text-gray-500">{action.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
