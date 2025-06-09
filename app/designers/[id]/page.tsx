import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ExternalLink, Instagram, Star, Twitter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// This would typically come from a database or API
const getDesignerData = (id: string) => {
  // Mock data for a specific designer
  return {
    id,
    name: id === "neo-atelier" ? "Neo Atelier" : "Designer",
    image: "/neon-threads.png",
    coverImage: "/placeholder.svg?height=400&width=1200&query=futuristic fashion studio with neon lights",
    bio: "Pioneering digital couture with a focus on reactive materials and dynamic silhouettes. Neo Atelier pushes the boundaries of what's possible in digital fashion, creating pieces that respond to their environment and wearer in real-time.",
    followers: 24500,
    following: 350,
    collections: 7,
    items: 42,
    rating: 4.9,
    tags: ["Avant-garde", "Reactive", "Couture", "Digital Fashion", "Metaverse"],
    socialLinks: {
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      website: "https://example.com",
    },
    featured: true,
    joinedDate: "March 2023",
    featuredCollections: [
      {
        id: "neo-genesis",
        name: "Neo Genesis",
        image: "/placeholder.svg?height=300&width=300&query=futuristic digital fashion collection",
        itemCount: 12,
        description: "A collection exploring the birth of new digital fashion paradigms.",
      },
      {
        id: "reactive-couture",
        name: "Reactive Couture",
        image: "/placeholder.svg?height=300&width=300&query=reactive digital fashion that changes color",
        itemCount: 8,
        description: "Garments that respond to environmental stimuli and wearer emotions.",
      },
      {
        id: "digital-atelier",
        name: "Digital Atelier",
        image: "/placeholder.svg?height=300&width=300&query=high fashion digital clothing",
        itemCount: 15,
        description: "Haute couture reimagined for the digital realm.",
      },
    ],
    featuredItems: [
      {
        id: "luminous-gown",
        name: "Luminous Gown",
        image: "/placeholder.svg?height=300&width=300&query=glowing digital fashion dress",
        price: "2.5 ETH",
      },
      {
        id: "reactive-jacket",
        name: "Reactive Jacket",
        image: "/placeholder.svg?height=300&width=300&query=digital fashion jacket with changing patterns",
        price: "1.8 ETH",
      },
      {
        id: "neural-headpiece",
        name: "Neural Headpiece",
        image: "/placeholder.svg?height=300&width=300&query=futuristic digital fashion headpiece",
        price: "1.2 ETH",
      },
      {
        id: "quantum-boots",
        name: "Quantum Boots",
        image: "/placeholder.svg?height=300&width=300&query=digital fashion futuristic boots",
        price: "0.9 ETH",
      },
    ],
    about: `
      Neo Atelier was founded in 2023 by a collective of fashion designers, 3D artists, and software engineers with a shared vision: to redefine what fashion means in the digital age.
      
      Our pieces are more than static digital assets - they're reactive, adaptive, and alive. Each garment is designed to respond to its environment, whether that's changing colors based on time of day in a metaverse, adapting to a wearer's movements, or transforming based on social interactions.
      
      We believe that digital fashion should be as expressive and dynamic as its physical counterpart, while exploring the unique possibilities that only exist in virtual spaces.
    `,
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const designer = getDesignerData(params.id)

  return {
    title: `${designer.name} | ENTIRE - Fashion Magazine for the Metaverse`,
    description: designer.bio,
  }
}

export default function DesignerDetailPage({ params }: { params: { id: string } }) {
  const designer = getDesignerData(params.id)

  return (
    <div className="container px-4 mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/designers" className="hover:text-foreground">
          Designers
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span>{designer.name}</span>
      </div>

      {/* Cover Image */}
      <div className="relative w-full h-64 mb-16 overflow-hidden rounded-xl md:h-80">
        <Image
          src={designer.coverImage || "/placeholder.svg"}
          alt={`${designer.name} cover`}
          fill
          className="object-cover"
        />
      </div>

      {/* Designer Profile Header */}
      <div className="relative flex flex-col items-center mb-8 md:flex-row md:items-start">
        <div className="absolute w-32 h-32 overflow-hidden border-4 border-background rounded-full -top-16 md:relative md:w-40 md:h-40 md:-mt-20 md:mr-6">
          <Image src={designer.image || "/placeholder.svg"} alt={designer.name} fill className="object-cover" />
        </div>

        <div className="mt-20 text-center md:mt-0 md:text-left md:flex-1">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{designer.name}</h1>
              <div className="flex items-center justify-center gap-2 mt-1 md:justify-start">
                <Badge variant="secondary" className="text-xs">
                  Verified Designer
                </Badge>
                <span className="flex items-center text-sm text-muted-foreground">
                  <Star className="w-4 h-4 mr-1 text-yellow-500" />
                  {designer.rating}
                </span>
                <span className="text-sm text-muted-foreground">Joined {designer.joinedDate}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button>Follow</Button>
              <Button variant="outline">Message</Button>
            </div>
          </div>

          <p className="max-w-3xl mt-4 text-muted-foreground">{designer.bio}</p>

          <div className="flex flex-wrap justify-center gap-2 mt-4 md:justify-start">
            {designer.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 mt-6 md:justify-start">
            <div className="text-center">
              <p className="text-xl font-bold">{designer.collections}</p>
              <p className="text-sm text-muted-foreground">Collections</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{designer.items}</p>
              <p className="text-sm text-muted-foreground">Items</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{(designer.followers / 1000).toFixed(1)}k</p>
              <p className="text-sm text-muted-foreground">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">{designer.following}</p>
              <p className="text-sm text-muted-foreground">Following</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 md:justify-start">
            <Link href={designer.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Twitter className="w-5 h-5" />
              </Button>
            </Link>
            <Link href={designer.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Instagram className="w-5 h-5" />
              </Button>
            </Link>
            <Link href={designer.socialLinks.website} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <ExternalLink className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Designer Content */}
      <Tabs defaultValue="collections" className="mt-12">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="items">Items</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {designer.featuredCollections.map((collection) => (
              <Link href={`/collections/${collection.id}`} key={collection.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-square">
                    <Image
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 text-xl font-bold">{collection.name}</h3>
                    <p className="mb-2 text-sm text-muted-foreground">{collection.itemCount} items</p>
                    <p className="text-sm line-clamp-2">{collection.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="items" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {designer.featuredItems.map((item) => (
              <Link href={`/marketplace/${item.id}`} key={item.id}>
                <Card className="overflow-hidden transition-all hover:shadow-md">
                  <div className="relative aspect-square">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-bold">{item.name}</h3>
                    <p className="text-sm">{item.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-bold">About {designer.name}</h2>
              <div className="space-y-4 text-muted-foreground">
                {designer.about.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-4 text-2xl font-bold">Recent Activity</h2>
              <div className="space-y-4">
                <ActivityItem type="Collection Launch" title="Neo Genesis Collection" time="2 days ago" />
                <ActivityItem type="Sale" title="Luminous Gown sold for 2.5 ETH" time="5 days ago" />
                <ActivityItem type="Collaboration" title="Announced collaboration with Pixel Punk" time="1 week ago" />
                <ActivityItem type="Event" title="Hosted digital runway show in Decentraland" time="2 weeks ago" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upcoming Events */}
      <section className="mt-12 mb-12">
        <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <Badge className="mb-2">May 15, 2025</Badge>
              <h3 className="mb-1 text-xl font-bold">Digital Runway Showcase</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                A virtual fashion show featuring the latest Neo Genesis collection.
              </p>
              <Button variant="outline" className="w-full">
                Add to Calendar
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Badge className="mb-2">June 3, 2025</Badge>
              <h3 className="mb-1 text-xl font-bold">Designer Masterclass</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Learn digital fashion design techniques from Neo Atelier.
              </p>
              <Button variant="outline" className="w-full">
                Register
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Badge className="mb-2">June 20, 2025</Badge>
              <h3 className="mb-1 text-xl font-bold">Metaverse Pop-up Shop</h3>
              <p className="mb-4 text-sm text-muted-foreground">Visit our exclusive pop-up shop in Decentraland.</p>
              <Button variant="outline" className="w-full">
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

function ActivityItem({ type, title, time }) {
  return (
    <div className="flex items-start gap-4 p-4 border rounded-lg">
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
        <Badge variant="outline">{type[0]}</Badge>
      </div>
      <div className="flex-1">
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
