import Link from "next/link"
import { ArrowLeft, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MarketplaceFilters from "@/components/marketplace/marketplace-filters"
import MarketplaceBanner from "@/components/marketplace/marketplace-banner"

// Mock data for marketplace listings
const listings = [
  {
    id: 1,
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    price: "2.5 SOL",
    image: "/neon-city-slicker.png",
    badge: "New Listing",
    rarity: "Rare",
    likes: 24,
    views: 156,
  },
  {
    id: 2,
    title: "Ethereal Gown",
    designer: "Digital Couture",
    price: "4.2 SOL",
    image: "/digital-dreamscape-gown.png",
    badge: "Limited Edition",
    rarity: "Legendary",
    likes: 42,
    views: 230,
  },
  {
    id: 3,
    title: "Quantum Sneakers",
    designer: "CryptoKicks",
    price: "1.8 SOL",
    image: "/lumina-flux.png",
    badge: "Trending",
    rarity: "Uncommon",
    likes: 18,
    views: 112,
  },
  {
    id: 4,
    title: "Holographic Headpiece",
    designer: "VirtualVogue",
    price: "3.0 SOL",
    image: "/ethereal-hologram-crown.png",
    badge: "Exclusive",
    rarity: "Epic",
    likes: 36,
    views: 198,
  },
  {
    id: 5,
    title: "Digital Denim Jacket",
    designer: "BlockchainThreads",
    price: "2.2 SOL",
    image: "/glowing-denim.png",
    badge: "Popular",
    rarity: "Rare",
    likes: 29,
    views: 175,
  },
  {
    id: 6,
    title: "Crystal Boots",
    designer: "MetaFashion",
    price: "3.5 SOL",
    image: "/placeholder.svg?key=0o3ko",
    badge: "Featured",
    rarity: "Epic",
    likes: 31,
    views: 187,
  },
  {
    id: 7,
    title: "Nebula Dress",
    designer: "Digital Couture",
    price: "5.0 SOL",
    image: "/cosmic-flow.png",
    badge: "Premium",
    rarity: "Legendary",
    likes: 47,
    views: 256,
  },
  {
    id: 8,
    title: "Tech Glasses",
    designer: "CryptoKicks",
    price: "1.5 SOL",
    image: "/augmented-reality-interface.png",
    badge: "New",
    rarity: "Uncommon",
    likes: 15,
    views: 98,
  },
]

export default function MarketplacePage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">NFT Marketplace</h1>
      </div>

      <MarketplaceBanner />

      <div className="flex flex-col gap-6 mt-8 md:flex-row">
        {/* Filters sidebar - desktop */}
        <div className="hidden w-64 md:block">
          <MarketplaceFilters />
        </div>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile filter button */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <p className="text-sm text-muted-foreground">{listings.length} items</p>
          </div>

          {/* Search and sort - desktop */}
          <div className="items-end justify-between hidden mb-6 md:flex">
            <div className="flex-1 max-w-sm space-y-2">
              <label htmlFor="search" className="text-sm font-medium">
                Search Marketplace
              </label>
              <div className="relative">
                <Input id="search" placeholder="Search by name, designer..." />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-48 space-y-2">
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

              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{listings.length} items</p>
                <Button variant="ghost" size="icon">
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* NFT Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((nft) => (
              <Link href={`/marketplace/${nft.id}`} key={nft.id}>
                <Card className="overflow-hidden transition-all hover:shadow-lg">
                  <div className="relative aspect-square">
                    <img src={nft.image || "/placeholder.svg"} alt={nft.title} className="object-cover w-full h-full" />
                    <Badge className="absolute top-2 right-2">{nft.badge}</Badge>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="bg-black/50 text-white border-white/10">
                        {nft.rarity}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{nft.title}</h3>
                    <p className="text-sm text-muted-foreground">by {nft.designer}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 border-t">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-medium">{nft.price}</span>
                      <Button size="sm" variant="secondary">
                        View Details
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
