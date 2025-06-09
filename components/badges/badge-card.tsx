import type { Badge } from "@/services/badge-service"
import { BadgeIcon } from "./badge-icon"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { LockIcon, UnlockIcon } from "lucide-react"

interface BadgeCardProps {
  badge: Badge
  className?: string
}

export function BadgeCard({ badge, className }: BadgeCardProps) {
  const isUnlocked = badge.unlockedAt !== undefined
  const hasProgress = badge.progress !== undefined

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <BadgeIcon badge={badge} size="lg" showRarity />

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{badge.name}</h3>
              {isUnlocked ? (
                <UnlockIcon className="w-4 h-4 text-green-500" />
              ) : (
                <LockIcon className="w-4 h-4 text-gray-400" />
              )}
            </div>

            <p className="text-sm text-muted-foreground">{badge.description}</p>

            {hasProgress && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>
                    {badge.progress!.current} / {badge.progress!.target}
                  </span>
                </div>
                <Progress value={(badge.progress!.current / badge.progress!.target) * 100} className="h-2" />
              </div>
            )}

            {isUnlocked && (
              <p className="text-xs text-muted-foreground mt-2">Unlocked on {badge.unlockedAt!.toLocaleDateString()}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
