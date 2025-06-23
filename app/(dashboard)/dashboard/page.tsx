import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { ContentCalendar } from "@/components/content-calendar"
import { AIAssistant } from "@/components/ai-assistant"
import { SocialStatsWidget } from '@/components/social-stats-widget'
import { QuickReportWidget } from '@/components/quick-report-widget'
import { AppShell } from '@/components/app-shell'

export default function Dashboard() {
  return (
    <AppShell title="Dashboard Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SocialStatsWidget platform="facebook" />
        <SocialStatsWidget platform="twitter" />
        <SocialStatsWidget platform="instagram" />
        <SocialStatsWidget platform="linkedin" />
      </div>
      <div className="p-6 bg-gray-50 min-h-screen w-full">
        {/* Stat Cards */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-6xl">
            <DashboardStats />
          </div>
        </div>

        {/* Main Grid */}
        <div className="mt-8 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Calendar (2/3 width on large screens) */}
          <div className="lg:col-span-2">
            <ContentCalendar />
          </div>
          {/* Quick Actions, Recent Activity, AI Assistant, and Quick Reports (1/3 width on large screens) */}
          <div className="flex flex-col gap-6">
            <QuickActions />
            <QuickReportWidget 
              title="Quick Analytics"
              description="Generate reports instantly"
              defaultType="campaign"
            />
            <RecentActivity />
            <AIAssistant />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
