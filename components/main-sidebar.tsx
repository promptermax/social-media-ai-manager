"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  ImageIcon,
  Settings,
  Users,
  BarChart3,
  Briefcase,
  FileIcon as FileTemplate,
  CheckSquare,
  Lightbulb,
  ChevronDown,
  LogOut,
  FileText,
  Activity,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"

export function MainSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [activeCompany, setActiveCompany] = useState({
    name: "Acme Corporation",
    logo: "/placeholder.svg?height=40&width=40",
  })
  const { state } = useSidebar ? useSidebar() : { state: "expanded" }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/")

  return (
    <>
      {/* Always-visible sidebar trigger when collapsed */}
      {state === "collapsed" && (
        <div className="fixed top-4 left-2 z-50">
          <SidebarTrigger />
        </div>
      )}
      <Sidebar>
        <SidebarHeader className="pb-0">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={activeCompany.logo || "/placeholder.svg"} alt={activeCompany.name} />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{activeCompany.name}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="link" className="h-auto p-0 text-xs text-blue-600">
                      Switch Company
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>
                      <Link href="/company-select" className="w-full">
                        Select Company
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarSeparator />
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link href="/dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/calendar")}>
                <Link href="/calendar">
                  <Calendar className="h-4 w-4" />
                  <span>Content Calendar</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/messages")}>
                <Link href="/messages">
                  <MessageSquare className="h-4 w-4" />
                  <span>Messages</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible className="w-full">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <ImageIcon className="h-4 w-4" />
                    <span>Content Creation</span>
                    <ChevronDown className="ml-auto h-4 w-4" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive("/ai-generator/image")}>
                      <Link href="/ai-generator/image">Image Generator</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive("/ai-generator/video")}>
                      <Link href="/ai-generator/video">Video Generator</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive("/ai-generator/content")}>
                      <Link href="/ai-generator/content">Content Generator</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild isActive={isActive("/ai-generator/enhanced-content")}>
                      <Link href="/ai-generator/enhanced-content">Enhanced Generator</Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/templates")}>
                <Link href="/templates">
                  <FileTemplate className="h-4 w-4" />
                  <span>Templates</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/tasks")}>
                <Link href="/tasks">
                  <CheckSquare className="h-4 w-4" />
                  <span>Tasks</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/strategy")}>
                <Link href="/strategy">
                  <Lightbulb className="h-4 w-4" />
                  <span>Strategy</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/documents")}>
                <Link href="/documents">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/activity")}>
                <Link href="/activity">
                  <Activity className="h-4 w-4" />
                  <span>Activity</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/analytics")}>
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          <SidebarSeparator className="my-2" />

          {session?.user?.role === "ADMIN" && (
            <SidebarMenu>
              <Collapsible className="w-full">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Briefcase className="h-4 w-4" />
                      <span>Admin</span>
                      <ChevronDown className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </SidebarMenuItem>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/admin/users")}>
                        <Link href="/admin/users">Users</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/admin/companies")}>
                        <Link href="/admin/companies">Companies</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/admin/roles")}>
                        <Link href="/admin/roles">Roles & Permissions</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton asChild isActive={isActive("/admin/audit")}>
                        <Link href="/admin/audit">Audit & Compliance</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/settings")}>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <span>John Doe</span>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </>
  )
}
