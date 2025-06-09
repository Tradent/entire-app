"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

// Mock data for the NFT preview
const getNFTPreviewData = (gameId: string, nftId: string) => {
  const nftData = {
    id: Number(nftId),
    name: "Neon Dreams Jacket",
    description: "A cyberpunk-inspired jacket with reactive neon patterns.",
    image: "/neon-city-slicker.png",
    gamePreview: "/placeholder.svg?height=600&width=600&query=avatar wearing neon jacket in virtual world",
    platform: gameId === "decentraland" ? "Decentraland" : "The Sandbox",
    compatibility: 100,
    features: ["Dynamic lighting", "Reactive to music", "Weather effects"],
    materials: ["Digital fabric", "Holographic trim", "Neon accents"],
  }

  return nftData
}

export default function NFTPreviewPage({ params }: { params: { id: string; nftId: string } }) {
  const nftData = getNFTPreviewData(params.id, params.nftId)
  const [previewAngle, setPreviewAngle] = useState(0)
  const [lightingLevel, setLightingLevel] = useState(50)
  const [animationSpeed, setAnimationSpeed] = useState(50)

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/games/${params.id}/manage`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          {nftData.name} in {nftData.platform}
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>3D Preview</CardTitle>
            <CardDescription>See how your NFT looks in {nftData.platform}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="aspect-square">
              <img
                src={nftData.gamePreview || "/placeholder.svg"}
                alt={`${nftData.name} in ${nftData.platform}`}
                className="object-cover w-full h-full"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Save Image
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compatibility Details</CardTitle>
              <CardDescription>Information about how this NFT works in {nftData.platform}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Compatibility Score</span>
                  <Badge variant={nftData.compatibility >= 90 ? "default" : "outline"}>{nftData.compatibility}%</Badge>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${nftData.compatibility}%` }}></div>
                </div>
              </div>

              <Tabs defaultValue="features">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="customize">Customize</TabsTrigger>
                </TabsList>
                <TabsContent value="features" className="space-y-4 pt-4">
                  <ul className="space-y-2">
                    {nftData.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="materials" className="space-y-4 pt-4">
                  <ul className="space-y-2">
                    {nftData.materials.map((material, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="customize" className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="preview-angle">Viewing Angle</Label>
                        <span className="text-sm text-muted-foreground">{previewAngle}°</span>
                      </div>
                      <Slider
                        id="preview-angle"
                        min={0}
                        max={360}
                        step={15}
                        value={[previewAngle]}
                        onValueChange={(value) => setPreviewAngle(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="lighting-level">Lighting Intensity</Label>
                        <span className="text-sm text-muted-foreground">{lightingLevel}%</span>
                      </div>
                      <Slider
                        id="lighting-level"
                        min={0}
                        max={100}
                        value={[lightingLevel]}
                        onValueChange={(value) => setLightingLevel(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="animation-speed">Animation Speed</Label>
                        <span className="text-sm text-muted-foreground">{animationSpeed}%</span>
                      </div>
                      <Slider
                        id="animation-speed"
                        min={0}
                        max={100}
                        value={[animationSpeed]}
                        onValueChange={(value) => setAnimationSpeed(value[0])}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Use in {nftData.platform}</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Technical Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Polygon Count</p>
                    <p className="text-sm text-muted-foreground">7,500 / 10,000 max</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Texture Size</p>
                    <p className="text-sm text-muted-foreground">1024x1024 px</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Animation Type</p>
                    <p className="text-sm text-muted-foreground">Skeletal + Shader</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">File Format</p>
                    <p className="text-sm text-muted-foreground">GLB / GLTF</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-2xl font-bold">More NFTs Compatible with {nftData.platform}</h2>
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4].map((id) => (
            <Link href={`/games/${params.id}/preview/${id}`} key={id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="aspect-square">
                  <img
                    src={`/placeholder.svg?height=300&width=300&query=digital fashion item ${id} in metaverse`}
                    alt={`Compatible NFT ${id}`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">Digital Fashion Item {id}</h3>
                  <p className="text-sm text-muted-foreground">100% Compatible</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
