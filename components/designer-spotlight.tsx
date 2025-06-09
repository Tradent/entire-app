import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const designers = [
  {
    id: 1,
    name: "Aria Digital",
    specialty: "Avant-garde Wearables",
    followers: "12.5K",
    avatar: "/placeholder.svg?height=100&width=100&query=female fashion designer portrait",
    background: "/placeholder.svg?height=200&width=400&query=futuristic fashion studio with neon lights",
  },
  {
    id: 2,
    name: "Nexus Atelier",
    specialty: "Luxury Metaverse Apparel",
    followers: "8.7K",
    avatar: "/placeholder.svg?height=100&width=100&query=male fashion designer portrait",
    background: "/placeholder.svg?height=200&width=400&query=minimalist digital fashion studio",
  },
  {
    id: 3,
    name: "Pixel Couture",
    specialty: "Gaming Accessories",
    followers: "15.2K",
    avatar: "/placeholder.svg?height=100&width=100&query=non-binary fashion designer portrait",
    background: "/placeholder.svg?height=200&width=400&query=colorful gaming-inspired fashion studio",
  },
]

export default function DesignerSpotlight() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {designers.map((designer) => (
        <Link href={`/designers/${designer.id}`} key={designer.id}>
          <Card className="overflow-hidden transition-all hover:shadow-lg">
            <div className="relative h-48">
              <img
                src={designer.background || "/placeholder.svg"}
                alt={`${designer.name}'s studio`}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12 border-2 border-background">
                    <AvatarImage src={designer.avatar || "/placeholder.svg"} alt={designer.name} />
                    <AvatarFallback>{designer.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{designer.name}</h3>
                    <p className="text-xs text-muted-foreground">{designer.followers} followers</p>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{designer.specialty}</p>
                <Badge variant="outline">View Profile</Badge>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
