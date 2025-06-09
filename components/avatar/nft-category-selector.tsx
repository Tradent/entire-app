"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface NFT {
  id: number
  name: string
  image: string
  designer: string
  compatible: string[]
}

interface NFTCategorySelectorProps {
  nfts: NFT[]
  selectedId: number | null
  onSelect: (id: number | null) => void
}

export default function NFTCategorySelector({ nfts, selectedId, onSelect }: NFTCategorySelectorProps) {
  const handleSelect = (id: number) => {
    if (selectedId === id) {
      onSelect(null) // Deselect if already selected
    } else {
      onSelect(id)
    }
  }

  const handleClear = () => {
    onSelect(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{nfts.length} items available</p>
        {selectedId !== null && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" /> Clear selection
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {nfts.map((nft) => (
          <Card
            key={nft.id}
            className={cn(
              "overflow-hidden cursor-pointer transition-all hover:shadow-md",
              selectedId === nft.id && "ring-2 ring-primary",
            )}
            onClick={() => handleSelect(nft.id)}
          >
            <div className="relative aspect-square">
              <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="object-cover w-full h-full" />
              {selectedId === nft.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{nft.name}</h3>
              <p className="text-xs text-muted-foreground">by {nft.designer}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {nft.compatible.map((platform) => (
                  <Badge key={platform} variant="secondary" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
