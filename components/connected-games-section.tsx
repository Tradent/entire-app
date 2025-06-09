"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Link2, Unlink } from "lucide-react"
import { ConnectWalletButton } from "@/components/connect-wallet-button"

// Mock data for connected games and NFTs
const connectedGames = [
  {
    id: "decentraland",
    name: "Decentraland",
    username: "ENTIRE_Fashion",
    avatar: "/placeholder.svg?height=100&width=100&query=decentraland logo",
    connectedNFTs: 3,
    lastSync: "2 hours ago",
  },
  {
    id: "sandbox",
    name: "The Sandbox",
    username: "ENTIRE_Official",
    avatar: "/placeholder.svg?height=100&width=100&query=the sandbox game logo",
    connectedNFTs: 5,
    lastSync: "1 day ago",
  },
]

const connectedNFTs = [
  {
    id: 1,
    name: "Neon Dreams Jacket",
    image: "/neon-city-slicker.png",
    connectedTo: ["decentraland", "sandbox"],
  },
  {
    id: 2,
    name: "Ethereal Gown",
    image: "/digital-dreamscape-gown.png",
    connectedTo: ["decentraland"],
  },
  {
    id: 3,
    name: "Quantum Sneakers",
    image: "/lumina-flux.png",
    connectedTo: ["sandbox"],
  },
  {
    id: 4,
    name: "Holographic Headpiece",
    image: "/ethereal-hologram-crown.png",
    connectedTo: ["sandbox", "decentraland"],
  },
]

export default function ConnectedGamesSection() {
  const [isConnected, setIsConnected] = useState(false)

  // Toggle connection state for demo purposes
  const toggleConnection = () => {
    setIsConnected(!isConnected)
  }

  if (!isConnected) {
    return (
      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Your Connected Games</CardTitle>
            <CardDescription>
              Connect your wallet to manage your metaverse game connections and wearable NFTs.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="mb-6 text-center">
              <p className="mb-4 text-muted-foreground">
                Connect your wallet to view and manage your metaverse game connections.
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

  return (
    <div className="mb-12">
      <Card>
        <CardHeader>
          <CardTitle>Your Connected Games</CardTitle>
          <CardDescription>Manage your metaverse game connections and wearable NFTs.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="games">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="games">Connected Games</TabsTrigger>
              <TabsTrigger value="nfts">Connected NFTs</TabsTrigger>
            </TabsList>
            <TabsContent value="games" className="pt-4">
              <div className="grid gap-4 md:grid-cols-2">
                {connectedGames.map((game) => (
                  <Card key={game.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={game.avatar || "/placeholder.svg"} alt={game.name} />
                          <AvatarFallback>{game.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium">{game.name}</h3>
                          <p className="text-sm text-muted-foreground">@{game.username}</p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Unlink className="w-4 h-4" />
                          <span className="sr-only">Disconnect</span>
                        </Button>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <span>{game.connectedNFTs} NFTs connected</span>
                          <span className="mx-2">•</span>
                          <span>Last sync: {game.lastSync}</span>
                        </div>
                        <Link href={`/games/${game.id}/manage`}>
                          <Button variant="ghost" size="sm" className="gap-1">
                            Manage <ArrowRight className="w-3 h-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Link href="/games/connect" className="block">
                  <Card className="flex flex-col items-center justify-center h-full p-6 border-dashed">
                    <Link2 className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="font-medium">Connect New Game</p>
                    <p className="text-sm text-muted-foreground">Add another metaverse platform</p>
                  </Card>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="nfts" className="pt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {connectedNFTs.map((nft) => (
                  <Card key={nft.id} className="overflow-hidden">
                    <div className="aspect-square">
                      <img
                        src={nft.image || "/placeholder.svg"}
                        alt={nft.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-2 font-medium">{nft.name}</h3>
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Connected to:</p>
                        <div className="flex flex-wrap gap-2">
                          {nft.connectedTo.map((gameId) => {
                            const game = connectedGames.find((g) => g.id === gameId)
                            return (
                              <Badge key={gameId} variant="outline">
                                {game?.name || gameId}
                              </Badge>
                            )
                          })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
