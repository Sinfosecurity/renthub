"use client"

import Image from "next/image"

interface ImageGalleryProps {
  image: string
  name: string
}

export function ImageGallery({ image, name }: ImageGalleryProps) {
  return (
    <div className="space-y-4">
      <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
        <Image src={image || "/placeholder.svg?height=400&width=600"} alt={name} fill className="object-cover" />
      </div>
    </div>
  )
}
