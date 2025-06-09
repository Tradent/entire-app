"use client"

import type { Badge } from "@/services/badge-service"
import { BadgeIcon } from "./badge-icon"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface RecentAchievementsProps {
  badges: Badge[]
  className?: string
}

export function RecentAchievements({ badges, className }: RecentAchievementsProps) {
  if (badges.length === 0) {
    return null
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle>Recent Achievements</CardTitle>
        <CardDescription>Badges you've unlocked recently</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {badges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4"
          >
            <BadgeIcon badge={badge} size="md" showRarity />
            <div>
              <h4 className="font-medium">{badge.name}</h4>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
              {badge.unlockedAt && (
                <p className="text-xs text-muted-foreground">Unlocked on {badge.unlockedAt.toLocaleDateString()}</p>
              )}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
