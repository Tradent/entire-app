"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface NFT {
  id: number
  name: string
  image: string
  designer: string
  arReady: boolean
  category: string
}

interface NFTSelectorProps {
  nfts: NFT[]
  selectedId: number | null
  onSelect: (id: number | null) => void
  disabled?: boolean
}

// Map category to display name
const categoryDisplayNames: Record<string, string> = {
  headwear: "Hat/Headwear",
  eyewear: "Glasses/Eyewear",
  tops: "Top/Shirt",
  outerwear: "Jacket/Outerwear",
  bottoms: "Pants/Skirt",
  footwear: "Shoes/Footwear",
  accessories: "Accessories",
}

export function NFTSelector({ nfts, selectedId, onSelect, disabled = false }: NFTSelectorProps) {
  const handleSelect = (nft: NFT) => {
    if (disabled) return
    if (!nft.arReady) {
      return // Don't allow selection of non-AR-ready NFTs
    }
    if (selectedId === nft.id) {
      onSelect(null) // Deselect if already selected
    } else {
      onSelect(nft.id)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {nfts.filter((nft) => nft.arReady).length} AR-ready items available
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {nfts.map((nft) => (
          <Card
            key={nft.id}
            className={cn(
              "overflow-hidden transition-all",
              nft.arReady ? "cursor-pointer hover:shadow-md" : "opacity-50 cursor-not-allowed",
              selectedId === nft.id && "ring-2 ring-primary",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            onClick={() => handleSelect(nft)}
          >
            <div className="relative aspect-square">
              <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="object-cover w-full h-full" />
              {selectedId === nft.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              {!nft.arReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <Badge variant="secondary">Not AR-Ready</Badge>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 py-1 px-2">
                <Badge variant="outline" className="text-xs text-white border-white/50">
                  {categoryDisplayNames[nft.category] || nft.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate">{nft.name}</h3>
              <p className="text-xs text-muted-foreground">by {nft.designer}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default NFTSelector
