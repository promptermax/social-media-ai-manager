import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // In a real app, you would check authentication here
  return <AppShell title="Dashboard">{children}</AppShell>
}
