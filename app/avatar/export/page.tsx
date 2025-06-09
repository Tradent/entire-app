"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

export default function AvatarExportPage() {
  const [exportProgress, setExportProgress] = useState<Record<string, number>>({
    decentraland: 0,
    sandbox: 0,
    cryptovoxels: 0,
    somnium: 0,
  })
  const [exportStatus, setExportStatus] = useState<Record<string, string>>({
    decentraland: "idle",
    sandbox: "idle",
    cryptovoxels: "idle",
    somnium: "idle",
  })
  const { toast } = useToast()

  const handleExport = (platform: string) => {
    setExportStatus((prev) => ({ ...prev, [platform]: "processing" }))

    // Simulate export process
    let progress = 0
    const interval = setInterval(() => {
      progress += 10
      setExportProgress((prev) => ({ ...prev, [platform]: progress }))

      if (progress >= 100) {
        clearInterval(interval)
        setExportStatus((prev) => ({ ...prev, [platform]: "completed" }))
        toast({
          title: "Export completed",
          description: `Your avatar has been exported to ${platform}.`,
        })
      }
    }, 500)
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/avatar">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Export Avatar</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Export Your Avatar to Metaverse Platforms</CardTitle>
          <CardDescription>
            Prepare your avatar and NFT combinations for use in different metaverse games.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-muted/30">
            <h3 className="mb-2 font-medium">Current Outfit</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src="/placeholder.svg?height=400&width=400&query=digital fashion avatar with neon jacket"
                  alt="Avatar Preview"
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <h4 className="font-medium">Cyberpunk Night</h4>
                <p className="text-sm text-muted-foreground mb-4">5 items equipped</p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Neon Dreams Jacket</span>
                    <Badge variant="outline">Outerwear</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Holographic Tee</span>
                    <Badge variant="outline">Top</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quantum Pants</span>
                    <Badge variant="outline">Bottom</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Quantum Sneakers</span>
                    <Badge variant="outline">Footwear</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Digital Glasses</span>
                    <Badge variant="outline">Accessory</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="decentraland">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="decentraland">Decentraland</TabsTrigger>
          <TabsTrigger value="sandbox">The Sandbox</TabsTrigger>
          <TabsTrigger value="cryptovoxels">Cryptovoxels</TabsTrigger>
          <TabsTrigger value="somnium">Somnium Space</TabsTrigger>
        </TabsList>

        <TabsContent value="decentraland" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Export to Decentraland</CardTitle>
                <Badge>Compatible</Badge>
              </div>
              <CardDescription>Prepare your avatar and NFTs for use in Decentraland.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Compatibility Notes</h3>
                <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                  <li>All items in your outfit are compatible with Decentraland</li>
                  <li>Neon effects will be preserved in the Decentraland environment</li>
                  <li>Avatar body type will be adjusted to match Decentraland standards</li>
                </ul>
              </div>

              {exportStatus.decentraland !== "idle" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Export Progress</span>
                    <span className="text-sm">{exportProgress.decentraland}%</span>
                  </div>
                  <Progress value={exportProgress.decentraland} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {exportStatus.decentraland === "processing"
                      ? "Converting and optimizing assets..."
                      : "Export completed successfully!"}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                onClick={() => handleExport("decentraland")}
                disabled={exportStatus.decentraland !== "idle"}
              >
                <Download className="w-4 h-4" />
                {exportStatus.decentraland === "idle"
                  ? "Export to Decentraland"
                  : exportStatus.decentraland === "processing"
                    ? "Exporting..."
                    : "Exported"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sandbox" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Export to The Sandbox</CardTitle>
                <Badge>Compatible</Badge>
              </div>
              <CardDescription>Prepare your avatar and NFTs for use in The Sandbox.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Compatibility Notes</h3>
                <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                  <li>All items in your outfit are compatible with The Sandbox</li>
                  <li>Items will be voxelized to match The Sandbox's art style</li>
                  <li>Some detailed textures may be simplified</li>
                </ul>
              </div>

              {exportStatus.sandbox !== "idle" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Export Progress</span>
                    <span className="text-sm">{exportProgress.sandbox}%</span>
                  </div>
                  <Progress value={exportProgress.sandbox} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {exportStatus.sandbox === "processing"
                      ? "Voxelizing and optimizing assets..."
                      : "Export completed successfully!"}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                onClick={() => handleExport("sandbox")}
                disabled={exportStatus.sandbox !== "idle"}
              >
                <Download className="w-4 h-4" />
                {exportStatus.sandbox === "idle"
                  ? "Export to The Sandbox"
                  : exportStatus.sandbox === "processing"
                    ? "Exporting..."
                    : "Exported"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="cryptovoxels" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Export to Cryptovoxels</CardTitle>
                <Badge variant="outline">Partial Compatibility</Badge>
              </div>
              <CardDescription>Prepare your avatar and NFTs for use in Cryptovoxels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Compatibility Notes</h3>
                <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                  <li>3 out of 5 items in your outfit are compatible with Cryptovoxels</li>
                  <li>Quantum Pants are not supported in Cryptovoxels</li>
                  <li>Some effects may be reduced due to platform limitations</li>
                </ul>
              </div>

              {exportStatus.cryptovoxels !== "idle" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Export Progress</span>
                    <span className="text-sm">{exportProgress.cryptovoxels}%</span>
                  </div>
                  <Progress value={exportProgress.cryptovoxels} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {exportStatus.cryptovoxels === "processing"
                      ? "Converting compatible assets..."
                      : "Export completed successfully!"}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full gap-2"
                onClick={() => handleExport("cryptovoxels")}
                disabled={exportStatus.cryptovoxels !== "idle"}
              >
                <Download className="w-4 h-4" />
                {exportStatus.cryptovoxels === "idle"
                  ? "Export to Cryptovoxels"
                  : exportStatus.cryptovoxels === "processing"
                    ? "Exporting..."
                    : "Exported"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="somnium" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Export to Somnium Space</CardTitle>
                <Badge variant="secondary">Incompatible</Badge>
              </div>
              <CardDescription>Your current outfit is not compatible with Somnium Space.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">Compatibility Issues</h3>
                <ul className="space-y-2 ml-5 list-disc text-muted-foreground">
                  <li>Somnium Space requires full avatar models rather than individual items</li>
                  <li>Current NFTs do not have Somnium Space compatible versions</li>
                  <li>Consider using Somnium Space native avatars instead</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" disabled>
                Not Available for Export
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
