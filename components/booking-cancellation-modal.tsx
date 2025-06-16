"use client"

import { useState } from "react"
import { X, AlertTriangle, Calendar, Clock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { cancelBooking } from "@/lib/data-service"
import type { Booking } from "@/lib/data-service"

interface BookingCancellationModalProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onCancelled: () => void
}

export function BookingCancellationModal({ booking, isOpen, onClose, onCancelled }: BookingCancellationModalProps) {
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleCancel = async () => {
    setLoading(true)
    setError("")

    try {
      const result = await cancelBooking(booking.id, reason)

      if (result.success) {
        onCancelled()
        onClose()
      } else {
        setError(result.message)
      }
    } catch (err: any) {
      console.error("Error cancelling booking:", err)
      setError(err.message || "Failed to cancel booking")
    } finally {
      setLoading(false)
    }
  }

  const getTimeUntilStart = () => {
    const startDate = new Date(booking.start_date)
    const now = new Date()
    const hoursUntilStart = Math.max(0, (startDate.getTime() - now.getTime()) / (1000 * 60 * 60))

    if (hoursUntilStart < 24) {
      return `${Math.floor(hoursUntilStart)} hours`
    } else {
      return `${Math.floor(hoursUntilStart / 24)} days`
    }
  }

  const isWithin24Hours = () => {
    const startDate = new Date(booking.start_date)
    const now = new Date()
    const hoursUntilStart = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilStart < 24 && booking.status === "confirmed"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Cancel Booking
            </DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription className="text-gray-400">
            Review the booking details and confirm cancellation. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {/* Booking Details */}
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <h3 className="font-semibold">{booking.item?.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(booking.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{getTimeUntilStart()} until start</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary">${booking.total_price}</Badge>
              <Badge
                className={
                  booking.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"
                }
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Warning for confirmed bookings */}
          {booking.status === "confirmed" && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400">
                {isWithin24Hours()
                  ? "Cannot cancel within 24 hours of rental start time."
                  : "Cancelling a confirmed booking will notify the owner immediately."}
              </AlertDescription>
            </Alert>
          )}

          {/* Cancellation Reason */}
          <div>
            <label className="block text-sm font-medium mb-2">Reason for cancellation (optional)</label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let the other party know why you're cancelling..."
              className="bg-gray-800 border-gray-600 text-white"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={loading}
            >
              Keep Booking
            </Button>
            <Button
              onClick={handleCancel}
              disabled={loading || isWithin24Hours()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Cancelling..." : "Cancel Booking"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
