"use client"

import type { Badge } from "@/services/badge-service"
import { BadgeIcon } from "@/components/badges/badge-icon"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

interface BadgeNotificationProps {
  badge: Badge
  onClose: () => void
}

export function BadgeNotification({ badge, onClose }: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300) // Wait for animation to complete
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className="overflow-hidden border-2 border-primary shadow-lg">
        <CardContent className="p-0">
          <div className="bg-primary text-primary-foreground p-2 text-sm font-medium flex items-center justify-between">
            <span>New Achievement Unlocked!</span>
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={handleClose}>
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="p-4 flex items-center gap-4">
            <BadgeIcon badge={badge} size="lg" showRarity />
            <div>
              <h4 className="font-semibold">{badge.name}</h4>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
