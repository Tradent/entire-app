"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, ImageIcon, Palette } from "lucide-react"

interface BackgroundSelectorProps {
  onSelectBackground: (url: string | null) => void
  onSelectColor: (color: string) => void
  onUploadBackground: (file: File) => void
}

export function BackgroundSelector({ onSelectBackground, onSelectColor, onUploadBackground }: BackgroundSelectorProps) {
  const [activeTab, setActiveTab] = useState("images")

  // Predefined backgrounds
  const backgrounds = [
    { id: "none", url: null, name: "None" },
    { id: "studio", url: "/backgrounds/studio.jpg", name: "Studio" },
    { id: "urban", url: "/backgrounds/urban.jpg", name: "Urban" },
    { id: "nature", url: "/backgrounds/nature.jpg", name: "Nature" },
    { id: "futuristic", url: "/backgrounds/futuristic.jpg", name: "Futuristic" },
    { id: "cyberpunk", url: "/backgrounds/cyberpunk.jpg", name: "Cyberpunk" },
    { id: "gradient1", url: "/backgrounds/gradient1.jpg", name: "Gradient 1" },
    { id: "gradient2", url: "/backgrounds/gradient2.jpg", name: "Gradient 2" },
  ]

  // Predefined colors
  const colors = [
    { id: "black", value: "#000000", name: "Black" },
    { id: "white", value: "#FFFFFF", name: "White" },
    { id: "gray", value: "#808080", name: "Gray" },
    { id: "red", value: "#FF0000", name: "Red" },
    { id: "green", value: "#00FF00", name: "Green" },
    { id: "blue", value: "#0000FF", name: "Blue" },
    { id: "cyan", value: "#00FFFF", name: "Cyan" },
    { id: "magenta", value: "#FF00FF", name: "Magenta" },
    { id: "yellow", value: "#FFFF00", name: "Yellow" },
    { id: "purple", value: "#800080", name: "Purple" },
    { id: "orange", value: "#FFA500", name: "Orange" },
    { id: "pink", value: "#FFC0CB", name: "Pink" },
  ]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUploadBackground(file)
    }
  }

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="images" className="flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            <span>Images</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-1">
            <Palette className="w-3 h-3" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center gap-1">
            <Upload className="w-3 h-3" />
            <span>Upload</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="images" className="space-y-4">
          <ScrollArea className="h-[220px] pr-4">
            <div className="grid grid-cols-2 gap-2">
              {backgrounds.map((bg) => (
                <div
                  key={bg.id}
                  className="rounded-md overflow-hidden cursor-pointer border hover:border-primary transition-all"
                  onClick={() => onSelectBackground(bg.url)}
                >
                  <div className="aspect-video bg-muted relative">
                    {bg.url ? (
                      <img src={bg.url || "/placeholder.svg"} alt={bg.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        No Background
                      </div>
                    )}
                  </div>
                  <div className="p-1 text-center bg-muted/50">
                    <p className="text-xs font-medium">{bg.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <div
                key={color.id}
                className="rounded-md overflow-hidden cursor-pointer border hover:border-primary transition-all"
                onClick={() => onSelectColor(color.value)}
              >
                <div className="aspect-square" style={{ backgroundColor: color.value }} />
                <div className="p-1 text-center bg-muted/50">
                  <p className="text-xs font-medium">{color.name}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed rounded-md p-6 text-center">
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="rounded-full bg-muted p-3">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Upload a background image</p>
                <p className="text-xs text-muted-foreground">Drag and drop or click to browse</p>
              </div>
              <input
                type="file"
                id="background-upload"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("background-upload")?.click()}>
                Choose File
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BackgroundSelector
