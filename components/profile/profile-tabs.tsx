"use client"
import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, Calendar, Eye, Package } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Item, Booking } from "@/lib/data-service"
import { BookingCancellationModal } from "@/components/booking-cancellation-modal"
import { useState } from "react"

interface ProfileTabsProps {
  items: Item[]
  bookingsAsRenter: Booking[]
  bookingsAsOwner: Booking[]
  userId: string
}

export function ProfileTabs({ items, bookingsAsRenter, bookingsAsOwner }: ProfileTabsProps) {
  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList className="grid w-full grid-cols-3 bg-gray-900/50 border border-gray-700">
        <TabsTrigger value="listings" className="data-[state=active]:bg-gray-800">
          My Listings ({items.length})
        </TabsTrigger>
        <TabsTrigger value="rentals" className="data-[state=active]:bg-gray-800">
          My Rentals ({bookingsAsRenter.length})
        </TabsTrigger>
        <TabsTrigger value="bookings" className="data-[state=active]:bg-gray-800">
          Received Bookings ({bookingsAsOwner.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="listings" className="mt-6">
        <ItemsGrid items={items} />
      </TabsContent>

      <TabsContent value="rentals" className="mt-6">
        <BookingsGrid bookings={bookingsAsRenter} type="renter" />
      </TabsContent>

      <TabsContent value="bookings" className="mt-6">
        <BookingsGrid bookings={bookingsAsOwner} type="owner" />
      </TabsContent>
    </Tabs>
  )
}

function ItemsGrid({ items }: { items: Item[] }) {
  if (items.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No items listed yet</h3>
            <p>Start earning by listing your first item</p>
          </div>
          <Link href="/items/new">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              List Your First Item
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <Card
          key={item.id}
          className="bg-gray-900/50 border-gray-700 overflow-hidden group hover:bg-gray-800/50 transition-colors"
        >
          <div className="aspect-[4/3] relative">
            <Image
              src={item.image || "/placeholder.svg?height=200&width=300"}
              alt={item.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant={item.is_available ? "default" : "secondary"} className="bg-black/50 backdrop-blur-sm">
                {item.is_available ? "Available" : "Unavailable"}
              </Badge>
            </div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                {item.category}
              </Badge>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">{item.average_rating?.toFixed(1) || "0.0"}</span>
              </div>
            </div>
            <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.name}</h3>
            <div className="flex items-center space-x-1 text-sm text-gray-400 mb-3">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-white">${item.price}/day</span>
              <Link href={`/item/${item.id}`}>
                <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function BookingsGrid({ bookings, type }: { bookings: Booking[]; type: "renter" | "owner" }) {
  const [selectedBookingForCancellation, setSelectedBookingForCancellation] = useState<Booking | null>(null)

  if (bookings.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardContent className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">
              {type === "renter" ? "No rentals yet" : "No bookings received yet"}
            </h3>
            <p>{type === "renter" ? "Start exploring items to rent" : "List items to start receiving bookings"}</p>
          </div>
          <Link href={type === "renter" ? "/browse" : "/items/new"}>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              {type === "renter" ? "Browse Items" : "List an Item"}
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id} className="bg-gray-900/50 border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-32 h-24 relative rounded-lg overflow-hidden">
                <Image
                  src={booking.item?.image || "/placeholder.svg?height=96&width=128"}
                  alt={booking.item?.name || "Item"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{booking.item?.name}</h3>
                    <p className="text-sm text-gray-400">
                      {type === "renter"
                        ? `Owner: ${booking.owner?.full_name}`
                        : `Renter: ${booking.renter?.full_name}`}
                    </p>
                  </div>
                  <Badge
                    variant={
                      booking.status === "confirmed" || booking.status === "active"
                        ? "default"
                        : booking.status === "completed"
                          ? "secondary"
                          : "destructive"
                    }
                    className={
                      booking.status === "confirmed" || booking.status === "active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : booking.status === "completed"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                    }
                  >
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
                  <div>
                    <span className="block text-gray-500">Start Date</span>
                    <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">End Date</span>
                    <span>{new Date(booking.end_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Total Price</span>
                    <span className="text-white font-semibold">${booking.total_price}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500">Booked</span>
                    <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            {(booking.status === "pending" || booking.status === "confirmed") && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedBookingForCancellation(booking)}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {selectedBookingForCancellation && (
        <BookingCancellationModal
          booking={selectedBookingForCancellation}
          isOpen={!!selectedBookingForCancellation}
          onClose={() => setSelectedBookingForCancellation(null)}
          onCancelled={() => {
            // Refresh the page or update the booking list
            window.location.reload()
          }}
        />
      )}
    </div>
  )
}
