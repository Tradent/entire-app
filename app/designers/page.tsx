import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Star, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Designers | ENTIRE - Fashion Magazine for the Metaverse",
  description: "Discover the most innovative fashion designers creating for the metaverse.",
}

// Mock data for designers
const featuredDesigners = [
  {
    id: "neo-atelier",
    name: "Neo Atelier",
    image: "/neon-threads.png",
    bio: "Pioneering digital couture with a focus on reactive materials and dynamic silhouettes.",
    followers: 24500,
    collections: 7,
    rating: 4.9,
    tags: ["Avant-garde", "Reactive", "Couture"],
    featured: true,
  },
  {
    id: "pixel-punk",
    name: "Pixel Punk",
    image: "/neon-threads.png",
    bio: "Merging retro gaming aesthetics with futuristic streetwear for the digital generation.",
    followers: 18700,
    collections: 5,
    rating: 4.7,
    tags: ["Streetwear", "Gaming", "Retro-future"],
    featured: true,
  },
  {
    id: "ethereal-threads",
    name: "Ethereal Threads",
    image: "/placeholder.svg?key=2cw7p",
    bio: "Creating otherworldly garments that blur the line between physical and digital fashion.",
    followers: 31200,
    collections: 9,
    rating: 4.8,
    tags: ["Ethereal", "Luxury", "Fluid"],
    featured: true,
  },
]

const allDesigners = [
  ...featuredDesigners,
  {
    id: "voxel-vogue",
    name: "Voxel Vogue",
    image: "/blocky-couture.png",
    bio: "Specializing in voxel-based fashion that bridges the gap between blocky game worlds and high fashion.",
    followers: 12300,
    collections: 4,
    rating: 4.5,
    tags: ["Voxel", "Gaming", "Geometric"],
    featured: false,
  },
  {
    id: "neural-couture",
    name: "Neural Couture",
    image: "/cyber-couturier.png",
    bio: "AI-assisted design collective creating fashion at the intersection of human creativity and machine learning.",
    followers: 15600,
    collections: 6,
    rating: 4.6,
    tags: ["AI", "Generative", "Futuristic"],
    featured: false,
  },
  {
    id: "hologram-haus",
    name: "Hologram Haus",
    image: "/placeholder.svg?height=400&width=400&query=holographic fashion designer with iridescent clothing",
    bio: "Specializing in holographic and light-reactive garments that transform based on environment.",
    followers: 19800,
    collections: 5,
    rating: 4.7,
    tags: ["Holographic", "Interactive", "Luminous"],
    featured: false,
  },
  {
    id: "crypto-couturier",
    name: "Crypto Couturier",
    image: "/placeholder.svg?height=400&width=400&query=blockchain fashion designer with digital patterns",
    bio: "Blockchain fashion pioneer creating verifiably unique pieces with embedded smart contracts.",
    followers: 22100,
    collections: 8,
    rating: 4.8,
    tags: ["Blockchain", "Luxury", "Smart Fashion"],
    featured: false,
  },
  {
    id: "metaverse-modiste",
    name: "Metaverse Modiste",
    image: "/placeholder.svg?height=400&width=400&query=virtual reality fashion designer with headset",
    bio: "Creating fashion specifically designed for optimal expression across multiple metaverse platforms.",
    followers: 17400,
    collections: 6,
    rating: 4.6,
    tags: ["Cross-platform", "Metaverse", "Adaptive"],
    featured: false,
  },
]

// Categories for filtering
const designerCategories = ["All", "Avant-garde", "Streetwear", "Luxury", "Gaming", "Blockchain", "AI-Generated"]

export default function DesignersPage() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span>Designers</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Fashion Designers</h1>
        <p className="text-xl text-muted-foreground">
          Discover the most innovative fashion designers creating for the metaverse
        </p>
      </div>

      <Tabs defaultValue="featured" className="mb-8">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="all">All Designers</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New Arrivals</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Categories
            </Button>
            <Button variant="outline" size="sm">
              Sort By
            </Button>
          </div>
        </div>

        <TabsContent value="featured" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredDesigners.map((designer) => (
              <DesignerCard key={designer.id} designer={designer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allDesigners.map((designer) => (
              <DesignerCard key={designer.id} designer={designer} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allDesigners
              .sort((a, b) => b.followers - a.followers)
              .slice(0, 6)
              .map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="new" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...allDesigners]
              .sort(() => 0.5 - Math.random())
              .slice(0, 3)
              .map((designer) => (
                <DesignerCard key={designer.id} designer={designer} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Categories</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {designerCategories.map((category) => (
            <Button key={category} variant={category === "All" ? "default" : "outline"} className="justify-start">
              {category}
            </Button>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Upcoming Designer Spotlights</h2>
          <Button variant="outline">View Calendar</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <SpotlightCard
            title="Digital Runway Showcase"
            designer="Neo Atelier"
            date="May 15, 2025"
            image="/placeholder.svg?height=200&width=400&query=digital fashion runway with neon lights"
          />
          <SpotlightCard
            title="Metaverse Collection Launch"
            designer="Pixel Punk"
            date="May 22, 2025"
            image="/placeholder.svg?height=200&width=400&query=virtual fashion show in cyberpunk setting"
          />
          <SpotlightCard
            title="AR Fashion Experience"
            designer="Ethereal Threads"
            date="June 3, 2025"
            image="/placeholder.svg?height=200&width=400&query=augmented reality fashion experience"
          />
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Become a Featured Designer</h2>
          <Button>Apply Now</Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center gap-6 p-6 text-center md:flex-row md:text-left">
            <div className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=200&width=200&query=digital fashion designer workspace"
                alt="Designer application"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <div>
              <h3 className="mb-2 text-xl font-bold">Showcase Your Digital Fashion</h3>
              <p className="mb-4 text-muted-foreground">
                Join our community of innovative designers pushing the boundaries of fashion in the metaverse. Get
                featured, connect with collectors, and grow your digital fashion brand.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Portfolio Review</Badge>
                <Badge variant="outline">Marketing Support</Badge>
                <Badge variant="outline">NFT Minting</Badge>
                <Badge variant="outline">Community Access</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

function DesignerCard({ designer }) {
  return (
    <Link href={`/designers/${designer.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-square">
          <Image src={designer.image || "/placeholder.svg"} alt={designer.name} fill className="object-cover" />
          {designer.featured && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500">Featured</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-1 text-xl font-bold">{designer.name}</h3>
          <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{designer.bio}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {designer.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>{designer.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>{(designer.followers / 1000).toFixed(1)}k followers</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function SpotlightCard({ title, designer, date, image }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-40">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-4">
        <h3 className="mb-1 text-lg font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">By {designer}</p>
        <p className="mt-2 text-sm">{date}</p>
      </CardContent>
    </Card>
  )
}
