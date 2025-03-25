"use client"

import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import Confetti from "react-confetti"
import { useWindowSize } from "./hooks/use-window-size"
import { motion } from "framer-motion"
import SpotifyPlayer from "./components/SpotifyPlayer"
import HorizontalGallery from "./components/HorizontalGallery"
import PhotoModal from "./components/PhotoModal"
import { photos } from "./data/photos"
import type { Photo } from "./types"
import TestImage from "./components/TestImage"

function App() {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showAlbum, setShowAlbum] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { width, height } = useWindowSize()

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleCelebrate = () => {
    setShowConfetti(true)

    // After 2 seconds, show the album
    setTimeout(() => {
      setShowAlbum(true)
    }, 2000)

    // After 6 seconds, stop the confetti
    setTimeout(() => {
      setShowConfetti(false)
    }, 6000)
  }

  const handlePhotoClick = (photo: Photo, index: number) => {
    // Ensure photo is valid before setting it
    if (photo) {
      console.log("Photo clicked:", photo) // Debug log

      // Make sure we're using the correct URL
      // Don't use highResUrl as it might not exist
      setSelectedPhoto({
        ...photo,
        // Ensure the URL is absolute and correct
        url: photo.url.startsWith("/") ? photo.url : `/${photo.url}`,
      })
      setIsModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 dark:from-slate-900 dark:to-slate-800">
      {/* Only render Confetti if component is mounted and showConfetti is true */}
      {isMounted && showConfetti && width > 0 && height > 0 && (
        <Confetti width={width} height={height} recycle={true} numberOfPieces={500} gravity={0.1} />
      )}

      <div className="container mx-auto px-4 py-8">
        {!showAlbum ? (
          <motion.div
            className="flex flex-col items-center justify-center min-h-[80vh] text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6 text-pink-600 dark:text-pink-400"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              Feliz 3 Anos de Namoro!
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-10 text-gray-700 dark:text-gray-300"
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            >
              Clique no botão para celebrar nossos momentos especiais juntos
            </motion.p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-pink-600 hover:bg-pink-700 text-white text-xl px-8 py-6 rounded-full shadow-lg"
                onClick={handleCelebrate}
              >
                Celebrar Nosso Amor ❤️
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="py-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                Nossos Momentos Especiais
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Deslize para ver mais fotos e clique para ver em alta resolução
              </p>
            </div>

            {/* Add a check to ensure photos array exists and is not empty */}
            {Array.isArray(photos) && photos.length > 0 ? (
              <HorizontalGallery photos={photos} onPhotoClick={handlePhotoClick} />
            ) : (
              <div className="p-8 text-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Carregando fotos...</p>
              </div>
            )}

          

            <div className="mt-16 grid gap-8 md:grid-cols-3">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400 mb-3">Nosso Primeiro Ano</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Cada momento ao seu lado foi especial. Desde nosso primeiro encontro até nossa primeira viagem juntos.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400 mb-3">Nosso Segundo Ano</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Crescemos juntos, superamos desafios e criamos memórias que vão durar para sempre.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold text-pink-600 dark:text-pink-400 mb-3">Nosso Terceiro Ano</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Três anos de amor, respeito e companheirismo. Que venham muitos mais anos juntos!
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setShowAlbum(false)
                  window.scrollTo(0, 0)
                }}
              >
                Voltar ao Início
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {isMounted && (
        <>
          <PhotoModal photo={selectedPhoto} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
          <SpotifyPlayer playlistId="37i9dQZF1DX0MLFaUdXnjA" theme={showAlbum ? "black" : "white"} />
        </>
      )}
    </div>
  )
}

export default App

