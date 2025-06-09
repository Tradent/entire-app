import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { CalendarDays } from "lucide-react"

export default function NewsHero() {
  return (
    <section className="relative overflow-hidden rounded-xl">
      <div className="relative aspect-[21/9] md:aspect-[21/7]">
        <Image
          src="/digital-fashion-abstract.png"
          alt="Digital Fashion Week Highlights"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-purple-600 hover:bg-purple-700">Featured</Badge>
          <span className="flex items-center text-sm text-gray-300 gap-1.5">
            <CalendarDays className="w-4 h-4" />
            April 15, 2025
          </span>
        </div>
        <h1 className="mb-2 text-2xl font-bold md:text-3xl lg:text-4xl">
          Digital Fashion Week Showcases Revolutionary NFT Collections
        </h1>
        <p className="max-w-3xl mb-4 text-sm text-gray-300 md:text-base">
          The world's first fully digital fashion week concludes with groundbreaking virtual runway shows and exclusive
          NFT drops from leading digital designers.
        </p>
        <Link
          href="/news/digital-fashion-week-showcases"
          className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors rounded-md bg-white/10 hover:bg-white/20"
        >
          Read Full Article
        </Link>
      </div>
    </section>
  )
}
