"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Music, PauseCircle } from "lucide-react"

interface SpotifyPlayerProps {
  playlistId: string
  theme?: "white" | "black"
  compact?: boolean
}

export default function SpotifyPlayer({ playlistId, theme = "white", compact = false }: SpotifyPlayerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const togglePlayer = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="flex flex-col items-end gap-2">
          <div className="rounded-lg overflow-hidden shadow-xl">
            <iframe
              src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=${theme}`}
              width={compact ? "300" : "100%"}
              height="352"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="border-0 max-w-[300px] sm:max-w-[380px]"
            />
          </div>
          <Button
            onClick={togglePlayer}
            variant="outline"
            size="sm"
            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-md"
          >
            <PauseCircle className="mr-2" size={16} />
            Esconder Player
          </Button>
        </div>
      ) : (
        <Button onClick={togglePlayer} className="shadow-lg bg-pink-600 hover:bg-pink-700 text-white">
          <Music className="mr-2" size={16} />
          Nossa Playlist
        </Button>
      )}
    </div>
  )
}

