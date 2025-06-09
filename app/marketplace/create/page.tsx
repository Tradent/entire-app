"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useToast } from "@/hooks/use-toast"

export default function CreateListingPage() {
  const [isConnected, setIsConnected] = useState(true)
  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const { toast } = useToast()

  // Toggle connection state for demo purposes
  const toggleConnection = () => {
    setIsConnected(!isConnected)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // For demo purposes, we'll just create placeholder URLs
    const newImages = Array.from(files).map(
      (_, index) =>
        `/placeholder.svg?height=400&width=400&query=digital fashion item upload ${uploadedImages.length + index + 1}`,
    )

    setUploadedImages([...uploadedImages, ...newImages])
  }

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({
        title: "Listing created",
        description: "Your NFT has been listed on the marketplace.",
      })
    }, 2000)
  }

  if (!isConnected) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/marketplace">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create Listing</h1>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-xl font-bold">Connect Your Wallet</h2>
              <p className="mb-6 text-muted-foreground">
                Connect your wallet to create a new NFT listing on the marketplace.
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

  if (isSubmitted) {
    return (
      <div className="container px-4 py-12 mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/marketplace">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create Listing</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 text-green-600 dark:text-green-400"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <CardTitle className="text-center">Listing Created Successfully!</CardTitle>
            <CardDescription className="text-center">
              Your NFT has been listed on the ENTIRE marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">
              Your listing is now live and available for purchase. You can view and manage your listings in your
              profile.
            </p>
            <p className="text-sm text-muted-foreground">
              Transaction Hash: ENTIRE-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link href="/marketplace/profile">
              <Button>View My Listings</Button>
            </Link>
            <Link href="/marketplace">
              <Button variant="outline">Return to Marketplace</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/marketplace">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Create Listing</h1>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>List Your Digital Fashion NFT</CardTitle>
          <CardDescription>
            Create a new listing to sell your digital fashion item on the ENTIRE marketplace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">NFT Details</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="pricing">Pricing & Royalties</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
              <TabsContent value="details" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="nft-name">NFT Name</Label>
                  <Input id="nft-name" placeholder="Enter your NFT name" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nft-description">Description</Label>
                  <Textarea
                    id="nft-description"
                    placeholder="Describe your digital fashion item in detail"
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Upload Images</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="nft-images"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/60"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG or GLB (MAX. 50MB)</p>
                      </div>
                      <Input
                        id="nft-images"
                        type="file"
                        className="hidden"
                        accept="image/*,.glb"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>

                  {uploadedImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`Upload ${index + 1}`}
                            className="object-cover w-full h-32 rounded-md"
                          />
                          <button
                            type="button"
                            className="absolute p-1 bg-black rounded-full top-2 right-2"
                            onClick={() => removeImage(index)}
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nft-category">Category</Label>
                    <Select defaultValue="clothing">
                      <SelectTrigger id="nft-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                        <SelectItem value="footwear">Footwear</SelectItem>
                        <SelectItem value="headwear">Headwear</SelectItem>
                        <SelectItem value="eyewear">Eyewear</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nft-rarity">Rarity</Label>
                    <Select defaultValue="rare">
                      <SelectTrigger id="nft-rarity">
                        <SelectValue placeholder="Select rarity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="common">Common</SelectItem>
                        <SelectItem value="uncommon">Uncommon</SelectItem>
                        <SelectItem value="rare">Rare</SelectItem>
                        <SelectItem value="epic">Epic</SelectItem>
                        <SelectItem value="legendary">Legendary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("properties")}>
                    Next: Properties
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="properties" className="space-y-6 mt-6">
                <div className="p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Properties define the attributes of your digital fashion item. These help with discoverability and
                      uniqueness.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="property-collection">Collection</Label>
                        <Input id="property-collection" placeholder="e.g., Cyberpunk 2025" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-season">Season</Label>
                        <Input id="property-season" placeholder="e.g., Digital Winter" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="property-material">Material</Label>
                        <Input id="property-material" placeholder="e.g., Digital Neon Fabric" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-style">Style</Label>
                        <Input id="property-style" placeholder="e.g., Futuristic" />
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="property-animation">Animation</Label>
                        <Select defaultValue="dynamic">
                          <SelectTrigger id="property-animation">
                            <SelectValue placeholder="Select animation type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="static">Static</SelectItem>
                            <SelectItem value="dynamic">Dynamic</SelectItem>
                            <SelectItem value="reactive">Reactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-wearable">Wearable</Label>
                        <div className="flex items-center justify-between pt-2">
                          <span>Is this item wearable in metaverse platforms?</span>
                          <Switch id="property-wearable" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("details")}>
                    Back: Details
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("pricing")}>
                    Next: Pricing
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-6 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="nft-price">Price (SOL)</Label>
                  <Input id="nft-price" type="number" step="0.01" min="0" placeholder="e.g., 2.5" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nft-quantity">Quantity</Label>
                  <Input id="nft-quantity" type="number" min="1" placeholder="e.g., 10" required />
                  <p className="text-xs text-muted-foreground">
                    Number of editions to mint. Each will be individually numbered.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nft-royalties">Royalties (%)</Label>
                  <Input id="nft-royalties" type="number" min="0" max="15" placeholder="e.g., 10" required />
                  <p className="text-xs text-muted-foreground">
                    Percentage of secondary sales that goes to the original creator.
                  </p>
                </div>

                <div className="p-4 border rounded-lg bg-muted/20">
                  <h3 className="mb-2 font-medium">Listing Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Listing Fee</span>
                      <span className="text-sm">0.01 SOL</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Transaction Fee (2.5%)</span>
                      <span className="text-sm">0.06 SOL</span>
                    </div>
                    <div className="flex items-center justify-between font-medium">
                      <span>You'll Receive</span>
                      <span>2.43 SOL</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("properties")}>
                    Back: Properties
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Listing..." : "Create Listing"}
                  </Button>
                </div>
              </TabsContent>
            </form>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
