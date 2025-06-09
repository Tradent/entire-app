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
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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

interface ARCanvasProps {
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
}

export default function ARCanvas({
  photoURL,
  videoMode,
  selectedNFT,
  transform,
  onAutoPosition,
  useAutomaticPositioning = false,
  selectedVariant,
  onCaptureImage,
  environmentLighting = "neutral",
}: ARCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const photoRef = useRef<HTMLImageElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mediaLoaded, setMediaLoaded] = useState(false)
  const [nftLoaded, setNftLoaded] = useState(false)
  const [poseDetected, setPoseDetected] = useState(false)
  const [poseResult, setPoseResult] = useState<PoseDetectionResult | null>(null)
  const [streamActive, setStreamActive] = useState(false)
  const animationRef = useRef<number | null>(null)
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
  }, [mediaLoaded, selectedNFT, useAutomaticPositioning, onAutoPosition, videoMode])

  // Real-time pose detection and rendering for video mode
  const detectAndRender = useCallback(async () => {
    if (!videoRef.current || !videoRef.current.readyState || !streamActive) return

    try {
      const result = await detectPose(videoRef.current)
      setPoseResult(result)
      setPoseDetected(!!result)

      // If we have a selected NFT and automatic positioning is enabled, position it
      if (result && selectedNFT && useAutomaticPositioning && onAutoPosition) {
        const canvas = canvasRef.current
        if (canvas) {
          const recommendedPosition = getRecommendedPosition(result, selectedNFT.category, canvas.width, canvas.height)

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
  }, [selectedNFT, useAutomaticPositioning, onAutoPosition, streamActive])

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
  const applyColorFilter = (ctx: CanvasRenderingContext2D, color?: string) => {
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

  // Apply lighting effect based on environment setting
  const applyLightingEffect = (ctx: CanvasRenderingContext2D, lighting: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    switch (lighting) {
      case "studio":
        // Bright, even lighting
        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        break
      case "outdoor":
        // Warm, directional lighting
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "rgba(255, 220, 150, 0.1)")
        gradient.addColorStop(1, "rgba(255, 180, 100, 0.05)")
        ctx.globalCompositeOperation = "overlay"
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        break
      case "night":
        // Cool, dark lighting
        ctx.globalCompositeOperation = "multiply"
        ctx.fillStyle = "rgba(50, 70, 150, 0.15)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        break
      case "neon":
        // Vibrant, colorful lighting
        const neonGlow = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 1.5,
        )
        neonGlow.addColorStop(0, "rgba(150, 50, 255, 0.05)")
        neonGlow.addColorStop(0.5, "rgba(50, 200, 255, 0.05)")
        neonGlow.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.globalCompositeOperation = "screen"
        ctx.fillStyle = neonGlow
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        break
      default:
        // Neutral lighting (no effect)
        break
    }

    // Reset composite operation
    ctx.globalCompositeOperation = "source-over"
  }

  // Render the current frame
  const renderFrame = useCallback(() => {
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

    // Apply environment lighting
    applyLightingEffect(ctx, environmentLighting)

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
  }, [videoMode, selectedNFT, transform, poseResult, environmentLighting, selectedVariant])

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
      applyColorFilter(ctx, selectedVariant.color)
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

  const handleAutoPosition = (position: { x: number; y: number; scale: number; rotation?: number }) => {
    setNftTransform((prev) => ({
      ...prev,
      x: position.x,
      y: position.y,
      scale: position.scale,
      rotation: position.rotation !== undefined ? position.rotation : prev.rotation,
    }))

    toast({
      title: "Auto-positioning applied",
      description: "NFT has been automatically positioned based on pose detection.",
    })
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
