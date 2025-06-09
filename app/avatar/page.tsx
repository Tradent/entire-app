"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Share2, Undo, Redo, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AvatarPreview from "@/components/avatar/avatar-preview"
import NFTCategorySelector from "@/components/avatar/nft-category-selector"
import AvatarCustomizer from "@/components/avatar/avatar-customizer"
import SavedOutfits from "@/components/avatar/saved-outfits"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useToast } from "@/hooks/use-toast"

// Mock data for user's NFTs by category
const userNFTs = {
  outerwear: [
    {
      id: 1,
      name: "Neon Dreams Jacket",
      image: "/neon-city-slicker.png",
      designer: "MetaFashion",
      compatible: ["decentraland", "sandbox", "cryptovoxels"],
    },
    {
      id: 5,
      name: "Digital Denim Jacket",
      image: "/glowing-denim.png",
      designer: "BlockchainThreads",
      compatible: ["decentraland", "sandbox"],
    },
  ],
  tops: [
    {
      id: 8,
      name: "Holographic Tee",
      image: "/digital-threads.png",
      designer: "VirtualVogue",
      compatible: ["decentraland", "sandbox", "cryptovoxels"],
    },
    {
      id: 9,
      name: "Reactive Light Shirt",
      image: "/reactive-light-shirt.png",
      designer: "MetaFashion",
      compatible: ["decentraland", "cryptovoxels"],
    },
  ],
  bottoms: [
    {
      id: 10,
      name: "Quantum Pants",
      image: "/circuit-weave-pants.png",
      designer: "CryptoKicks",
      compatible: ["decentraland", "sandbox"],
    },
    {
      id: 11,
      name: "Nebula Skirt",
      image: "/cosmic-flow.png",
      designer: "Digital Couture",
      compatible: ["decentraland", "cryptovoxels"],
    },
  ],
  footwear: [
    {
      id: 3,
      name: "Quantum Sneakers",
      image: "/lumina-flux.png",
      designer: "CryptoKicks",
      compatible: ["decentraland", "sandbox", "cryptovoxels"],
    },
    {
      id: 6,
      name: "Crystal Boots",
      image: "/placeholder.svg?height=400&width=400&query=transparent crystal boots digital fashion",
      designer: "MetaFashion",
      compatible: ["decentraland", "sandbox"],
    },
  ],
  accessories: [
    {
      id: 4,
      name: "Holographic Headpiece",
      image: "/ethereal-hologram-crown.png",
      designer: "VirtualVogue",
      compatible: ["decentraland", "cryptovoxels"],
    },
    {
      id: 12,
      name: "Digital Glasses",
      image: "/placeholder.svg?height=400&width=400&query=futuristic digital glasses",
      designer: "BlockchainThreads",
      compatible: ["decentraland", "sandbox", "cryptovoxels"],
    },
  ],
}

// Mock data for saved outfits
const savedOutfitsMock = [
  {
    id: 1,
    name: "Cyberpunk Night",
    preview: "/placeholder.svg?height=400&width=400&query=cyberpunk avatar outfit with neon jacket",
    items: [1, 8, 10, 3, 12],
    lastModified: "2 days ago",
  },
  {
    id: 2,
    name: "Digital Elegance",
    preview: "/placeholder.svg?height=400&width=400&query=elegant digital fashion avatar outfit",
    items: [5, 9, 11, 6, 4],
    lastModified: "1 week ago",
  },
]

export default function AvatarBuilderPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [selectedNFTs, setSelectedNFTs] = useState<Record<string, number | null>>({
    outerwear: null,
    tops: null,
    bottoms: null,
    footwear: null,
    accessories: null,
  })
  const [avatarCustomization, setAvatarCustomization] = useState({
    bodyType: "a",
    skinTone: "#e0c8b0",
    hairStyle: "short",
    hairColor: "#3a3a3a",
  })
  const [savedOutfits, setSavedOutfits] = useState(savedOutfitsMock)
  const [history, setHistory] = useState<Array<Record<string, number | null>>>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const { toast } = useToast()

  // Toggle connection state for demo purposes
  const toggleConnection = () => {
    setIsConnected(!isConnected)
  }

  // Add to history when selections change
  useEffect(() => {
    if (JSON.stringify(selectedNFTs) !== JSON.stringify(history[historyIndex])) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({ ...selectedNFTs })
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
  }, [selectedNFTs])

  const handleSelectNFT = (category: string, nftId: number | null) => {
    setSelectedNFTs((prev) => ({
      ...prev,
      [category]: nftId,
    }))
  }

  const handleAvatarCustomizationChange = (key: string, value: string) => {
    setAvatarCustomization((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setSelectedNFTs(history[historyIndex - 1])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setSelectedNFTs(history[historyIndex + 1])
    }
  }

  const handleSaveOutfit = (name: string) => {
    const newOutfit = {
      id: savedOutfits.length + 1,
      name,
      preview: "/placeholder.svg?height=400&width=400&query=digital fashion avatar outfit",
      items: Object.values(selectedNFTs).filter((id) => id !== null) as number[],
      lastModified: "Just now",
    }

    setSavedOutfits([newOutfit, ...savedOutfits])
    toast({
      title: "Outfit saved",
      description: `"${name}" has been saved to your collection.`,
    })
  }

  const handleLoadOutfit = (outfitId: number) => {
    const outfit = savedOutfits.find((o) => o.id === outfitId)
    if (!outfit) return

    const newSelectedNFTs = { ...selectedNFTs }

    // Reset all selections
    Object.keys(newSelectedNFTs).forEach((key) => {
      newSelectedNFTs[key] = null
    })

    // Set the items from the outfit
    outfit.items.forEach((itemId) => {
      // Find which category this item belongs to
      for (const [category, items] of Object.entries(userNFTs)) {
        const found = items.find((item) => item.id === itemId)
        if (found) {
          newSelectedNFTs[category] = itemId
          break
        }
      }
    })

    setSelectedNFTs(newSelectedNFTs)
  }

  const handleScreenshot = () => {
    toast({
      title: "Screenshot captured",
      description: "Your avatar image has been saved to your gallery.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Opening share dialog for your avatar.",
    })
  }

  if (!isConnected) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/games">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Avatar Builder</h1>
        </div>

        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access your NFTs and customize your metaverse avatar.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="mb-6 text-center">
              <p className="mb-4 text-muted-foreground">
                Connect your wallet to view and customize your avatar with your fashion NFTs.
              </p>
              <div onClick={toggleConnection}>
                <ConnectWalletButton />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Avatar Builder</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-8">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Avatar Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleUndo} disabled={historyIndex <= 0} title="Undo">
                    <Undo className="w-4 h-4" />
                    <span className="sr-only">Undo</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRedo}
                    disabled={historyIndex >= history.length - 1}
                    title="Redo"
                  >
                    <Redo className="w-4 h-4" />
                    <span className="sr-only">Redo</span>
                  </Button>
                </div>
              </div>
              <CardDescription>Preview how your NFTs will look when combined on your avatar.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-square bg-muted/30">
                <AvatarPreview
                  selectedNFTs={selectedNFTs}
                  userNFTs={userNFTs}
                  avatarCustomization={avatarCustomization}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleScreenshot}>
                  <Camera className="w-4 h-4" />
                  Screenshot
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
              <Button size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Export to Games
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Fashion NFTs</CardTitle>
              <CardDescription>Select items to add to your avatar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="outerwear">
                <TabsList className="grid grid-cols-5">
                  <TabsTrigger value="outerwear">Outerwear</TabsTrigger>
                  <TabsTrigger value="tops">Tops</TabsTrigger>
                  <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                  <TabsTrigger value="footwear">Footwear</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                </TabsList>
                <TabsContent value="outerwear" className="mt-4">
                  <NFTCategorySelector
                    nfts={userNFTs.outerwear}
                    selectedId={selectedNFTs.outerwear}
                    onSelect={(id) => handleSelectNFT("outerwear", id)}
                  />
                </TabsContent>
                <TabsContent value="tops" className="mt-4">
                  <NFTCategorySelector
                    nfts={userNFTs.tops}
                    selectedId={selectedNFTs.tops}
                    onSelect={(id) => handleSelectNFT("tops", id)}
                  />
                </TabsContent>
                <TabsContent value="bottoms" className="mt-4">
                  <NFTCategorySelector
                    nfts={userNFTs.bottoms}
                    selectedId={selectedNFTs.bottoms}
                    onSelect={(id) => handleSelectNFT("bottoms", id)}
                  />
                </TabsContent>
                <TabsContent value="footwear" className="mt-4">
                  <NFTCategorySelector
                    nfts={userNFTs.footwear}
                    selectedId={selectedNFTs.footwear}
                    onSelect={(id) => handleSelectNFT("footwear", id)}
                  />
                </TabsContent>
                <TabsContent value="accessories" className="mt-4">
                  <NFTCategorySelector
                    nfts={userNFTs.accessories}
                    selectedId={selectedNFTs.accessories}
                    onSelect={(id) => handleSelectNFT("accessories", id)}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Customization</CardTitle>
              <CardDescription>Customize your base avatar appearance.</CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarCustomizer customization={avatarCustomization} onChange={handleAvatarCustomizationChange} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Saved Outfits</CardTitle>
              <CardDescription>Save and load your favorite outfit combinations.</CardDescription>
            </CardHeader>
            <CardContent>
              <SavedOutfits outfits={savedOutfits} onSave={handleSaveOutfit} onLoad={handleLoadOutfit} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Platform Compatibility</CardTitle>
              <CardDescription>Check where your outfit can be used.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Decentraland</span>
                  </div>
                  <Badge variant="outline">Compatible</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>The Sandbox</span>
                  </div>
                  <Badge variant="outline">Compatible</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Cryptovoxels</span>
                  </div>
                  <Badge variant="outline">Partial</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Somnium Space</span>
                  </div>
                  <Badge variant="outline">Incompatible</Badge>
                </div>

                <div className="p-3 mt-4 text-sm border rounded-md bg-muted/50">
                  <p>
                    Some items in your outfit may need conversion to work properly in certain platforms. Use the Export
                    button to prepare your outfit for use in games.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
