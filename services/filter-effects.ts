"use client"

import type { FilterType, EffectType } from "./ar-filters"

// Apply filter to canvas context
export const applyFilter = (
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  filterType: FilterType,
  intensity = 1.0,
): void => {
  // Get the pixel data
  const data = imageData.data

  switch (filterType) {
    case "sepia":
      applySepia(data, intensity)
      break
    case "grayscale":
      applyGrayscale(data, intensity)
      break
    case "vintage":
      applyVintage(data, intensity)
      break
    case "cyberpunk":
      applyCyberpunk(data, intensity)
      break
    case "neon":
      applyNeon(data, intensity)
      break
    case "pastel":
      applyPastel(data, intensity)
      break
    case "highContrast":
      applyContrast(data, 1 + intensity)
      break
    case "lowContrast":
      applyContrast(data, 1 - intensity * 0.5)
      break
    case "blur":
      // Blur is applied separately using a convolution filter
      applyBlur(ctx, imageData, intensity * 5)
      return
    case "sharpen":
      // Sharpen is applied separately using a convolution filter
      applySharpen(ctx, imageData, intensity)
      return
    case "pixelate":
      // Pixelate is applied separately
      applyPixelate(ctx, imageData, intensity * 10)
      return
    case "glitch":
      applyGlitch(ctx, imageData, intensity)
      return
    case "vaporwave":
      applyVaporwave(data, intensity)
      break
    case "duotone":
      applyDuotone(data, intensity, [255, 0, 128], [0, 70, 255])
      break
    case "none":
    default:
      // No filter
      return
  }

  // Put the modified pixel data back
  ctx.putImageData(imageData, 0, 0)
}

// Apply filter to canvas context
export const applyFilterEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filterType: string,
  intensity = 1.0,
): void => {
  // Get the image data from the canvas
  const imageData = ctx.getImageData(0, 0, width, height)

  // Apply the filter
  applyFilter(ctx, imageData, filterType as FilterType, intensity)

  console.log("applyFilterEffect called", filterType, intensity)
}

// Apply sepia filter
const applySepia = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const newR = Math.min(255, r * (1 - 0.607 * intensity) + g * 0.769 * intensity + b * 0.189 * intensity)
    const newG = Math.min(255, r * 0.349 * intensity + g * (1 - 0.314 * intensity) + b * 0.168 * intensity)
    const newB = Math.min(255, r * 0.272 * intensity + g * 0.534 * intensity + b * (1 - 0.869 * intensity))

    data[i] = newR
    data[i + 1] = newG
    data[i + 2] = newB
  }
}

// Apply grayscale filter
const applyGrayscale = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Calculate grayscale value
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b

    // Apply intensity
    data[i] = r * (1 - intensity) + gray * intensity
    data[i + 1] = g * (1 - intensity) + gray * intensity
    data[i + 2] = b * (1 - intensity) + gray * intensity
  }
}

// Apply vintage filter
const applyVintage = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Vintage effect (sepia + reduced saturation + vignette)
    const newR = Math.min(255, r * 0.9 + g * 0.1 + b * 0.1)
    const newG = Math.min(255, r * 0.05 + g * 0.85 + b * 0.05)
    const newB = Math.min(255, r * 0.1 + g * 0.1 + b * 0.7)

    data[i] = r * (1 - intensity) + newR * intensity
    data[i + 1] = g * (1 - intensity) + newG * intensity
    data[i + 2] = b * (1 - intensity) + newB * intensity
  }
}

// Apply cyberpunk filter
const applyCyberpunk = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Enhance blues and pinks
    const newR = Math.min(255, r * 0.8 + b * 0.5)
    const newG = Math.min(255, g * 0.7)
    const newB = Math.min(255, b * 1.2 + r * 0.3)

    data[i] = r * (1 - intensity) + newR * intensity
    data[i + 1] = g * (1 - intensity) + newG * intensity
    data[i + 2] = b * (1 - intensity) + newB * intensity
  }
}

// Apply neon filter
const applyNeon = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Enhance bright colors
    const brightness = (r + g + b) / 3
    const threshold = 100

    let newR = r
    let newG = g
    let newB = b

    if (brightness > threshold) {
      // Brighten and saturate
      newR = Math.min(255, r * 1.5)
      newG = Math.min(255, g * 1.5)
      newB = Math.min(255, b * 1.5)
    } else {
      // Darken
      newR = r * 0.5
      newG = g * 0.5
      newB = b * 0.5
    }

    data[i] = r * (1 - intensity) + newR * intensity
    data[i + 1] = g * (1 - intensity) + newG * intensity
    data[i + 2] = b * (1 - intensity) + newB * intensity
  }
}

// Apply pastel filter
const applyPastel = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Soften and lighten colors
    const newR = Math.min(255, r * 0.8 + 50)
    const newG = Math.min(255, g * 0.8 + 50)
    const newB = Math.min(255, b * 0.8 + 50)

    data[i] = r * (1 - intensity) + newR * intensity
    data[i + 1] = g * (1 - intensity) + newG * intensity
    data[i + 2] = b * (1 - intensity) + newB * intensity
  }
}

// Apply contrast adjustment
const applyContrast = (data: Uint8ClampedArray, factor: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128
    data[i + 1] = factor * (data[i + 1] - 128) + 128
    data[i + 2] = factor * (data[i + 2] - 128) + 128
  }
}

// Apply blur filter using convolution
const applyBlur = (ctx: CanvasRenderingContext2D, imageData: ImageData, radius: number): void => {
  // Simple box blur implementation
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  const boxSize = Math.floor(radius)
  const div = 2 * boxSize + 1

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0,
        g = 0,
        b = 0,
        a = 0
      let count = 0

      // Sample the surrounding pixels
      for (let ky = -boxSize; ky <= boxSize; ky++) {
        for (let kx = -boxSize; kx <= boxSize; kx++) {
          const px = x + kx
          const py = y + ky

          if (px >= 0 && px < width && py >= 0 && py < height) {
            const i = (py * width + px) * 4
            r += copy[i]
            g += copy[i + 1]
            b += copy[i + 2]
            a += copy[i + 3]
            count++
          }
        }
      }

      // Calculate average
      const i = (y * width + x) * 4
      data[i] = r / count
      data[i + 1] = g / count
      data[i + 2] = b / count
      data[i + 3] = a / count
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

// Apply sharpen filter using convolution
const applySharpen = (ctx: CanvasRenderingContext2D, imageData: ImageData, intensity: number): void => {
  const width = imageData.width
  const height = imageData.height
  const data = imageData.data
  const copy = new Uint8ClampedArray(data)

  // Sharpen kernel
  const kernel = [0, -1 * intensity, 0, -1 * intensity, 5 * intensity, -1 * intensity, 0, -1 * intensity, 0]

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let r = 0,
        g = 0,
        b = 0

      // Apply convolution
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const px = x + kx
          const py = y + ky
          const i = (py * width + px) * 4
          const ki = (ky + 1) * 3 + (kx + 1)

          r += copy[i] * kernel[ki]
          g += copy[i + 1] * kernel[ki]
          b += copy[i + 2] * kernel[ki]
        }
      }

      // Set the result
      const i = (y * width + x) * 4
      data[i] = Math.min(255, Math.max(0, r))
      data[i + 1] = Math.min(255, Math.max(0, g))
      data[i + 2] = Math.min(255, Math.max(0, b))
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

// Apply pixelate effect
const applyPixelate = (ctx: CanvasRenderingContext2D, imageData: ImageData, pixelSize: number): void => {
  const width = imageData.width
  const height = imageData.height

  // Create a temporary canvas to work with
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext("2d")!

  // Draw the original image
  tempCtx.putImageData(imageData, 0, 0)

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height)

  // Draw pixelated version
  const size = Math.max(1, Math.floor(pixelSize))

  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      // Get the color of the first pixel in the block
      const pixelData = tempCtx.getImageData(x, y, 1, 1).data

      // Fill a rectangle with that color
      ctx.fillStyle = `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${pixelData[3] / 255})`
      ctx.fillRect(x, y, size, size)
    }
  }
}

// Apply glitch effect
const applyGlitch = (ctx: CanvasRenderingContext2D, imageData: ImageData, intensity: number): void => {
  const width = imageData.width
  const height = imageData.height

  // Create a temporary canvas to work with
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext("2d")!

  // Draw the original image
  tempCtx.putImageData(imageData, 0, 0)

  // Clear the original canvas
  ctx.clearRect(0, 0, width, height)

  // Draw the original image
  ctx.drawImage(tempCanvas, 0, 0)

  // Apply glitch effect
  const numGlitches = Math.floor(intensity * 10)

  for (let i = 0; i < numGlitches; i++) {
    // Random position and size
    const x = Math.floor(Math.random() * width)
    const y = Math.floor(Math.random() * height)
    const w = Math.floor(Math.random() * 100) + 20
    const h = Math.floor(Math.random() * 15) + 2

    // Random offset
    const offsetX = Math.floor((Math.random() - 0.5) * 30 * intensity)

    // Random channel shift
    const channelIndex = Math.floor(Math.random() * 3)

    // Get the image data for this slice
    const sliceData = tempCtx.getImageData(x, y, w, h)

    // Shift the channel
    const data = sliceData.data
    for (let j = 0; j < data.length; j += 4) {
      const temp = data[j + channelIndex]
      data[j + channelIndex] = data[j + ((channelIndex + 1) % 3)]
      data[j + ((channelIndex + 1) % 3)] = temp
    }

    // Draw the modified slice at the offset position
    ctx.putImageData(sliceData, x + offsetX, y)
  }
}

// Apply vaporwave effect
const applyVaporwave = (data: Uint8ClampedArray, intensity: number): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Enhance pinks and cyans
    const newR = Math.min(255, r * 1.2 + b * 0.3)
    const newG = Math.min(255, g * 0.7 + b * 0.4)
    const newB = Math.min(255, b * 1.2 + r * 0.3)

    data[i] = r * (1 - intensity) + newR * intensity
    data[i + 1] = g * (1 - intensity) + newG * intensity
    data[i + 2] = b * (1 - intensity) + newB * intensity
  }
}

// Apply duotone effect
const applyDuotone = (data: Uint8ClampedArray, intensity: number, color1: number[], color2: number[]): void => {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    // Convert to grayscale
    const gray = 0.2126 * r + 0.7152 * g + 0.0722 * b
    const value = gray / 255

    // Interpolate between the two colors
    const newR = color1[0] * (1 - value) + color2[0] * value
    const newG = color1[1] * (1 - value) + color2[1] * value
    const newB = color1[2] * (1 - value) + color2[2] * value

    data[i] = r * (1 - intensity) + newR * intensity
    data[i + 1] = g * (1 - intensity) + newG * intensity
    data[i + 2] = b * (1 - intensity) + newB * intensity
  }
}

// Apply particle effects
export class ParticleEffect {
  private particles: any[] = []
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private effectType: EffectType
  private intensity: number
  private animationId: number | null = null

  constructor(canvas: HTMLCanvasElement, effectType: EffectType, intensity = 1.0) {
    this.canvas = canvas
    this.ctx = canvas.getContext("2d")!
    this.effectType = effectType
    this.intensity = intensity
    this.initParticles()
  }

  private initParticles() {
    this.particles = []

    const count = Math.floor(this.intensity * 100)

    switch (this.effectType) {
      case "sparkles":
        this.initSparkles(count)
        break
      case "rain":
        this.initRain(count)
        break
      case "snow":
        this.initSnow(count)
        break
      case "bubbles":
        this.initBubbles(count)
        break
      case "confetti":
        this.initConfetti(count)
        break
      case "glitter":
        this.initGlitter(count)
        break
      case "neonGlow":
        this.initNeonGlow(count)
        break
      case "digitalRain":
        this.initDigitalRain(count)
        break
      case "holographic":
        this.initHolographic(count)
        break
      case "fireflies":
        this.initFireflies(count)
        break
      default:
        // No particles
        break
    }
  }

  private initSparkles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: `rgba(255, 255, ${Math.floor(Math.random() * 100) + 155}, ${Math.random() * 0.7 + 0.3})`,
        life: Math.random() * 100,
      })
    }
  }

  private initRain(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: Math.random() * 20 + 10,
        speedY: Math.random() * 10 + 10,
        width: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.3,
      })
    }
  }

  private initSnow(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 5 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: Math.random() * 1 + 1,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }
  }

  private initBubbles(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height + Math.random() * 100,
        size: Math.random() * 15 + 5,
        speedY: -(Math.random() * 2 + 1),
        opacity: Math.random() * 0.5 + 0.3,
      })
    }
  }

  private initConfetti(count: number) {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4CAF50",
      "#8BC34A",
      "#CDDC39",
      "#FFEB3B",
      "#FFC107",
      "#FF9800",
      "#FF5722",
    ]

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: -Math.random() * 100,
        size: Math.random() * 10 + 5,
        speedX: (Math.random() - 0.5) * 5,
        speedY: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
  }

  private initGlitter(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 1,
        speedY: (Math.random() - 0.5) * 1,
        opacity: Math.random() * 0.5 + 0.5,
        color: `rgba(255, ${Math.floor(Math.random() * 100) + 155}, ${Math.floor(Math.random() * 100) + 155}, ${Math.random() * 0.7 + 0.3})`,
        pulse: Math.random() * 0.1 + 0.05,
        pulseDirection: 1,
      })
    }
  }

  private initNeonGlow(count: number) {
    const colors = ["#ff00ff", "#00ffff", "#ff0099", "#00ff99", "#9900ff", "#ff9900"]

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulse: Math.random() * 0.05 + 0.02,
        pulseDirection: 1,
      })
    }
  }

  private initDigitalRain(count: number) {
    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    for (let i = 0; i < count; i++) {
      const column = Math.floor(Math.random() * (this.canvas.width / 20)) * 20

      this.particles.push({
        x: column,
        y: Math.random() * this.canvas.height,
        speedY: Math.random() * 5 + 3,
        character: characters.charAt(Math.floor(Math.random() * characters.length)),
        opacity: Math.random() * 0.5 + 0.5,
        color: `rgba(0, ${Math.floor(Math.random() * 100) + 155}, 0, 1)`,
      })
    }
  }

  private initHolographic(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 30 + 20,
        opacity: Math.random() * 0.2 + 0.1,
        hue: Math.random() * 360,
        hueSpeed: (Math.random() - 0.5) * 10,
        pulse: Math.random() * 0.05 + 0.02,
        pulseDirection: 1,
      })
    }
  }

  private initFireflies(count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * 0.05 + 0.02,
        pulseDirection: 1,
        color: `rgba(255, ${Math.floor(Math.random() * 100) + 155}, 0, 1)`,
      })
    }
  }

  public start() {
    if (this.animationId) {
      return
    }

    const animate = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.updateParticles()
      this.drawParticles()
      this.animationId = requestAnimationFrame(animate)
    }

    animate()
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = null
    }
  }

  private updateParticles() {
    // Implementation depends on the effect type
    switch (this.effectType) {
      case "sparkles":
        this.updateSparkles()
        break
      case "rain":
        this.updateRain()
        break
      case "snow":
        this.updateSnow()
        break
      case "bubbles":
        this.updateBubbles()
        break
      case "confetti":
        this.updateConfetti()
        break
      case "glitter":
        this.updateGlitter()
        break
      case "neonGlow":
        this.updateNeonGlow()
        break
      case "digitalRain":
        this.updateDigitalRain()
        break
      case "holographic":
        this.updateHolographic()
        break
      case "fireflies":
        this.updateFireflies()
        break
      default:
        // No update
        break
    }
  }

  private drawParticles() {
    // Implementation depends on the effect type
    switch (this.effectType) {
      case "sparkles":
        this.drawSparkles()
        break
      case "rain":
        this.drawRain()
        break
      case "snow":
        this.drawSnow()
        break
      case "bubbles":
        this.drawBubbles()
        break
      case "confetti":
        this.drawConfetti()
        break
      case "glitter":
        this.drawGlitter()
        break
      case "neonGlow":
        this.drawNeonGlow()
        break
      case "digitalRain":
        this.drawDigitalRain()
        break
      case "holographic":
        this.drawHolographic()
        break
      case "fireflies":
        this.drawFireflies()
        break
      default:
        // No drawing
        break
    }
  }

  // Implementation of update and draw methods for each effect type
  // These would be specific to each effect

  private updateSparkles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      p.x += p.speedX
      p.y += p.speedY
      p.life -= 1

      if (p.life <= 0 || p.x < 0 || p.x > this.canvas.width || p.y < 0 || p.y > this.canvas.height) {
        // Reset particle
        p.x = Math.random() * this.canvas.width
        p.y = Math.random() * this.canvas.height
        p.life = Math.random() * 100
      }
    }
  }

  private drawSparkles() {
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]
      this.ctx.beginPath()
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      this.ctx.fillStyle = p.color
      this.ctx.fill()
    }
  }

  // Similar methods for other effect types
  private updateRain() {
    // Implementation for rain update
  }

  private drawRain() {
    // Implementation for rain drawing
  }

  // And so on for other effects...
  private updateSnow() {}
  private drawSnow() {}
  private updateBubbles() {}
  private drawBubbles() {}
  private updateConfetti() {}
  private drawConfetti() {}
  private updateGlitter() {}
  private drawGlitter() {}
  private updateNeonGlow() {}
  private drawNeonGlow() {}
  private updateDigitalRain() {}
  private drawDigitalRain() {}
  private updateHolographic() {}
  private drawHolographic() {}
  private updateFireflies() {}
  private drawFireflies() {}
}
