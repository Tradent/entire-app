"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, Grid, List, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/auth-context"

// Mock data for user's NFTs
const userNFTs = [
  {
    id: 1,
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    price: "2.5 SOL",
    image: "/neon-city-slicker.png",
    badge: "Owned",
    purchaseDate: "May 5, 2025",
  },
  {
    id: 4,
    title: "Holographic Headpiece",
    designer: "VirtualVogue",
    price: "3.0 SOL",
    image: "/ethereal-hologram-crown.png",
    badge: "Owned",
    purchaseDate: "April 28, 2025",
  },
  {
    id: 8,
    title: "Tech Glasses",
    designer: "CryptoKicks",
    price: "1.5 SOL",
    image: "/augmented-reality-interface.png",
    badge: "Listed",
    purchaseDate: "April 15, 2025",
  },
]

// Mock data for user's listings
const userListings = [
  {
    id: 8,
    title: "Tech Glasses",
    designer: "CryptoKicks",
    price: "1.5 SOL",
    image: "/augmented-reality-interface.png",
    badge: "Listed",
    listingDate: "May 1, 2025",
    views: 45,
    likes: 12,
  },
]

// Mock data for user's activity
const userActivity = [
  {
    id: 1,
    type: "purchase",
    title: "Neon Dreams Jacket",
    price: "2.5 SOL",
    date: "May 5, 2025",
    image: "/neon-city-slicker.png",
  },
  {
    id: 2,
    type: "purchase",
    title: "Holographic Headpiece",
    price: "3.0 SOL",
    date: "April 28, 2025",
    image: "/ethereal-hologram-crown.png",
  },
  {
    id: 3,
    type: "listing",
    title: "Tech Glasses",
    price: "1.5 SOL",
    date: "May 1, 2025",
    image: "/augmented-reality-interface.png",
  },
]

export default function MarketplaceProfileContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { publicKey, signOut } = useAuth()

  // Format the public key for display
  const formattedPublicKey = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : ""

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/marketplace">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">My Collection</h1>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/diverse-avatars.png" alt="User" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">User123</h2>
            <p className="text-sm text-muted-foreground">Wallet: {formattedPublicKey}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/marketplace/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Listing
            </Button>
          </Link>
          <Button variant="outline" onClick={signOut}>
            Disconnect
          </Button>
        </div>
      </div>

      <div className="p-4 mb-8 border rounded-lg bg-muted/20">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total NFTs</p>
            <p className="text-2xl font-bold">{userNFTs.length}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Active Listings</p>
            <p className="text-2xl font-bold">{userListings.length}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">7.0 SOL</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="collection">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(viewMode === "grid" && "bg-muted")}
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(viewMode === "list" && "bg-muted")}
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="collection">
          {userNFTs.length === 0 ? (
            <div className="p-12 text-center border rounded-lg">
              <p className="mb-4 text-muted-foreground">You don't have any NFTs in your collection yet.</p>
              <Link href="/marketplace">
                <Button>Browse Marketplace</Button>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userNFTs.map((nft) => (
                <Link href={`/marketplace/${nft.id}`} key={nft.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-square">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2">{nft.badge}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{nft.title}</h3>
                      <p className="text-sm text-muted-foreground">by {nft.designer}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 border-t">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{nft.price}</span>
                        <span className="text-xs text-muted-foreground">Purchased: {nft.purchaseDate}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userNFTs.map((nft) => (
                <Link href={`/marketplace/${nft.id}`} key={nft.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="flex">
                      <div className="w-24 h-24 sm:w-32 sm:h-32">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{nft.title}</h3>
                            <Badge>{nft.badge}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">by {nft.designer}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{nft.price}</span>
                          <span className="text-xs text-muted-foreground">Purchased: {nft.purchaseDate}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="listings">
          {userListings.length === 0 ? (
            <div className="p-12 text-center border rounded-lg">
              <p className="mb-4 text-muted-foreground">You don't have any active listings.</p>
              <Link href="/marketplace/create">
                <Button>Create Listing</Button>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userListings.map((listing) => (
                <Link href={`/marketplace/${listing.id}`} key={listing.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="relative aspect-square">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2">{listing.badge}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{listing.title}</h3>
                      <p className="text-sm text-muted-foreground">by {listing.designer}</p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 border-t">
                      <div className="flex items-center justify-between w-full">
                        <span className="text-sm font-medium">{listing.price}</span>
                        <span className="text-xs text-muted-foreground">Listed: {listing.listingDate}</span>
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userListings.map((listing) => (
                <Link href={`/marketplace/${listing.id}`} key={listing.id}>
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="flex">
                      <div className="w-24 h-24 sm:w-32 sm:h-32">
                        <img
                          src={listing.image || "/placeholder.svg"}
                          alt={listing.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col justify-between flex-1 p-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold">{listing.title}</h3>
                            <Badge>{listing.badge}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">by {listing.designer}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{listing.price}</span>
                          <span className="text-xs text-muted-foreground">Listed: {listing.listingDate}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="activity">
          <div className="border rounded-lg">
            {userActivity.map((activity, index) => (
              <div
                key={activity.id}
                className={cn("flex items-center p-4", index < userActivity.length - 1 && "border-b")}
              >
                <div className="w-12 h-12 mr-4 overflow-hidden rounded-md">
                  <img
                    src={activity.image || "/placeholder.svg"}
                    alt={activity.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{activity.title}</h3>
                    <Badge variant={activity.type === "purchase" ? "default" : "secondary"}>
                      {activity.type === "purchase" ? "Purchased" : "Listed"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">{activity.price}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
