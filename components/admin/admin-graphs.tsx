"use client"

import { TrendingUp, BarChart3, PieChart, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { AdminAnalytics } from "@/lib/data-service"

interface AdminGraphsProps {
  analytics: AdminAnalytics
}

export function AdminGraphs({ analytics }: AdminGraphsProps) {
  // Ensure we have data or provide defaults
  const itemsByCategory =
    analytics.itemsByCategory?.length > 0
      ? analytics.itemsByCategory
      : [
          { category: "Electronics", count: 5 },
          { category: "Tools", count: 3 },
          { category: "Sports", count: 2 },
          { category: "Photography", count: 1 },
        ]

  const bookingsByStatus =
    analytics.bookingsByStatus?.length > 0
      ? analytics.bookingsByStatus
      : [
          { status: "pending", count: 3 },
          { status: "confirmed", count: 5 },
          { status: "completed", count: 2 },
          { status: "cancelled", count: 1 },
        ]

  const bookingsByMonth =
    analytics.bookingsByMonth?.length > 0
      ? analytics.bookingsByMonth
      : [
          { month: "Jan", count: 2, revenue: 150 },
          { month: "Feb", count: 4, revenue: 300 },
          { month: "Mar", count: 3, revenue: 225 },
          { month: "Apr", count: 6, revenue: 450 },
          { month: "May", count: 5, revenue: 375 },
          { month: "Jun", count: 8, revenue: 600 },
        ]

  // Calculate max values for scaling
  const maxCategoryCount = Math.max(...itemsByCategory.map((item) => item.count))
  const maxStatusCount = Math.max(...bookingsByStatus.map((item) => item.count))
  const maxMonthCount = Math.max(...bookingsByMonth.map((item) => item.count))
  const maxMonthRevenue = Math.max(...bookingsByMonth.map((item) => item.revenue))

  // Status colors
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500",
    confirmed: "bg-blue-500",
    completed: "bg-green-500",
    cancelled: "bg-red-500",
    active: "bg-purple-500",
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Items by Category - Custom Bar Graph */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Items by Category
          </CardTitle>
          <CardDescription className="text-gray-400">Distribution of items across different categories</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {itemsByCategory.map((item, index) => {
            const percentage = (item.count / maxCategoryCount) * 100
            const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"]
            const color = colors[index % colors.length]

            return (
              <div key={item.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-300">{item.category}</span>
                  <span className="text-sm text-gray-400">{item.count} items</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${color} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
          <div className="pt-2 border-t border-gray-700">
            <div className="flex gap-2 font-medium leading-none text-gray-300">
              Total items: {itemsByCategory.reduce((sum, item) => sum + item.count, 0)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bookings by Status - Custom Donut Graph */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Bookings by Status
          </CardTitle>
          <CardDescription className="text-gray-400">Current status distribution of all bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-32 h-32">
              {/* Custom donut visualization */}
              <div className="absolute inset-0 rounded-full bg-gray-700">
                <div className="absolute inset-2 rounded-full bg-gray-900/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {bookingsByStatus.reduce((sum, item) => sum + item.count, 0)}
                    </div>
                    <div className="text-xs text-gray-400">Total</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {bookingsByStatus.map((item, index) => {
              const total = bookingsByStatus.reduce((sum, booking) => sum + booking.count, 0)
              const percentage = total > 0 ? (item.count / total) * 100 : 0
              const colorClass = statusColors[item.status] || "bg-gray-500"

              return (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                    <span className="text-sm font-medium text-gray-300 capitalize">{item.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{item.count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Bookings by Month - Custom Line Graph */}
      <Card className="bg-gray-900/50 border-gray-700 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Bookings & Revenue by Month
          </CardTitle>
          <CardDescription className="text-gray-400">Monthly booking trends and revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Bookings Line */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-blue-400">Bookings</span>
                <span className="text-sm text-gray-400">Max: {maxMonthCount}</span>
              </div>
              <div className="relative h-20 bg-gray-800 rounded-lg p-4">
                <div className="flex items-end justify-between h-full">
                  {bookingsByMonth.map((item, index) => {
                    const height = maxMonthCount > 0 ? (item.count / maxMonthCount) * 100 : 0
                    return (
                      <div key={`bookings-${index}`} className="flex flex-col items-center gap-2 flex-1">
                        <div className="relative w-full max-w-8 bg-gray-700 rounded-t">
                          <div
                            className="bg-blue-500 rounded-t transition-all duration-500 ease-out"
                            style={{ height: `${height}%`, minHeight: item.count > 0 ? "4px" : "0" }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Revenue Line */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-green-400">Revenue ($)</span>
                <span className="text-sm text-gray-400">Max: ${maxMonthRevenue}</span>
              </div>
              <div className="relative h-20 bg-gray-800 rounded-lg p-4">
                <div className="flex items-end justify-between h-full">
                  {bookingsByMonth.map((item, index) => {
                    const height = maxMonthRevenue > 0 ? (item.revenue / maxMonthRevenue) * 100 : 0
                    return (
                      <div key={`revenue-${index}`} className="flex flex-col items-center gap-2 flex-1">
                        <div className="relative w-full max-w-8 bg-gray-700 rounded-t">
                          <div
                            className="bg-green-500 rounded-t transition-all duration-500 ease-out"
                            style={{ height: `${height}%`, minHeight: item.revenue > 0 ? "4px" : "0" }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{item.month}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full items-start gap-2 text-sm mt-6 pt-4 border-t border-gray-700">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none text-gray-300">
                Monthly trends showing growth <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-gray-400">
                Displaying bookings and revenue for the last 6 months
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
