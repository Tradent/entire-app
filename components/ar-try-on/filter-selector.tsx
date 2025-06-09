"use client"

import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  type Filter,
  type FilterCategory,
  type FilterPreset,
  filterCategories,
  filterPresets,
} from "@/services/ar-filters"

interface FilterSelectorProps {
  onSelectFilter: (filter: Filter, type: string, intensity: number) => void
  onSelectPreset: (preset: FilterPreset) => void
  onClearFilters: () => void
  activeFilters: {
    color?: { filter: Filter; intensity: number }
    artistic?: { filter: Filter; intensity: number }
    environment?: { filter: Filter; intensity: number }
    background?: { filter: Filter; intensity: number }
    lighting?: { filter: Filter; intensity: number }
  }
}

export function FilterSelector({ onSelectFilter, onSelectPreset, onClearFilters, activeFilters }: FilterSelectorProps) {
  const [activeTab, setActiveTab] = useState("presets")
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory | null>(null)
  const [intensities, setIntensities] = useState<Record<string, number>>({
    color: 1.0,
    artistic: 0.7,
    environment: 0.8,
    background: 1.0,
    lighting: 0.7,
  })
  const [favoritePresets, setFavoritePresets] = useState<string[]>([])

  const handleSelectFilter = (filter: Filter) => {
    if (!selectedCategory) return

    const type = selectedCategory.type
    const intensity = intensities[type] || 1.0

    onSelectFilter(filter, type, intensity)
  }

  const handleIntensityChange = (type: string, value: number[]) => {
    const newIntensity = value[0]
    setIntensities((prev) => ({ ...prev, [type]: newIntensity }))

    // If there's an active filter of this type, update its intensity
    const activeFilter = activeFilters[type as keyof typeof activeFilters]
    if (activeFilter) {
      onSelectFilter(activeFilter.filter, type, newIntensity)
    }
  }

  const handleToggleFavorite = (presetId: string) => {
    setFavoritePresets((prev) => (prev.includes(presetId) ? prev.filter((id) => id !== presetId) : [...prev, presetId]))
  }

  const getFilterThumbnail = (filter: Filter) => {
    return filter.thumbnail || "/placeholder.svg?key=5xcev"
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="presets" className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Presets</span>
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span>Filters</span>
          </TabsTrigger>
          <TabsTrigger value="active" className="flex items-center gap-1">
            <span>Active</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="presets" className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {filterPresets.map((preset) => (
              <div
                key={preset.id}
                className={cn(
                  "relative rounded-md overflow-hidden cursor-pointer border transition-all",
                  "hover:border-primary hover:shadow-md",
                )}
                onClick={() => onSelectPreset(preset)}
              >
                <div className="aspect-square relative">
                  <img
                    src={preset.thumbnail || "/placeholder.svg?height=100&width=100&query=filter preset"}
                    alt={preset.name}
                    className="object-cover w-full h-full"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 bg-black/30 hover:bg-black/50 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleToggleFavorite(preset.id)
                    }}
                  >
                    <Heart
                      className={cn(
                        "h-3 w-3",
                        favoritePresets.includes(preset.id) ? "fill-red-500 text-red-500" : "text-white",
                      )}
                    />
                  </Button>
                </div>
                <div className="p-1 text-center bg-muted/50">
                  <p className="text-xs font-medium truncate">{preset.name}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="filters" className="space-y-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory?.id === category.id ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {selectedCategory && (
            <>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`intensity-${selectedCategory.type}`}>Intensity</Label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(intensities[selectedCategory.type] * 100)}%
                  </span>
                </div>
                <Slider
                  id={`intensity-${selectedCategory.type}`}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[intensities[selectedCategory.type] || 1.0]}
                  onValueChange={(value) => handleIntensityChange(selectedCategory.type, value)}
                />
              </div>

              <ScrollArea className="h-[220px] pr-4">
                <div className="grid grid-cols-3 gap-2">
                  {selectedCategory.filters.map((filter) => {
                    const isActive =
                      activeFilters[selectedCategory.type as keyof typeof activeFilters]?.filter.id === filter.id

                    return (
                      <div
                        key={filter.id}
                        className={cn(
                          "rounded-md overflow-hidden cursor-pointer border transition-all",
                          isActive ? "border-primary ring-1 ring-primary" : "border-border",
                          "hover:border-primary",
                        )}
                        onClick={() => handleSelectFilter(filter)}
                      >
                        <div className="aspect-square">
                          <img
                            src={getFilterThumbnail(filter) || "/placeholder.svg"}
                            alt={filter.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="p-1 text-center bg-muted/50">
                          <p className="text-xs font-medium truncate">{filter.name}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="space-y-3">
            {Object.entries(activeFilters).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No filters applied</p>
                <p className="text-xs mt-1">Select filters to enhance your AR experience</p>
              </div>
            ) : (
              <>
                {Object.entries(activeFilters).map(([type, data]) => {
                  if (!data) return null
                  const { filter, intensity } = data
                  const category = filterCategories.find((c) => c.type === type)

                  return (
                    <div key={type} className="flex items-center justify-between border rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={getFilterThumbnail(filter) || "/placeholder.svg"}
                            alt={filter.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{filter.name}</p>
                          <p className="text-xs text-muted-foreground">{category?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{Math.round(intensity * 100)}%</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onSelectFilter({ ...filter, id: "none" }, type, 1.0)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-x"
                          >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  )
                })}

                <Button variant="outline" className="w-full mt-2" onClick={onClearFilters}>
                  Clear All Filters
                </Button>
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default FilterSelector
