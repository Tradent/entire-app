import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface GameIntegrationCardProps {
  game: {
    id: string
    name: string
    description: string
    image: string
    supportedItems: string[]
    status: string
    userCount: string
    url: string
  }
}

export default function GameIntegrationCard({ game }: GameIntegrationCardProps) {
  const isLive = game.status === "Live"

  return (
    <Card className="overflow-hidden h-full">
      <div className="relative h-48">
        <img src={game.image || "/placeholder.svg"} alt={game.name} className="object-cover w-full h-full" />
        <div className="absolute top-2 right-2">
          <Badge variant={isLive ? "default" : "outline"}>{game.status}</Badge>
        </div>
      </div>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{game.name}</span>
          <span className="text-sm font-normal text-muted-foreground">{game.userCount} users</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">{game.description}</p>
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium">Supported Item Types:</p>
          <div className="flex flex-wrap gap-2">
            {game.supportedItems.map((item, index) => (
              <Badge key={index} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={isLive ? `/games/${game.id}` : "#"}>
          <Button variant="outline" disabled={!isLive}>
            {isLive ? "Connect" : "Coming Soon"}
          </Button>
        </Link>
        <a href={game.url} target="_blank" rel="noopener noreferrer">
          <Button variant="ghost" size="icon">
            <ExternalLink className="w-4 h-4" />
            <span className="sr-only">Visit {game.name}</span>
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
