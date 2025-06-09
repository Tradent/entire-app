import * as tf from "@tensorflow/tfjs"
import { applyFabricTexture, applyRunwayEffect, applySeasonalEffect } from "./fashion-filter-effects"

// Filter types
export type FilterType =
  | "none"
  | "sepia"
  | "grayscale"
  | "vintage"
  | "cyberpunk"
  | "neon"
  | "pastel"
  | "highContrast"
  | "lowContrast"
  | "blur"
  | "sharpen"
  | "pixelate"
  | "glitch"
  | "vaporwave"
  | "duotone"
  | "fabric"
  | "runway"
  | "seasons"

export type EffectType =
  | "none"
  | "sparkles"
  | "rain"
  | "snow"
  | "bubbles"
  | "confetti"
  | "glitter"
  | "neonGlow"
  | "digitalRain"
  | "holographic"
  | "fireflies"

export type BackgroundType =
  | "none"
  | "blur"
  | "replace"
  | "greenScreen"
  | "gradient"
  | "runway"
  | "studio"
  | "street"
  | "futuristic"
  | "metaverse"
  | "abstract"

// Filter categories
export interface FilterCategory {
  id: string
  name: string
  type: FilterType
  description: string
  filters: Filter[]
}

// Filter interface
export interface Filter {
  id: string
  name: string
  thumbnail: string
  type: FilterType
  description?: string
  intensity?: number
  params?: Record<string, number | string | boolean>
  shader?: string
}

// Filter preset (saved combination)
export interface FilterPreset {
  id: string
  name: string
  filter: FilterType
  effect: EffectType
  background: BackgroundType
  filterIntensity: number
  effectIntensity: number
  backgroundSettings: Record<string, any>
  isFavorite: boolean
  createdAt: Date
}

export interface FilterSettings {
  filter: FilterType
  effect: EffectType
  background: BackgroundType
  filterIntensity: number
  effectIntensity: number
  backgroundSettings: Record<string, any>
}

// Default filter settings
export const defaultFilterSettings: FilterSettings = {
  filter: "none",
  effect: "none",
  background: "none",
  filterIntensity: 1.0,
  effectIntensity: 1.0,
  backgroundSettings: {},
}

// Background segmentation model
let segmentationModel: tf.GraphModel | null = null

// Initialize segmentation model
export async function initSegmentation() {
  if (!segmentationModel) {
    try {
      // Load the BodyPix model for segmentation
      await tf.ready()
      segmentationModel = await tf.loadGraphModel(
        "https://tfhub.dev/tensorflow/tfjs-model/bodypix/resnet50/float/model-stride16/1/default/1",
        { fromTFHub: true },
      )
      return true
    } catch (error) {
      console.error("Error loading segmentation model:", error)
      return false
    }
  }
  return true
}

// Segment person from background
export async function segmentPerson(
  imageElement: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
): Promise<ImageData | null> {
  if (!segmentationModel) {
    const initialized = await initSegmentation()
    if (!initialized) return null
  }

  try {
    // Prepare input
    const input = tf.browser.fromPixels(imageElement)

    // Run segmentation
    const segmentation = (await segmentationModel!.predict(input.expandDims(0))) as tf.Tensor

    // Process the segmentation mask
    const maskTensor = segmentation.squeeze().argMax(-1)
    const mask = await maskTensor.data()

    // Create segmentation mask as ImageData
    const width = imageElement instanceof HTMLVideoElement ? imageElement.videoWidth : imageElement.width
    const height = imageElement instanceof HTMLVideoElement ? imageElement.videoHeight : imageElement.height

    const imageData = new ImageData(width, height)

    // Fill the imageData based on the mask
    for (let i = 0; i < mask.length; i++) {
      // If pixel is person (class 1), make it opaque, otherwise transparent
      const isPersonPixel = mask[i] === 1
      const pixelIndex = i * 4

      imageData.data[pixelIndex] = isPersonPixel ? 255 : 0 // R
      imageData.data[pixelIndex + 1] = isPersonPixel ? 255 : 0 // G
      imageData.data[pixelIndex + 2] = isPersonPixel ? 255 : 0 // B
      imageData.data[pixelIndex + 3] = isPersonPixel ? 255 : 0 // A
    }

    // Clean up tensors
    input.dispose()
    segmentation.dispose()
    maskTensor.dispose()

    return imageData
  } catch (error) {
    console.error("Error in segmentation:", error)
    return null
  }
}

// Apply color filter
export function applyColorFilter(ctx: CanvasRenderingContext2D, filter: Filter, intensity = 1.0): void {
  const canvas = ctx.canvas

  switch (filter.id) {
    case "sepia":
      ctx.filter = `sepia(${intensity})`
      break
    case "grayscale":
      ctx.filter = `grayscale(${intensity})`
      break
    case "vintage":
      ctx.filter = `sepia(${intensity * 0.5}) contrast(${1 + intensity * 0.2}) brightness(${1 + intensity * 0.05})`
      break
    case "noir":
      ctx.filter = `grayscale(${intensity}) contrast(${1 + intensity * 0.5}) brightness(${1 - intensity * 0.3})`
      break
    case "cyberpunk":
      // Neon-like effect with high contrast and vibrant colors
      ctx.filter = `saturate(${1 + intensity * 2}) contrast(${1 + intensity * 0.8}) brightness(${1 + intensity * 0.2})`

      // Add a color overlay for the cyberpunk effect
      ctx.save()
      ctx.globalCompositeOperation = "overlay"
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `rgba(255, 0, 255, ${intensity * 0.2})`)
      gradient.addColorStop(1, `rgba(0, 255, 255, ${intensity * 0.2})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
      break
    case "futuristic":
      // Clean, high-tech look with blue tint
      ctx.filter = `saturate(${1 + intensity * 0.5}) contrast(${1 + intensity * 0.3}) brightness(${1 + intensity * 0.1})`

      // Add a subtle blue overlay
      ctx.save()
      ctx.globalCompositeOperation = "color"
      ctx.fillStyle = `rgba(100, 180, 255, ${intensity * 0.3})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
      break
    case "vaporwave":
      // Retro-futuristic aesthetic with purple and teal
      ctx.filter = `saturate(${1 + intensity * 1.5}) contrast(${1 + intensity * 0.4})`

      // Add a duotone effect
      ctx.save()
      ctx.globalCompositeOperation = "hue"
      const vaporGradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      vaporGradient.addColorStop(0, `rgba(255, 105, 180, ${intensity * 0.5})`) // Hot pink
      vaporGradient.addColorStop(1, `rgba(64, 224, 208, ${intensity * 0.5})`) // Turquoise
      ctx.fillStyle = vaporGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()
      break

    // Handle fashion-specific filters
    case filter.id.startsWith("fabric-") ? filter.id : "":
      applyFabricTexture(ctx, { id: filter.id.replace("fabric-", ""), params: filter.params }, intensity)
      break
    case filter.id.startsWith("runway-") ? filter.id : "":
      applyRunwayEffect(ctx, { id: filter.id.replace("runway-", ""), params: filter.params }, intensity)
      break
    case filter.id.startsWith("season-") ? filter.id : "":
      applySeasonalEffect(ctx, { id: filter.id.replace("season-", ""), params: filter.params }, intensity)
      break

    default:
      ctx.filter = "none"
  }
}

// Apply artistic filter
export function applyArtisticFilter(ctx: CanvasRenderingContext2D, filter: Filter, intensity = 1.0): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  // Get the image data
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  switch (filter.id) {
    case "sketch":
      // Simple edge detection for sketch effect
      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = width
      tempCanvas.height = height
      const tempCtx = tempCanvas.getContext("2d")!
      tempCtx.drawImage(canvas, 0, 0)
      const tempData = tempCtx.getImageData(0, 0, width, height).data

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4

          // Simple Sobel edge detection
          const gx =
            -1 * tempData[((y - 1) * width + (x - 1)) * 4] +
            1 * tempData[((y - 1) * width + (x + 1)) * 4] +
            -2 * tempData[(y * width + (x - 1)) * 4] +
            2 * tempData[(y * width + (x + 1)) * 4] +
            -1 * tempData[((y + 1) * width + (x - 1)) * 4] +
            1 * tempData[((y + 1) * width + (x + 1)) * 4]

          const gy =
            -1 * tempData[((y - 1) * width + (x - 1)) * 4] +
            -2 * tempData[((y - 1) * width + x) * 4] +
            -1 * tempData[((y - 1) * width + (x + 1)) * 4] +
            1 * tempData[((y + 1) * width + (x - 1)) * 4] +
            2 * tempData[((y + 1) * width + x) * 4] +
            1 * tempData[((y + 1) * width + (x + 1)) * 4]

          // Calculate gradient magnitude
          const g = Math.sqrt(gx * gx + gy * gy)

          // Invert and adjust by intensity
          const val = 255 - Math.min(255, g * intensity)

          // Set grayscale value
          data[idx] = val
          data[idx + 1] = val
          data[idx + 2] = val
          data[idx + 3] = 255
        }
      }
      break

    case "painting":
      // Oil painting effect
      const radius = Math.floor(intensity * 5) + 1
      const intensityFactor = intensity * 30

      for (let y = radius; y < height - radius; y++) {
        for (let x = radius; x < width - radius; x++) {
          const idx = (y * width + x) * 4

          // Collect color samples in the radius
          const samples = []
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const sampleIdx = ((y + dy) * width + (x + dx)) * 4
              samples.push({
                r: data[sampleIdx],
                g: data[sampleIdx + 1],
                b: data[sampleIdx + 2],
                intensity: data[sampleIdx] + data[sampleIdx + 1] + data[sampleIdx + 2],
              })
            }
          }

          // Sort by intensity
          samples.sort((a, b) => a.intensity - b.intensity)

          // Pick a sample based on intensity factor
          const sampleIndex = Math.min(samples.length - 1, Math.floor((intensityFactor / 100) * samples.length))
          const sample = samples[sampleIndex]

          // Apply the color
          data[idx] = sample.r
          data[idx + 1] = sample.g
          data[idx + 2] = sample.b
        }
      }
      break

    case "pixelate":
      const pixelSize = Math.max(2, Math.floor(intensity * 20))

      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          // Get the color of the first pixel in the block
          const idx = (y * width + x) * 4
          const r = data[idx]
          const g = data[idx + 1]
          const b = data[idx + 2]

          // Apply to all pixels in the block
          for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
            for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
              const blockIdx = ((y + dy) * width + (x + dx)) * 4
              data[blockIdx] = r
              data[blockIdx + 1] = g
              data[blockIdx + 2] = b
            }
          }
        }
      }
      break

    case "glitch":
      // RGB shift glitch effect
      const shiftAmount = Math.floor(intensity * 10)

      // Create temporary copy of image data
      const tempData2 = new Uint8ClampedArray(data)

      for (let y = 0; y < height; y++) {
        // Random horizontal shift for this row
        const rowShift = Math.floor(Math.random() * shiftAmount * 2) - shiftAmount

        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4

          // Shift red channel
          const redX = Math.max(0, Math.min(width - 1, x + rowShift))
          const redIdx = (y * width + redX) * 4
          data[idx] = tempData2[redIdx]

          // Occasionally add random blocks of shifted pixels
          if (Math.random() < intensity * 0.01) {
            const blockHeight = Math.floor(Math.random() * 10) + 5
            const blockShift = Math.floor(Math.random() * 20) - 10

            for (let by = y; by < Math.min(height, y + blockHeight); by++) {
              for (let bx = x; bx < Math.min(width, x + 20); bx++) {
                const blockIdx = (by * width + bx) * 4
                const sourceX = Math.max(0, Math.min(width - 1, bx + blockShift))
                const sourceIdx = (by * width + sourceX) * 4

                data[blockIdx] = tempData2[sourceIdx]
                data[blockIdx + 1] = tempData2[sourceIdx + 1]
                data[blockIdx + 2] = tempData2[sourceIdx + 2]
              }
            }
          }
        }
      }
      break
  }

  // Put the modified image data back
  ctx.putImageData(imageData, 0, 0)
}

// Apply environmental effect
export function applyEnvironmentalEffect(
  ctx: CanvasRenderingContext2D,
  filter: Filter,
  intensity = 1.0,
  time = 0,
): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  ctx.save()

  switch (filter.id) {
    case "rain":
      // Draw rain drops
      ctx.globalAlpha = intensity * 0.7
      ctx.strokeStyle = "rgba(200, 200, 255, 0.8)"

      const rainCount = Math.floor(intensity * 100)
      for (let i = 0; i < rainCount; i++) {
        const x = Math.random() * width
        const y = (Math.random() * height + time * 500) % height
        const length = 10 + Math.random() * 20

        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 1, y + length)
        ctx.stroke()
      }
      break

    case "snow":
      // Draw snowflakes
      ctx.globalAlpha = intensity * 0.8
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"

      const snowCount = Math.floor(intensity * 100)
      for (let i = 0; i < snowCount; i++) {
        const size = 2 + Math.random() * 5
        const x = (Math.random() * width + Math.sin(time + i) * 50) % width
        const y = (Math.random() * height + time * 200) % height

        ctx.beginPath()
        ctx.arc(x, y, size / 2, 0, Math.PI * 2)
        ctx.fill()
      }
      break

    case "sparkles":
      // Draw sparkles
      const sparkleCount = Math.floor(intensity * 70)

      for (let i = 0; i < sparkleCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = 1 + Math.random() * 3
        const opacity = 0.3 + Math.random() * 0.7
        const hue = (time * 100 + i * 20) % 360

        ctx.globalAlpha = opacity * intensity
        ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity})`

        // Draw a simple star shape
        ctx.beginPath()
        for (let j = 0; j < 5; j++) {
          const angle = (j * Math.PI * 2) / 5 - Math.PI / 2
          const innerAngle = angle + Math.PI / 5

          if (j === 0) {
            ctx.moveTo(x + Math.cos(angle) * size * 2, y + Math.sin(angle) * size * 2)
          } else {
            ctx.lineTo(x + Math.cos(angle) * size * 2, y + Math.sin(angle) * size * 2)
          }

          ctx.lineTo(x + Math.cos(innerAngle) * size, y + Math.sin(innerAngle) * size)
        }
        ctx.closePath()
        ctx.fill()
      }
      break

    case "bubbles":
      // Draw bubbles
      const bubbleCount = Math.floor(intensity * 50)

      for (let i = 0; i < bubbleCount; i++) {
        const x = Math.random() * width
        const y = (height - Math.random() * height * 2 - time * 100) % height
        const size = 5 + Math.random() * 20
        const opacity = 0.2 + Math.random() * 0.3

        // Bubble
        ctx.globalAlpha = opacity * intensity

        // Create gradient for bubble
        const gradient = ctx.createRadialGradient(x - size * 0.3, y - size * 0.3, size * 0.1, x, y, size)
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(0.5, "rgba(200, 230, 255, 0.6)")
        gradient.addColorStop(1, "rgba(150, 200, 255, 0.1)")

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()

        // Highlight
        ctx.globalAlpha = opacity * 0.8 * intensity
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.2, 0, Math.PI * 2)
        ctx.fill()
      }
      break

    case "neon-particles":
      // Draw neon particles
      const particleCount = Math.floor(intensity * 80)

      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width
        const y = Math.random() * height
        const size = 1 + Math.random() * 4
        const opacity = 0.3 + Math.random() * 0.7

        // Cycle through neon colors
        const colorIndex = (i + Math.floor(time * 5)) % 5
        const colors = [
          "rgba(255, 0, 128, 0.8)", // Pink
          "rgba(0, 255, 255, 0.8)", // Cyan
          "rgba(128, 0, 255, 0.8)", // Purple
          "rgba(0, 255, 128, 0.8)", // Green
          "rgba(255, 255, 0, 0.8)", // Yellow
        ]

        ctx.globalAlpha = opacity * intensity
        ctx.fillStyle = colors[colorIndex]

        // Draw particle with glow
        ctx.shadowColor = colors[colorIndex]
        ctx.shadowBlur = size * 5
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      break
  }

  ctx.restore()
}

// Apply background effect
export async function applyBackgroundEffect(
  ctx: CanvasRenderingContext2D,
  filter: Filter,
  intensity = 1.0,
  segmentationData?: ImageData | null,
  backgroundImage?: HTMLImageElement | null,
): Promise<void> {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  // If we don't have segmentation data and need it, try to get it
  if (!segmentationData && ["blur", "replace"].includes(filter.id)) {
    // This would be a placeholder - in a real implementation,
    // you'd need to pass in the original image/video element
    return
  }

  // Get current canvas state
  const originalImageData = ctx.getImageData(0, 0, width, height)

  switch (filter.id) {
    case "blur":
      if (segmentationData) {
        // Create a temporary canvas for the background
        const tempCanvas = document.createElement("canvas")
        tempCanvas.width = width
        tempCanvas.height = height
        const tempCtx = tempCanvas.getContext("2d")!

        // Draw the original image
        tempCtx.putImageData(originalImageData, 0, 0)

        // Apply blur to the temporary canvas
        tempCtx.filter = `blur(${intensity * 10}px)`
        tempCtx.drawImage(tempCanvas, 0, 0)

        // Get the blurred background
        const blurredBg = tempCtx.getImageData(0, 0, width, height)

        // Combine the segmented person with the blurred background
        const resultData = new ImageData(width, height)
        for (let i = 0; i < segmentationData.data.length; i += 4) {
          // If this pixel is part of a person (alpha > 0)
          if (segmentationData.data[i + 3] > 0) {
            // Use the original pixel
            resultData.data[i] = originalImageData.data[i]
            resultData.data[i + 1] = originalImageData.data[i + 1]
            resultData.data[i + 2] = originalImageData.data[i + 2]
            resultData.data[i + 3] = originalImageData.data[i + 3]
          } else {
            // Use the blurred background pixel
            resultData.data[i] = blurredBg.data[i]
            resultData.data[i + 1] = blurredBg.data[i + 1]
            resultData.data[i + 2] = blurredBg.data[i + 2]
            resultData.data[i + 3] = blurredBg.data[i + 3]
          }
        }

        // Draw the result
        ctx.putImageData(resultData, 0, 0)
      }
      break

    case "replace":
      if (segmentationData && backgroundImage) {
        // Draw the background image
        ctx.drawImage(backgroundImage, 0, 0, width, height)

        // Get the current state with background
        const bgImageData = ctx.getImageData(0, 0, width, height)

        // Combine the segmented person with the new background
        const resultData = new ImageData(width, height)
        for (let i = 0; i < segmentationData.data.length; i += 4) {
          // If this pixel is part of a person (alpha > 0)
          if (segmentationData.data[i + 3] > 0) {
            // Use the original pixel
            resultData.data[i] = originalImageData.data[i]
            resultData.data[i + 1] = originalImageData.data[i + 1]
            resultData.data[i + 2] = originalImageData.data[i + 2]
            resultData.data[i + 3] = originalImageData.data[i + 3]
          } else {
            // Use the new background pixel
            resultData.data[i] = bgImageData.data[i]
            resultData.data[i + 1] = bgImageData.data[i + 1]
            resultData.data[i + 2] = bgImageData.data[i + 2]
            resultData.data[i + 3] = bgImageData.data[i + 3]
          }
        }

        // Draw the result
        ctx.putImageData(resultData, 0, 0)
      }
      break

    case "gradient":
      // Create a gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height)

      // Get gradient colors from params or use defaults
      const color1 = (filter.params?.color1 as string) || "#ff00ff"
      const color2 = (filter.params?.color2 as string) || "#00ffff"

      gradient.addColorStop(0, color1)
      gradient.addColorStop(1, color2)

      ctx.save()
      ctx.globalCompositeOperation = "destination-over"
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
      break

    case "solid":
      // Solid color background
      const color = (filter.params?.color as string) || "#000000"

      ctx.save()
      ctx.globalCompositeOperation = "destination-over"
      ctx.fillStyle = color
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
      break
  }
}

// Apply lighting effect
export function applyLightingEffect(ctx: CanvasRenderingContext2D, filter: Filter, intensity = 1.0): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  ctx.save()

  switch (filter.id) {
    case "studio":
      // Bright, even lighting
      ctx.globalCompositeOperation = "overlay"
      ctx.fillStyle = `rgba(255, 255, 255, ${intensity * 0.2})`
      ctx.fillRect(0, 0, width, height)

      // Add a subtle vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5,
      )
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.3})`)

      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      break

    case "warm":
      // Warm lighting effect
      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = `rgba(255, 200, 150, ${intensity * 0.3})`
      ctx.fillRect(0, 0, width, height)

      // Add warm highlights
      ctx.globalCompositeOperation = "screen"
      const warmGradient = ctx.createRadialGradient(
        width * 0.7,
        height * 0.3,
        0,
        width * 0.7,
        height * 0.3,
        width * 0.8,
      )
      warmGradient.addColorStop(0, `rgba(255, 200, 100, ${intensity * 0.5})`)
      warmGradient.addColorStop(1, "rgba(255, 200, 100, 0)")

      ctx.fillStyle = warmGradient
      ctx.fillRect(0, 0, width, height)
      break

    case "cool":
      // Cool lighting effect
      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = `rgba(150, 180, 255, ${intensity * 0.3})`
      ctx.fillRect(0, 0, width, height)

      // Add cool highlights
      ctx.globalCompositeOperation = "screen"
      const coolGradient = ctx.createRadialGradient(
        width * 0.3,
        height * 0.3,
        0,
        width * 0.3,
        height * 0.3,
        width * 0.8,
      )
      coolGradient.addColorStop(0, `rgba(100, 150, 255, ${intensity * 0.5})`)
      coolGradient.addColorStop(1, "rgba(100, 150, 255, 0)")

      ctx.fillStyle = coolGradient
      ctx.fillRect(0, 0, width, height)
      break

    case "dramatic":
      // High contrast dramatic lighting

      // Darken the image
      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = `rgba(0, 0, 0, ${intensity * 0.5})`
      ctx.fillRect(0, 0, width, height)

      // Add dramatic spotlight
      ctx.globalCompositeOperation = "screen"
      const spotlightGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        0,
        width * 0.5,
        height * 0.4,
        width * 0.6,
      )
      spotlightGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.8})`)
      spotlightGradient.addColorStop(0.7, `rgba(255, 255, 255, ${intensity * 0.1})`)
      spotlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = spotlightGradient
      ctx.fillRect(0, 0, width, height)
      break

    case "neon":
      // Vibrant neon lighting effect

      // Add neon glow
      ctx.globalCompositeOperation = "screen"
      const neonGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5,
      )
      neonGradient.addColorStop(0, `rgba(150, 50, 255, ${intensity * 0.5})`)
      neonGradient.addColorStop(0.5, `rgba(50, 200, 255, ${intensity * 0.3})`)
      neonGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = neonGradient
      ctx.fillRect(0, 0, width, height)

      // Add color tint
      ctx.globalCompositeOperation = "color"
      ctx.fillStyle = `rgba(80, 20, 120, ${intensity * 0.3})`
      ctx.fillRect(0, 0, width, height)
      break
  }

  ctx.restore()
}

// Filter categories with available filters
export const filterCategories: FilterCategory[] = [
  {
    id: "color",
    name: "Color Filters",
    type: "color",
    description: "Adjust colors and tones",
    filters: [
      {
        id: "none",
        name: "Original",
        thumbnail: "/filters/original.png",
        type: "color",
        description: "No filter applied",
      },
      {
        id: "sepia",
        name: "Sepia",
        thumbnail: "/filters/sepia.png",
        type: "color",
        description: "Warm brown tone",
      },
      {
        id: "grayscale",
        name: "Monochrome",
        thumbnail: "/filters/grayscale.png",
        type: "color",
        description: "Black and white",
      },
      {
        id: "vintage",
        name: "Vintage",
        thumbnail: "/filters/vintage.png",
        type: "color",
        description: "Faded retro look",
      },
      {
        id: "noir",
        name: "Noir",
        thumbnail: "/filters/noir.png",
        type: "color",
        description: "High contrast black and white",
      },
      {
        id: "cyberpunk",
        name: "Cyberpunk",
        thumbnail: "/filters/cyberpunk.png",
        type: "color",
        description: "Neon futuristic style",
      },
      {
        id: "futuristic",
        name: "Futuristic",
        thumbnail: "/filters/futuristic.png",
        type: "color",
        description: "Clean high-tech look",
      },
      {
        id: "vaporwave",
        name: "Vaporwave",
        thumbnail: "/filters/vaporwave.png",
        type: "color",
        description: "Retro-futuristic aesthetic",
      },
    ],
  },
  {
    id: "artistic",
    name: "Artistic Effects",
    type: "artistic",
    description: "Creative visual styles",
    filters: [
      {
        id: "none",
        name: "Original",
        thumbnail: "/filters/original.png",
        type: "artistic",
        description: "No effect applied",
      },
      {
        id: "sketch",
        name: "Sketch",
        thumbnail: "/filters/sketch.png",
        type: "artistic",
        description: "Hand-drawn sketch effect",
      },
      {
        id: "painting",
        name: "Painting",
        thumbnail: "/filters/painting.png",
        type: "artistic",
        description: "Oil painting style",
      },
      {
        id: "pixelate",
        name: "Pixelate",
        thumbnail: "/filters/pixelate.png",
        type: "artistic",
        description: "Retro pixel art style",
      },
      {
        id: "glitch",
        name: "Glitch",
        thumbnail: "/filters/glitch.png",
        type: "artistic",
        description: "Digital distortion effect",
      },
    ],
  },
  {
    id: "environment",
    name: "Environment",
    type: "environment",
    description: "Add environmental elements",
    filters: [
      {
        id: "none",
        name: "Clear",
        thumbnail: "/filters/original.png",
        type: "environment",
        description: "No environment effects",
      },
      {
        id: "rain",
        name: "Rain",
        thumbnail: "/filters/rain.png",
        type: "environment",
        description: "Rainfall effect",
      },
      {
        id: "snow",
        name: "Snow",
        thumbnail: "/filters/snow.png",
        type: "environment",
        description: "Snowfall effect",
      },
      {
        id: "sparkles",
        name: "Sparkles",
        thumbnail: "/filters/sparkles.png",
        type: "environment",
        description: "Magical sparkle effect",
      },
      {
        id: "bubbles",
        name: "Bubbles",
        thumbnail: "/filters/bubbles.png",
        type: "environment",
        description: "Floating bubbles effect",
      },
      {
        id: "neon-particles",
        name: "Neon Particles",
        thumbnail: "/filters/neon-particles.png",
        type: "environment",
        description: "Glowing particle effect",
      },
    ],
  },
  {
    id: "background",
    name: "Background",
    type: "background",
    description: "Modify or replace background",
    filters: [
      {
        id: "none",
        name: "Original",
        thumbnail: "/filters/original.png",
        type: "background",
        description: "Keep original background",
      },
      {
        id: "blur",
        name: "Blur",
        thumbnail: "/filters/blur-bg.png",
        type: "background",
        description: "Blur the background",
      },
      {
        id: "replace",
        name: "Replace",
        thumbnail: "/filters/replace-bg.png",
        type: "background",
        description: "Replace with custom background",
      },
      {
        id: "gradient",
        name: "Gradient",
        thumbnail: "/filters/gradient-bg.png",
        type: "background",
        description: "Colorful gradient background",
        params: {
          color1: "#ff00ff",
          color2: "#00ffff",
        },
      },
      {
        id: "solid",
        name: "Solid Color",
        thumbnail: "/filters/solid-bg.png",
        type: "background",
        description: "Solid color background",
        params: {
          color: "#000000",
        },
      },
    ],
  },
  {
    id: "lighting",
    name: "Lighting",
    type: "lighting",
    description: "Lighting and atmosphere",
    filters: [
      {
        id: "none",
        name: "Natural",
        thumbnail: "/filters/original.png",
        type: "lighting",
        description: "Natural lighting",
      },
      {
        id: "studio",
        name: "Studio",
        thumbnail: "/filters/studio.png",
        type: "lighting",
        description: "Professional studio lighting",
      },
      {
        id: "warm",
        name: "Warm",
        thumbnail: "/filters/warm.png",
        type: "lighting",
        description: "Warm golden lighting",
      },
      {
        id: "cool",
        name: "Cool",
        thumbnail: "/filters/cool.png",
        type: "lighting",
        description: "Cool blue lighting",
      },
      {
        id: "dramatic",
        name: "Dramatic",
        thumbnail: "/filters/dramatic.png",
        type: "lighting",
        description: "High contrast dramatic lighting",
      },
      {
        id: "neon",
        name: "Neon",
        thumbnail: "/filters/neon.png",
        type: "lighting",
        description: "Vibrant neon lighting",
      },
    ],
  },
]

// Sample filter presets
export const filterPresets = [
  {
    id: "fashion-runway",
    name: "Fashion Runway",
    filter: "highContrast",
    effect: "sparkles",
    background: "runway",
    filterIntensity: 0.8,
    effectIntensity: 0.5,
    backgroundSettings: { opacity: 0.7 },
    isFavorite: false,
    createdAt: new Date(),
  },
  {
    id: "cyberpunk-night",
    name: "Cyberpunk Night",
    filter: "cyberpunk",
    effect: "neonGlow",
    background: "futuristic",
    filterIntensity: 1.0,
    effectIntensity: 0.8,
    backgroundSettings: { opacity: 0.9, color: "#0a0a2a" },
    isFavorite: false,
    createdAt: new Date(),
  },
  {
    id: "vintage-vibes",
    name: "Vintage Vibes",
    filter: "vintage",
    effect: "none",
    background: "blur",
    filterIntensity: 0.7,
    effectIntensity: 0,
    backgroundSettings: { blurAmount: 5 },
    isFavorite: false,
    createdAt: new Date(),
  },
  {
    id: "metaverse-dream",
    name: "Metaverse Dream",
    filter: "vaporwave",
    effect: "digitalRain",
    background: "metaverse",
    filterIntensity: 0.9,
    effectIntensity: 0.6,
    backgroundSettings: { opacity: 0.8 },
    isFavorite: false,
    createdAt: new Date(),
  },
  {
    id: "studio-pro",
    name: "Studio Pro",
    filter: "none",
    effect: "none",
    background: "studio",
    filterIntensity: 0,
    effectIntensity: 0,
    backgroundSettings: { lighting: "soft" },
    isFavorite: false,
    createdAt: new Date(),
  },
]

// Mock function to get user's saved filter presets
export const getUserFilterPresets = (): FilterPreset[] => {
  // In a real app, this would fetch from an API or local storage
  const savedPresets = localStorage.getItem("userFilterPresets")
  if (savedPresets) {
    try {
      return JSON.parse(savedPresets).map((preset: any) => ({
        ...preset,
        createdAt: new Date(preset.createdAt),
      }))
    } catch (e) {
      console.error("Error parsing saved filter presets", e)
    }
  }
  return []
}

// Mock function to save a new filter preset
export const saveFilterPreset = (preset: Omit<FilterPreset, "id" | "createdAt">): FilterPreset => {
  const newPreset: FilterPreset = {
    ...preset,
    id: `preset-${Date.now()}`,
    createdAt: new Date(),
  }

  const existingPresets = getUserFilterPresets()
  const updatedPresets = [...existingPresets, newPreset]

  localStorage.setItem("userFilterPresets", JSON.stringify(updatedPresets))
  return newPreset
}

// Mock function to update a filter preset
export const updateFilterPreset = (preset: FilterPreset): FilterPreset => {
  const existingPresets = getUserFilterPresets()
  const updatedPresets = existingPresets.map((p) => (p.id === preset.id ? preset : p))

  localStorage.setItem("userFilterPresets", JSON.stringify(updatedPresets))
  return preset
}

// Mock function to delete a filter preset
export const deleteFilterPreset = (presetId: string): boolean => {
  const existingPresets = getUserFilterPresets()
  const updatedPresets = existingPresets.filter((p) => p.id !== presetId)

  localStorage.setItem("userFilterPresets", JSON.stringify(updatedPresets))
  return true
}

// Get all available filters
export const getAvailableFilters = (): { id: FilterType; name: string }[] => [
  { id: "none", name: "No Filter" },
  { id: "sepia", name: "Sepia" },
  { id: "grayscale", name: "Grayscale" },
  { id: "vintage", name: "Vintage" },
  { id: "cyberpunk", name: "Cyberpunk" },
  { id: "neon", name: "Neon" },
  { id: "pastel", name: "Pastel" },
  { id: "highContrast", name: "High Contrast" },
  { id: "lowContrast", name: "Low Contrast" },
  { id: "blur", name: "Blur" },
  { id: "sharpen", name: "Sharpen" },
  { id: "pixelate", name: "Pixelate" },
  { id: "glitch", name: "Glitch" },
  { id: "vaporwave", name: "Vaporwave" },
  { id: "duotone", name: "Duotone" },
]

// Get all available effects
export const getAvailableEffects = (): { id: EffectType; name: string }[] => [
  { id: "none", name: "No Effect" },
  { id: "sparkles", name: "Sparkles" },
  { id: "rain", name: "Rain" },
  { id: "snow", name: "Snow" },
  { id: "bubbles", name: "Bubbles" },
  { id: "confetti", name: "Confetti" },
  { id: "glitter", name: "Glitter" },
  { id: "neonGlow", name: "Neon Glow" },
  { id: "digitalRain", name: "Digital Rain" },
  { id: "holographic", name: "Holographic" },
  { id: "fireflies", name: "Fireflies" },
]

// Get all available backgrounds
export const getAvailableBackgrounds = (): { id: BackgroundType; name: string }[] => [
  { id: "none", name: "No Background" },
  { id: "blur", name: "Blur" },
  { id: "replace", name: "Replace" },
  { id: "greenScreen", name: "Green Screen" },
  { id: "gradient", name: "Gradient" },
  { id: "runway", name: "Runway" },
  { id: "studio", name: "Studio" },
  { id: "street", name: "Street" },
  { id: "futuristic", name: "Futuristic" },
  { id: "metaverse", name: "Metaverse" },
  { id: "abstract", name: "Abstract" },
]

// Clean up resources
export function disposeFilters() {
  if (segmentationModel) {
    try {
      segmentationModel.dispose()
      segmentationModel = null
    } catch (e) {
      console.warn("Error disposing segmentation model:", e)
    }
  }
}

import { fashionFilterCategories, fashionFilterPresets } from "./fashion-filters"

// Add fashion categories to the filter categories
export const allFilterCategories = [...filterCategories, ...fashionFilterCategories]

// Add fashion presets to the filter presets
export const allFilterPresets = [...filterPresets, ...fashionFilterPresets]
