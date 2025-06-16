import { redirect } from "next/navigation"
import { getCurrentUser, getProfile, getProfileStats, getItemsByOwner, getBookingsByUser } from "@/lib/data-service"
import { Navigation } from "@/components/navigation"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileStats } from "@/components/profile/profile-stats"
import { ProfileTabs } from "@/components/profile/profile-tabs"

export default async function ProfilePage() {
  // Check if user is authenticated
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin?redirect=/profile")
  }

  // Fetch user data
  const [profile, stats, userItems, bookingsAsRenter, bookingsAsOwner] = await Promise.all([
    getProfile(user.id),
    getProfileStats(user.id),
    getItemsByOwner(user.id),
    getBookingsByUser(user.id, "renter"),
    getBookingsByUser(user.id, "owner"),
  ])

  if (!profile) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader profile={profile} user={user} />

        {/* Profile Stats */}
        <ProfileStats stats={stats} />

        {/* Profile Tabs */}
        <ProfileTabs
          items={userItems}
          bookingsAsRenter={bookingsAsRenter}
          bookingsAsOwner={bookingsAsOwner}
          userId={user.id}
        />
      </div>
    </div>
  )
}
