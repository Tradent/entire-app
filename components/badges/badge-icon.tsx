import { type Badge, BadgeRarity } from "@/services/badge-service"
import { cn } from "@/lib/utils"

interface BadgeIconProps {
  badge: Badge
  size?: "sm" | "md" | "lg" | "xl"
  showRarity?: boolean
  className?: string
}

export function BadgeIcon({ badge, size = "md", showRarity = false, className }: BadgeIconProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const rarityBorderColor = {
    [BadgeRarity.Common]: "border-gray-400",
    [BadgeRarity.Uncommon]: "border-green-500",
    [BadgeRarity.Rare]: "border-blue-500",
    [BadgeRarity.Epic]: "border-purple-500",
    [BadgeRarity.Legendary]: "border-amber-500",
  }

  const rarityGlowColor = {
    [BadgeRarity.Common]: "",
    [BadgeRarity.Uncommon]: "",
    [BadgeRarity.Rare]: "shadow-[0_0_10px_rgba(59,130,246,0.5)]",
    [BadgeRarity.Epic]: "shadow-[0_0_15px_rgba(168,85,247,0.6)]",
    [BadgeRarity.Legendary]: "shadow-[0_0_20px_rgba(245,158,11,0.7)]",
  }

  const isUnlocked = badge.unlockedAt !== undefined

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "rounded-full border-2 overflow-hidden transition-all",
          sizeClasses[size],
          isUnlocked ? rarityBorderColor[badge.rarity] : "border-gray-300 opacity-50",
          isUnlocked && badge.rarity !== BadgeRarity.Common && badge.rarity !== BadgeRarity.Uncommon
            ? rarityGlowColor[badge.rarity]
            : "",
        )}
      >
        <img
          src={badge.icon || "/placeholder.svg"}
          alt={badge.name}
          className={cn("w-full h-full", !isUnlocked && "grayscale")}
        />
      </div>

      {showRarity && badge.rarity !== BadgeRarity.Common && (
        <span
          className={cn(
            "absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold px-1.5 py-0.5 rounded-full",
            {
              "bg-green-100 text-green-800": badge.rarity === BadgeRarity.Uncommon,
              "bg-blue-100 text-blue-800": badge.rarity === BadgeRarity.Rare,
              "bg-purple-100 text-purple-800": badge.rarity === BadgeRarity.Epic,
              "bg-amber-100 text-amber-800": badge.rarity === BadgeRarity.Legendary,
            },
          )}
        >
          {badge.rarity}
        </span>
      )}
    </div>
  )
}
