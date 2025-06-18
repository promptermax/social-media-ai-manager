import type { ReactNode } from "react"
import { MainSidebar } from "@/components/main-sidebar"
import { MainHeader } from "@/components/main-header"
import { SidebarInset } from "@/components/ui/sidebar"

interface AppShellProps {
  children: ReactNode
  title: string
}

export function AppShell({ children, title }: AppShellProps) {
  return (
    <div className="flex min-h-screen">
      <MainSidebar />
      <SidebarInset>
        <MainHeader title={title} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50">{children}</main>
      </SidebarInset>
    </div>
  )
}
