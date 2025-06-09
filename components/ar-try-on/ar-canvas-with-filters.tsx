"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Loader2, Camera } from "lucide-react"
import {
  detectPose,
  getRecommendedPosition,
  type PoseDetectionResult,
  initPoseDetection,
  disposePoseDetector,
} from "@/services/pose-detection"
import {
  applyColorFilter,
  applyArtisticFilter,
  applyEnvironmentalEffect,
  applyBackgroundEffect,
  applyLightingEffect,
  segmentPerson,
  type Filter,
} from "@/services/ar-filters"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { applyFabricTexture, applyRunwayEffect, applySeasonalEffect } from "@/services/fashion-filters"

interface NFT {
  id: number
  name: string
  image: string
  designer: string
  arReady: boolean
  category: string
  variants?: {
    color?: string[]
    size?: string[]
    style?: string[]
  }
}

interface ARCanvasWithFiltersProps {
  photoURL: string | null
  videoMode: boolean
  selectedNFT: NFT | null
  transform: {
    x: number
    y: number
    scale: number
    rotation: number
    opacity: number
    brightness: number
    contrast: number
  }
  onAutoPosition?: (position: { x: number; y: number; scale: number }) => void
  useAutomaticPositioning?: boolean
  selectedVariant?: {
    color?: string
    size?: string
    style?: string
  }
  onCaptureImage?: (dataUrl: string) => void
  environmentLighting?: string
  filters: {
    color?: { filter: Filter; intensity: number }
    artistic?: { filter: Filter; intensity: number }
    environment?: { filter: Filter; intensity: number }
    background?: { filter: Filter; intensity: number }
    lighting?: { filter: Filter; intensity: number }
    fabric?: { filter: Filter; intensity: number }
    runway?: { filter: Filter; intensity: number }
    seasons?: { filter: Filter; intensity: number }
  }
  customBackground?: string | null
  onPreviewCapture?: (dataUrl: string) => void
}

export default function ARCanvasWithFilters({
  photoURL,
  videoMode,
  selectedNFT,
  transform,
  onAutoPosition,
  useAutomaticPositioning = false,
  selectedVariant,
  onCaptureImage,
  environmentLighting = "neutral",
  filters,
  customBackground,
  onPreviewCapture,
}: ARCanvasWithFiltersProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoRef = useRef<HTMLImageElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const backgroundRef = useRef<HTMLImageElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [nftLoaded, setNftLoaded] = useState(false)
  const [poseDetected, setPoseDetected] = useState(false)
  const [poseResult, setPoseResult] = useState<PoseDetectionResult | null>(null)
  const [streamActive, setStreamActive] = useState(false)
  const [segmentationData, setSegmentationData] = useState<ImageData | null>(null)
  const animationRef = useRef<number | null>(null)
  const animationTimeRef = useRef<number>(0)
  const { toast } = useToast()
  const [nftTransform, setNftTransform] = useState(transform)

  // Initialize pose detection
  useEffect(() => {
    const initDetector = async () => {
      await initPoseDetection({
        modelType: "lightning", // Use lightning for faster performance in real-time
        enableSmoothing: true,
        multiPerson: false,
        minPoseScore: 0.25,
        minKeypointScore: 0.4,
        enableTracking: true,
        smoothingWindowSize: videoMode ? 5 : 1, // More smoothing for video mode
      })
    }

    initDetector()

    return () => {
      // Clean up resources when component unmounts
      disposePoseDetector()
    }
  }, [videoMode])

  // Load custom background if provided
  useEffect(() => {
    if (customBackground) {
      const bgImage = new Image()
      bgImage.crossOrigin = "anonymous"
      bgImage.src = customBackground

      bgImage.onload = () => {
        backgroundRef.current = bgImage
        renderFrame()
      }

      bgImage.onerror = () => {
        backgroundRef.current = null
        console.error("Failed to load custom background")
      }
    } else {
      backgroundRef.current = null
    }
  }, [customBackground])

  // Handle video stream for real-time mode
  useEffect(() => {
    if (!videoMode) {
      if (streamActive && videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
        setStreamActive(false)
      }
      return
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setStreamActive(true)
          setIsLoading(false)
        }
      } catch (err) {
        console.error("Error accessing camera:", err)
        toast({
          title: "Camera Error",
          description: "Could not access your camera. Please check permissions.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    if (videoMode) {
      startCamera()
    }

    return () => {
      if (streamActive && videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
        videoRef.current.srcObject = null
        setStreamActive(false)
      }
    }
  }, [videoMode, toast])

  // Handle video element loaded
  const handleVideoLoaded = () => {
    setMediaLoaded(true)
  }

  // Handle pose detection for photo mode
  useEffect(() => {
    if (!photoRef.current || !mediaLoaded || videoMode) return

    const detectPoseInPhoto = async () => {
      try {
        const result = await detectPose(photoRef.current!)
        setPoseResult(result)
        setPoseDetected(!!result)

        // If we need background segmentation for filters
        if (filters.background && filters.background.filter.id !== "none") {
          const segData = await segmentPerson(photoRef.current!)
          setSegmentationData(segData)
        }

        // If we have a selected NFT and automatic positioning is enabled, position it
        if (result && selectedNFT && useAutomaticPositioning && onAutoPosition) {
          const canvas = canvasRef.current
          if (canvas) {
            const recommendedPosition = getRecommendedPosition(
              result,
              selectedNFT.category,
              canvas.width,
              canvas.height,
            )

            if (recommendedPosition && onAutoPosition) {
              onAutoPosition(recommendedPosition)
            }
          }
        }
      } catch (error) {
        console.error("Error detecting pose:", error)
        setPoseDetected(false)
      }
    }

    detectPoseInPhoto()
  }, [mediaLoaded, selectedNFT, useAutomaticPositioning, onAutoPosition, videoMode, filters.background])

  // Real-time pose detection and rendering for video mode
  const detectAndRender = useCallback(
    async (time: number) => {
      if (!videoRef.current || !videoRef.current.readyState || !streamActive) return

      // Update animation time
      animationTimeRef.current = time / 1000 // Convert to seconds

      try {
        const result = await detectPose(videoRef.current)
        setPoseResult(result)
        setPoseDetected(!!result)

        // If we need background segmentation for filters
        if (filters.background && filters.background.filter.id !== "none") {
          const segData = await segmentPerson(videoRef.current)
          setSegmentationData(segData)
        }

        // If we have a selected NFT and automatic positioning is enabled, position it
        if (result && selectedNFT && useAutomaticPositioning && onAutoPosition) {
          const canvas = canvasRef.current
          if (canvas) {
            const recommendedPosition = getRecommendedPosition(
              result,
              selectedNFT.category,
              canvas.width,
              canvas.height,
            )

            if (recommendedPosition && onAutoPosition) {
              onAutoPosition(recommendedPosition)
            }
          }
        }

        renderFrame()
      } catch (error) {
        console.error("Error in real-time pose detection:", error)
      }

      animationRef.current = requestAnimationFrame(detectAndRender)
    },
    [selectedNFT, useAutomaticPositioning, onAutoPosition, streamActive, filters.background],
  )

  // Start/stop animation loop for video mode
  useEffect(() => {
    if (videoMode && streamActive) {
      animationRef.current = requestAnimationFrame(detectAndRender)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [videoMode, streamActive, detectAndRender])

  // Apply color filter to NFT image based on selected variant
  const applyVariantFilter = (ctx: CanvasRenderingContext2D, color?: string) => {
    if (!color) return

    switch (color.toLowerCase()) {
      case "red":
        ctx.filter = "sepia(0.5) hue-rotate(0deg) saturate(1.5)"
        break
      case "blue":
        ctx.filter = "sepia(0.5) hue-rotate(180deg) saturate(1.5)"
        break
      case "green":
        ctx.filter = "sepia(0.5) hue-rotate(90deg) saturate(1.5)"
        break
      case "purple":
        ctx.filter = "sepia(0.5) hue-rotate(270deg) saturate(1.5)"
        break
      case "yellow":
        ctx.filter = "sepia(0.5) hue-rotate(30deg) saturate(1.5)"
        break
      case "black":
        ctx.filter = "brightness(0.6) contrast(1.2)"
        break
      case "white":
        ctx.filter = "brightness(1.2) contrast(0.8) saturate(0)"
        break
      default:
        ctx.filter = "none"
    }
  }

  // Render the current frame
  const renderFrame = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Set canvas dimensions if needed
    const containerWidth = canvas.parentElement?.clientWidth || 800
    const containerHeight = canvas.parentElement?.clientHeight || 600

    if (canvas.width !== containerWidth || canvas.height !== containerHeight) {
      canvas.width = containerWidth
      canvas.height = containerHeight
    }

    // Draw photo or video
    if (videoMode && videoRef.current && videoRef.current.readyState >= 2) {
      // Calculate dimensions to fit the container while maintaining aspect ratio
      const videoAspect = videoRef.current.videoWidth / videoRef.current.videoHeight
      let drawWidth = canvas.width
      let drawHeight = canvas.width / videoAspect

      if (drawHeight > canvas.height) {
        drawHeight = canvas.height
        drawWidth = canvas.height * videoAspect
      }

      const offsetX = (canvas.width - drawWidth) / 2
      const offsetY = (canvas.height - drawHeight) / 2

      ctx.drawImage(videoRef.current, offsetX, offsetY, drawWidth, drawHeight)
    } else if (!videoMode && photoRef.current) {
      // Calculate dimensions to fit the container while maintaining aspect ratio
      const imgAspect = photoRef.current.width / photoRef.current.height
      let drawWidth = canvas.width
      let drawHeight = canvas.width / imgAspect

      if (drawHeight > canvas.height) {
        drawHeight = canvas.height
        drawWidth = canvas.height * imgAspect
      }

      const offsetX = (canvas.width - drawWidth) / 2
      const offsetY = (canvas.height - drawHeight) / 2

      ctx.drawImage(photoRef.current, offsetX, offsetY, drawWidth, drawHeight)
    }

    // Apply filters in order

    // 1. Apply color filter
    if (filters.color && filters.color.filter.id !== "none") {
      applyColorFilter(ctx, filters.color.filter, filters.color.intensity)
    }

    // 2. Apply artistic filter
    if (filters.artistic && filters.artistic.filter.id !== "none") {
      applyArtisticFilter(ctx, filters.artistic.filter, filters.artistic.intensity)
    }

    // 3. Apply background effect
    if (filters.background && filters.background.filter.id !== "none") {
      await applyBackgroundEffect(
        ctx,
        filters.background.filter,
        filters.background.intensity,
        segmentationData,
        backgroundRef.current,
      )
    }

    // 4. Apply lighting effect
    if (filters.lighting && filters.lighting.filter.id !== "none") {
      applyLightingEffect(ctx, filters.lighting.filter, filters.lighting.intensity)
    }

    // 5. Apply environmental effect (animated)
    if (filters.environment && filters.environment.filter.id !== "none") {
      applyEnvironmentalEffect(ctx, filters.environment.filter, filters.environment.intensity, animationTimeRef.current)
    }

    // Apply fashion-specific filters
    if (filters.fabric && filters.fabric.filter.id !== "none") {
      applyFabricTexture(ctx, filters.fabric.filter, filters.fabric.intensity)
    }

    if (filters.runway && filters.runway.filter.id !== "none") {
      applyRunwayEffect(ctx, filters.runway.filter, filters.runway.intensity)
    }

    if (filters.seasons && filters.seasons.filter.id !== "none") {
      applySeasonalEffect(ctx, filters.seasons.filter, filters.seasons.intensity)
    }

    // If there's a selected NFT, draw it on top
    if (selectedNFT) {
      const nftImage = new Image()
      nftImage.crossOrigin = "anonymous"
      nftImage.src = selectedNFT.image

      if (nftImage.complete) {
        drawNFT(ctx, nftImage, canvas.width, canvas.height)
      } else {
        nftImage.onload = () => {
          drawNFT(ctx, nftImage, canvas.width, canvas.height)
          setNftLoaded(true)
          setIsLoading(false)
        }

        nftImage.onerror = () => {
          setNftLoaded(true)
          setIsLoading(false)
        }
      }
    } else {
      setIsLoading(false)
    }

    // Capture preview for filter thumbnails if needed
    if (onPreviewCapture) {
      onPreviewCapture(canvas.toDataURL("image/jpeg", 0.7))
    }
  }, [
    videoMode,
    selectedNFT,
    transform,
    poseResult,
    environmentLighting,
    selectedVariant,
    filters,
    segmentationData,
    onPreviewCapture,
  ])

  // Draw NFT on canvas
  const drawNFT = (
    ctx: CanvasRenderingContext2D,
    nftImage: HTMLImageElement,
    canvasWidth: number,
    canvasHeight: number,
  ) => {
    // Calculate NFT position and size
    const nftWidth = (canvasWidth * nftTransform.scale) / 100
    const nftHeight = (nftImage.height / nftImage.width) * nftWidth

    const nftX = (canvasWidth * nftTransform.x) / 100 - nftWidth / 2
    const nftY = (canvasHeight * nftTransform.y) / 100 - nftHeight / 2

    // Save context state
    ctx.save()

    // Apply filters and transformations
    ctx.filter = `opacity(${nftTransform.opacity}%) brightness(${nftTransform.brightness}%) contrast(${nftTransform.contrast}%)`

    // Apply color variant if selected
    if (selectedVariant?.color) {
      applyVariantFilter(ctx, selectedVariant.color)
    }

    // Move to the center of where we want to draw the NFT
    ctx.translate(nftX + nftWidth / 2, nftY + nftHeight / 2)

    // Rotate around this center point
    ctx.rotate((nftTransform.rotation * Math.PI) / 180)

    // Draw the NFT centered on the rotation point
    ctx.drawImage(nftImage, -nftWidth / 2, -nftHeight / 2, nftWidth, nftHeight)

    // Restore context state
    ctx.restore()
  }

  // Load photo when URL changes
  useEffect(() => {
    if (videoMode) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Clear canvas
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (!photoURL) {
      setMediaLoaded(false)
      setIsLoading(false)
      return
    }

    // Load background photo
    const photo = new Image()
    photo.crossOrigin = "anonymous"
    photo.src = photoURL
    setMediaLoaded(false)

    photo.onload = () => {
      photoRef.current = photo
      setMediaLoaded(true)

      // Set canvas dimensions to match photo aspect ratio
      const containerWidth = canvas.parentElement?.clientWidth || 800
      const containerHeight = canvas.parentElement?.clientHeight || 600

      // Calculate dimensions to fit the container while maintaining aspect ratio
      let width = containerWidth
      let height = (photo.height / photo.width) * width

      if (height > containerHeight) {
        height = containerHeight
        width = (photo.width / photo.height) * height
      }

      canvas.width = width
      canvas.height = height

      renderFrame()
    }

    photo.onerror = () => {
      setMediaLoaded(false)
      setIsLoading(false)
      toast({
        title: "Image Error",
        description: "Failed to load the image. Please try another one.",
        variant: "destructive",
      })
    }
  }, [photoURL, videoMode, renderFrame, toast])

  // Capture current frame as image
  const captureFrame = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const dataUrl = canvas.toDataURL("image/png")
      if (onCaptureImage) {
        onCaptureImage(dataUrl)
      }

      toast({
        title: "Image Captured",
        description: "Your AR try-on image has been captured successfully.",
      })
    } catch (err) {
      console.error("Error capturing frame:", err)
      toast({
        title: "Capture Failed",
        description: "Failed to capture the image. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />

      {videoMode && (
        <video ref={videoRef} className="hidden" autoPlay playsInline muted onLoadedData={handleVideoLoaded} />
      )}

      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50">
          <Loader2 className="w-8 h-8 mb-2 animate-spin" />
          <p className="text-sm">
            {!mediaLoaded ? "Loading media..." : !nftLoaded && selectedNFT ? "Applying NFT..." : "Processing..."}
          </p>
        </div>
      )}

      {videoMode && streamActive && (
        <div className="absolute bottom-4 right-4">
          <Button onClick={captureFrame} variant="secondary" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Capture
          </Button>
        </div>
      )}

      {mediaLoaded && poseDetected && selectedNFT && (
        <div className="absolute top-2 left-2 px-2 py-1 bg-green-500/80 text-white text-xs rounded-md">
          Pose detected
        </div>
      )}
    </div>
  )
}
