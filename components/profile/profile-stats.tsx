import { Package, Calendar, Star, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileStatsProps {
  stats: {
    itemsListed: number
    bookingsAsOwner: number
    bookingsAsRenter: number
    reviewsGiven: number
  }
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Items Listed",
      value: stats.itemsListed,
      icon: Package,
      color: "text-blue-400",
    },
    {
      label: "Items Rented",
      value: stats.bookingsAsRenter,
      icon: Calendar,
      color: "text-green-400",
    },
    {
      label: "Bookings Received",
      value: stats.bookingsAsOwner,
      icon: Users,
      color: "text-purple-400",
    },
    {
      label: "Reviews Given",
      value: stats.reviewsGiven,
      icon: Star,
      color: "text-yellow-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statItems.map((stat) => (
        <Card key={stat.label} className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6 text-center">
            <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
