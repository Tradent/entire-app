// Badge types and categories
export enum BadgeCategory {
  Collection = "collection",
  Creation = "creation",
  Social = "social",
  Event = "event",
  Marketplace = "marketplace",
  Special = "special",
}

export enum BadgeRarity {
  Common = "common",
  Uncommon = "uncommon",
  Rare = "rare",
  Epic = "epic",
  Legendary = "legendary",
}

export interface Badge {
  id: string
  name: string
  description: string
  category: BadgeCategory
  rarity: BadgeRarity
  icon: string
  unlockedAt?: Date
  progress?: {
    current: number
    target: number
  }
}

// Mock badge data
export const badges: Badge[] = [
  // Collection badges
  {
    id: "first-purchase",
    name: "First Steps",
    description: "Purchase your first digital fashion NFT",
    category: BadgeCategory.Collection,
    rarity: BadgeRarity.Common,
    icon: "/badges/first-purchase.svg",
    unlockedAt: new Date("2025-03-15"),
  },
  {
    id: "fashion-collector",
    name: "Fashion Collector",
    description: "Own 10 different digital fashion items",
    category: BadgeCategory.Collection,
    rarity: BadgeRarity.Uncommon,
    icon: "/badges/fashion-collector.svg",
    unlockedAt: new Date("2025-03-20"),
  },
  {
    id: "fashion-connoisseur",
    name: "Fashion Connoisseur",
    description: "Own 50 different digital fashion items",
    category: BadgeCategory.Collection,
    rarity: BadgeRarity.Rare,
    icon: "/badges/fashion-connoisseur.svg",
    progress: {
      current: 32,
      target: 50,
    },
  },
  {
    id: "fashion-mogul",
    name: "Fashion Mogul",
    description: "Own 100 different digital fashion items",
    category: BadgeCategory.Collection,
    rarity: BadgeRarity.Epic,
    icon: "/badges/fashion-mogul.svg",
    progress: {
      current: 32,
      target: 100,
    },
  },

  // Creation badges
  {
    id: "first-creation",
    name: "Digital Designer",
    description: "Create your first digital fashion NFT",
    category: BadgeCategory.Creation,
    rarity: BadgeRarity.Common,
    icon: "/badges/first-creation.svg",
    unlockedAt: new Date("2025-03-10"),
  },
  {
    id: "prolific-creator",
    name: "Prolific Creator",
    description: "Create 10 digital fashion NFTs",
    category: BadgeCategory.Creation,
    rarity: BadgeRarity.Rare,
    icon: "/badges/prolific-creator.svg",
    progress: {
      current: 4,
      target: 10,
    },
  },

  // Social badges
  {
    id: "social-butterfly",
    name: "Social Butterfly",
    description: "Reach 100 followers",
    category: BadgeCategory.Social,
    rarity: BadgeRarity.Uncommon,
    icon: "/badges/social-butterfly.svg",
    unlockedAt: new Date("2025-04-05"),
  },
  {
    id: "fashion-influencer",
    name: "Fashion Influencer",
    description: "Reach 1,000 followers",
    category: BadgeCategory.Social,
    rarity: BadgeRarity.Epic,
    icon: "/badges/fashion-influencer.svg",
    progress: {
      current: 240,
      target: 1000,
    },
  },

  // Event badges
  {
    id: "fashion-week-2025",
    name: "Fashion Week 2025",
    description: "Participated in the Digital Fashion Week 2025",
    category: BadgeCategory.Event,
    rarity: BadgeRarity.Rare,
    icon: "/badges/fashion-week-2025.svg",
    unlockedAt: new Date("2025-02-28"),
  },
  {
    id: "metaverse-runway",
    name: "Metaverse Runway",
    description: "Showcased your creation in a virtual fashion show",
    category: BadgeCategory.Event,
    rarity: BadgeRarity.Epic,
    icon: "/badges/metaverse-runway.svg",
  },

  // Marketplace badges
  {
    id: "first-sale",
    name: "First Sale",
    description: "Sold your first digital fashion NFT",
    category: BadgeCategory.Marketplace,
    rarity: BadgeRarity.Common,
    icon: "/badges/first-sale.svg",
    unlockedAt: new Date("2025-03-22"),
  },
  {
    id: "high-roller",
    name: "High Roller",
    description: "Complete a transaction worth over 100 SOL",
    category: BadgeCategory.Marketplace,
    rarity: BadgeRarity.Legendary,
    icon: "/badges/high-roller.svg",
  },

  // Special badges
  {
    id: "early-adopter",
    name: "Early Adopter",
    description: "Joined ENTIRE during the beta phase",
    category: BadgeCategory.Special,
    rarity: BadgeRarity.Epic,
    icon: "/badges/early-adopter.svg",
    unlockedAt: new Date("2025-01-15"),
  },
  {
    id: "trendsetter",
    name: "Trendsetter",
    description: "Created a collection that was featured on the homepage",
    category: BadgeCategory.Special,
    rarity: BadgeRarity.Legendary,
    icon: "/badges/trendsetter.svg",
  },
]

// Get all badges for a user
export function getUserBadges(): Badge[] {
  // In a real app, this would fetch from an API based on the user ID
  return badges
}

// Get badges by category
export function getBadgesByCategory(category: BadgeCategory): Badge[] {
  return badges.filter((badge) => badge.category === category)
}

// Get unlocked badges
export function getUnlockedBadges(): Badge[] {
  return badges.filter((badge) => badge.unlockedAt !== undefined)
}

// Get locked badges
export function getLockedBadges(): Badge[] {
  return badges.filter((badge) => badge.unlockedAt === undefined)
}

// Check if a badge is unlocked
export function isBadgeUnlocked(badgeId: string): boolean {
  const badge = badges.find((b) => b.id === badgeId)
  return badge?.unlockedAt !== undefined
}

// Get badge progress
export function getBadgeProgress(badgeId: string): { current: number; target: number } | null {
  const badge = badges.find((b) => b.id === badgeId)
  return badge?.progress || null
}

// Get recently unlocked badges (last 7 days)
export function getRecentlyUnlockedBadges(): Badge[] {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  return badges.filter((badge) => badge.unlockedAt !== undefined && badge.unlockedAt >= sevenDaysAgo)
}
