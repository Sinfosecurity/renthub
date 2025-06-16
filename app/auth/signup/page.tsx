import Link from "next/link"
import { SignUpForm } from "@/components/auth/signup-form"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold">RentHub</span>
            </Link>
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-gray-400">Join thousands of users renting and sharing items</p>
          </div>

          {/* Sign Up Form */}
          <SignUpForm />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-blue-400 hover:text-blue-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
