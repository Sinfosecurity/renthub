"use client"

import { useState } from "react"
import Image from "next/image"
import { Calendar, MapPin, User, DollarSign, Clock, CheckCircle, X, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { updateBookingStatus } from "@/lib/data-service"
import type { Notification } from "@/lib/data-service"

interface NotificationModalProps {
  notification: Notification
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (bookingId: string, newStatus: string) => void
}

export function NotificationModal({ notification, isOpen, onClose, onStatusUpdate }: NotificationModalProps) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null)
  const [error, setError] = useState("")

  const booking = notification.booking
  if (!booking) return null

  const duration = Math.ceil(
    (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  const handleStatusUpdate = async (newStatus: "confirmed" | "cancelled") => {
    const actionType = newStatus === "confirmed" ? "approve" : "reject"
    setLoading(actionType)
    setError("")

    try {
      await updateBookingStatus(booking.id, newStatus)
      onStatusUpdate(booking.id, newStatus)
      onClose()
    } catch (err: any) {
      setError(err.message || `Failed to ${actionType} booking`)
    } finally {
      setLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "active":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "completed":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{notification.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Notification Message */}
          <div className="bg-gray-800/50 rounded-lg p-4">
            <p className="text-gray-300">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-2">{new Date(notification.created_at).toLocaleString()}</p>
          </div>

          {/* Booking Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Booking Status</p>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-400">Booking ID</p>
              <p className="font-mono text-sm">{booking.id.slice(0, 8)}...</p>
            </div>
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg">Rental Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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

              {/* Payment Summary */}
              <div className="space-y-2 pt-4 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Daily Rate</span>
                  <span>${booking.item?.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration</span>
                  <span>
                    {duration} day{duration !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>${(booking.item?.price || 0) * duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service Fee</span>
                  <span>${booking.total_price - (booking.item?.price || 0) * duration}</span>
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${booking.total_price}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renter Info */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Renter Information
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

          {/* Action Buttons - Only show for pending booking requests */}
          {notification.type === "booking_request" && booking.status === "pending" && (
            <div className="flex gap-4 pt-4">
              <Button
                onClick={() => handleStatusUpdate("cancelled")}
                disabled={loading !== null}
                variant="outline"
                className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                {loading === "reject" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject Booking
                  </>
                )}
              </Button>
              <Button
                onClick={() => handleStatusUpdate("confirmed")}
                disabled={loading !== null}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading === "approve" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Approving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Booking
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
