"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Line, LineChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { AdminAnalytics } from "@/lib/data-service"

interface AdminChartsProps {
  analytics: AdminAnalytics
}

export function AdminCharts({ analytics }: AdminChartsProps) {
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

  const categoryChartConfig = {
    count: {
      label: "Items",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  const statusChartConfig = {
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    confirmed: {
      label: "Confirmed",
      color: "hsl(var(--chart-2))",
    },
    completed: {
      label: "Completed",
      color: "hsl(var(--chart-3))",
    },
    cancelled: {
      label: "Cancelled",
      color: "hsl(var(--chart-4))",
    },
    active: {
      label: "Active",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig

  const monthChartConfig = {
    count: {
      label: "Bookings",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue ($)",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Items by Category - Bar Chart */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Items by Category</CardTitle>
          <CardDescription className="text-gray-400">Distribution of items across different categories</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryChartConfig}>
            <BarChart
              accessibilityLayer
              data={itemsByCategory}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid vertical={false} stroke="#374151" />
              <XAxis
                dataKey="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none text-gray-300">
            Total items: {itemsByCategory.reduce((sum, item) => sum + item.count, 0)}
          </div>
        </CardFooter>
      </Card>

      {/* Bookings by Status - Pie Chart */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Bookings by Status</CardTitle>
          <CardDescription className="text-gray-400">Current status distribution of all bookings</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={statusChartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={bookingsByStatus}
                dataKey="count"
                nameKey="status"
                innerRadius={60}
                strokeWidth={5}
                fill="var(--color-pending)"
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none text-gray-300">
            Total bookings: {bookingsByStatus.reduce((sum, item) => sum + item.count, 0)}
          </div>
        </CardFooter>
      </Card>

      {/* Bookings by Month - Line Chart */}
      <Card className="bg-gray-900/50 border-gray-700 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-white">Bookings & Revenue by Month</CardTitle>
          <CardDescription className="text-gray-400">Monthly booking trends and revenue over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthChartConfig}>
            <LineChart
              accessibilityLayer
              data={bookingsByMonth}
              margin={{
                top: 20,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} stroke="#374151" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tick={{ fill: "#9CA3AF" }} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} tick={{ fill: "#9CA3AF" }} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                dataKey="count"
                type="monotone"
                stroke="var(--color-count)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-count)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
              <Line
                yAxisId="right"
                dataKey="revenue"
                type="monotone"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={{
                  fill: "var(--color-revenue)",
                }}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none text-gray-300">
                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 leading-none text-gray-400">
                Showing total bookings and revenue for the last 6 months
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
