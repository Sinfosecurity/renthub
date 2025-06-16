import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle, Calendar, MapPin, DollarSign, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { getCurrentUser } from "@/lib/data-service"
import { supabase } from "@/lib/supabase"

async function getBooking(bookingId: string) {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      item:items(*),
      renter:renter_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at),
      owner:owner_id(id, email, full_name, avatar_url, location, bio, phone, is_verified, is_admin, rating, review_count, joined_at)
    `)
    .eq("id", bookingId)
    .single()

  if (error) return null
  return data
}

export default async function BookingSuccessPage({ params }: { params: { id: string } }) {
  // Check if user is authenticated
  const user = await getCurrentUser()
  if (!user) {
    redirect("/auth/signin")
  }

  const booking = await getBooking(params.id)
  if (!booking) {
    notFound()
  }

  // Ensure user can only see their own booking
  if (booking.renter_id !== user.id) {
    redirect("/")
  }

  const duration = Math.ceil(
    (new Date(booking.end_date).getTime() - new Date(booking.start_date).getTime()) / (1000 * 60 * 60 * 24),
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-gray-400">Your rental request has been submitted successfully</p>
        </div>

        {/* Booking Details Card */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Booking Details</CardTitle>
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">Booking ID: {booking.id.slice(0, 8)}...</p>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Item Details */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{booking.item?.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Owner: {booking.owner?.full_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Rental Period */}
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
                <DollarSign className="w-4 h-4 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Duration</p>
                  <p className="font-semibold">
                    {duration} day{duration !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            {/* Payment Summary */}
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
                <span>Total Paid</span>
                <span className="text-green-400">${booking.total_price}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="bg-gray-900/50 border-gray-700 mb-8">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <div>
                  <p className="font-semibold">Waiting for Owner Confirmation</p>
                  <p className="text-sm text-gray-400">The item owner will review and confirm your booking request.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <div>
                  <p className="font-semibold">Coordinate Pickup</p>
                  <p className="text-sm text-gray-400">
                    Once confirmed, you'll receive contact details to arrange pickup.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <div>
                  <p className="font-semibold">Enjoy Your Rental</p>
                  <p className="text-sm text-gray-400">Use the item during your rental period and return it on time.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/profile">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              View My Bookings
            </Button>
          </Link>
          <Link href="/browse">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Browse More Items
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
