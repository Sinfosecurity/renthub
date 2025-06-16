"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin, DollarSign } from "lucide-react"
import { createBookingWithDates, getBookedDatesForItem } from "@/lib/data-service"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface BookingCardProps {
  item: {
    id: string
    name: string
    price: number
    location: string
    owner_id: string
  }
}

export function BookingCard({ item }: BookingCardProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isBooking, setIsBooking] = useState(false)
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const { user } = useAuth()
  const router = useRouter()

  // Fetch booked dates when component mounts
  useEffect(() => {
    const fetchBookedDates = async () => {
      const dates = await getBookedDatesForItem(item.id)
      setBookedDates(dates)
    }
    fetchBookedDates()
  }, [item.id])

  const calculateDays = () => {
    if (!startDate || !endDate) return 0
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  }

  const calculateTotal = () => {
    return calculateDays() * item.price
  }

  const handleBooking = async () => {
    if (!user) {
      router.push("/auth/signin")
      return
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates")
      return
    }

    if (user.id === item.owner_id) {
      alert("You cannot book your own item")
      return
    }

    setIsBooking(true)

    try {
      const booking = await createBookingWithDates({
        item_id: item.id,
        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],
        total_price: calculateTotal(),
      })

      // Redirect to success page
      router.push(`/booking/success/${booking.id}`)
    } catch (error) {
      console.error("Booking error:", error)
      alert(error instanceof Error ? error.message : "Failed to create booking")
    } finally {
      setIsBooking(false)
    }
  }

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // Disable past dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return true

    // Disable booked dates
    return bookedDates.some((bookedDate) => {
      const bookedDateOnly = new Date(bookedDate)
      bookedDateOnly.setHours(0, 0, 0, 0)
      const checkDate = new Date(date)
      checkDate.setHours(0, 0, 0, 0)
      return bookedDateOnly.getTime() === checkDate.getTime()
    })
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          Book this item
        </CardTitle>
        <CardDescription className="flex items-center gap-4 text-gray-400">
          <span className="flex items-center gap-1">
            <DollarSign className="w-4 h-4" />${item.price}/day
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {item.location}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              disabled={isDateDisabled}
              className="rounded-md border border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              disabled={(date) => {
                if (isDateDisabled(date)) return true
                // End date must be after start date
                if (startDate && date < startDate) return true
                return false
              }}
              className="rounded-md border border-gray-700"
            />
          </div>
        </div>

        {startDate && endDate && (
          <div className="bg-gray-800 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span>Duration:</span>
              <Badge variant="secondary">{calculateDays()} days</Badge>
            </div>
            <div className="flex justify-between">
              <span>Price per day:</span>
              <span>${item.price}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg border-t border-gray-700 pt-2">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleBooking}
          disabled={!startDate || !endDate || isBooking}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {isBooking ? "Creating Booking..." : "Book Now"}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          <p>• Grayed out dates are already booked</p>
          <p>• You'll receive a confirmation after booking</p>
        </div>
      </CardContent>
    </Card>
  )
}
