"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { FilterPreset } from "@/services/ar-filters"
import { Save } from "lucide-react"

interface FilterPresetCreatorProps {
  activeFilters: {
    color?: { filter: { id: string }; intensity: number }
    artistic?: { filter: { id: string }; intensity: number }
    environment?: { filter: { id: string }; intensity: number }
    background?: { filter: { id: string }; intensity: number }
    lighting?: { filter: { id: string }; intensity: number }
  }
  onSavePreset: (preset: FilterPreset) => void
  previewImage: string | null
}

export default function FilterPresetCreator({ activeFilters, onSavePreset, previewImage }: FilterPresetCreatorProps) {
  const [presetName, setPresetName] = useState("")
  const [open, setOpen] = useState(false)

  const handleSavePreset = () => {
    if (!presetName.trim()) return

    // Convert active filters to preset format
    const filters = Object.entries(activeFilters)
      .filter(([_, data]) => data && data.filter.id !== "none")
      .map(([type, data]) => ({
        filterId: data!.filter.id,
        intensity: data!.intensity,
      }))

    if (filters.length === 0) return

    // Create new preset
    const newPreset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name: presetName,
      thumbnail: previewImage || "/placeholder.svg?key=kzbo8",
      filters,
    }

    onSavePreset(newPreset)
    setPresetName("")
    setOpen(false)
  }

  const hasActiveFilters = Object.values(activeFilters).some((filter) => filter && filter.filter.id !== "none")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1" disabled={!hasActiveFilters}>
          <Save className="h-4 w-4" />
          Save Preset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Save Filter Preset</DialogTitle>
          <DialogDescription>Create a custom preset with your current filter settings.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="preset-name" className="text-right">
              Name
            </Label>
            <Input
              id="preset-name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              className="col-span-3"
              placeholder="My Custom Preset"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Preview</Label>
            <div className="col-span-3 border rounded-md overflow-hidden">
              <div className="aspect-square bg-muted">
                {previewImage ? (
                  <img src={previewImage || "/placeholder.svg"} alt="Preview" className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No preview available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSavePreset} disabled={!presetName.trim()}>
            Save Preset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
