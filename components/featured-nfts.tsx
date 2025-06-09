import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const featuredNFTs = [
  {
    id: 1,
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    price: "2.5 SOL",
    image: "/neon-city-slicker.png",
    badge: "New Release",
  },
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
    id: 4,
    title: "Holographic Headpiece",
    designer: "VirtualVogue",
    price: "3.0 SOL",
    image: "/ethereal-hologram-crown.png",
    badge: "Exclusive",
  },
]

export default function FeaturedNFTs() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {featuredNFTs.map((nft) => (
        <Link href={`/collections/${nft.id}`} key={nft.id}>
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
