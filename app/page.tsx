import Link from "next/link"
import Image from "next/image"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getItems, getCategories } from "@/lib/data-service"
import { Navigation } from "@/components/navigation"
import HeroGeometric from "@/components/hero-geometric"

export default async function HomePage() {
  // Fetch data on the server
  const [featuredItems, categories] = await Promise.all([getItems({ limit: 4, sortBy: "rating" }), getCategories()])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <HeroGeometric />

      {/* Categories Section */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-400">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link key={category.name} href={`/browse?category=${encodeURIComponent(category.name)}`}>
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-400">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Featured Items</h2>
              <p className="text-gray-400">Popular rentals in your area</p>
            </div>
            <Link href="/browse">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
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
                      <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">{item.category}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-300">{item.average_rating?.toFixed(1) || "0.0"}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-white mb-2">{item.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-white">${item.price}</span>
                      <span className="text-sm text-gray-400">per day</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Renting?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of users who trust RentHub for their rental needs</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Browse Items
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              List Your Items
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold">RentHub</span>
              </div>
              <p className="text-gray-400">The trusted marketplace for renting anything you need.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    Safety
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 RentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
