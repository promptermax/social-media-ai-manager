import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, MessageSquare, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Followers",
    value: "124.5K",
    change: "+12.5%",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Engagement Rate",
    value: "8.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-green-600",
  },
  {
    title: "Posts This Month",
    value: "47",
    change: "+18%",
    icon: Calendar,
    color: "text-purple-600",
  },
  {
    title: "Pending Messages",
    value: "23",
    change: "-5%",
    icon: MessageSquare,
    color: "text-orange-600",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-600 mt-1">
              <span className={stat.change.startsWith("+") ? "text-green-600" : "text-red-600"}>{stat.change}</span>
              {" from last month"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
