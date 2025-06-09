import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "Luxury Brands Enter the Metaverse with Digital Fashion Lines",
    excerpt: "Major fashion houses are launching exclusive digital collections for virtual worlds.",
    date: "April 15, 2025",
    image: "/placeholder.svg?height=200&width=400&query=luxury fashion brand digital showroom",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "NFT Fashion Week Announces Virtual Runway Shows",
    excerpt: "The biggest digital fashion event of the year will showcase works from top designers.",
    date: "April 12, 2025",
    image: "/placeholder.svg?height=200&width=400&query=virtual fashion runway show with avatars",
    readTime: "4 min read",
  },
  {
    id: 3,
    title: "Gaming Platforms Partner with Fashion Brands for In-Game Wearables",
    excerpt: "Popular games are collaborating with designers to create exclusive virtual clothing.",
    date: "April 10, 2025",
    image: "/placeholder.svg?height=200&width=400&query=video game character wearing designer clothes",
    readTime: "6 min read",
  },
]

export default function MetaverseNews() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {newsItems.map((item) => (
        <Link href={`/news/${item.id}`} key={item.id}>
          <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
            <div className="relative aspect-video">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="object-cover w-full h-full" />
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <CalendarIcon className="w-3 h-3" />
                <span>{item.date}</span>
                <span>•</span>
                <span>{item.readTime}</span>
              </div>
              <h3 className="mb-2 font-semibold line-clamp-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-3">{item.excerpt}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <span className="text-sm font-medium text-primary">Read more</span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
