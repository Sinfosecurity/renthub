import Image from "next/image"
import Link from "next/link"
import { Star, MapPin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getItems, getCategories } from "@/lib/data-service"
import { SearchAndFilter } from "@/components/search-and-filter"
import { Navigation } from "@/components/navigation"

interface SearchParams {
  search?: string
  category?: string
  sort?: string
}

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  // Parse search params
  const search = searchParams.search || ""
  const category = searchParams.category || ""
  const sortBy = searchParams.sort || "newest"

  // Map sort parameter to data service format
  const sortMapping: Record<string, any> = {
    "price-low": "price_asc",
    "price-high": "price_desc",
    rating: "rating",
    newest: "newest",
  }

  // Fetch data on the server
  const [items, categories] = await Promise.all([
    getItems({
      search: search || undefined,
      category: category || undefined,
      sortBy: sortMapping[sortBy] || "newest",
    }),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Items</h1>
          <p className="text-gray-400">Discover thousands of items available for rent</p>
        </div>

        {/* Search and Filter Component */}
        <SearchAndFilter categories={categories} />

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-400">Showing {items.length} items</p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item.id} href={`/item/${item.id}`}>
              <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <Image
                    src={item.image || "/placeholder.svg?height=200&width=300"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                      {item.category}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-300">{item.average_rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-xs text-gray-400">({item.review_count || 0})</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2 line-clamp-2">{item.name}</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-400 mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{item.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">${item.price}</span>
                    <span className="text-sm text-gray-400">per day</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No items found matching your criteria.</p>
            <Link href="/browse">
              <button className="mt-4 border border-gray-600 text-gray-300 hover:bg-gray-800 px-4 py-2 rounded-md">
                Clear Filters
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
