import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for related NFTs
const getRelatedNFTs = (currentId: number) => {
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
      image: "/placeholder.svg?key=3hqf2",
      badge: "Featured",
    },
    {
      id: 7,
      title: "Nebula Dress",
      designer: "Digital Couture",
      price: "5.0 SOL",
      image: "/cosmic-flow.png",
      badge: "Premium",
    },
  ]

  return allNFTs.filter((nft) => nft.id !== currentId)
}

interface RelatedNFTsProps {
  nftId: number
}

export default function RelatedNFTs({ nftId }: RelatedNFTsProps) {
  const relatedNFTs = getRelatedNFTs(nftId)

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {relatedNFTs.map((nft) => (
        <Link href={`/marketplace/${nft.id}`} key={nft.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative aspect-square">
              <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="object-cover w-full h-full" />
              <Badge className="absolute top-2 right-2">{nft.badge}</Badge>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{nft.title}</h3>
              <p className="text-sm text-muted-foreground">by {nft.designer}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 border-t">
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">{nft.price}</span>
                <Badge variant="outline">View Details</Badge>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
