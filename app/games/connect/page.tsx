"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const metaverseGames = [
  {
    id: "decentraland",
    name: "Decentraland",
    logo: "/placeholder.svg?height=100&width=100&query=decentraland logo",
    authType: "oauth",
    connectionSteps: [
      "Sign in to your Decentraland account",
      "Authorize ENTIRE to access your account",
      "Select which NFTs to make available in Decentraland",
    ],
  },
  {
    id: "sandbox",
    name: "The Sandbox",
    logo: "/placeholder.svg?height=100&width=100&query=the sandbox game logo",
    authType: "wallet",
    connectionSteps: [
      "Connect the same wallet to The Sandbox",
      "Verify ownership of your NFTs",
      "Select which NFTs to make available in The Sandbox",
    ],
  },
  {
    id: "somnium",
    name: "Somnium Space",
    logo: "/placeholder.svg?height=100&width=100&query=somnium space logo",
    authType: "oauth",
    connectionSteps: [
      "Sign in to your Somnium Space account",
      "Authorize ENTIRE to access your account",
      "Select which NFTs to make available in Somnium Space",
    ],
  },
  {
    id: "cryptovoxels",
    name: "Voxels",
    logo: "/placeholder.svg?height=100&width=100&query=cryptovoxels logo",
    authType: "wallet",
    connectionSteps: [
      "Connect the same wallet to Voxels",
      "Verify ownership of your NFTs",
      "Select which NFTs to make available in Voxels",
    ],
  },
]

export default function ConnectGamesPage() {
  const [selectedGame, setSelectedGame] = useState(metaverseGames[0])
  const [connectionStep, setConnectionStep] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = () => {
    setIsConnecting(true)
    // Simulate connection process
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  const resetConnection = () => {
    setConnectionStep(0)
    setIsConnected(false)
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/games">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Connect Game Accounts</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Link Your Metaverse Accounts</CardTitle>
          <CardDescription>
            Connect your accounts from various metaverse platforms to use your fashion NFTs across virtual worlds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="connect" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="connect">Connect Account</TabsTrigger>
              <TabsTrigger value="manage">Manage Connections</TabsTrigger>
            </TabsList>

            <TabsContent value="connect" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-[200px_1fr]">
                <div className="space-y-4">
                  <div className="font-medium">Select Platform</div>
                  <div className="space-y-2">
                    {metaverseGames.map((game) => (
                      <div
                        key={game.id}
                        className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                          selectedGame.id === game.id ? "bg-muted" : "hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          setSelectedGame(game)
                          resetConnection()
                        }}
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={game.logo || "/placeholder.svg"} alt={game.name} />
                          <AvatarFallback>{game.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{game.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedGame.logo || "/placeholder.svg"} alt={selectedGame.name} />
                      <AvatarFallback>{selectedGame.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedGame.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{selectedGame.authType === "oauth" ? "OAuth" : "Wallet"} Auth</Badge>
                        <a
                          href={`https://${selectedGame.id}.io`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground"
                        >
                          Visit site <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {isConnected ? (
                    <div className="space-y-4">
                      <div className="p-4 text-center bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-green-200 dark:bg-green-800">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-medium">Successfully Connected!</h3>
                        <p className="text-sm text-muted-foreground">
                          Your {selectedGame.name} account is now linked to ENTIRE.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Connected Account</Label>
                        <div className="p-2 border rounded-md">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">ENTIRE_Fashion</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between pt-4">
                        <Button variant="outline" onClick={resetConnection}>
                          Disconnect
                        </Button>
                        <Link href="/games/decentraland/manage">
                          <Button>Manage NFTs</Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Connection Steps</h3>
                        <ol className="space-y-4">
                          {selectedGame.connectionSteps.map((step, index) => (
                            <li
                              key={index}
                              className={`flex items-start gap-2 ${
                                connectionStep >= index ? "text-foreground" : "text-muted-foreground"
                              }`}
                            >
                              <div
                                className={`flex items-center justify-center w-5 h-5 mt-0.5 rounded-full text-xs ${
                                  connectionStep > index
                                    ? "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200"
                                    : connectionStep === index
                                      ? "bg-primary text-primary-foreground"
                                      : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {connectionStep > index ? <Check className="w-3 h-3" /> : index + 1}
                              </div>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {connectionStep === 0 && (
                        <div className="space-y-4">
                          {selectedGame.authType === "wallet" ? (
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Connect your wallet to verify ownership of your NFTs and link them to{" "}
                                {selectedGame.name}.
                              </p>
                              <div className="flex justify-center">
                                <ConnectWalletButton />
                              </div>
                              <Button className="w-full" onClick={() => setConnectionStep(1)}>
                                Continue
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" placeholder={`Your ${selectedGame.name} username`} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="••••••••" />
                              </div>
                              <Button className="w-full" onClick={() => setConnectionStep(1)}>
                                Sign In
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {connectionStep === 1 && (
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg bg-muted/30">
                            <h4 className="mb-2 font-medium">Authorize Access</h4>
                            <p className="text-sm text-muted-foreground mb-4">ENTIRE is requesting permission to:</p>
                            <ul className="space-y-2 text-sm">
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>View your {selectedGame.name} profile</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Import your NFTs to {selectedGame.name}</span>
                              </li>
                              <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span>Manage your wearable items</span>
                              </li>
                            </ul>
                          </div>
                          <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setConnectionStep(0)}>
                              Back
                            </Button>
                            <Button onClick={() => setConnectionStep(2)}>Authorize</Button>
                          </div>
                        </div>
                      )}

                      {connectionStep === 2 && (
                        <div className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            You're almost done! Click the button below to complete the connection process and start
                            using your fashion NFTs in {selectedGame.name}.
                          </p>
                          <div className="flex justify-between">
                            <Button variant="outline" onClick={() => setConnectionStep(1)}>
                              Back
                            </Button>
                            <Button onClick={handleConnect} disabled={isConnecting}>
                              {isConnecting ? "Connecting..." : "Complete Connection"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="manage">
              <div className="p-4 text-center border rounded-lg">
                <p className="mb-4 text-muted-foreground">
                  You can view and manage your connected game accounts from your dashboard.
                </p>
                <Link href="/games">
                  <Button>Go to Game Dashboard</Button>
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
