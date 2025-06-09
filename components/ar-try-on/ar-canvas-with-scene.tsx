"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Download, RefreshCw } from "lucide-react"
import type { SceneBackground } from "@/services/ar-scene-backgrounds"
import { detectPose } from "@/services/pose-detection"
import { applyFilterEffect } from "@/services/filter-effects"
import { applyFashionFilter } from "@/services/fashion-filters"

interface ARCanvasWithSceneProps {
  selectedNFT?: string
  selectedVariant?: string
  selectedFilter?: string
  selectedFashionFilter?: string
  selectedBackground?: SceneBackground | null
  width?: number
  height?: number
}

export function ARCanvasWithScene({
  selectedNFT,
  selectedVariant,
  selectedFilter,
  selectedFashionFilter,
  selectedBackground,
  width = 640,
  height = 480,
}: ARCanvasWithSceneProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streaming, setStreaming] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null)

  // Load background image when selected background changes
  useEffect(() => {
    if (selectedBackground) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = selectedBackground.imageUrl
      img.onload = () => {
        setBackgroundImage(img)
      }
    } else {
      setBackgroundImage(null)
    }
  }, [selectedBackground])

  useEffect(() => {
    let stream: MediaStream | null = null

    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: "user",
          },
          audio: false,
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play()
          setCameraReady(true)
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [width, height])

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !cameraReady) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let poseDetectionActive = false

    const processFrame = async () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        if (!streaming) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          setStreaming(true)
        }

        // Draw background if available
        if (backgroundImage) {
          ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height)
        } else {
          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }

        // Draw video frame
        if (!backgroundImage) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        }

        // Apply pose detection if needed for NFT overlay
        if (selectedNFT && !poseDetectionActive) {
          poseDetectionActive = true
          try {
            const poses = await detectPose(video)
            // Here you would use the pose data to position the NFT
            console.log("Pose detected:", poses)
            // Implement NFT overlay based on pose data
          } catch (error) {
            console.error("Error detecting pose:", error)
          } finally {
            poseDetectionActive = false
          }
        }

        // Apply selected filter effect
        if (selectedFilter) {
          applyFilterEffect(ctx, canvas.width, canvas.height, selectedFilter)
        }

        // Apply selected fashion filter
        if (selectedFashionFilter) {
          applyFashionFilter(ctx, canvas.width, canvas.height, selectedFashionFilter)
        }

        // If we have a background image, blend the person with the background
        if (backgroundImage) {
          // This would require more advanced segmentation to extract the person
          // For now, we'll just overlay the video with some transparency
          ctx.globalAlpha = 0.8
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          ctx.globalAlpha = 1.0
        }
      }

      animationFrameId = requestAnimationFrame(processFrame)
    }

    processFrame()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [cameraReady, selectedNFT, selectedVariant, selectedFilter, selectedFashionFilter, backgroundImage, streaming])

  const captureImage = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `entire-fashion-ar-${Date.now()}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  const restartCamera = async () => {
    if (!videoRef.current) return

    const stream = videoRef.current.srcObject as MediaStream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
    }

    setStreaming(false)
    setCameraReady(false)

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: "user",
        },
        audio: false,
      })

      videoRef.current.srcObject = newStream
      videoRef.current.play()
      setCameraReady(true)
    } catch (error) {
      console.error("Error restarting camera:", error)
    }
  }

  return (
    <div className="relative">
      <div className="relative rounded-lg overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover opacity-0"
          width={width}
          height={height}
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="w-full h-full" width={width} height={height} />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
            Loading camera...
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        <Button size="sm" variant="secondary" onClick={restartCamera}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Restart
        </Button>
        <Button size="sm" onClick={captureImage}>
          <Camera className="h-4 w-4 mr-1" />
          Capture
        </Button>
        <Button size="sm" variant="secondary" onClick={captureImage}>
          <Download className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>

      {selectedBackground && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs">
          Scene: {selectedBackground.name}
        </div>
      )}
    </div>
  )
}
