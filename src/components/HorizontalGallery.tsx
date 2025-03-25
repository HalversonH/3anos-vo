"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "../lib/utils"
import type { Photo } from "../types"

interface HorizontalGalleryProps {
  photos: Photo[]
  onPhotoClick?: (photo: Photo, index: number) => void
}

export default function HorizontalGallery({ photos, onPhotoClick }: HorizontalGalleryProps) {
  // Add safety check for photos array
  const safePhotos = Array.isArray(photos) ? photos : []

  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [imageWidth, setImageWidth] = useState(0)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1]))
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        setContainerWidth(width)
        // Calculate image width based on screen size
        const imgWidth = width < 640 ? width - 40 : width / 2 - 40
        setImageWidth(imgWidth)
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Scroll to current image
  useEffect(() => {
    if (scrollContainerRef.current && imageWidth > 0) {
      const scrollPosition = currentIndex * (imageWidth + 20)
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [currentIndex, imageWidth])

  // Preload adjacent images
  useEffect(() => {
    if (!safePhotos.length) return // Guard against empty photos array

    setLoadedImages((prevLoadedImages) => {
      const newLoadedImages = new Set(prevLoadedImages)

      // Add current image and adjacent images to the set
      newLoadedImages.add(currentIndex)
      if (currentIndex > 0) newLoadedImages.add(currentIndex - 1)
      if (currentIndex < safePhotos.length - 1) newLoadedImages.add(currentIndex + 1)

      // Only update if the set has changed
      if (
        newLoadedImages.size !== prevLoadedImages.size ||
        ![...newLoadedImages].every((img) => prevLoadedImages.has(img))
      ) {
        return newLoadedImages
      }

      return prevLoadedImages
    })
  }, [currentIndex, safePhotos.length]) // Remove loadedImages from dependencies

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < safePhotos.length - 1 ? prev + 1 : prev))
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index)
  }

  const handleScroll = () => {
    if (scrollContainerRef.current && imageWidth > 0) {
      const scrollPosition = scrollContainerRef.current.scrollLeft
      const newIndex = Math.round(scrollPosition / (imageWidth + 20))
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < safePhotos.length) {
        setCurrentIndex(newIndex)
      }
    }
  }

  // If photos is undefined or empty, show a placeholder message
  if (!safePhotos.length) {
    return (
      <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">Nenhuma foto disponível</p>
      </div>
    )
  }

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Navigation Buttons */}
      <div className="absolute left-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>
      </div>

      <div className="absolute right-0 top-1/2 z-10 -translate-y-1/2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
          onClick={handleNext}
          disabled={currentIndex === safePhotos.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>

      {/* Image Gallery */}
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-5 px-4">
          {safePhotos.map((photo, index) => (
            <motion.div
              key={photo.id || index}
              className={cn(
                "flex-shrink-0 snap-center rounded-lg overflow-hidden shadow-md transition-all duration-300 relative",
                currentIndex === index ? "ring-4 ring-pink-500 ring-opacity-50" : "",
              )}
              style={{ width: `${imageWidth}px` }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: currentIndex === index ? 1 : 0.9,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative aspect-square">
                {loadedImages.has(index) && (
                  <img
                    src={photo.url || "/placeholder.svg"}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for image loading errors
                      ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=400&width=400"
                    }}
                    loading={index <= 2 ? "eager" : "lazy"}
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <p className="text-white text-sm font-medium">{photo.date}</p>
                </div>

                {/* Fullscreen button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPhotoClick && onPhotoClick(photo, index)
                  }}
                >
                  <Maximize2 className="h-4 w-4" />
                  <span className="sr-only">View full size</span>
                </Button>

                {/* Clickable overlay */}
                <div
                  className="absolute inset-0 cursor-pointer"
                  onClick={() => onPhotoClick && onPhotoClick(photo, index)}
                  aria-label={`View photo from ${photo.date}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center mt-4 gap-1.5 overflow-x-auto py-2 scrollbar-hide">
        {safePhotos.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300 flex-shrink-0",
              currentIndex === index
                ? "bg-pink-600 w-4"
                : "bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500",
            )}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

