import { redirect } from "next/navigation"
import { getCurrentUser, getNotifications } from "@/lib/data-service"
import { Navigation } from "@/components/navigation"
import { NotificationsList } from "@/components/notifications/notifications-list"

export default async function NotificationsPage() {
  // Check if user is authenticated
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin?redirect=/notifications")
  }

  // Fetch notifications
  const notifications = await getNotifications(user.id)

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Notifications</h1>
          <p className="text-gray-400">Stay updated with your booking requests and updates</p>
        </div>

        <NotificationsList notifications={notifications} />
      </div>
    </div>
  )
}
