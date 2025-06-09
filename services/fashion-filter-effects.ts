// Apply fabric texture overlay to canvas
export function applyFabricTexture(
  ctx: CanvasRenderingContext2D,
  filter: { id: string; params?: Record<string, any> },
  intensity = 1.0,
): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  // Save current state
  ctx.save()

  // Create a temporary canvas for the texture
  const tempCanvas = document.createElement("canvas")
  tempCanvas.width = width
  tempCanvas.height = height
  const tempCtx = tempCanvas.getContext("2d")!

  // Load and apply the appropriate texture
  const textureImage = new Image()
  textureImage.crossOrigin = "anonymous"

  // Set texture based on filter id
  switch (filter.id) {
    case "denim":
      textureImage.src = "/textures/denim.jpg"
      ctx.globalCompositeOperation = "overlay"
      break
    case "leather":
      textureImage.src = "/textures/leather.jpg"
      ctx.globalCompositeOperation = "overlay"
      break
    case "silk":
      textureImage.src = "/textures/silk.jpg"
      ctx.globalCompositeOperation = "soft-light"
      break
    case "metallic":
      textureImage.src = "/textures/metallic.jpg"
      ctx.globalCompositeOperation = "overlay"
      // Add reflective highlights
      ctx.filter = "brightness(1.2) contrast(1.1)"
      break
    case "holographic":
      // For holographic, we'll create a rainbow gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, "rgba(255, 0, 255, 0.4)")
      gradient.addColorStop(0.33, "rgba(0, 255, 255, 0.4)")
      gradient.addColorStop(0.66, "rgba(255, 255, 0, 0.4)")
      gradient.addColorStop(1, "rgba(0, 255, 0, 0.4)")

      ctx.globalCompositeOperation = "color-dodge"
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      // Add shimmer effect
      applyShimmerEffect(ctx, intensity)
      ctx.restore()
      return
    default:
      ctx.restore()
      return
  }

  // When texture image loads, apply it
  textureImage.onload = () => {
    // Create a pattern and apply with proper opacity
    const pattern = tempCtx.createPattern(textureImage, "repeat")!
    tempCtx.fillStyle = pattern
    tempCtx.fillRect(0, 0, width, height)

    // Apply the texture with specified intensity
    ctx.globalAlpha = intensity * 0.7
    ctx.drawImage(tempCanvas, 0, 0)

    // Restore context
    ctx.restore()
  }

  // Handle loading errors
  textureImage.onerror = () => {
    console.error(`Failed to load texture: ${filter.id}`)
    ctx.restore()
  }
}

// Apply runway-style effects
export function applyRunwayEffect(
  ctx: CanvasRenderingContext2D,
  filter: { id: string; params?: Record<string, any> },
  intensity = 1.0,
): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  ctx.save()

  switch (filter.id) {
    case "catwalk":
      // Enhance contrast and add spotlight effect
      ctx.filter = `contrast(${1 + intensity * 0.3}) brightness(${1 + intensity * 0.1})`

      // Add spotlight gradient
      const spotlightGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        0,
        width * 0.5,
        height * 0.4,
        width * 0.7,
      )
      spotlightGradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.3})`)
      spotlightGradient.addColorStop(0.7, `rgba(255, 255, 255, ${intensity * 0.05})`)
      spotlightGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.globalCompositeOperation = "screen"
      ctx.fillStyle = spotlightGradient
      ctx.fillRect(0, 0, width, height)
      break

    case "editorial":
      // High contrast, slightly desaturated, professional look
      ctx.filter = `contrast(${1 + intensity * 0.4}) saturate(${1 - intensity * 0.2}) brightness(${1 + intensity * 0.05})`

      // Add subtle vignette
      const vignetteGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.5,
      )
      vignetteGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
      vignetteGradient.addColorStop(0.7, `rgba(0, 0, 0, ${intensity * 0.2})`)
      vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${intensity * 0.4})`)

      ctx.globalCompositeOperation = "multiply"
      ctx.fillStyle = vignetteGradient
      ctx.fillRect(0, 0, width, height)
      break

    case "streetstyle":
      // Urban, slightly gritty look with enhanced colors
      ctx.filter = `contrast(${1 + intensity * 0.2}) saturate(${1 + intensity * 0.3})`

      // Add subtle grain
      addNoiseEffect(ctx, intensity * 0.15)
      break

    case "avantgarde":
      // Bold, experimental look with high contrast and color shifts
      ctx.filter = `contrast(${1 + intensity * 0.5}) hue-rotate(${intensity * 15}deg)`

      // Add color overlay for artistic effect
      ctx.globalCompositeOperation = "color"
      const gradient = ctx.createLinearGradient(0, 0, width, height)
      gradient.addColorStop(0, `rgba(255, 100, 200, ${intensity * 0.2})`)
      gradient.addColorStop(1, `rgba(100, 200, 255, ${intensity * 0.2})`)
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      break
  }

  ctx.restore()
}

// Apply seasonal fashion looks
export function applySeasonalEffect(
  ctx: CanvasRenderingContext2D,
  filter: { id: string; params?: Record<string, any> },
  intensity = 1.0,
): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  ctx.save()

  switch (filter.id) {
    case "spring":
      // Fresh, bright spring look
      ctx.filter = `brightness(${1 + intensity * 0.1}) saturate(${1 + intensity * 0.2})`

      // Add soft green/pink tint
      ctx.globalCompositeOperation = "color"
      ctx.fillStyle = `rgba(200, 255, 200, ${intensity * 0.15})`
      ctx.fillRect(0, 0, width, height)
      break

    case "summer":
      // Warm, vibrant summer look
      ctx.filter = `brightness(${1 + intensity * 0.15}) saturate(${1 + intensity * 0.3}) contrast(${1 + intensity * 0.1})`

      // Add warm golden overlay
      ctx.globalCompositeOperation = "color"
      ctx.fillStyle = `rgba(255, 220, 150, ${intensity * 0.2})`
      ctx.fillRect(0, 0, width, height)
      break

    case "fall":
      // Warm autumn tones
      ctx.filter = `sepia(${intensity * 0.3}) saturate(${1 + intensity * 0.1})`

      // Add warm orange/brown tint
      ctx.globalCompositeOperation = "color"
      ctx.fillStyle = `rgba(255, 200, 150, ${intensity * 0.25})`
      ctx.fillRect(0, 0, width, height)
      break

    case "winter":
      // Cool winter aesthetic
      ctx.filter = `brightness(${1 - intensity * 0.05}) contrast(${1 + intensity * 0.2}) saturate(${1 - intensity * 0.1})`

      // Add cool blue tint
      ctx.globalCompositeOperation = "color"
      ctx.fillStyle = `rgba(200, 220, 255, ${intensity * 0.2})`
      ctx.fillRect(0, 0, width, height)
      break
  }

  ctx.restore()
}

// Helper function to add shimmer effect for holographic materials
function applyShimmerEffect(ctx: CanvasRenderingContext2D, intensity: number): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  // Create shimmer particles
  const particleCount = Math.floor(intensity * 100)

  ctx.globalCompositeOperation = "screen"

  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 3 + 1
    const opacity = Math.random() * 0.7 + 0.3

    // Cycle through shimmer colors
    const hue = (i * 20) % 360

    ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity * intensity})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Helper function to add noise/grain effect
function addNoiseEffect(ctx: CanvasRenderingContext2D, intensity: number): void {
  const canvas = ctx.canvas
  const width = canvas.width
  const height = canvas.height

  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let i = 0; i < data.length; i += 4) {
    // Add random noise to each pixel
    const noise = (Math.random() - 0.5) * intensity * 50

    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise))
  }

  ctx.putImageData(imageData, 0, 0)
}
