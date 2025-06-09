import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const collections = [
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
  {
    id: 5,
    title: "Digital Denim Jacket",
    designer: "BlockchainThreads",
    price: "2.2 SOL",
    image: "/placeholder.svg?height=400&width=400&query=digital denim jacket with glowing patterns",
    badge: "Popular",
  },
  {
    id: 6,
    title: "Crystal Boots",
    designer: "MetaFashion",
    price: "3.5 SOL",
    image: "/placeholder.svg?height=400&width=400&query=transparent crystal boots digital fashion",
    badge: "Featured",
  },
  {
    id: 7,
    title: "Nebula Dress",
    designer: "Digital Couture",
    price: "5.0 SOL",
    image: "/placeholder.svg?height=400&width=400&query=space nebula pattern flowing dress digital",
    badge: "Premium",
  },
  {
    id: 8,
    title: "Tech Glasses",
    designer: "CryptoKicks",
    price: "1.5 SOL",
    image: "/placeholder.svg?height=400&width=400&query=futuristic tech glasses with HUD display",
    badge: "New",
  },
]

export default function CollectionsPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">All Collections</h1>
      </div>

      <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <label htmlFor="search" className="text-sm font-medium">
            Search Collections
          </label>
          <Input id="search" placeholder="Search by name, designer..." />
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label htmlFor="category" className="text-sm font-medium">
            Category
          </label>
          <Select defaultValue="all">
            <SelectTrigger id="category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="clothing">Clothing</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
              <SelectItem value="footwear">Footwear</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label htmlFor="sort" className="text-sm font-medium">
            Sort By
          </label>
          <Select defaultValue="newest">
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {collections.map((nft) => (
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
    </div>
  )
}
