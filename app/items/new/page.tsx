import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/data-service"
import { Navigation } from "@/components/navigation"
import { ListItemForm } from "@/components/list-item-form"

export default async function NewItemPage() {
  // Check if user is authenticated
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/signin?redirect=/items/new")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">List Your Item</h1>
          <p className="text-gray-400">Share your items with the community and start earning</p>
        </div>

        <ListItemForm />
      </div>
    </div>
  )
}
