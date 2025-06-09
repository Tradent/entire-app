import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

export default function FeaturedArticles() {
  const featuredArticles = [
    {
      id: "metaverse-fashion-houses",
      title: "Top Fashion Houses Expand Metaverse Presence",
      excerpt:
        "Luxury brands are racing to establish virtual storefronts and digital collections in popular metaverse platforms.",
      image: "/voxel-metaverse-gathering.png",
      category: "Metaverse",
      date: "April 14, 2025",
    },
    {
      id: "nft-sustainability",
      title: "Sustainable Practices in NFT Fashion Production",
      excerpt:
        "Digital fashion creators implement carbon-neutral minting processes for environmentally conscious collections.",
      image: "/digital-threads.png",
      category: "Sustainability",
      date: "April 13, 2025",
    },
    {
      id: "ar-fashion-trends",
      title: "AR Fashion Try-On Technology Advances",
      excerpt: "New developments in augmented reality are revolutionizing how consumers experience digital fashion.",
      image: "/augmented-reality-interface.png",
      category: "Technology",
      date: "April 12, 2025",
    },
  ]

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Featured Articles</h2>
        <Link
          href="/news/featured"
          className="text-sm text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {featuredArticles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.id}`}
            className="group overflow-hidden rounded-lg border bg-card text-card-foreground shadow transition-all hover:shadow-md"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={article.image || "/placeholder.svg"}
                alt={article.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <Badge className="absolute top-3 left-3 bg-purple-600 hover:bg-purple-700">{article.category}</Badge>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-2">
                <CalendarDays className="w-4 h-4" />
                {article.date}
              </div>
              <h3 className="mb-2 text-lg font-semibold group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {article.title}
              </h3>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
