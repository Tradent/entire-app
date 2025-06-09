import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LatestNews() {
  const latestArticles = [
    {
      id: "virtual-fashion-awards",
      title: "2025 Virtual Fashion Awards Announce Nominees",
      excerpt:
        "The prestigious digital fashion event reveals this year's nominees across 12 categories including Best Digital Designer and Most Innovative NFT Collection.",
      image: "/digital-fashion-abstract.png",
      category: "Events",
      date: "April 11, 2025",
    },
    {
      id: "nft-marketplace-trends",
      title: "NFT Marketplace Analysis: Q2 2025 Trends",
      excerpt:
        "Our quarterly analysis reveals shifting trends in the digital fashion marketplace, with wearable NFTs seeing unprecedented growth.",
      image: "/neon-threads.png",
      category: "NFTs",
      date: "April 10, 2025",
    },
    {
      id: "designer-spotlight-neocyber",
      title: "Designer Spotlight: NeoCyber's Groundbreaking Collection",
      excerpt:
        "Rising digital fashion house NeoCyber discusses their latest collection that bridges cyberpunk aesthetics with practical virtual world applications.",
      image: "/cyber-couturier.png",
      category: "Designers",
      date: "April 9, 2025",
    },
    {
      id: "metaverse-fashion-districts",
      title: "New Fashion Districts Emerge in Leading Metaverse Platforms",
      excerpt:
        "Virtual real estate dedicated to fashion experiences is booming across metaverse platforms, creating new opportunities for brands and designers.",
      image: "/voxel-cityscape.png",
      category: "Metaverse",
      date: "April 8, 2025",
    },
    {
      id: "digital-textile-innovation",
      title: "Breakthrough in Digital Textile Rendering Technology",
      excerpt:
        "New algorithms allow for ultra-realistic fabric physics and textures in digital fashion, closing the gap between physical and virtual clothing.",
      image: "/reactive-light-shirt.png",
      category: "Technology",
      date: "April 7, 2025",
    },
  ]

  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Latest News</h2>

      <div className="space-y-8">
        {latestArticles.map((article) => (
          <article key={article.id} className="flex flex-col gap-4 pb-8 border-b sm:flex-row last:border-0 last:pb-0">
            <div className="relative w-full sm:w-1/3 aspect-video overflow-hidden rounded-lg">
              <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
            </div>
            <div className="flex flex-col sm:w-2/3">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-purple-600 hover:bg-purple-700">{article.category}</Badge>
                <span className="flex items-center text-sm text-muted-foreground gap-1.5">
                  <CalendarDays className="w-4 h-4" />
                  {article.date}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                <Link href={`/news/${article.id}`} className="hover:text-purple-600 dark:hover:text-purple-400">
                  {article.title}
                </Link>
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">{article.excerpt}</p>
              <div className="mt-auto">
                <Link href={`/news/${article.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 p-0"
                  >
                    Read More <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button className="bg-purple-600 hover:bg-purple-700">Load More Articles</Button>
      </div>
    </section>
  )
}
