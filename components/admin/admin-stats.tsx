import { Package, Calendar, Users, Star, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminAnalytics } from "@/lib/data-service"

interface AdminStatsProps {
  analytics: AdminAnalytics
}

export function AdminStats({ analytics }: AdminStatsProps) {
  const stats = [
    {
      title: "Total Items",
      value: analytics.totalItems,
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Bookings",
      value: analytics.totalBookings,
      icon: Calendar,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Total Reviews",
      value: analytics.totalReviews,
      icon: Star,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Total Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Avg. Booking Value",
      value: `$${analytics.totalBookings > 0 ? (analytics.totalRevenue / analytics.totalBookings).toFixed(2) : "0"}`,
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="bg-gray-900/50 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
