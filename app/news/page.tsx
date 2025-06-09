import type { Metadata } from "next"
import NewsHero from "@/components/news/news-hero"
import FeaturedArticles from "@/components/news/featured-articles"
import NewsCategories from "@/components/news/news-categories"
import LatestNews from "@/components/news/latest-news"
import TrendingTopics from "@/components/news/trending-topics"
import NewsletterSignup from "@/components/news/newsletter-signup"

export const metadata: Metadata = {
  title: "Fashion News | ENTIRE",
  description: "Stay updated with the latest in digital fashion, NFTs, and metaverse style trends.",
}

export default function NewsPage() {
  return (
    <main className="container px-4 mx-auto space-y-12 pb-16">
      <NewsHero />
      <FeaturedArticles />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <NewsCategories />
          <LatestNews />
        </div>
        <aside className="space-y-8">
          <TrendingTopics />
          <NewsletterSignup />
        </aside>
      </div>
    </main>
  )
}
