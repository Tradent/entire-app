"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock followers data
const followersData = [
  {
    id: "user1",
    username: "metaverse_maven",
    displayName: "Metaverse Maven",
    avatar: "/vibrant-blue-portrait.png",
    isVerified: true,
    isFollowing: true,
  },
  {
    id: "user2",
    username: "digital_dreamer",
    displayName: "Digital Dreamer",
    avatar: "/vibrant-green-portrait.png",
    isVerified: false,
    isFollowing: false,
  },
  {
    id: "user3",
    username: "nft_collector",
    displayName: "NFT Collector",
    avatar: "/vibrant-redhead.png",
    isVerified: true,
    isFollowing: true,
  },
  {
    id: "user4",
    username: "crypto_fashionista",
    displayName: "Crypto Fashionista",
    avatar: "/placeholder.svg?height=100&width=100&query=person with purple hair",
    isVerified: false,
    isFollowing: false,
  },
  {
    id: "user5",
    username: "virtual_stylist",
    displayName: "Virtual Stylist",
    avatar: "/placeholder.svg?height=100&width=100&query=person with yellow hair",
    isVerified: false,
    isFollowing: true,
  },
  {
    id: "user6",
    username: "blockchain_couture",
    displayName: "Blockchain Couture",
    avatar: "/placeholder.svg?height=100&width=100&query=person with pink hair",
    isVerified: true,
    isFollowing: false,
  },
]

export default function FollowersPage() {
  const [followers, setFollowers] = useState(followersData)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFollowers = followers.filter(
    (follower) =>
      follower.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      follower.username.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleFollow = (userId: string) => {
    setFollowers(
      followers.map((follower) =>
        follower.id === userId ? { ...follower, isFollowing: !follower.isFollowing } : follower,
      ),
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
        <h1 className="text-3xl font-bold">Followers</h1>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search followers..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFollowers.length === 0 ? (
          <div className="p-8 text-center border rounded-lg">
            <p className="text-muted-foreground">No followers found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredFollowers.map((follower) => (
            <div key={follower.id} className="flex items-center justify-between p-4 border rounded-lg">
              <Link href={`/profile/${follower.username}`} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.displayName} />
                  <AvatarFallback>{follower.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{follower.displayName}</p>
                    {follower.isVerified && <Badge variant="secondary">Verified</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">@{follower.username}</p>
                </div>
              </Link>
              <Button
                variant={follower.isFollowing ? "outline" : "default"}
                size="sm"
                onClick={() => toggleFollow(follower.id)}
              >
                {follower.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
