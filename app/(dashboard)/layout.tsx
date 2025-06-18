import type { ReactNode } from "react"

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  // In a real app, you would check authentication here
  return children
}
