import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import GameIntegrationCard from "@/components/game-integration-card"
import ConnectedGamesSection from "@/components/connected-games-section"

const metaverseGames = [
  {
    id: "decentraland",
    name: "Decentraland",
    description:
      "A decentralized virtual world where users can create, experience, and monetize content and applications.",
    image: "/decentraland-gathering.png",
    supportedItems: ["Clothing", "Accessories", "Footwear"],
    status: "Live",
    userCount: "2.5M+",
    url: "https://decentraland.org",
  },
  {
    id: "sandbox",
    name: "The Sandbox",
    description:
      "A virtual world where players can build, own, and monetize their gaming experiences using SAND, the platform's utility token.",
    image: "/voxel-metaverse-gathering.png",
    supportedItems: ["Clothing", "Accessories", "Full Avatars"],
    status: "Live",
    userCount: "3M+",
    url: "https://www.sandbox.game",
  },
  {
    id: "roblox",
    name: "Roblox",
    description:
      "An online platform and storefront where users can play games and create experiences using custom avatars.",
    image: "/stylish-roblox-hangout.png",
    supportedItems: ["Clothing", "Accessories", "Animations"],
    status: "Integration Coming Soon",
    userCount: "50M+",
    url: "https://www.roblox.com",
  },
  {
    id: "somnium",
    name: "Somnium Space",
    description: "A cross-platform virtual reality world that focuses on social interactions and land ownership.",
    image: "/somnium-cityscape.png",
    supportedItems: ["Full Avatars", "Accessories", "Virtual Homes"],
    status: "Live",
    userCount: "500K+",
    url: "https://somniumspace.com",
  },
  {
    id: "cryptovoxels",
    name: "Voxels",
    description:
      "A virtual world and metaverse, powered by the Ethereum blockchain, where you can buy land and build stores and art galleries.",
    image: "/voxel-cityscape.png",
    supportedItems: ["Clothing", "Accessories", "Digital Art"],
    status: "Live",
    userCount: "800K+",
    url: "https://www.voxels.com",
  },
  {
    id: "upland",
    name: "Upland",
    description:
      "A blockchain-based property trading game where users can buy, sell, and trade virtual properties mapped to real addresses.",
    image: "/placeholder.svg?height=300&width=600&query=upland metaverse game with property map",
    supportedItems: ["Accessories", "Property Decorations"],
    status: "Integration Coming Soon",
    userCount: "1.5M+",
    url: "https://www.upland.me",
  },
]

export default function GamesPage() {
  return (
    <div className="container px-4 py-12 mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Metaverse Game Integrations</h1>
      </div>

      <div className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Connect Your Fashion NFTs to Virtual Worlds</CardTitle>
            <CardDescription>
              Wear your digital fashion across multiple metaverse platforms and games. Connect your wallet to manage
              your wearable NFTs across different virtual worlds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-muted/30">
              <h3 className="mb-2 font-medium">How It Works</h3>
              <ol className="ml-5 space-y-2 list-decimal text-muted-foreground">
                <li>Connect your wallet containing your fashion NFTs</li>
                <li>Link your metaverse game accounts to ENTIRE</li>
                <li>Select which NFTs you want to use in each platform</li>
                <li>Enjoy your fashion items across multiple virtual worlds</li>
              </ol>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/games/connect">
              <Button>Connect Game Accounts</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <ConnectedGamesSection />

      <div className="mb-8">
        <h2 className="mb-6 text-2xl font-bold">Supported Metaverse Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {metaverseGames.map((game) => (
            <GameIntegrationCard key={game.id} game={game} />
          ))}
        </div>
      </div>

      <div className="mt-16">
        <Card>
          <CardHeader>
            <CardTitle>Are You a Game Developer?</CardTitle>
            <CardDescription>
              Integrate your metaverse game or platform with ENTIRE to allow users to bring their fashion NFTs into your
              virtual world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Our open SDK makes it easy to support wearable NFTs from the ENTIRE ecosystem. Join our growing network of
              metaverse partners and tap into a community of fashion-forward digital creators and users.
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="outline">Technical Documentation</Badge>
              <Badge variant="outline">Integration Guidelines</Badge>
              <Badge variant="outline">Asset Standards</Badge>
              <Badge variant="outline">API Reference</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/developers">
              <Button variant="outline" className="gap-2">
                Developer Portal <ExternalLink className="w-4 h-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
