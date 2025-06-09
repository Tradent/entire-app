import type { Badge } from "@/services/badge-service"
import { BadgeIcon } from "./badge-icon"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BadgeShowcaseProps {
  badges: Badge[]
  limit?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

export function BadgeShowcase({ badges, limit = 5, size = "md", className }: BadgeShowcaseProps) {
  // Filter to only unlocked badges and sort by rarity
  const unlockedBadges = badges
    .filter((badge) => badge.unlockedAt !== undefined)
    .sort((a, b) => {
      // Sort by rarity (Legendary first)
      const rarityOrder = {
        legendary: 0,
        epic: 1,
        rare: 2,
        uncommon: 3,
        common: 4,
      }
      return rarityOrder[a.rarity] - rarityOrder[b.rarity]
    })
    .slice(0, limit)

  const hasMore = badges.filter((badge) => badge.unlockedAt !== undefined).length > limit

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <TooltipProvider>
        {unlockedBadges.map((badge) => (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <div>
                <BadgeIcon badge={badge} size={size} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground">{badge.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}

        {hasMore && (
          <div
            className={cn("flex items-center justify-center rounded-full bg-muted text-muted-foreground font-medium", {
              "w-8 h-8 text-xs": size === "sm",
              "w-12 h-12 text-sm": size === "md",
              "w-16 h-16 text-base": size === "lg",
            })}
          >
            +{badges.filter((badge) => badge.unlockedAt !== undefined).length - limit}
          </div>
        )}
      </TooltipProvider>
    </div>
  )
}
