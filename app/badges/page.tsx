"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BadgeCategory,
  BadgeRarity,
  getUserBadges,
  getBadgesByCategory,
  getUnlockedBadges,
} from "@/services/badge-service"
import { BadgeCard } from "@/components/badges/badge-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { ArrowRight, Award, Crown, ShoppingBag, Users, Calendar, Palette } from "lucide-react"

export default function BadgesPage() {
  const [activeCategory, setActiveCategory] = useState<BadgeCategory | "all">("all")

  const allBadges = getUserBadges()
  const unlockedBadges = getUnlockedBadges()

  // Calculate completion percentage
  const completionPercentage = Math.round((unlockedBadges.length / allBadges.length) * 100)

  // Get badges for the active category
  const displayedBadges = activeCategory === "all" ? allBadges : getBadgesByCategory(activeCategory as BadgeCategory)

  // Count badges by category
  const categoryCounts = Object.values(BadgeCategory).reduce(
    (acc, category) => {
      const badges = getBadgesByCategory(category)
      const unlocked = badges.filter((b) => b.unlockedAt !== undefined).length
      acc[category] = { total: badges.length, unlocked }
      return acc
    },
    {} as Record<string, { total: number; unlocked: number }>,
  )

  // Count badges by rarity
  const rarityData = Object.values(BadgeRarity).map((rarity) => {
    const total = allBadges.filter((b) => b.rarity === rarity).length
    const unlocked = unlockedBadges.filter((b) => b.rarity === rarity).length
    return { rarity, total, unlocked }
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Achievement Badges</h1>
          <p className="text-muted-foreground">Collect badges by participating in the ENTIRE ecosystem</p>
        </div>
        <Link href="/badges/unlock-demo">
          <Button variant="outline">
            Badge Unlock Demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Progress Overview */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Badge Collection Progress</CardTitle>
          <CardDescription>Track your achievement progress across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span>Overall Completion</span>
                <span className="font-medium">
                  {unlockedBadges.length} / {allBadges.length} ({completionPercentage}%)
                </span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {rarityData.map(({ rarity, total, unlocked }) => (
                <Card key={rarity} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium capitalize">{rarity}</h3>
                      <span className="text-sm">
                        {unlocked}/{total}
                      </span>
                    </div>
                    <Progress value={total > 0 ? (unlocked / total) * 100 : 0} className="h-1 mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-8">
        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === "all" ? "border-primary" : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Award className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">All Badges</h3>
              <p className="text-xs text-muted-foreground">
                {unlockedBadges.length}/{allBadges.length} unlocked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === BadgeCategory.Collection ? "border-primary" : ""}`}
          onClick={() => setActiveCategory(BadgeCategory.Collection)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium">Collection</h3>
              <p className="text-xs text-muted-foreground">
                {categoryCounts[BadgeCategory.Collection]?.unlocked}/{categoryCounts[BadgeCategory.Collection]?.total}{" "}
                unlocked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === BadgeCategory.Creation ? "border-primary" : ""}`}
          onClick={() => setActiveCategory(BadgeCategory.Creation)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Palette className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium">Creation</h3>
              <p className="text-xs text-muted-foreground">
                {categoryCounts[BadgeCategory.Creation]?.unlocked}/{categoryCounts[BadgeCategory.Creation]?.total}{" "}
                unlocked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === BadgeCategory.Social ? "border-primary" : ""}`}
          onClick={() => setActiveCategory(BadgeCategory.Social)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-medium">Social</h3>
              <p className="text-xs text-muted-foreground">
                {categoryCounts[BadgeCategory.Social]?.unlocked}/{categoryCounts[BadgeCategory.Social]?.total} unlocked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === BadgeCategory.Event ? "border-primary" : ""}`}
          onClick={() => setActiveCategory(BadgeCategory.Event)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium">Event</h3>
              <p className="text-xs text-muted-foreground">
                {categoryCounts[BadgeCategory.Event]?.unlocked}/{categoryCounts[BadgeCategory.Event]?.total} unlocked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === BadgeCategory.Marketplace ? "border-primary" : ""}`}
          onClick={() => setActiveCategory(BadgeCategory.Marketplace)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <ShoppingBag className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-medium">Marketplace</h3>
              <p className="text-xs text-muted-foreground">
                {categoryCounts[BadgeCategory.Marketplace]?.unlocked}/{categoryCounts[BadgeCategory.Marketplace]?.total}{" "}
                unlocked
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:shadow-md transition-shadow ${activeCategory === BadgeCategory.Special ? "border-primary" : ""}`}
          onClick={() => setActiveCategory(BadgeCategory.Special)}
        >
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Crown className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-medium">Special</h3>
              <p className="text-xs text-muted-foreground">
                {categoryCounts[BadgeCategory.Special]?.unlocked}/{categoryCounts[BadgeCategory.Special]?.total}{" "}
                unlocked
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badge Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {activeCategory === "all" ? "All Badges" : `${activeCategory} Badges`}
        </h2>

        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
            <TabsTrigger value="locked">Locked</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedBadges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="unlocked">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedBadges
                .filter((badge) => badge.unlockedAt !== undefined)
                .map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="locked">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayedBadges
                .filter((badge) => badge.unlockedAt === undefined)
                .map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
