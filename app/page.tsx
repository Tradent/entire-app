import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import FeaturedNFTs from "@/components/featured-nfts"
import DesignerSpotlight from "@/components/designer-spotlight"
import MetaverseNews from "@/components/metaverse-news"
import HeroSection from "@/components/hero-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <main className="flex-1">
        <section className="container px-4 py-12 mx-auto md:py-24">
          <div className="flex flex-col items-start justify-between gap-4 mb-12 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Featured Collections</h2>
              <p className="mt-2 text-muted-foreground">Explore the latest fashion NFTs from top designers</p>
            </div>
            <Link href="/collections">
              <Button variant="ghost" className="gap-1">
                View all collections <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <FeaturedNFTs />
        </section>

        <section className="py-12 bg-black/5 dark:bg-white/5">
          <div className="container px-4 mx-auto">
            <div className="flex flex-col items-start justify-between gap-4 mb-12 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Designer Spotlight</h2>
                <p className="mt-2 text-muted-foreground">Meet the creative minds shaping metaverse fashion</p>
              </div>
              <Link href="/designers">
                <Button variant="ghost" className="gap-1">
                  All designers <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <DesignerSpotlight />
          </div>
        </section>

        <section className="container px-4 py-12 mx-auto md:py-24">
          <div className="flex flex-col items-start justify-between gap-4 mb-12 md:flex-row md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Metaverse News</h2>
              <p className="mt-2 text-muted-foreground">Stay updated with the latest trends in digital fashion</p>
            </div>
            <Link href="/news">
              <Button variant="ghost" className="gap-1">
                All news <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <MetaverseNews />
        </section>

        <section className="py-16 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20">
          <div className="container px-4 mx-auto text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-4" />
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Launch Your Fashion Brand</h2>
            <p className="max-w-2xl mx-auto mb-8 text-muted-foreground">
              Submit your digital fashion collection for a chance to be featured in ENTIRE magazine
            </p>
            <Link href="/submit">
              <Button size="lg" className="gap-2">
                Submit Your Collection <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
