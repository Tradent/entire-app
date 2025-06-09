"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const categories = [
  { id: "clothing", label: "Clothing", count: 124 },
  { id: "accessories", label: "Accessories", count: 87 },
  { id: "footwear", label: "Footwear", count: 45 },
  { id: "headwear", label: "Headwear", count: 32 },
  { id: "eyewear", label: "Eyewear", count: 18 },
]

const designers = [
  { id: "metafashion", label: "MetaFashion", count: 42 },
  { id: "digitalcouture", label: "Digital Couture", count: 38 },
  { id: "cryptokicks", label: "CryptoKicks", count: 27 },
  { id: "virtualvogue", label: "VirtualVogue", count: 24 },
  { id: "blockchainThreads", label: "BlockchainThreads", count: 19 },
]

const rarities = [
  { id: "common", label: "Common", color: "bg-gray-400" },
  { id: "uncommon", label: "Uncommon", color: "bg-green-400" },
  { id: "rare", label: "Rare", color: "bg-blue-400" },
  { id: "epic", label: "Epic", color: "bg-purple-400" },
  { id: "legendary", label: "Legendary", color: "bg-amber-400" },
]

export default function MarketplaceFilters() {
  const [priceRange, setPriceRange] = useState([0, 10])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedDesigners, setSelectedDesigners] = useState<string[]>([])
  const [selectedRarities, setSelectedRarities] = useState<string[]>([])

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const toggleDesigner = (designerId: string) => {
    setSelectedDesigners((prev) =>
      prev.includes(designerId) ? prev.filter((id) => id !== designerId) : [...prev, designerId],
    )
  }

  const toggleRarity = (rarityId: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarityId) ? prev.filter((id) => id !== rarityId) : [...prev, rarityId],
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedDesigners([])
    setSelectedRarities([])
    setPriceRange([0, 10])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={clearAllFilters}>
          Clear All
        </Button>
      </div>

      {/* Selected filters */}
      {(selectedCategories.length > 0 || selectedDesigners.length > 0 || selectedRarities.length > 0) && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Selected Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((categoryId) => (
              <Badge key={categoryId} variant="secondary" className="gap-1">
                {categories.find((c) => c.id === categoryId)?.label}
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedDesigners.map((designerId) => (
              <Badge key={designerId} variant="secondary" className="gap-1">
                {designers.find((d) => d.id === designerId)?.label}
                <button
                  onClick={() => toggleDesigner(designerId)}
                  className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
            {selectedRarities.map((rarityId) => (
              <Badge key={rarityId} variant="secondary" className="gap-1">
                {rarities.find((r) => r.id === rarityId)?.label}
                <button
                  onClick={() => toggleRarity(rarityId)}
                  className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Accordion type="multiple" defaultValue={["price", "category", "designer", "rarity"]} className="w-full">
        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-sm font-medium">Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 10]}
                max={10}
                step={0.1}
                value={priceRange}
                onValueChange={setPriceRange}
                className="py-4"
              />
              <div className="flex items-center justify-between">
                <div className="p-2 border rounded-md">
                  <p className="text-xs text-muted-foreground">Min</p>
                  <p className="font-medium">{priceRange[0]} SOL</p>
                </div>
                <div className="p-2 border rounded-md">
                  <p className="text-xs text-muted-foreground">Max</p>
                  <p className="font-medium">{priceRange[1]} SOL</p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Categories */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm font-medium">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex items-center justify-between w-full text-sm cursor-pointer"
                  >
                    <span>{category.label}</span>
                    <span className="text-xs text-muted-foreground">({category.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Designers */}
        <AccordionItem value="designer">
          <AccordionTrigger className="text-sm font-medium">Designer</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {designers.map((designer) => (
                <div key={designer.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`designer-${designer.id}`}
                    checked={selectedDesigners.includes(designer.id)}
                    onCheckedChange={() => toggleDesigner(designer.id)}
                  />
                  <Label
                    htmlFor={`designer-${designer.id}`}
                    className="flex items-center justify-between w-full text-sm cursor-pointer"
                  >
                    <span>{designer.label}</span>
                    <span className="text-xs text-muted-foreground">({designer.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Rarity */}
        <AccordionItem value="rarity">
          <AccordionTrigger className="text-sm font-medium">Rarity</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {rarities.map((rarity) => (
                <div key={rarity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rarity-${rarity.id}`}
                    checked={selectedRarities.includes(rarity.id)}
                    onCheckedChange={() => toggleRarity(rarity.id)}
                  />
                  <Label
                    htmlFor={`rarity-${rarity.id}`}
                    className="flex items-center justify-between w-full text-sm cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", rarity.color)}></div>
                      <span>{rarity.label}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full">Apply Filters</Button>
    </div>
  )
}
