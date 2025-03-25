"use client"

import { motion } from "framer-motion"
import type { Photo } from "../types"
import { Card, CardContent } from "./ui/card"

interface PhotoCardProps {
  photo: Photo
  isExpanded: boolean
  onClick: () => void
}

export default function PhotoCard({ photo, isExpanded, onClick }: PhotoCardProps) {
  return (
    <div className="cursor-pointer perspective" onClick={onClick}>
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Front of card (photo) */}
        <Card className="absolute w-full h-full backface-hidden">
          <CardContent className="p-3">
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={photo.url || "/placeholder.svg"}
                alt={`Momento especial ${photo.id}`}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              />
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">{photo.date}</p>
            </div>
          </CardContent>
        </Card>

        {/* Back of card (comment) */}
        <Card className="absolute w-full h-full backface-hidden rotateY-180 bg-pink-100 dark:bg-pink-900">
          <CardContent className="p-4 flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg font-medium text-pink-700 dark:text-pink-300">{photo.comment}</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

