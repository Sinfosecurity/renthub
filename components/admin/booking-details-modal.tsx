"use client"

import Image from "next/image"
import { Calendar, MapPin, User, DollarSign, Clock, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Booking } from "@/lib/data-service"
import { Button } from "@/components/ui/button"

interface BookingDetailsModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
}

export function BookingDetailsModal({ booking, isOpen, onClose }: BookingDetailsModalProps) {
  const duration = Math.ceil(
    (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Booking Details</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Booking ID</p>
              <p className="font-mono text-sm">{booking.id}</p>
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

          <Separator className="bg-gray-700" />

          {/* Item Details */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                  <Image
                    src={booking.item?.image || "/placeholder.svg?height=96&width=96"}
                    alt={booking.item?.name || "Item"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{booking.item?.name}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{booking.item?.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <DollarSign className="w-4 h-4" />
                      <span>${booking.item?.price}/day</span>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{booking.item?.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Period */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Rental Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Start Date</p>
                    <p className="font-semibold">{new Date(booking.start_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-400" />
                  <div>
                    <p className="text-sm text-gray-400">End Date</p>
                    <p className="font-semibold">{new Date(booking.end_date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">Duration</p>
                    <p className="font-semibold">
                      {duration} day{duration !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* People Involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Renter */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Renter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-semibold">{booking.renter?.full_name}</p>
                  <p className="text-sm text-gray-400">{booking.renter?.email}</p>
                  {booking.renter?.location && <p className="text-sm text-gray-400 mt-1">{booking.renter.location}</p>}
                </div>
              </CardContent>
            </Card>

            {/* Owner */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-semibold">{booking.owner?.full_name}</p>
                  <p className="text-sm text-gray-400">{booking.owner?.email}</p>
                  {booking.owner?.location && <p className="text-sm text-gray-400 mt-1">{booking.owner.location}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Details */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Rate</span>
                  <span>${booking.item?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Duration</span>
                  <span>
                    {duration} day{duration !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${(booking.item?.price || 0) * duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Service Fee</span>
                  <span>${booking.total_price - (booking.item?.price || 0) * duration}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${booking.total_price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Timeline */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Booking Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">
                <p>Booking created: {new Date(booking.created_at).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
