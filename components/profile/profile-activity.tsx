import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock activity data
const activityData = [
  {
    id: 1,
    type: "purchase",
    title: "Purchased Neon Dreams Jacket",
    price: "2.5 SOL",
    date: new Date(2025, 3, 15), // April 15, 2025
    image: "/neon-city-slicker.png",
    link: "/marketplace/1",
  },
  {
    id: 2,
    type: "listing",
    title: "Listed Tech Glasses",
    price: "1.5 SOL",
    date: new Date(2025, 3, 10), // April 10, 2025
    image: "/augmented-reality-interface.png",
    link: "/marketplace/8",
  },
  {
    id: 3,
    type: "purchase",
    title: "Purchased Holographic Headpiece",
    price: "3.0 SOL",
    date: new Date(2025, 2, 28), // March 28, 2025
    image: "/ethereal-hologram-crown.png",
    link: "/marketplace/4",
  },
  {
    id: 4,
    type: "mint",
    title: "Created Digital Glasses",
    price: "1.5 SOL",
    date: new Date(2025, 2, 15), // March 15, 2025
    image: "/augmented-reality-interface.png",
    link: "/marketplace/12",
  },
  {
    id: 5,
    type: "follow",
    title: "Followed MetaFashion",
    date: new Date(2025, 2, 10), // March 10, 2025
    link: "/designers/1",
  },
]

export default function ProfileActivity() {
  return (
    <div className="space-y-1 border rounded-lg">
      {activityData.map((activity) => (
        <Link href={activity.link} key={activity.id} className="block hover:bg-muted/50">
          <div className="flex items-center p-4 border-b last:border-b-0">
            {activity.image && (
              <div className="w-12 h-12 mr-4 overflow-hidden rounded-md">
                <img
                  src={activity.image || "/placeholder.svg"}
                  alt={activity.title}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{activity.title}</h3>
                <Badge
                  variant={
                    activity.type === "purchase"
                      ? "default"
                      : activity.type === "listing"
                        ? "secondary"
                        : activity.type === "mint"
                          ? "outline"
                          : "default"
                  }
                >
                  {activity.type === "purchase"
                    ? "Purchased"
                    : activity.type === "listing"
                      ? "Listed"
                      : activity.type === "mint"
                        ? "Created"
                        : "Followed"}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-1">
                {activity.price && <p className="text-sm text-muted-foreground">{activity.price}</p>}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(activity.date, { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
