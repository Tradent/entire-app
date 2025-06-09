"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Edit, Grid, List, Settings, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import ProfileStats from "@/components/profile/profile-stats"
import ProfileActivity from "@/components/profile/profile-activity"
import { useAuth } from "@/context/auth-context"

// Mock NFT collection data
const userNFTs = [
  {
    id: 1,
    title: "Neon Dreams Jacket",
    designer: "MetaFashion",
    price: "2.5 SOL",
    image: "/neon-city-slicker.png",
    badge: "Owned",
  },
  {
    id: 4,
    title: "Holographic Headpiece",
    designer: "VirtualVogue",
    price: "3.0 SOL",
    image: "/ethereal-hologram-crown.png",
    badge: "Owned",
  },
  {
    id: 8,
    title: "Tech Glasses",
    designer: "CryptoKicks",
    price: "1.5 SOL",
    image: "/augmented-reality-interface.png",
    badge: "Listed",
  },
  {
    id: 3,
    title: "Quantum Sneakers",
    designer: "CryptoKicks",
    price: "1.8 SOL",
    image: "/lumina-flux.png",
    badge: "Owned",
  },
  {
    id: 5,
    title: "Digital Denim Jacket",
    designer: "BlockchainThreads",
    price: "2.2 SOL",
    image: "/glowing-denim.png",
    badge: "Owned",
  },
  {
    id: 12,
    title: "Digital Glasses",
    designer: "BlockchainThreads",
    price: "1.5 SOL",
    image: "/augmented-reality-interface.png",
    badge: "Created",
  },
]

export default function ProfileContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const { publicKey, signOut } = useAuth()

  // Format the public key for display
  const formattedPublicKey = publicKey ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}` : ""

  // Mock user data - in a real app, this would come from a database
  const userData = {
    id: "user123",
    username: publicKey ? formattedPublicKey : "fashion_pioneer",
    displayName: "Fashion Pioneer",
    bio: "Digital fashion enthusiast and collector. Building the future of fashion in the metaverse.",
    avatar: "/diverse-avatars.png",
    coverImage: "/digital-fashion-abstract.png",
    walletAddress: formattedPublicKey,
    joinedDate: "April 2025",
    followers: 1240,
    following: 356,
    isVerified: true,
    socialLinks: {
      twitter: "fashion_pioneer",
      instagram: "fashion_pioneer",
      website: "fashionpioneer.io",
    },
  }

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Profile</h1>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-48 mb-16 overflow-hidden rounded-lg md:h-64">
        <img src={userData.coverImage || "/placeholder.svg"} alt="Cover" className="object-cover w-full h-full" />

        {/* Profile Avatar - Positioned to overlap the bottom of the cover */}
        <div className="absolute left-4 -bottom-12 md:left-8">
          <Avatar className="w-24 h-24 border-4 border-background">
            <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.displayName} />
            <AvatarFallback>{userData.displayName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>

        {/* Action buttons */}
        <div className="absolute right-4 bottom-4 flex gap-2">
          <Button size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Link href="/profile/edit">
            <Button size="sm" className="bg-background/80 backdrop-blur-sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Profile Info */}
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{userData.displayName}</h2>
              {userData.isVerified && <Badge variant="secondary">Verified</Badge>}
            </div>
            <p className="text-muted-foreground">@{userData.username}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={signOut}>
              Disconnect Wallet
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        <p className="mt-4 max-w-2xl">{userData.bio}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="font-medium text-foreground">{userData.walletAddress}</span>
          </div>
          <div className="text-muted-foreground">Joined {userData.joinedDate}</div>
        </div>

        <ProfileStats followers={userData.followers} following={userData.following} className="mt-4" />
      </div>

      <Separator className="my-8" />

      {/* Tabs for different sections */}
      <Tabs defaultValue="collection">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="collection">Collection</TabsTrigger>
            <TabsTrigger value="created">Created</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
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
          </div>
        </div>

        <TabsContent value="collection">
          {viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userNFTs
                .filter((nft) => nft.badge === "Owned")
                .map((nft) => (
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
                          <Badge variant="outline">View Details</Badge>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userNFTs
                .filter((nft) => nft.badge === "Owned")
                .map((nft) => (
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
                            <Badge variant="outline">View Details</Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="created">
          {viewMode === "grid" ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {userNFTs
                .filter((nft) => nft.badge === "Created")
                .map((nft) => (
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
                          <Badge variant="outline">View Details</Badge>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
            </div>
          ) : (
            <div className="space-y-4">
              {userNFTs
                .filter((nft) => nft.badge === "Created")
                .map((nft) => (
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
                            <Badge variant="outline">View Details</Badge>
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
          <ProfileActivity />
        </TabsContent>

        <TabsContent value="favorites">
          <div className="p-12 text-center border rounded-lg">
            <p className="mb-4 text-muted-foreground">You haven't favorited any items yet.</p>
            <Link href="/collections">
              <Button>Browse Collections</Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
