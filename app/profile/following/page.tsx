"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock following data
const followingData = [
  {
    id: "designer1",
    username: "metafashion",
    displayName: "MetaFashion",
    avatar: "/placeholder.svg?height=100&width=100&query=female fashion designer portrait",
    isVerified: true,
    isFollowing: true,
    type: "Designer",
  },
  {
    id: "designer2",
    username: "digitalcouture",
    displayName: "Digital Couture",
    avatar: "/placeholder.svg?height=100&width=100&query=male fashion designer portrait",
    isVerified: true,
    isFollowing: true,
    type: "Designer",
  },
  {
    id: "user1",
    username: "crypto_collector",
    displayName: "Crypto Collector",
    avatar: "/placeholder.svg?height=100&width=100&query=person with orange hair",
    isVerified: false,
    isFollowing: true,
    type: "Collector",
  },
  {
    id: "brand1",
    username: "virtualvogue",
    displayName: "VirtualVogue",
    avatar: "/placeholder.svg?height=100&width=100&query=fashion brand logo minimal",
    isVerified: true,
    isFollowing: true,
    type: "Brand",
  },
  {
    id: "user2",
    username: "nft_enthusiast",
    displayName: "NFT Enthusiast",
    avatar: "/vibrant-blue-portrait.png",
    isVerified: false,
    isFollowing: true,
    type: "Collector",
  },
]

export default function FollowingPage() {
  const [following, setFollowing] = useState(followingData)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFollowing = following.filter(
    (follow) =>
      follow.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follow.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follow.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFollow = (userId: string) => {
    setFollowing(
      following.map((follow) => (follow.id === userId ? { ...follow, isFollowing: !follow.isFollowing } : follow)),
    )
  }

  return (
    <div className="container px-4 py-12 mx-auto max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Following</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search following..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFollowing.length === 0 ? (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">No accounts found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredFollowing.map((follow) => (
            <div key={follow.id} className="flex items-center justify-between p-4 border rounded-lg">
              <Link href={`/profile/${follow.username}`} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={follow.avatar || "/placeholder.svg"} alt={follow.displayName} />
                  <AvatarFallback>{follow.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{follow.displayName}</p>
                    {follow.isVerified && <Badge variant="secondary">Verified</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">@{follow.username}</p>
                    <Badge variant="outline">{follow.type}</Badge>
                  </div>
                </div>
              </Link>
              <Button
                variant={follow.isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => toggleFollow(follow.id)}
              >
                {follow.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
