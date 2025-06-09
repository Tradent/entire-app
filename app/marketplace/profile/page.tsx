import ProtectedRoute from "@/components/auth/protected-route"
import MarketplaceProfileContent from "@/components/marketplace/marketplace-profile-content"

export default function MarketplaceProfilePage() {
  return (
    <ProtectedRoute>
      <MarketplaceProfileContent />
    </ProtectedRoute>
  )
}
