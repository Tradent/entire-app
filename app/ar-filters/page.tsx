"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import PhotoUploader from "@/components/ar-try-on/photo-uploader"
import ARCanvasWithFilters from "@/components/ar-try-on/ar-canvas-with-filters"
import { FilterSelector } from "@/components/ar-try-on/filter-selector"
import { BackgroundSelector } from "@/components/ar-try-on/background-selector"
import FilterPresetCreator from "@/components/ar-try-on/filter-preset-creator"
import { type Filter, type FilterPreset, filterPresets } from "@/services/ar-filters"

// Enhanced mock data for user's NFTs with variants
const userNFTs = [
  {
    id: 1,
    name: "Neon Dreams Jacket",
    image: "/neon-city-slicker.png",
    designer: "MetaFashion",
    arReady: true,
    category: "outerwear",
    variants: {
      color: ["Blue", "Red", "Black", "White"],
      size: ["S", "M", "L", "XL"],
      style: ["Classic", "Modern"],
    },
  },
  {
    id: 4,
    name: "Holographic Headpiece",
    image: "/ethereal-hologram-crown.png",
    designer: "VirtualVogue",
    arReady: true,
    category: "headwear",
    variants: {
      color: ["Purple", "Blue", "Green", "Gold"],
      style: ["Minimal", "Ornate"],
    },
  },
  {
    id: 3,
    name: "Quantum Sneakers",
    image: "/lumina-flux.png",
    designer: "CryptoKicks",
    arReady: true,
    category: "footwear",
    variants: {
      color: ["White", "Black", "Red", "Blue"],
      size: ["US 7", "US 8", "US 9", "US 10", "US 11"],
    },
  },
]

export default function ARFiltersPage() {
  // Add a client-side rendering check
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [isConnected, setIsConnected] = useState(true)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [videoMode, setVideoMode] = useState(false)
  const [activeTab, setActiveTab] = useState("filters")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [customBackground, setCustomBackground] = useState<string | null>(null)
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>([])
  const { toast } = useToast()

  // Initialize savedPresets after component mounts
  useEffect(() => {
    setSavedPresets([...filterPresets])
  }, [])

  // NFT state
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null)
  const [nftTransform, setNftTransform] = useState({
    x: 50,
    y: 50,
    scale: 100,
    rotation: 0,
    opacity: 100,
    brightness: 100,
    contrast: 100,
  })

  // Filter state - initialize with empty object to prevent undefined errors
  const [activeFilters, setActiveFilters] = useState<{
    color?: { filter: Filter; intensity: number }
    artistic?: { filter: Filter; intensity: number }
    environment?: { filter: Filter; intensity: number }
    background?: { filter: Filter; intensity: number }
    lighting?: { filter: Filter; intensity: number }
  }>({})

  const handlePhotoUpload = (url: string) => {
    setPhotoURL(url)
    setVideoMode(false)
  }

  const handleSelectFilter = (filter: Filter, type: string, intensity: number) => {
    setActiveFilters((prev) => ({
      ...prev,
      [type]: { filter, intensity },
    }))
  }

  const handleClearFilters = () => {
    setActiveFilters({})
    setCustomBackground(null)
  }

  const handleSelectPreset = (preset: FilterPreset) => {
    // Convert preset to active filters
    const newFilters: typeof activeFilters = {}

    if (preset && preset.filters) {
      preset.filters.forEach((item) => {
        // Find the filter in our categories
        const filterType = item.filterId.split("-")[0] || "color"

        // Find the actual filter object
        const filterObj = {
          id: item.filterId,
          name: item.filterId,
          thumbnail: "",
          type: filterType as any,
        }

        newFilters[filterType as keyof typeof activeFilters] = {
          filter: filterObj,
          intensity: item.intensity,
        }
      })

      setActiveFilters(newFilters)

      toast({
        title: "Preset Applied",
        description: `Applied "${preset.name}" preset to your image.`,
      })
    }
  }

  const handleSavePreset = (preset: FilterPreset) => {
    setSavedPresets((prev) => [preset, ...prev])

    toast({
      title: "Preset Saved",
      description: `"${preset.name}" has been saved to your presets.`,
    })
  }

  const handleSelectBackground = (url: string | null) => {
    setCustomBackground(url)

    // If a background is selected, add a background filter if none exists
    if (url && (!activeFilters.background || activeFilters.background?.filter?.id === "none")) {
      setActiveFilters((prev) => ({
        ...prev,
        background: {
          filter: {
            id: "replace",
            name: "Replace",
            thumbnail: "/filters/replace-bg.png",
            type: "background",
          },
          intensity: 1.0,
        },
      }))
    }
  }

  const handleSelectBackgroundColor = (color: string) => {
    if (typeof window === "undefined") return // Skip on server

    // Create a solid color background
    const canvas = document.createElement("canvas")
    canvas.width = 100
    canvas.height = 100
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.fillStyle = color
      ctx.fillRect(0, 0, 100, 100)
      setCustomBackground(canvas.toDataURL())

      // Set the background filter to solid
      setActiveFilters((prev) => ({
        ...prev,
        background: {
          filter: {
            id: "solid",
            name: "Solid Color",
            thumbnail: "/filters/solid-bg.png",
            type: "background",
            params: { color },
          },
          intensity: 1.0,
        },
      }))
    }
  }

  const handleUploadBackground = (file: File) => {
    if (typeof window === "undefined") return // Skip on server

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        setCustomBackground(e.target.result as string)

        // Set the background filter to replace
        setActiveFilters((prev) => ({
          ...prev,
          background: {
            filter: {
              id: "replace",
              name: "Replace",
              thumbnail: "/filters/replace-bg.png",
              type: "background",
            },
            intensity: 1.0,
          },
        }))
      }
    }
    reader.readAsDataURL(file)
  }

  // Return a loading state or null during server-side rendering
  if (!isClient) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <p>Loading AR Filters...</p>
      </div>
    )
  }

  return (
    <>
      <div className="container relative flex flex-col items-center justify-center space-y-10 pb-10">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">AR Filter Playground</h1>
          <p className="text-muted-foreground text-sm">Experiment with AR filters and virtual try-on features.</p>
        </div>

        <div className="flex w-full max-w-4xl space-x-4">
          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>NFT Selection</CardTitle>
              <CardDescription>Choose an NFT to try on virtually.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="nft-select"
                  className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Select NFT
                </label>
                <select
                  id="nft-select"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  onChange={(e) => setSelectedNFT(Number.parseInt(e.target.value))}
                >
                  <option value="">Select an NFT</option>
                  {userNFTs.map((nft) => (
                    <option key={nft.id} value={nft.id}>
                      {nft.name} - {nft.designer}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="nft-transform"
                  className="text-right text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Transform NFT
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="X"
                    className="flex h-10 w-1/4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={nftTransform.x}
                    onChange={(e) => setNftTransform({ ...nftTransform, x: Number.parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    className="flex h-10 w-1/4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={nftTransform.y}
                    onChange={(e) => setNftTransform({ ...nftTransform, y: Number.parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Scale"
                    className="flex h-10 w-1/4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={nftTransform.scale}
                    onChange={(e) => setNftTransform({ ...nftTransform, scale: Number.parseInt(e.target.value) })}
                  />
                  <input
                    type="number"
                    placeholder="Rotation"
                    className="flex h-10 w-1/4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={nftTransform.rotation}
                    onChange={(e) => setNftTransform({ ...nftTransform, rotation: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Apply Transform</Button>
            </CardFooter>
          </Card>

          <Card className="w-1/2">
            <CardHeader>
              <CardTitle>Upload Photo</CardTitle>
              <CardDescription>Upload or capture a photo to apply filters to.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <PhotoUploader
                onPhotoUpload={handlePhotoUpload}
                setVideoMode={setVideoMode}
                setPreviewImage={setPreviewImage}
              />
            </CardContent>
            <CardFooter>
              <Button>Apply Photo</Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="filters" className="w-full max-w-4xl" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="create">Create Preset</TabsTrigger>
          </TabsList>
          <TabsContent value="filters">
            <FilterSelector
              activeFilters={activeFilters}
              onSelectFilter={handleSelectFilter}
              onClearFilters={handleClearFilters}
            />
          </TabsContent>
          <TabsContent value="background">
            <BackgroundSelector
              onSelectBackground={handleSelectBackground}
              onSelectBackgroundColor={handleSelectBackgroundColor}
              onUploadBackground={handleUploadBackground}
            />
          </TabsContent>
          <TabsContent value="presets">
            <div className="grid gap-4">
              <h3 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Saved Presets
              </h3>
              <p className="text-muted-foreground">Apply a saved preset to quickly apply a set of filters.</p>
              <div className="flex flex-wrap gap-4">
                {savedPresets &&
                  savedPresets.map((preset, index) => (
                    <Button key={index} variant="outline" onClick={() => handleSelectPreset(preset)}>
                      {preset.name}
                    </Button>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="create">
            <FilterPresetCreator activeFilters={activeFilters} onSavePreset={handleSavePreset} />
          </TabsContent>
        </Tabs>

        <div className="relative w-full max-w-2xl">
          <ARCanvasWithFilters
            photoURL={photoURL}
            videoMode={videoMode}
            activeFilters={activeFilters || {}}
            customBackground={customBackground}
            selectedNFT={selectedNFT}
            nftTransform={nftTransform}
            userNFTs={userNFTs}
          />
        </div>
      </div>
    </>
  )
}
