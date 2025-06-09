"use client"

import { useState } from "react"
import {
  type Badge,
  BadgeCategory,
  getUserBadges,
  getUnlockedBadges,
  getLockedBadges,
  getRecentlyUnlockedBadges,
} from "@/services/badge-service"
import { BadgeCard } from "@/components/badges/badge-card"
import { RecentAchievements } from "@/components/badges/recent-achievements"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ProfileAchievements() {
  const [filter, setFilter] = useState<"all" | "unlocked" | "locked">("all")
  const [categoryFilter, setCategoryFilter] = useState<BadgeCategory | "all">("all")

  const allBadges = getUserBadges()
  const unlockedBadges = getUnlockedBadges()
  const recentBadges = getRecentlyUnlockedBadges()

  // Calculate completion percentage
  const completionPercentage = Math.round((unlockedBadges.length / allBadges.length) * 100)

  // Filter badges based on selected filters
  let filteredBadges: Badge[] = []

  if (filter === "all") {
    filteredBadges = allBadges
  } else if (filter === "unlocked") {
    filteredBadges = getUnlockedBadges()
  } else if (filter === "locked") {
    filteredBadges = getLockedBadges()
  }

  if (categoryFilter !== "all") {
    filteredBadges = filteredBadges.filter((badge) => badge.category === categoryFilter)
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Achievement Stats */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Achievement Progress</CardTitle>
            <CardDescription>Track your badge collection progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Overall Completion</span>
                  <span>{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-muted rounded-md">
                  <p className="text-2xl font-bold">{unlockedBadges.length}</p>
                  <p className="text-xs text-muted-foreground">Badges Earned</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-md">
                  <p className="text-2xl font-bold">{allBadges.length - unlockedBadges.length}</p>
                  <p className="text-xs text-muted-foreground">Badges Remaining</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Achievements */}
        <RecentAchievements badges={recentBadges} />
      </div>

      {/* Badge Collection */}
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Badge Collection</h2>

          <div className="flex gap-2">
            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as BadgeCategory | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value={BadgeCategory.Collection}>Collection</SelectItem>
                <SelectItem value={BadgeCategory.Creation}>Creation</SelectItem>
                <SelectItem value={BadgeCategory.Social}>Social</SelectItem>
                <SelectItem value={BadgeCategory.Event}>Event</SelectItem>
                <SelectItem value={BadgeCategory.Marketplace}>Marketplace</SelectItem>
                <SelectItem value={BadgeCategory.Special}>Special</SelectItem>
              </SelectContent>
            </Select>

            <Tabs
              value={filter}
              onValueChange={(value) => setFilter(value as "all" | "unlocked" | "locked")}
              className="w-[300px]"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
                <TabsTrigger value="locked">Locked</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}

          {filteredBadges.length === 0 && (
            <div className="col-span-full p-12 text-center border rounded-lg">
              <p className="text-muted-foreground">No badges found matching your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
