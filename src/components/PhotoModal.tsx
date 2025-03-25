"use client"

import { useEffect, useState, useRef } from "react"
import { X, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, MessageCircle } from "lucide-react"
import { Button } from "./ui/button"
import type { Photo } from "../types"

interface PhotoModalProps {
  photo: Photo | null
  isOpen: boolean
  onClose: () => void
}

export default function PhotoModal({ photo, isOpen, onClose }: PhotoModalProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Reset states when photo changes or modal opens
  useEffect(() => {
    if (photo && isOpen) {
      setIsFlipped(false) // Always start with photo side showing
      setIsLoading(true)
      setZoom(1)
      setRotation(0)

      // Log for debugging
      console.log("Modal opened with photo:", photo)
    }
  }, [photo, isOpen])

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case " ":
          setIsFlipped(!isFlipped)
          break
        case "f":
          toggleFullscreen()
          break
        case "+":
          handleZoomIn()
          break
        case "-":
          handleZoomOut()
          break
        case "r":
          handleRotate()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isFlipped, onClose])

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5))
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleDownload = () => {
    if (!photo) return

    // Create a temporary link
    const link = document.createElement("a")
    link.href = photo.url
    link.download = `photo-${photo.id}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Toggle between photo and comment
  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  // Early return if no photo is provided or modal is not open
  if (!photo || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <div
        ref={containerRef}
        className="relative max-w-6xl w-full max-h-[90vh] bg-transparent rounded-lg overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={toggleFlip}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="sr-only">{isFlipped ? "Show Photo" : "Show Comment"}</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
            <span className="sr-only">Zoom in</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
            <span className="sr-only">Zoom out</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={handleRotate}
          >
            <RotateCw className="h-4 w-4" />
            <span className="sr-only">Rotate</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={toggleFullscreen}
          >
            <Maximize2 className="h-4 w-4" />
            <span className="sr-only">Fullscreen</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm shadow-md"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
            <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
          </div>
        )}

        {/* Content container */}
        <div className="w-full h-full flex items-center justify-center">
          {isFlipped ? (
            /* Comment View */
            <div className="bg-pink-100 dark:bg-pink-900 rounded-lg p-8 max-w-lg mx-auto text-center">
              <h3 className="text-xl font-bold text-pink-700 dark:text-pink-300 mb-4">{photo.date}</h3>
              <p className="text-lg text-gray-800 dark:text-gray-100">{photo.comment}</p>
              <Button variant="outline" className="mt-6" onClick={toggleFlip}>
                Voltar para a foto
              </Button>
            </div>
          ) : (
            /* Photo View */
            <div className="relative flex items-center justify-center w-full h-full">
              <div
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: "transform 0.3s ease",
                }}
                className="relative"
              >
                <img
                  ref={imageRef}
                  src={photo.url || "/placeholder.svg"}
                  alt={`Photo from ${photo.date}`}
                  className="max-h-[80vh] object-contain"
                  onLoad={() => {
                    console.log("Image loaded:", photo.url)
                    setIsLoading(false)
                  }}
                  onError={(e) => {
                    console.error("Image failed to load:", photo.url)
                    setIsLoading(false)
                    ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=800&width=800"
                  }}
                />
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <p className="text-white text-lg font-medium">{photo.date}</p>
                <Button
                  variant="ghost"
                  className="text-white/80 text-sm p-0 h-auto hover:bg-transparent hover:text-white"
                  onClick={toggleFlip}
                >
                  Clique para ver o comentário
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

