"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchAndFilterProps {
  categories: { name: string; count: number; icon: string }[]
}

export function SearchAndFilter({ categories }: SearchAndFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest")

  useEffect(() => {
    const params = new URLSearchParams()

    if (searchTerm) params.set("search", searchTerm)
    if (selectedCategory !== "all") params.set("category", selectedCategory)
    if (sortBy !== "newest") params.set("sort", sortBy)

    const queryString = params.toString()
    const newUrl = queryString ? `/browse?${queryString}` : "/browse"

    router.push(newUrl)
  }, [searchTerm, selectedCategory, sortBy, router])

  return (
    <div className="flex flex-col lg:flex-row gap-4 mb-8">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
        />
      </div>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full lg:w-48 bg-gray-800 border-gray-700 text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 border-gray-700">
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
