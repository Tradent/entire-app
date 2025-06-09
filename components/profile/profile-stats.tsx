import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProfileStatsProps {
  followers: number
  following: number
  className?: string
}

export default function ProfileStats({ followers, following, className }: ProfileStatsProps) {
  return (
    <div className={cn("flex gap-6", className)}>
      <Link href="/profile/followers" className="hover:opacity-80">
        <div className="text-center">
          <p className="text-lg font-bold">{followers.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Followers</p>
        </div>
      </Link>
      <Link href="/profile/following" className="hover:opacity-80">
        <div className="text-center">
          <p className="text-lg font-bold">{following.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Following</p>
        </div>
      </Link>
    </div>
  )
}
