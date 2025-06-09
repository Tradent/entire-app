"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Share2, Eye, Clock, ShoppingBag, ExternalLink, Info, View } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { SmartContractDetails } from "@/components/smart-contract-details"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import NFTProperties from "@/components/marketplace/nft-properties"
import PriceHistory from "@/components/marketplace/price-history"
import RelatedNFTs from "@/components/marketplace/related-nfts"

// Mock data for the NFT details
const getNFTById = (id: string) => {
  return {
    id: Number.parseInt(id),
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    designerAvatar: "/placeholder.svg?key=45bh6",
    price: "2.5 SOL",
    previousPrice: "2.2 SOL",
    images: ["/neon-city-slicker.png", "/placeholder.svg?key=a01is", "/placeholder.svg?key=03xn1"],
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
    properties: [
      { trait: "Collection", value: "Cyberpunk 2025" },
      { trait: "Season", value: "Digital Winter" },
      { trait: "Material", value: "Digital Neon Fabric" },
      { trait: "Style", value: "Futuristic" },
      { trait: "Animation", value: "Dynamic" },
      { trait: "Wearable", value: "Yes" },
    ],
    contractAddress: "8xDR8MgCLZGJ7ZiMVxKnMQPQpKJqZnPzTvzH4xJsHHgA",
    tokenId: "NFT-123456",
    blockchain: "Solana",
    creator: "MetaFashion Studios",
    creatorAddress: "5xTR9MgCLZGJ7ZiMVxKnMQPQpKJqZnPzTvzH4xJsHHgB",
    royalties: "10%",
    mintDate: "April 15, 2025",
    edition: "42 of 100",
    likes: 24,
    views: 156,
    relatedItems: [2, 6, 3],
    priceHistory: [
      { date: "Apr 15", price: 2.0 },
      { date: "Apr 20", price: 2.2 },
      { date: "Apr 25", price: 2.1 },
      { date: "Apr 30", price: 2.3 },
      { date: "May 5", price: 2.5 },
    ],
    has3DModel: true,
  }
}

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const nft = getNFTById(params.id)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [likes, setLikes] = useState(nft.likes)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseComplete, setPurchaseComplete] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  const handlePurchase = () => {
    setIsPurchasing(true)
    // Simulate purchase process
    setTimeout(() => {
      setIsPurchasing(false)
      setPurchaseComplete(true)
    }, 2000)
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/marketplace">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{nft.title}</h1>
        <Badge className="ml-auto">{nft.badge}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg relative">
            <img
              src={nft.images[selectedImage] || "/placeholder.svg"}
              alt={nft.title}
              className="object-cover w-full aspect-square"
            />

            {/* 3D View Button */}
            {nft.has3DModel && (
              <Link href={`/marketplace/${params.id}/view3d`}>
                <Button className="absolute bottom-4 right-4 gap-2" variant="secondary">
                  <View className="w-4 h-4" />
                  View in 3D
                </Button>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            {nft.images.map((image, index) => (
              <div
                key={index}
                className={`overflow-hidden rounded-lg cursor-pointer border-2 ${
                  selectedImage === index ? "border-primary" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${nft.title} view ${index + 1}`}
                  className="object-cover w-full aspect-square"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={handleLike}>
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <span className="text-sm">{likes}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <span className="text-sm">Share</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{nft.views} views</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={nft.designerAvatar || "/placeholder.svg"} alt={nft.designer} />
                <AvatarFallback>{nft.designer[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-muted-foreground">Designer</p>
                <Link href={`/designers/1`} className="font-medium hover:underline">
                  {nft.designer}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                {nft.rarity}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {nft.edition}
              </Badge>
            </div>
          </div>

          <div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Current Price</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold">{nft.price}</p>
                    <Badge variant="outline" className="text-green-500">
                      +13.6%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <p className="text-sm text-muted-foreground">Previous: {nft.previousPrice}</p>
                    <Info className="w-3 h-3 text-muted-foreground" />
                  </div>
                </div>
                <Button className="gap-2" onClick={handlePurchase} disabled={isPurchasing || purchaseComplete}>
                  <ShoppingBag className="w-4 h-4" />
                  {isPurchasing ? "Processing..." : purchaseComplete ? "Purchased" : "Buy Now"}
                </Button>
              </div>

              <p className="text-muted-foreground">{nft.description}</p>
            </div>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="history">Price History</TabsTrigger>
              <TabsTrigger value="contract">Smart Contract</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-lg mt-2">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Collection</dt>
                  <dd className="font-medium">{nft.properties[0].value}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Mint Date</dt>
                  <dd className="font-medium">{nft.mintDate}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Edition</dt>
                  <dd className="font-medium">{nft.edition}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Blockchain</dt>
                  <dd className="font-medium">{nft.blockchain}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Creator</dt>
                  <dd className="font-medium">{nft.creator}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Royalties</dt>
                  <dd className="font-medium">{nft.royalties}</dd>
                </div>
              </dl>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-medium">Features</h4>
                <ul className="space-y-2">
                  {nft.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="properties" className="p-4 border rounded-lg mt-2">
              <NFTProperties properties={nft.properties} />
            </TabsContent>
            <TabsContent value="history" className="p-4 border rounded-lg mt-2">
              <PriceHistory priceHistory={nft.priceHistory} />
            </TabsContent>
            <TabsContent value="contract" className="p-4 border rounded-lg mt-2">
              <SmartContractDetails
                contractAddress={nft.contractAddress}
                tokenId={nft.tokenId}
                blockchain={nft.blockchain}
              />
            </TabsContent>
          </Tabs>

          {!purchaseComplete ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connect Your Wallet to Purchase</CardTitle>
                <CardDescription>You need to connect your wallet to purchase this NFT.</CardDescription>
              </CardHeader>
              <CardContent>
                <ConnectWalletButton />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-green-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-500">Purchase Complete!</CardTitle>
                <CardDescription>Your NFT has been added to your collection.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 mb-3 text-sm border rounded-md bg-muted/50">
                  <p>
                    Transaction Hash:{" "}
                    <span className="font-mono text-xs">5xTR9MgCLZGJ7ZiMVxKnMQPQpKJqZnPzTvzH4xJsHHgB...</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </Button>
                  <Link href="/marketplace/profile" className="flex-1">
                    <Button className="w-full">View in Collection</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <RelatedNFTs nftId={nft.id} />
      </div>
    </div>
  )
}
