"use client"

import { useState } from "react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Check } from "lucide-react"
import {
  type SceneBackground,
  SceneBackgroundCategory,
  getAllSceneBackgroundCategories,
  getCategoryDisplayName,
  getSceneBackgroundsByCategory,
} from "@/services/ar-scene-backgrounds"

interface SceneBackgroundSelectorProps {
  selectedBackground: SceneBackground | null
  onSelectBackground: (background: SceneBackground) => void
}

export function SceneBackgroundSelector({ selectedBackground, onSelectBackground }: SceneBackgroundSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<SceneBackgroundCategory>(SceneBackgroundCategory.RUNWAY)
  const categories = getAllSceneBackgroundCategories()
  const backgrounds = getSceneBackgroundsByCategory(activeCategory)

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-2">Scene Backgrounds</h3>
      <Tabs
        defaultValue={activeCategory}
        onValueChange={(value) => setActiveCategory(value as SceneBackgroundCategory)}
      >
        <TabsList className="grid grid-cols-4 md:grid-cols-7 mb-4">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category} className="text-xs">
              {getCategoryDisplayName(category)}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <ScrollArea className="h-[220px] pr-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {getSceneBackgroundsByCategory(category).map((background) => (
                  <BackgroundCard
                    key={background.id}
                    background={background}
                    isSelected={selectedBackground?.id === background.id}
                    onSelect={() => onSelectBackground(background)}
                  />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

interface BackgroundCardProps {
  background: SceneBackground
  isSelected: boolean
  onSelect: () => void
}

function BackgroundCard({ background, isSelected, onSelect }: BackgroundCardProps) {
  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-primary" : "hover:scale-105"
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <Image
          src={background.imageUrl || "/placeholder.svg"}
          alt={background.name}
          width={300}
          height={150}
          className="w-full h-[100px] object-cover"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <CardContent className="p-2">
        <p className="text-sm font-medium truncate">{background.name}</p>
        <p className="text-xs text-muted-foreground truncate">{background.description}</p>
      </CardContent>
    </Card>
  )
}
