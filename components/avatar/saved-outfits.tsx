"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Clock, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SavedOutfit {
  id: number
  name: string
  preview: string
  items: number[]
  lastModified: string
}

interface SavedOutfitsProps {
  outfits: SavedOutfit[]
  onSave: (name: string) => void
  onLoad: (outfitId: number) => void
}

export default function SavedOutfits({ outfits, onSave, onLoad }: SavedOutfitsProps) {
  const [newOutfitName, setNewOutfitName] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null)

  const handleSave = () => {
    if (newOutfitName.trim()) {
      onSave(newOutfitName.trim())
      setNewOutfitName("")
      setIsDialogOpen(false)
    }
  }

  const handleOutfitClick = (outfitId: number) => {
    if (selectedOutfit === outfitId) {
      setSelectedOutfit(null)
    } else {
      setSelectedOutfit(outfitId)
      onLoad(outfitId)
    }
  }

  return (
    <div className="space-y-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" /> Save Current Outfit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Outfit</DialogTitle>
            <DialogDescription>Give your outfit a name to save it to your collection.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input placeholder="Outfit name" value={newOutfitName} onChange={(e) => setNewOutfitName(e.target.value)} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Outfit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-3">
        {outfits.length === 0 ? (
          <div className="p-4 text-center border rounded-lg">
            <p className="text-sm text-muted-foreground">No saved outfits yet.</p>
          </div>
        ) : (
          outfits.map((outfit) => (
            <Card
              key={outfit.id}
              className={cn(
                "overflow-hidden cursor-pointer transition-all hover:shadow-md",
                selectedOutfit === outfit.id && "ring-2 ring-primary",
              )}
              onClick={() => handleOutfitClick(outfit.id)}
            >
              <div className="grid grid-cols-[80px_1fr]">
                <div className="aspect-square">
                  <img
                    src={outfit.preview || "/placeholder.svg"}
                    alt={outfit.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium truncate">{outfit.name}</h3>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{outfit.lastModified}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{outfit.items.length} items</span>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
