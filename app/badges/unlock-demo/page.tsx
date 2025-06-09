"use client"

import { useState } from "react"
import { type Badge, badges } from "@/services/badge-service"
import { BadgeCard } from "@/components/badges/badge-card"
import { BadgeNotification } from "@/components/notifications/badge-notification"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { triggerBadgeUnlockNotification } from "@/services/notification-service"

export default function BadgeUnlockDemo() {
  const [showNotification, setShowNotification] = useState(false)
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null)

  // Filter to only locked badges
  const lockedBadges = badges.filter((badge) => badge.unlockedAt === undefined)

  const handleUnlockBadge = (badge: Badge) => {
    // Create a copy of the badge with an unlock date
    const unlockedBadge = {
      ...badge,
      unlockedAt: new Date(),
    }

    setSelectedBadge(unlockedBadge)
    setShowNotification(true)

    // Trigger a notification
    triggerBadgeUnlockNotification(unlockedBadge)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Badge Unlock Demo</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Badge Unlock Simulation</CardTitle>
          <CardDescription>
            This page demonstrates how badges are unlocked and how notifications appear. In a real application, badges
            would be unlocked based on user actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Click on any of the locked badges below to simulate unlocking it. This will trigger a notification and
            update the badge status.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lockedBadges.map((badge) => (
          <div key={badge.id} className="relative group">
            <BadgeCard badge={badge} />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
              <Button onClick={() => handleUnlockBadge(badge)}>Unlock Badge</Button>
            </div>
          </div>
        ))}
      </div>

      {showNotification && selectedBadge && (
        <BadgeNotification badge={selectedBadge} onClose={() => setShowNotification(false)} />
      )}
    </div>
  )
}
