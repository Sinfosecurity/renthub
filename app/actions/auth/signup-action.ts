"use server"

import { z } from "zod"
import { signUp as signUpService } from "@/lib/data-service" // Ensure this path is correct
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Schema for server-side validation (can be same as client if no transformations)
const SignupActionSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
})

export interface SignupFormState {
  message: string
  fields?: Record<string, string> // For field-specific errors
  issues?: string[] // For general form errors
  success: boolean
}

export async function signupAction(prevState: SignupFormState, formData: FormData): Promise<SignupFormState> {
  const rawFormData = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const validatedFields = SignupActionSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {}
    validatedFields.error.issues.forEach((issue) => {
      if (issue.path.length > 0) {
        fieldErrors[issue.path[0].toString()] = issue.message
      }
    })
    return {
      message: "Invalid form data. Please check the fields below.",
      fields: fieldErrors,
      issues: validatedFields.error.flatten().formErrors,
      success: false,
    }
  }

  try {
    const { fullName, email, password } = validatedFields.data
    // Assuming your signUpService from data-service.ts handles Supabase interaction
    const result = await signUpService(email, password, fullName)

    // Assuming email confirmation is OFF, Supabase returns user & session immediately
    if (!result.user || !result.session) {
      return {
        message: "Signup was successful, but session could not be established. Please try logging in.",
        success: false, // Or true with a specific message
      }
    }
    // User is signed up and session is active
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "An unknown error occurred during signup.",
      success: false,
    }
  }

  // Revalidate relevant paths to ensure fresh data after auth state change
  revalidatePath("/", "layout") // Revalidates all pages under the layout
  redirect("/") // Redirect to homepage
  // redirect() throws an error, so code below it won't run.
  // For type safety, you might return a success state here if redirect wasn't used,
  // but with redirect, this part is effectively unreachable.
}
