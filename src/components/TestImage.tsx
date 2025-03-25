"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"

export default function TestImage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const testImageUrl = "/images/foto2.jpg"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Don't render anything during SSR
  }

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="text-lg font-bold mb-2">Test Image Component</h3>
      <p className="mb-2">Testing image loading from: {testImageUrl}</p>

      <div className="border p-2 mb-2">
        <img
          src={testImageUrl || "/placeholder.svg"}
          alt="Test image"
          className="max-w-full h-auto"
          style={{ maxHeight: "200px" }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>

      <div className="text-sm">
        {isLoaded && <p className="text-green-600">✓ Image loaded successfully</p>}
        {hasError && <p className="text-red-600">✗ Error loading image</p>}
        {!isLoaded && !hasError && <p className="text-blue-600">Loading image...</p>}
      </div>

      <div className="mt-4">
        <Button
          size="sm"
          onClick={() => {
            setIsLoaded(false)
            setHasError(false)
            // Force reload by changing the key
            const img = new Image()
            img.src = testImageUrl + "?t=" + new Date().getTime()
            img.onload = () => setIsLoaded(true)
            img.onerror = () => setHasError(true)
          }}
        >
          Reload Image
        </Button>
      </div>
    </div>
  )
}

