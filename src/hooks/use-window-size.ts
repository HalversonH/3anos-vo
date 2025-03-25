"use client"

import { useState, useEffect } from "react"

interface WindowSize {
  width: number
  height: number
}

export function useWindowSize(): WindowSize {
  // Initialize with default values to prevent SSR issues
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    // This function will only run on the client side
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

