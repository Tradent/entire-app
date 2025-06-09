"use client"

import { useState, useRef, Suspense, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RotateCw, ZoomIn, Maximize2, Download, Share2, Lightbulb, Ruler, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import NFTViewer3D from "@/components/marketplace/nft-viewer-3d"
import BodyMeasurementsPanel, { type BodyMeasurement } from "@/components/marketplace/body-measurements-panel"
import MeasurementComparison from "@/components/marketplace/measurement-comparison"
import type { Measurement } from "@/components/marketplace/measurement-tools"

// Mock data for the NFT details
const getNFTById = (id: string) => {
  return {
    id: Number.parseInt(id),
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    price: "2.5 SOL",
    modelUrl: "/assets/3d/duck.glb", // Using the duck as a placeholder
    textureUrl: "/assets/3d/texture_earth.jpg", // Using the earth texture as a placeholder
    badge: "New Release",
    rarity: "Rare",
    description:
      "The Neon Dreams Jacket is a statement piece for the digital age. Featuring dynamic light patterns that respond to music and movement, this virtual garment is perfect for metaverse events and digital fashion showcases.",
    features: [
      "Reactive light patterns",
      "Custom color options",
      "Compatible with major metaverse platforms",
      "Includes 3D model for AR try-on",
    ],
    materials: ["Digital Neon Fabric", "Holographic Trim", "Reactive Light Elements"],
    compatiblePlatforms: ["Decentraland", "The Sandbox", "Cryptovoxels"],
    polygonCount: "7,500",
    textureResolution: "2048x2048",
    fileFormat: "GLB/GLTF",
    animationType: "Dynamic",
    sizingInfo: {
      chest: { min: 90, max: 110 },
      waist: { min: 75, max: 95 },
      hips: { min: 90, max: 110 },
      length: { min: 65, max: 75 },
      shoulder: { min: 42, max: 48 },
      sleeve: { min: 60, max: 70 },
    },
  }
}

// Default body measurements
const defaultBodyMeasurements: BodyMeasurement[] = [
  { id: "chest", name: "Chest", value: 100 },
  { id: "waist", name: "Waist", value: 80 },
  { id: "hips", name: "Hips", value: 100 },
  { id: "inseam", name: "Inseam", value: 80 },
  { id: "shoulder", name: "Shoulder Width", value: 45 },
  { id: "sleeve", name: "Sleeve Length", value: 65 },
]

export default function NFT3DViewerPage({ params }: { params: { id: string } }) {
  const nft = getNFTById(params.id)
  const [activeTab, setActiveTab] = useState<"view" | "measure" | "body">("view")
  const [autoRotate, setAutoRotate] = useState(true)
  const [environment, setEnvironment] = useState("studio")
  const [lightIntensity, setLightIntensity] = useState(1)
  const [zoom, setZoom] = useState(5)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [measurements, setMeasurements] = useState<Measurement[]>([])
  const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>(defaultBodyMeasurements)
  const [isComparing, setIsComparing] = useState(false)
  const viewerContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Disable auto-rotate when in measurement mode
  useEffect(() => {
    if (activeTab === "measure") {
      setAutoRotate(false)
    }
  }, [activeTab])

  const handleFullscreen = () => {
    if (!viewerContainerRef.current) return

    if (!document.fullscreenElement) {
      viewerContainerRef.current.requestFullscreen().catch((err) => {
        toast({
          title: "Fullscreen error",
          description: `Error attempting to enable fullscreen: ${err.message}`,
        })
      })
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Your 3D model is being prepared for download.",
    })
  }

  const handleShare = () => {
    toast({
      title: "Share options",
      description: "Opening share dialog for this 3D NFT.",
    })
  }

  const handleMeasurementComplete = (measurement: Measurement) => {
    setMeasurements([...measurements, measurement])
    toast({
      title: "Measurement added",
      description: `${measurement.name} has been added (${measurement.distance.toFixed(2)} cm).`,
    })
  }

  const handleDeleteMeasurement = (id: string) => {
    setMeasurements(measurements.filter((m) => m.id !== id))
    toast({
      title: "Measurement deleted",
      description: "The measurement has been removed.",
    })
  }

  const handleSaveBodyMeasurements = (updatedMeasurements: BodyMeasurement[]) => {
    setBodyMeasurements(updatedMeasurements)
  }

  const handleCompareMeasurements = (bodyMeasurements: BodyMeasurement[]) => {
    setIsComparing(true)
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href={`/marketplace/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{nft.title} - 3D View</h1>
        <Badge className="ml-auto">{nft.badge}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardHeader className="p-4">
              <div className="flex items-center justify-between">
                <CardTitle>3D Model Viewer</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handleFullscreen} title="Fullscreen">
                    <Maximize2 className="w-4 h-4" />
                    <span className="sr-only">Fullscreen</span>
                  </Button>
                </div>
              </div>
              <CardDescription>
                {activeTab === "view"
                  ? "Interact with the 3D model to view from all angles"
                  : activeTab === "measure"
                    ? "Click on the model to place measurement points"
                    : "Compare your body measurements with the item"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div ref={viewerContainerRef} className="aspect-square bg-muted/30 relative">
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center w-full h-full">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-t-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                        <p className="mt-4 text-sm text-muted-foreground">Loading 3D model...</p>
                      </div>
                    </div>
                  }
                >
                  <NFTViewer3D
                    modelUrl={nft.modelUrl}
                    textureUrl={nft.textureUrl}
                    autoRotate={autoRotate && activeTab !== "measure"}
                    environment={environment}
                    lightIntensity={lightIntensity}
                    zoom={zoom}
                    measurementMode={activeTab === "measure"}
                    onMeasurementComplete={handleMeasurementComplete}
                    measurements={measurements}
                    onDeleteMeasurement={handleDeleteMeasurement}
                  />
                </Suspense>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "view" | "measure" | "body")}>
                <TabsList>
                  <TabsTrigger value="view">View</TabsTrigger>
                  <TabsTrigger value="measure">Measure</TabsTrigger>
                  <TabsTrigger value="body">Body Fit</TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
                <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
              </div>
            </CardFooter>
          </Card>

          {activeTab === "measure" && (
            <Card>
              <CardHeader>
                <CardTitle>Measurements</CardTitle>
                <CardDescription>Click on the model to create measurements between two points</CardDescription>
              </CardHeader>
              <CardContent>
                {measurements.length === 0 ? (
                  <div className="p-4 text-center border rounded-lg">
                    <p className="text-muted-foreground">No measurements yet. Click on the model to start measuring.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {measurements.map((measurement) => (
                      <div key={measurement.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: measurement.color }}></div>
                          <input
                            type="text"
                            value={measurement.name}
                            onChange={(e) => {
                              const updatedMeasurements = measurements.map((m) =>
                                m.id === measurement.id ? { ...m, name: e.target.value } : m,
                              )
                              setMeasurements(updatedMeasurements)
                            }}
                            className="border-none bg-transparent focus:outline-none focus:ring-0 p-0"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{measurement.distance.toFixed(2)} cm</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteMeasurement(measurement.id)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setMeasurements([])}
                      disabled={measurements.length === 0}
                    >
                      Clear All Measurements
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "body" && (
            <Card>
              <CardHeader>
                <CardTitle>Body Measurements</CardTitle>
                <CardDescription>Compare your body measurements with this item</CardDescription>
              </CardHeader>
              <CardContent>
                {isComparing ? (
                  <div className="space-y-4">
                    <MeasurementComparison bodyMeasurements={bodyMeasurements} itemMeasurements={measurements} />
                    <Button variant="outline" className="w-full" onClick={() => setIsComparing(false)}>
                      Back to Body Measurements
                    </Button>
                  </div>
                ) : (
                  <BodyMeasurementsPanel
                    measurements={bodyMeasurements}
                    onSaveMeasurements={handleSaveBodyMeasurements}
                    onCompareMeasurements={handleCompareMeasurements}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "view" && (
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
                <CardDescription>Details about this 3D fashion NFT</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Polygon Count</p>
                    <p className="text-sm text-muted-foreground">{nft.polygonCount}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Texture Resolution</p>
                    <p className="text-sm text-muted-foreground">{nft.textureResolution}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">File Format</p>
                    <p className="text-sm text-muted-foreground">{nft.fileFormat}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm font-medium">Animation Type</p>
                    <p className="text-sm text-muted-foreground">{nft.animationType}</p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Materials</h3>
                  <ul className="space-y-2">
                    {nft.materials.map((material, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span>{material}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Compatible Platforms</h3>
                  <div className="flex flex-wrap gap-2">
                    {nft.compatiblePlatforms.map((platform, index) => (
                      <Badge key={index} variant="outline">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Viewer Controls</CardTitle>
              <CardDescription>Customize your viewing experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="auto-rotate" className="text-sm font-medium">
                    Auto-Rotate
                  </label>
                  <Button
                    variant={autoRotate ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoRotate(!autoRotate)}
                    disabled={activeTab === "measure"}
                  >
                    <RotateCw className="w-4 h-4 mr-2" />
                    {autoRotate ? "On" : "Off"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="environment" className="text-sm font-medium">
                    Environment
                  </label>
                  <Select value={environment} onValueChange={setEnvironment}>
                    <SelectTrigger id="environment" className="w-[180px]">
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="city">City</SelectItem>
                      <SelectItem value="dawn">Dawn</SelectItem>
                      <SelectItem value="night">Night</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="forest">Forest</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="sunset">Sunset</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-muted-foreground" />
                    <label htmlFor="light-intensity" className="text-sm font-medium">
                      Light Intensity
                    </label>
                  </div>
                  <span className="text-sm text-muted-foreground">{lightIntensity.toFixed(1)}</span>
                </div>
                <Slider
                  id="light-intensity"
                  min={0}
                  max={2}
                  step={0.1}
                  value={[lightIntensity]}
                  onValueChange={(value) => setLightIntensity(value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ZoomIn className="w-4 h-4 text-muted-foreground" />
                    <label htmlFor="zoom" className="text-sm font-medium">
                      Zoom
                    </label>
                  </div>
                  <span className="text-sm text-muted-foreground">{zoom.toFixed(1)}</span>
                </div>
                <Slider
                  id="zoom"
                  min={2}
                  max={10}
                  step={0.1}
                  value={[zoom]}
                  onValueChange={(value) => setZoom(value[0])}
                />
              </div>
            </CardContent>
          </Card>

          {activeTab === "view" && (
            <Card>
              <CardHeader>
                <CardTitle>Viewing Instructions</CardTitle>
                <CardDescription>How to interact with the 3D model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mouse-pointer"
                      >
                        <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                        <path d="m13 13 6 6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Rotate</h4>
                      <p className="text-sm text-muted-foreground">Click and drag to rotate the model</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mouse-pointer-click"
                      >
                        <path d="m9 9 5 12 1.774-5.226L21 14 9 9z" />
                        <path d="m16.071 16.071 4.243 4.243" />
                        <path d="m7.188 2.239.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656-2.12 2.122" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Pan</h4>
                      <p className="text-sm text-muted-foreground">Right-click and drag to pan the camera</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-mouse-pointer-square"
                      >
                        <path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" />
                        <path d="m12 12 4 10 1.7-4.3L22 16Z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Zoom</h4>
                      <p className="text-sm text-muted-foreground">Use the scroll wheel to zoom in and out</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-maximize-2"
                      >
                        <polyline points="15 3 21 3 21 9" />
                        <polyline points="9 21 3 21 3 15" />
                        <line x1="21" x2="14" y1="3" y2="10" />
                        <line x1="3" x2="10" y1="21" y2="14" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Fullscreen</h4>
                      <p className="text-sm text-muted-foreground">Click the fullscreen button for a larger view</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "measure" && (
            <Card>
              <CardHeader>
                <CardTitle>Measurement Instructions</CardTitle>
                <CardDescription>How to measure the 3D model</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <Ruler className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Create Measurement</h4>
                      <p className="text-sm text-muted-foreground">
                        Click on two points on the model to create a measurement between them
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-edit"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Edit Measurement Name</h4>
                      <p className="text-sm text-muted-foreground">
                        Click on the measurement name to edit it (e.g., "Chest", "Sleeve")
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 border rounded-full">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-medium">Compare with Your Measurements</h4>
                      <p className="text-sm text-muted-foreground">
                        Switch to the "Body Fit" tab to compare with your body measurements
                      </p>
                    </div>
                  </div>

                  <div className="p-4 mt-2 border rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      Tip: For accurate measurements, rotate the model to get the best angle for each measurement point.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "body" && !isComparing && (
            <Card>
              <CardHeader>
                <CardTitle>Size Information</CardTitle>
                <CardDescription>Recommended measurements for this item</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(nft.sizingInfo).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="capitalize">{key}</span>
                      <span>
                        {value.min} - {value.max} cm
                      </span>
                    </div>
                  ))}

                  <Separator />

                  <div className="p-4 border rounded-lg bg-muted/20">
                    <p className="text-sm text-muted-foreground">
                      These are the recommended measurements for this item. Compare with your body measurements for the
                      best fit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-lg mt-2">
              <p className="text-sm text-muted-foreground">{nft.description}</p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-sm font-medium">Price</span>
                <span className="text-sm">{nft.price}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Designer</span>
                <span className="text-sm">{nft.designer}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-medium">Rarity</span>
                <span className="text-sm">{nft.rarity}</span>
              </div>
            </TabsContent>
            <TabsContent value="features" className="p-4 border rounded-lg mt-2">
              <ul className="space-y-2">
                {nft.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
