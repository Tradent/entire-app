import { BadgeShowcase } from "@/components/badges/badge-showcase"
import { getUserBadges } from "@/services/badge-service"

const ProfileHeader = () => {
  const userBadges = getUserBadges()

  return (
    <div>
      {/* User info */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full bg-gray-200" />
        <div>
          <h2 className="text-lg font-semibold">User Name</h2>
          <p className="text-sm text-gray-500">@username</p>
        </div>
      </div>

      {/* User stats */}
      <div className="mt-4 flex items-center gap-4">
        <div>
          <span className="text-sm font-medium">Posts</span>
          <p className="text-sm text-gray-500">100</p>
        </div>
        <div>
          <span className="text-sm font-medium">Followers</span>
          <p className="text-sm text-gray-500">100</p>
        </div>
        <div>
          <span className="text-sm font-medium">Following</span>
          <p className="text-sm text-gray-500">100</p>
        </div>
      </div>

      {/* Badges showcase */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm font-medium">Achievements:</span>
        <BadgeShowcase badges={userBadges} size="sm" />
      </div>
    </div>
  )
}

export default ProfileHeader
