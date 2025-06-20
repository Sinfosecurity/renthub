"use server"

import { z } from "zod"
import { signIn as signInService } from "@/lib/data-service"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

const SigninActionSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
})

// Simplified FormState without 'issues'
export interface SigninFormState {
  message: string
  fields?: Record<string, string>
  success: boolean
}

export async function signinAction(prevState: SigninFormState, formData: FormData): Promise<SigninFormState> {
  const rawFormData = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const validatedFields = SigninActionSchema.safeParse(rawFormData)

  if (!validatedFields.success) {
    const fieldErrors: Record<string, string> = {}
    validatedFields.error.issues.forEach((issue) => {
      if (issue.path.length > 0) {
        fieldErrors[issue.path[0].toString()] = issue.message
      }
    })
    return {
      message: "Invalid form data. Please check the fields.",
      fields: fieldErrors,
      success: false,
    }
  }

  try {
    const { email, password } = validatedFields.data
    const result = await signInService(email, password) // This is your Supabase signIn

    if (!result.user || !result.session) {
      // Check based on what signInService returns
      return {
        message: "Login successful, but session could not be established.", // Or a more generic error
        success: false,
      }
    }
    // User is logged in, session is active
  } catch (error) {
    return {
      message: error instanceof Error ? error.message : "Invalid email or password.",
      success: false,
    }
  }

  // If successful, revalidate and redirect
  revalidatePath("/", "layout") // Revalidate all paths to update auth state everywhere
  redirect("/") // Redirect to homepage
  // Note: The function should ideally not reach here if redirect works.
  // To satisfy TypeScript, if redirect doesn't immediately terminate, return a success state.
  // However, `redirect` throws an error that Next.js catches to perform the redirect,
  // so code after it in the same block typically doesn't run.
  // For robustness in case of future Next.js changes or if redirect is conditional:
  // return { message: "Login successful! Redirecting...", success: true };
}
