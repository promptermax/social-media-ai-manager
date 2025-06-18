import { AppShell } from "@/components/app-shell"
import { DashboardStats } from "@/components/dashboard-stats"
import { QuickActions } from "@/components/quick-actions"
import { RecentActivity } from "@/components/recent-activity"
import { ContentCalendar } from "@/components/content-calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Dashboard() {
  return (
    <AppShell title="Dashboard">
      <div className="grid gap-6">
        <DashboardStats />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Tabs defaultValue="upcoming">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming Content</TabsTrigger>
                  <TabsTrigger value="tasks">My Tasks</TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="upcoming" className="m-0">
                <ContentCalendar />
              </TabsContent>

              <TabsContent value="tasks" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Assigned Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">Create Instagram post for product launch</h4>
                            <p className="text-sm text-muted-foreground">Due in 2 days</p>
                          </div>
                          <Button size="sm">View</Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
