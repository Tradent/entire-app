"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the game
const getGameData = (id: string) => {
  const games = {
    decentraland: {
      id: "decentraland",
      name: "Decentraland",
      logo: "/placeholder.svg?height=100&width=100&query=decentraland logo",
      username: "ENTIRE_Fashion",
      connectedNFTs: 3,
      lastSync: "2 hours ago",
      preview:
        "/placeholder.svg?height=600&width=600&query=decentraland virtual world with avatar wearing digital fashion",
    },
    sandbox: {
      id: "sandbox",
      name: "The Sandbox",
      logo: "/placeholder.svg?height=100&width=100&query=the sandbox game logo",
      username: "ENTIRE_Official",
      connectedNFTs: 5,
      lastSync: "1 day ago",
      preview:
        "/placeholder.svg?height=600&width=600&query=the sandbox game with voxel character wearing digital fashion",
    },
  }

  return games[id as keyof typeof games] || games.decentraland
}

// Mock data for NFTs
const userNFTs = [
  {
    id: 1,
    name: "Neon Dreams Jacket",
    image: "/neon-city-slicker.png",
    connected: true,
    compatible: true,
    gamePreview: "/placeholder.svg?height=300&width=300&query=avatar wearing neon jacket in virtual world",
  },
  {
    id: 2,
    name: "Ethereal Gown",
    image: "/digital-dreamscape-gown.png",
    connected: true,
    compatible: true,
    gamePreview: "/placeholder.svg?height=300&width=300&query=avatar wearing ethereal gown in virtual world",
  },
  {
    id: 3,
    name: "Quantum Sneakers",
    image: "/lumina-flux.png",
    connected: false,
    compatible: true,
    gamePreview: "/placeholder.svg?height=300&width=300&query=avatar wearing futuristic sneakers in virtual world",
  },
  {
    id: 4,
    name: "Holographic Headpiece",
    image: "/ethereal-hologram-crown.png",
    connected: true,
    compatible: true,
    gamePreview: "/placeholder.svg?height=300&width=300&query=avatar wearing holographic crown in virtual world",
  },
  {
    id: 5,
    name: "Digital Denim Jacket",
    image: "/placeholder.svg?height=400&width=400&query=digital denim jacket with glowing patterns",
    connected: false,
    compatible: false,
    incompatibleReason: "Format not supported",
  },
  {
    id: 6,
    name: "Crystal Boots",
    image: "/placeholder.svg?height=400&width=400&query=transparent crystal boots digital fashion",
    connected: false,
    compatible: true,
    gamePreview: "/placeholder.svg?height=300&width=300&query=avatar wearing crystal boots in virtual world",
  },
]

export default function ManageGamePage({ params }: { params: { id: string } }) {
  const game = getGameData(params.id)
  const [nfts, setNfts] = useState(userNFTs)
  const [syncInProgress, setSyncInProgress] = useState(false)

  const toggleNFTConnection = (nftId: number) => {
    setNfts(nfts.map((nft) => (nft.id === nftId ? { ...nft, connected: !nft.connected } : nft)))
  }

  const syncNFTs = () => {
    setSyncInProgress(true)
    // Simulate sync process
    setTimeout(() => {
      setSyncInProgress(false)
    }, 2000)
  }

  const connectedCount = nfts.filter((nft) => nft.connected).length
  const compatibleCount = nfts.filter((nft) => nft.compatible).length

  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Manage {game.name} NFTs</h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={game.logo || "/placeholder.svg"} alt={game.name} />
                  <AvatarFallback>{game.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{game.name}</CardTitle>
                  <CardDescription>Connected as @{game.username}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-4 text-center border rounded-lg">
                  <p className="text-2xl font-bold">{connectedCount}</p>
                  <p className="text-sm text-muted-foreground">Connected NFTs</p>
                </div>
                <div className="p-4 text-center border rounded-lg">
                  <p className="text-2xl font-bold">{compatibleCount}</p>
                  <p className="text-sm text-muted-foreground">Compatible NFTs</p>
                </div>
                <div className="p-4 text-center border rounded-lg">
                  <p className="text-sm font-medium">Last Synced</p>
                  <p className="text-muted-foreground">{game.lastSync}</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href={`/games/${game.id}`}>View in {game.name}</Link>
              </Button>
              <Button onClick={syncNFTs} disabled={syncInProgress}>
                {syncInProgress ? "Syncing..." : "Sync NFTs"}
              </Button>
            </CardFooter>
          </Card>

          <div>
            <h2 className="mb-6 text-2xl font-bold">Your Fashion NFTs</h2>
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All NFTs</TabsTrigger>
                <TabsTrigger value="connected">Connected</TabsTrigger>
                <TabsTrigger value="compatible">Compatible</TabsTrigger>
                <TabsTrigger value="incompatible">Incompatible</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nfts.map((nft) => (
                    <NFTCard
                      key={nft.id}
                      nft={nft}
                      game={game}
                      onToggleConnection={() => toggleNFTConnection(nft.id)}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="connected" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nfts
                    .filter((nft) => nft.connected)
                    .map((nft) => (
                      <NFTCard
                        key={nft.id}
                        nft={nft}
                        game={game}
                        onToggleConnection={() => toggleNFTConnection(nft.id)}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="compatible" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nfts
                    .filter((nft) => nft.compatible && !nft.connected)
                    .map((nft) => (
                      <NFTCard
                        key={nft.id}
                        nft={nft}
                        game={game}
                        onToggleConnection={() => toggleNFTConnection(nft.id)}
                      />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="incompatible" className="mt-6">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {nfts
                    .filter((nft) => !nft.compatible)
                    .map((nft) => (
                      <NFTCard
                        key={nft.id}
                        nft={nft}
                        game={game}
                        onToggleConnection={() => toggleNFTConnection(nft.id)}
                      />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Preview in {game.name}</CardTitle>
              <CardDescription>See how your NFTs look in the metaverse</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-hidden rounded-lg aspect-square mb-4">
                <img
                  src={game.preview || "/placeholder.svg"}
                  alt={`Preview in ${game.name}`}
                  className="object-cover w-full h-full"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This is a preview of how your connected NFTs will appear in {game.name}. Connect more items to enhance
                your avatar's appearance.
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href={`https://${game.id}.org/avatar`} target="_blank" rel="noopener noreferrer">
                  Customize Avatar
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

interface NFTCardProps {
  nft: {
    id: number
    name: string
    image: string
    connected: boolean
    compatible: boolean
    gamePreview?: string
    incompatibleReason?: string
  }
  game: {
    id: string
    name: string
  }
  onToggleConnection: () => void
}

function NFTCard({ nft, game, onToggleConnection }: NFTCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-square">
        <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="object-cover w-full h-full" />
        {!nft.compatible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <Badge variant="destructive" className="text-sm">
              Incompatible
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="mb-2 font-medium">{nft.name}</h3>
        {nft.compatible ? (
          <div className="flex items-center justify-between">
            <Label htmlFor={`nft-toggle-${nft.id}`} className="text-sm cursor-pointer">
              Use in {game.name}
            </Label>
            <Switch id={`nft-toggle-${nft.id}`} checked={nft.connected} onCheckedChange={onToggleConnection} />
          </div>
        ) : (
          <p className="text-sm text-destructive">{nft.incompatibleReason}</p>
        )}
      </CardContent>
      {nft.compatible && (
        <CardFooter className="p-0 border-t">
          <Button variant="ghost" className="w-full rounded-none h-10" asChild>
            <Link href={`/games/${game.id}/preview/${nft.id}`}>Preview in {game.name}</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
