"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PhotoCard from "./PhotoCard"
import { photos } from "../data/photos"

export default function PhotoAlbum() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {photos.map((photo, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PhotoCard
            photo={photo}
            isExpanded={expandedIndex === index}
            onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        </motion.div>
      ))}
    </div>
  )
}

