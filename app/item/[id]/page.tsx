import { notFound } from "next/navigation"
import { Star, Shield, MapPin, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getItemById } from "@/lib/data-service"
import { BookingCard } from "@/components/booking-card"
import { ImageGallery } from "@/components/image-gallery"
import { Navigation } from "@/components/navigation"

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = await getItemById(params.id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <ImageGallery image={item.image} name={item.name} />

          {/* Item Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="bg-gray-800 text-gray-300">
                  {item.category}
                </Badge>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
              <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{item.average_rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-gray-400">({item.review_count || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <MapPin className="w-4 h-4" />
                  <span>{item.location}</span>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>

            {/* Features */}
            {item.features && item.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">What's Included</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {item.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Owner Info */}
            {item.owner && (
              <Card className="bg-gray-800/50 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage
                        src={item.owner.avatar_url || "/placeholder.svg?height=40&width=40"}
                        alt={item.owner.full_name}
                      />
                      <AvatarFallback>
                        {item.owner.full_name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold">{item.owner.full_name}</h4>
                        {item.owner.is_verified && <Shield className="w-4 h-4 text-green-400" />}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>
                            {item.owner.rating.toFixed(1)} ({item.owner.review_count} reviews)
                          </span>
                        </div>
                        <span>Joined {new Date(item.owner.joined_at).getFullYear()}</span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Usually responds within 1 hour</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {item.reviews && item.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {item.reviews.slice(0, 6).map((review) => (
                <Card key={review.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={review.reviewer?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                        <AvatarFallback>
                          {review.reviewer?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{review.reviewer?.full_name}</p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Booking Card */}
        <div className="mt-8">
          <BookingCard item={item} />
        </div>
      </div>
    </div>
  )
}
