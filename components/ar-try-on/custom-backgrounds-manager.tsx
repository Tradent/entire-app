"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pencil, Trash2, Share2, Check } from "lucide-react"
import {
  type CustomSceneBackground,
  getCustomBackgroundsByUser,
  deleteCustomBackground,
  updateCustomBackground,
} from "@/services/custom-scene-backgrounds"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface CustomBackgroundsManagerProps {
  userId: string
  onSelectBackground: (background: CustomSceneBackground) => void
  onEditBackground: (background: CustomSceneBackground) => void
  selectedBackgroundId?: string
}

export function CustomBackgroundsManager({
  userId,
  onSelectBackground,
  onEditBackground,
  selectedBackgroundId,
}: CustomBackgroundsManagerProps) {
  const [backgrounds, setBackgrounds] = useState<CustomSceneBackground[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [backgroundToDelete, setBackgroundToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Load user's custom backgrounds
    const userBackgrounds = getCustomBackgroundsByUser(userId)
    setBackgrounds(userBackgrounds)
  }, [userId])

  const handleDelete = (backgroundId: string) => {
    setBackgroundToDelete(backgroundId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!backgroundToDelete) return

    const success = deleteCustomBackground(backgroundToDelete)
    if (success) {
      setBackgrounds(backgrounds.filter((bg) => bg.id !== backgroundToDelete))
      toast({
        title: "Background deleted",
        description: "Your custom background has been deleted",
      })
    } else {
      toast({
        title: "Error",
        description: "Failed to delete background",
        variant: "destructive",
      })
    }

    setDeleteDialogOpen(false)
    setBackgroundToDelete(null)
  }

  const togglePublic = (background: CustomSceneBackground) => {
    const updated = updateCustomBackground(background.id, {
      isPublic: !background.isPublic,
    })

    if (updated) {
      setBackgrounds(backgrounds.map((bg) => (bg.id === background.id ? updated : bg)))

      toast({
        title: updated.isPublic ? "Background shared" : "Background unshared",
        description: updated.isPublic
          ? "Your background is now visible to other users"
          : "Your background is now private",
      })
    }
  }

  if (backgrounds.length === 0) {
    return (
      <div className="text-center p-6 border rounded-lg">
        <p className="text-muted-foreground">You haven't created any custom backgrounds yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Your Custom Backgrounds</h3>

      <ScrollArea className="h-[300px]">
        <div className="grid grid-cols-2 gap-3 pr-4">
          {backgrounds.map((background) => (
            <Card
              key={background.id}
              className={`overflow-hidden cursor-pointer transition-all ${
                selectedBackgroundId === background.id ? "ring-2 ring-primary" : "hover:scale-105"
              }`}
            >
              <div className="relative">
                <img
                  src={background.imageUrl || "/placeholder.svg"}
                  alt={background.name}
                  className="w-full h-24 object-cover"
                />
                {selectedBackgroundId === background.id && (
                  <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-xs font-medium text-white truncate">{background.name}</p>
                </div>
              </div>
              <CardContent className="p-2 flex justify-between items-center">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditBackground(background)
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(background.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Button
                  variant={background.isPublic ? "default" : "outline"}
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    togglePublic(background)
                  }}
                >
                  <Share2 className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete background</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this custom background? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
