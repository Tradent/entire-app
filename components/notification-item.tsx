"use client"

import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { Bell, ShoppingBag, Users, Sparkles, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Notification } from "@/services/notifications"
import { BadgeIcon } from "@/components/badges/badge-icon"
import { NotificationType } from "@/services/notification-service"

interface NotificationItemProps {
  notification: Notification
  onClick: () => void
}

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
  // Get the appropriate icon based on notification type
  const getIcon = () => {
    let icon
    switch (notification.type) {
      case "system":
        return <Sparkles className="w-4 h-4 text-blue-500" />
      case "nft":
        return <Bell className="w-4 h-4 text-purple-500" />
      case "social":
        return <Users className="w-4 h-4 text-green-500" />
      case "marketplace":
        return <ShoppingBag className="w-4 h-4 text-amber-500" />
      case NotificationType.BadgeUnlocked:
        if (notification.data?.badge) {
          icon = <BadgeIcon badge={notification.data.badge} size="sm" />
        } else {
          icon = <Award className="h-4 w-4" />
        }
        break
      default:
        return <Bell className="w-4 h-4" />
    }
    return icon
  }

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 p-3 transition-colors hover:bg-muted/50 w-full",
        !notification.read && "bg-muted/30",
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">{getIcon()}</div>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <p className={cn("text-sm font-medium", !notification.read && "font-semibold")}>{notification.title}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
      </div>
      {!notification.read && <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />}
    </div>
  )

  if (notification.link) {
    return (
      <Link href={notification.link} className="block w-full">
        {content}
      </Link>
    )
  }

  return content
}
