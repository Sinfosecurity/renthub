import { redirect } from "next/navigation"
import { getCurrentUser, isAdmin, getAdminAnalytics, getAllBookings } from "@/lib/data-service"
import { Navigation } from "@/components/navigation"
import { AdminStats } from "@/components/admin/admin-stats"
import { AdminGraphs } from "@/components/admin/admin-graphs"
import { BookingsDataTable } from "@/components/admin/bookings-data-table"
import { UserManagement } from "@/components/admin/user-management"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default async function AdminDashboard() {
  // Check if user is authenticated and is admin
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin?redirect=/admin")
  }

  const userIsAdmin = await isAdmin(user.id)
  if (!userIsAdmin) {
    redirect("/") // Redirect non-admin users
  }

  try {
    // Fetch admin data
    const [analytics, allBookings] = await Promise.all([getAdminAnalytics(), getAllBookings()])

    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Overview of platform analytics and bookings</p>
          </div>

          {/* Stats Cards */}
          <AdminStats analytics={analytics} />

          {/* Custom Graphs */}
          <AdminGraphs analytics={analytics} />

          {/* Bookings Table */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">All Bookings</h2>
            <BookingsDataTable bookings={allBookings} />
          </div>

          {/* User Management */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>
            <UserManagement />
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading admin dashboard:", error)

    return (
      <div className="min-h-screen bg-black text-white">
        <Navigation />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Overview of platform analytics and bookings</p>
          </div>

          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold mb-2 text-red-400">Error Loading Dashboard</h3>
              <p className="text-gray-400 mb-4">There was an error loading the admin dashboard data.</p>
              <p className="text-sm text-gray-500">
                Please check the console for more details or try refreshing the page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}
