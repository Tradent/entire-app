"use client"

import { useState, useEffect, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sliders, Palette, Layers, Save } from "lucide-react"
import type { CustomSceneBackground } from "@/services/custom-scene-backgrounds"

interface BackgroundCustomizerProps {
  imageUrl: string | null
  onSave: (filters: CustomSceneBackground["filters"]) => void
  initialFilters?: CustomSceneBackground["filters"]
}

export function BackgroundCustomizer({ imageUrl, onSave, initialFilters }: BackgroundCustomizerProps) {
  const [filters, setFilters] = useState<CustomSceneBackground["filters"]>(
    initialFilters || {
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
    },
  )
  const [activeTab, setActiveTab] = useState("adjustments")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  // Update canvas when filters change or image changes
  useEffect(() => {
    if (!imageUrl) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Create image if it doesn't exist
    if (!imageRef.current) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.src = imageUrl
      imageRef.current = img

      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width
        canvas.height = img.height
        renderCanvas()
      }
    } else {
      renderCanvas()
    }
  }, [imageUrl, filters])

  const renderCanvas = () => {
    const canvas = canvasRef.current
    const img = imageRef.current
    if (!canvas || !img) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply filters
    ctx.filter = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`

    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

    // Reset filter
    ctx.filter = "none"
  }

  const handleFilterChange = (key: keyof CustomSceneBackground["filters"], value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    onSave(filters)
  }

  if (!imageUrl) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <p className="text-muted-foreground">Upload an image to customize it</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg overflow-hidden border">
        <canvas ref={canvasRef} className="w-full h-48 object-cover" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="adjustments" className="flex items-center gap-2">
            <Sliders className="h-4 w-4" />
            <span>Adjustments</span>
          </TabsTrigger>
          <TabsTrigger value="overlays" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span>Overlays</span>
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Effects</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adjustments" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="brightness">Brightness</Label>
              <span className="text-sm text-muted-foreground">{filters.brightness}%</span>
            </div>
            <Slider
              id="brightness"
              min={0}
              max={200}
              step={5}
              value={[filters.brightness]}
              onValueChange={(value) => handleFilterChange("brightness", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="contrast">Contrast</Label>
              <span className="text-sm text-muted-foreground">{filters.contrast}%</span>
            </div>
            <Slider
              id="contrast"
              min={0}
              max={200}
              step={5}
              value={[filters.contrast]}
              onValueChange={(value) => handleFilterChange("contrast", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="saturation">Saturation</Label>
              <span className="text-sm text-muted-foreground">{filters.saturation}%</span>
            </div>
            <Slider
              id="saturation"
              min={0}
              max={200}
              step={5}
              value={[filters.saturation]}
              onValueChange={(value) => handleFilterChange("saturation", value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="blur">Blur</Label>
              <span className="text-sm text-muted-foreground">{filters.blur}px</span>
            </div>
            <Slider
              id="blur"
              min={0}
              max={20}
              step={0.5}
              value={[filters.blur]}
              onValueChange={(value) => handleFilterChange("blur", value[0])}
            />
          </div>
        </TabsContent>

        <TabsContent value="overlays" className="space-y-4 pt-4">
          <div className="space-y-4">
            <Label>Overlay Type</Label>
            <Select
              value={filters.overlay || "none"}
              onValueChange={(value) => handleFilterChange("overlay", value === "none" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select overlay" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="gradient">Gradient</SelectItem>
                <SelectItem value="vignette">Vignette</SelectItem>
                <SelectItem value="grain">Film Grain</SelectItem>
                <SelectItem value="duotone">Duotone</SelectItem>
              </SelectContent>
            </Select>

            {filters.overlay && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="overlayOpacity">Overlay Opacity</Label>
                  <span className="text-sm text-muted-foreground">{filters.overlayOpacity || 50}%</span>
                </div>
                <Slider
                  id="overlayOpacity"
                  min={0}
                  max={100}
                  step={5}
                  value={[filters.overlayOpacity || 50]}
                  onValueChange={(value) => handleFilterChange("overlayOpacity", value[0])}
                />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4 pt-4">
          <p className="text-sm text-muted-foreground">Apply special effects to your background image.</p>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  ...filters,
                  contrast: 120,
                  saturation: 110,
                  brightness: 105,
                })
              }}
            >
              Vibrant
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  ...filters,
                  contrast: 110,
                  saturation: 80,
                  brightness: 100,
                })
              }}
            >
              Muted
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  ...filters,
                  contrast: 120,
                  saturation: 0,
                  brightness: 100,
                })
              }}
            >
              Monochrome
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  ...filters,
                  contrast: 90,
                  saturation: 90,
                  brightness: 110,
                  blur: 1.5,
                })
              }}
            >
              Dreamy
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Button className="w-full" onClick={handleSave}>
        <Save className="h-4 w-4 mr-2" />
        Save Background
      </Button>
    </div>
  )
}
