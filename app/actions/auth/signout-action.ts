"use server"

import { signOut as signOutService } from "@/lib/data-service" // Ensure this path is correct
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signoutAction() {
  try {
    await signOutService()
  } catch (error) {
    console.error("Error during signout:", error)
    // Even if there's an error, attempt to redirect.
    // The session might be partially cleared or Supabase might handle it.
  }
  revalidatePath("/", "layout")
  redirect("/") // Redirect to homepage after signout
}
