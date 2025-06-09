import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface NFTPreviewCardProps {
  nft: {
    id: number
    name: string
    image: string
    gamePreview?: string
    platform: string
  }
}

export default function NFTPreviewCard({ nft }: NFTPreviewCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-2">
        <div className="aspect-square">
          <img src={nft.image || "/placeholder.svg"} alt={nft.name} className="object-cover w-full h-full" />
        </div>
        <div className="aspect-square">
          <img
            src={nft.gamePreview || "/placeholder.svg?height=200&width=200&query=3d avatar placeholder"}
            alt={`${nft.name} in ${nft.platform}`}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium truncate">{nft.name}</h3>
          <Badge variant="outline">{nft.platform}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-0 border-t">
        <Button variant="ghost" className="w-full rounded-none h-10" asChild>
          <Link href={`/collections/${nft.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
