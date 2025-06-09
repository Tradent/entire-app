"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Camera, Palette, Layers, Mountain, Plus } from "lucide-react"
import { NFTSelector } from "@/components/ar-try-on/nft-selector"
import { NFTVariantSelector } from "@/components/ar-try-on/nft-variant-selector"
import { FilterSelector } from "@/components/ar-try-on/filter-selector"
import { BackgroundSelector } from "@/components/ar-try-on/background-selector"
import { SceneBackgroundSelector } from "@/components/ar-try-on/scene-background-selector"
import { ARCanvasWithScene } from "@/components/ar-try-on/ar-canvas-with-scene"
import type { SceneBackground } from "@/services/ar-scene-backgrounds"
import { getCustomBackgroundsByUser, type CustomSceneBackground } from "@/services/custom-scene-backgrounds"

export default function ARTryOnPage() {
  // Add client-side rendering check
  const [isClient, setIsClient] = useState(false)

  const [selectedNFT, setSelectedNFT] = useState<string | undefined>()
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>()
  const [selectedFilter, setSelectedFilter] = useState<string | undefined>()
  const [selectedFashionFilter, setSelectedFashionFilter] = useState<string | undefined>()
  const [selectedBackground, setSelectedBackground] = useState<string | undefined>()
  const [selectedSceneBackground, setSelectedSceneBackground] = useState<SceneBackground | null>(null)
  const [activeTab, setActiveTab] = useState("nfts")
  const [customBackgrounds, setCustomBackgrounds] = useState<CustomSceneBackground[]>([])

  // Set isClient to true when component mounts
  useEffect(() => {
    setIsClient(true)

    // Mock user ID (in a real app, this would come from authentication)
    const userId = "user-123"

    // Only fetch custom backgrounds on client-side
    if (typeof window !== "undefined") {
      try {
        const backgrounds = getCustomBackgroundsByUser(userId)
        setCustomBackgrounds(backgrounds || [])
      } catch (error) {
        console.error("Error fetching custom backgrounds:", error)
        setCustomBackgrounds([])
      }
    }
  }, [])

  const handleSelectCustomBackground = (background: CustomSceneBackground) => {
    if (background) {
      setSelectedSceneBackground(background)
    }
  }

  // Return a loading state during server-side rendering
  if (!isClient) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">AR Try-On Experience</h1>
        <div className="flex items-center justify-center h-[480px] bg-gray-100 rounded-lg">
          <p className="text-gray-500">Loading AR experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">AR Try-On Experience</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-4">
              <ARCanvasWithScene
                selectedNFT={selectedNFT}
                selectedVariant={selectedVariant}
                selectedFilter={selectedFilter}
                selectedFashionFilter={selectedFashionFilter}
                selectedBackground={selectedSceneBackground}
                width={640}
                height={480}
              />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="nfts" className="flex flex-col items-center text-xs p-2">
                    <ImageIcon className="h-4 w-4 mb-1" />
                    NFTs
                  </TabsTrigger>
                  <TabsTrigger value="variants" className="flex flex-col items-center text-xs p-2">
                    <Layers className="h-4 w-4 mb-1" />
                    Variants
                  </TabsTrigger>
                  <TabsTrigger value="filters" className="flex flex-col items-center text-xs p-2">
                    <Palette className="h-4 w-4 mb-1" />
                    Filters
                  </TabsTrigger>
                  <TabsTrigger value="backgrounds" className="flex flex-col items-center text-xs p-2">
                    <Camera className="h-4 w-4 mb-1" />
                    BG
                  </TabsTrigger>
                  <TabsTrigger value="scenes" className="flex flex-col items-center text-xs p-2">
                    <Mountain className="h-4 w-4 mb-1" />
                    Scenes
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="nfts">
                  {isClient && <NFTSelector selectedNFT={selectedNFT} onSelectNFT={setSelectedNFT} />}
                </TabsContent>

                <TabsContent value="variants">
                  {isClient && (
                    <NFTVariantSelector
                      selectedNFT={selectedNFT}
                      selectedVariant={selectedVariant}
                      onSelectVariant={setSelectedVariant}
                    />
                  )}
                </TabsContent>

                <TabsContent value="filters">
                  {isClient && (
                    <FilterSelector
                      selectedFilter={selectedFilter}
                      onSelectFilter={setSelectedFilter}
                      selectedFashionFilter={selectedFashionFilter}
                      onSelectFashionFilter={setSelectedFashionFilter}
                    />
                  )}
                </TabsContent>

                <TabsContent value="backgrounds">
                  {isClient && (
                    <BackgroundSelector
                      selectedBackground={selectedBackground}
                      onSelectBackground={setSelectedBackground}
                    />
                  )}
                </TabsContent>

                <TabsContent value="scenes">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Scene Backgrounds</h3>
                      <Link href="/ar-try-on/custom-scenes">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <Plus className="h-3 w-3" />
                          Create Custom
                        </Button>
                      </Link>
                    </div>

                    {isClient && (
                      <SceneBackgroundSelector
                        selectedBackground={selectedSceneBackground}
                        onSelectBackground={setSelectedSceneBackground}
                      />
                    )}

                    {isClient && customBackgrounds && customBackgrounds.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2">Your Custom Backgrounds</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {customBackgrounds.slice(0, 4).map((background) => (
                            <Card
                              key={background.id}
                              className={`overflow-hidden cursor-pointer transition-all ${
                                selectedSceneBackground?.id === background.id
                                  ? "ring-2 ring-primary"
                                  : "hover:scale-105"
                              }`}
                              onClick={() => handleSelectCustomBackground(background)}
                            >
                              <div className="relative">
                                <img
                                  src={background.imageUrl || "/placeholder.svg"}
                                  alt={background.name || "Custom background"}
                                  className="w-full h-20 object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                                  <p className="text-xs font-medium text-white truncate">{background.name}</p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                        {customBackgrounds.length > 4 && (
                          <Link href="/ar-try-on/custom-scenes">
                            <Button variant="link" size="sm" className="mt-2 w-full">
                              View all custom backgrounds
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
