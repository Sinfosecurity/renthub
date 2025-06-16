"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { addItem, uploadImage } from "@/lib/data-service"

const CATEGORIES = [
  "Electronics",
  "Tools",
  "Sports",
  "Photography",
  "Outdoor",
  "Music",
  "Vehicles",
  "Home & Garden",
  "Fashion",
  "Books",
  "Art & Crafts",
  "Other",
]

export function ListItemForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [imageUploading, setImageUploading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    location: "",
    image: "",
    features: [] as string[],
  })

  const [newFeature, setNewFeature] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleAddFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB")
      return
    }

    setImageUploading(true)
    setError("")

    try {
      const imageUrl = await uploadImage(file)
      setFormData((prev) => ({ ...prev, image: imageUrl }))
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Validation
    if (!formData.name.trim()) {
      setError("Item name is required")
      setLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError("Description is required")
      setLoading(false)
      return
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      setError("Please enter a valid price")
      setLoading(false)
      return
    }

    if (!formData.category) {
      setError("Please select a category")
      setLoading(false)
      return
    }

    if (!formData.location.trim()) {
      setError("Location is required")
      setLoading(false)
      return
    }

    try {
      const item = await addItem({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        category: formData.category,
        location: formData.location.trim(),
        image: formData.image,
        features: formData.features,
      })

      // Redirect to the new item page
      router.push(`/item/${item.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to list item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl">Item Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Professional Camera Kit"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Daily Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                placeholder="25.00"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="bg-gray-800 border-gray-700 text-white"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your item in detail. Include condition, specifications, and any important notes..."
              rows={4}
              className="bg-gray-800 border-gray-700 text-white resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label htmlFor="image">Item Photo</Label>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
              {formData.image ? (
                <div className="space-y-4">
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Item preview"
                    className="max-w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData((prev) => ({ ...prev, image: "" }))}
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors"
                    >
                      {imageUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Image
                        </>
                      )}
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </div>
                  <p className="text-sm text-gray-400">Upload a photo of your item (Max 5MB, JPG/PNG)</p>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <Label>Features & What's Included</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature or included item"
                className="bg-gray-800 border-gray-700 text-white"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddFeature())}
              />
              <Button
                type="button"
                onClick={handleAddFeature}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="bg-gray-700 text-gray-300 pr-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(feature)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || imageUploading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Listing Item...
                </>
              ) : (
                "List Item"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
