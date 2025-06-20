"use client"

import { useActionState, useEffect } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signupAction, type SignupFormState } from "@/app/actions/auth/signup-action"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Client-side schema for react-hook-form, includes passwordConfirm
const signupFormSchemaClient = z
  .object({
    fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match.",
    path: ["passwordConfirm"],
  })

type SignupFormValues = z.infer<typeof signupFormSchemaClient>

const initialSignupState: SignupFormState = {
  message: "",
  success: false,
  fields: {},
  issues: [],
}

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signupAction, initialSignupState)
  const { toast } = useToast()

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupFormSchemaClient),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  })

  useEffect(() => {
    if (!isPending && state.message) {
      if (!state.success) {
        toast({
          title: "Sign-up Error",
          description: state.message,
          variant: "destructive",
        })
        // Populate react-hook-form errors from server action state.fields
        if (state.fields) {
          for (const [fieldName, errorMsg] of Object.entries(state.fields)) {
            form.setError(fieldName as keyof SignupFormValues, { type: "server", message: errorMsg })
          }
        }
      }
      // Successful signup is handled by redirect in the server action, so no client toast for success.
    }
  }, [state, toast, isPending, form])

  // Handle form submission by react-hook-form, then pass FormData to server action
  const onSubmit: SubmitHandler<SignupFormValues> = (data) => {
    const formData = new FormData()
    formData.append("fullName", data.fullName)
    formData.append("email", data.email)
    formData.append("password", data.password)
    // passwordConfirm is validated client-side, not strictly needed by server action
    formAction(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Display general form errors from server action (state.issues) */}
        {state.issues && state.issues.length > 0 && !state.success && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Please correct the following:</AlertTitle>
            <AlertDescription>
              <ul>
                {state.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} disabled={isPending} className="bg-gray-800 border-gray-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="m@example.com"
                  {...field}
                  disabled={isPending}
                  className="bg-gray-800 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password (min. 8 characters)</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isPending}
                  className="bg-gray-800 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isPending}
                  className="bg-gray-800 border-gray-700"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </div>
      </form>
    </Form>
  )
}
