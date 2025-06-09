"use client"

import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { SunMedium, Contrast, Droplets } from "lucide-react"

interface ImageAdjustmentsProps {
  transform: {
    opacity: number
    brightness: number
    contrast: number
  }
  onChange: (key: string, value: number) => void
  disabled?: boolean
}

export default function ImageAdjustments({ transform, onChange, disabled = false }: ImageAdjustmentsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="opacity">Opacity</Label>
          </div>
          <span className="text-sm text-muted-foreground">{transform.opacity}%</span>
        </div>
        <Slider
          id="opacity"
          min={10}
          max={100}
          step={5}
          value={[transform.opacity]}
          onValueChange={(value) => onChange("opacity", value[0])}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SunMedium className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="brightness">Brightness</Label>
          </div>
          <span className="text-sm text-muted-foreground">{transform.brightness}%</span>
        </div>
        <Slider
          id="brightness"
          min={50}
          max={150}
          step={5}
          value={[transform.brightness]}
          onValueChange={(value) => onChange("brightness", value[0])}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Contrast className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="contrast">Contrast</Label>
          </div>
          <span className="text-sm text-muted-foreground">{transform.contrast}%</span>
        </div>
        <Slider
          id="contrast"
          min={50}
          max={150}
          step={5}
          value={[transform.contrast]}
          onValueChange={(value) => onChange("contrast", value[0])}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
