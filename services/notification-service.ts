import type { Badge } from "./badge-service"

export enum NotificationType {
  BadgeUnlocked = "badge_unlocked",
  NftPurchased = "nft_purchased",
  NftSold = "nft_sold",
  NewFollower = "new_follower",
  EventInvitation = "event_invitation",
  SystemMessage = "system_message",
}

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  data?: any
}

// Create a notification for a badge unlock
export function createBadgeUnlockNotification(badge: Badge): Notification {
  return {
    id: `badge-${badge.id}-${Date.now()}`,
    type: NotificationType.BadgeUnlocked,
    title: "New Badge Unlocked!",
    message: `You've earned the "${badge.name}" badge. ${badge.description}`,
    timestamp: new Date(),
    read: false,
    data: {
      badge,
    },
  }
}

// Add notification to the user's notifications
export function addNotification(notification: Notification): void {
  // In a real app, this would call an API to add the notification
  console.log("Notification added:", notification)
}

// Trigger a badge unlock notification
export function triggerBadgeUnlockNotification(badge: Badge): void {
  const notification = createBadgeUnlockNotification(badge)
  addNotification(notification)

  // Show a toast or in-app notification
  // This would be implemented differently in a real app
}
