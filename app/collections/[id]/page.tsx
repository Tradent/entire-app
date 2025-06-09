import Link from "next/link"
import { ArrowLeft, Share2, Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SmartContractDetails } from "@/components/smart-contract-details"

// This would typically come from a database or API
const getNFTById = (id: string) => {
  return {
    id: Number.parseInt(id),
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    designerAvatar: "/placeholder.svg?height=100&width=100&query=female fashion designer portrait",
    price: "2.5 SOL",
    images: [
      "/placeholder.svg?height=600&width=600&query=neon cyberpunk jacket digital fashion front view",
      "/placeholder.svg?height=600&width=600&query=neon cyberpunk jacket digital fashion side view",
      "/placeholder.svg?height=600&width=600&query=neon cyberpunk jacket digital fashion back view",
    ],
    badge: "New Release",
    description:
      "The Neon Dreams Jacket is a statement piece for the digital age. Featuring dynamic light patterns that respond to music and movement, this virtual garment is perfect for metaverse events and digital fashion showcases.",
    features: [
      "Reactive light patterns",
      "Custom color options",
      "Compatible with major metaverse platforms",
      "Includes 3D model for AR try-on",
    ],
    contractAddress: "8xDR8MgCLZGJ7ZiMVxKnMQPQpKJqZnPzTvzH4xJsHHgA",
    tokenId: "NFT-123456",
    blockchain: "Solana",
    relatedItems: [2, 6, 3],
  }
}

// This would typically come from a database or API
const getRelatedNFTs = (ids: number[]) => {
  const allNFTs = [
    {
      id: 2,
      title: "Ethereal Gown",
      designer: "Digital Couture",
      price: "4.2 SOL",
      image: "/digital-dreamscape-gown.png",
      badge: "Limited Edition",
    },
    {
      id: 3,
      title: "Quantum Sneakers",
      designer: "CryptoKicks",
      price: "1.8 SOL",
      image: "/lumina-flux.png",
      badge: "Trending",
    },
    {
      id: 6,
      title: "Crystal Boots",
      designer: "MetaFashion",
      price: "3.5 SOL",
      image: "/placeholder.svg?height=400&width=400&query=transparent crystal boots digital fashion",
      badge: "Featured",
    },
  ]

  return allNFTs.filter((nft) => ids.includes(nft.id))
}

export default function NFTDetailPage({ params }: { params: { id: string } }) {
  const nft = getNFTById(params.id)
  const relatedNFTs = getRelatedNFTs(nft.relatedItems)

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/collections">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{nft.title}</h1>
        <Badge className="ml-auto">{nft.badge}</Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg">
            <img
              src={nft.images[0] || "/placeholder.svg"}
              alt={nft.title}
              className="object-cover w-full aspect-square"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {nft.images.slice(1).map((image, index) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${nft.title} view ${index + 2}`}
                  className="object-cover w-full aspect-square"
                />
              </div>
            ))}
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

            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Heart className="w-4 h-4" />
                <span className="sr-only">Add to favorites</span>
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-3xl font-bold">{nft.price}</p>
              </div>
              <Button className="gap-2">
                <ShoppingBag className="w-4 h-4" />
                Purchase NFT
              </Button>
            </div>

            <p className="text-muted-foreground">{nft.description}</p>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="contract">Smart Contract</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="p-4 border rounded-lg mt-2">
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Collection</dt>
                  <dd className="font-medium">Digital Wearables 2025</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Release Date</dt>
                  <dd className="font-medium">April 15, 2025</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Edition</dt>
                  <dd className="font-medium">Limited (100 of 100)</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Blockchain</dt>
                  <dd className="font-medium">{nft.blockchain}</dd>
                </div>
              </dl>
            </TabsContent>
            <TabsContent value="features" className="p-4 border rounded-lg mt-2">
              <ul className="space-y-2">
                {nft.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>
            <TabsContent value="contract" className="p-4 border rounded-lg mt-2">
              <SmartContractDetails
                contractAddress={nft.contractAddress}
                tokenId={nft.tokenId}
                blockchain={nft.blockchain}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedNFTs.map((relatedNft) => (
            <Link href={`/collections/${relatedNft.id}`} key={relatedNft.id}>
              <Card className="overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-square">
                  <img
                    src={relatedNft.image || "/placeholder.svg"}
                    alt={relatedNft.title}
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2">{relatedNft.badge}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{relatedNft.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">by {relatedNft.designer}</p>
                    <p className="text-sm font-medium">{relatedNft.price}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
