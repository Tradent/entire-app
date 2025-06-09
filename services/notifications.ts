export interface Notification {
  id: string
  title: string
  message: string
  type: "system" | "nft" | "social" | "marketplace"
  read: boolean
  timestamp: Date
  link?: string
  image?: string
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Collection Drop",
    message: 'MetaFashion just released their new "Neon Dreams" collection. Check it out now!',
    type: "nft",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    link: "/collections/1",
    image: "/neon-city-slicker.png",
  },
  {
    id: "2",
    title: "AR Try-On Feature",
    message: "Our new AR Try-On feature is now available! Try on your NFTs in real-world photos.",
    type: "system",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    link: "/ar-try-on",
  },
  {
    id: "3",
    title: "Wallet Connected",
    message: "Your wallet has been successfully connected to ENTIRE.",
    type: "system",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    title: "Digital Couture Liked Your Outfit",
    message: 'Designer Digital Couture liked your "Cyberpunk Night" outfit.',
    type: "social",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    link: "/avatar",
  },
  {
    id: "5",
    title: "Limited Time Offer",
    message: "Get 20% off on all marketplace purchases this weekend!",
    type: "marketplace",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    link: "/marketplace",
  },
]

// Notification context and provider
export class NotificationService {
  private static instance: NotificationService
  private notifications: Notification[] = [...mockNotifications]
  private listeners: Array<() => void> = []

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  public getNotifications(): Notification[] {
    return [...this.notifications]
  }

  public getUnreadCount(): number {
    return this.notifications.filter((notification) => !notification.read).length
  }

  public markAsRead(id: string): void {
    this.notifications = this.notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification,
    )
    this.notifyListeners()
  }

  public markAllAsRead(): void {
    this.notifications = this.notifications.map((notification) => ({ ...notification, read: true }))
    this.notifyListeners()
  }

  public addNotification(notification: Omit<Notification, "id" | "timestamp">): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    this.notifications = [newNotification, ...this.notifications]
    this.notifyListeners()
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener())
  }
}

export default NotificationService.getInstance()
