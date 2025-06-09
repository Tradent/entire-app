import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden md:py-32">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-indigo-500/30" />
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Fashion Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                Metaverse
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Bridging the fashion world with the metaverse, for an open-source scene.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:justify-start">
              <Link href="/collections">
                <Button size="lg">Explore Collections</Button>
              </Link>
              <Link href="/submit">
                <Button variant="outline" size="lg">
                  Submit Your Brand
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 pt-4 md:justify-start">
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">100+</p>
                <p className="text-sm text-muted-foreground">Designer Brands</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">5K+</p>
                <p className="text-sm text-muted-foreground">Digital Assets</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-2xl font-bold">24K+</p>
                <p className="text-sm text-muted-foreground">Community Members</p>
              </div>
            </div>
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500/20 to-purple-500/20 animate-pulse" />
            <img
              src="/cyber-aura.png"
              alt="Digital Fashion Model"
              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
