import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MarketplaceBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-indigo-500/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

      <img src="/placeholder.svg?key=qw4a3" alt="Marketplace Banner" className="object-cover w-full h-64 md:h-80" />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
        <h2 className="mb-2 text-2xl font-bold md:text-4xl">Digital Fashion Marketplace</h2>
        <p className="max-w-2xl mb-6 text-sm md:text-base">
          Discover, collect, and trade exclusive digital fashion NFTs from top designers around the metaverse
        </p>
        <div className="flex flex-wrap gap-4">
          <Button size="lg" className="bg-white text-black hover:bg-white/90">
            Explore Collections
          </Button>
          <Link href="/marketplace/create">
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
              Sell Your NFT
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
