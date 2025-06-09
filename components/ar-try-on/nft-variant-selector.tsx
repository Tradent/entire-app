"use client"
import { Check } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface NFTVariantSelectorProps {
  variants: {
    color?: string[]
    size?: string[]
    style?: string[]
  }
  selectedVariant: {
    color?: string
    size?: string
    style?: string
  }
  onChange: (variant: { color?: string; size?: string; style?: string }) => void
  disabled?: boolean
}

export function NFTVariantSelector({ variants, selectedVariant, onChange, disabled = false }: NFTVariantSelectorProps) {
  const handleColorChange = (color: string) => {
    onChange({ ...selectedVariant, color })
  }

  const handleSizeChange = (size: string) => {
    onChange({ ...selectedVariant, size })
  }

  const handleStyleChange = (style: string) => {
    onChange({ ...selectedVariant, style })
  }

  return (
    <div className="space-y-4">
      {variants.color && variants.color.length > 0 && (
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {variants.color.map((color) => (
              <button
                key={color}
                className={cn(
                  "w-8 h-8 rounded-full border border-muted-foreground/20 flex items-center justify-center",
                  selectedVariant.color === color && "ring-2 ring-primary ring-offset-2",
                  disabled && "opacity-50 cursor-not-allowed",
                )}
                style={{ backgroundColor: color.toLowerCase() }}
                onClick={() => !disabled && handleColorChange(color)}
                disabled={disabled}
                title={color}
              >
                {selectedVariant.color === color && (
                  <Check
                    className={`w-4 h-4 ${["white", "yellow", "lime"].includes(color.toLowerCase()) ? "text-black" : "text-white"}`}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {variants.size && variants.size.length > 0 && (
        <div className="space-y-2">
          <Label>Size</Label>
          <RadioGroup
            value={selectedVariant.size}
            onValueChange={handleSizeChange}
            className="flex flex-wrap gap-2"
            disabled={disabled}
          >
            {variants.size.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <RadioGroupItem value={size} id={`size-${size}`} disabled={disabled} />
                <Label htmlFor={`size-${size}`} className={disabled ? "opacity-50" : ""}>
                  {size}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {variants.style && variants.style.length > 0 && (
        <div className="space-y-2">
          <Label>Style</Label>
          <RadioGroup
            value={selectedVariant.style}
            onValueChange={handleStyleChange}
            className="flex flex-wrap gap-2"
            disabled={disabled}
          >
            {variants.style.map((style) => (
              <div key={style} className="flex items-center space-x-2">
                <RadioGroupItem value={style} id={`style-${style}`} disabled={disabled} />
                <Label htmlFor={`style-${style}`} className={disabled ? "opacity-50" : ""}>
                  {style}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  )
}

export default NFTVariantSelector
