import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, CreditCard, Users, AlertTriangle, RefreshCw, XCircle } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Terms of Service</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Please read these terms carefully before using our platform.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: January 1, {new Date().getFullYear()}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-8">
          {/* Agreement */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Agreement to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                By accessing and using RentHub, you accept and agree to be bound by the terms and provision of this
                agreement.
              </p>
              <p className="text-gray-400">
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </CardContent>
          </Card>

          {/* Platform Use */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-400" />
                Platform Use and User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Account Registration</h3>
                <p className="text-gray-400">
                  You must provide accurate and complete information when creating an account. You are responsible for
                  maintaining the security of your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Acceptable Use</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Use the platform only for lawful purposes</li>
                  <li>• Provide accurate information in listings and profiles</li>
                  <li>• Respect other users and their property</li>
                  <li>• Follow all applicable laws and regulations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Posting false or misleading information</li>
                  <li>• Harassment or discrimination of other users</li>
                  <li>• Attempting to circumvent platform fees</li>
                  <li>• Using the platform for illegal activities</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payments and Bookings */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-400" />
                Payments and Bookings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Booking Process</h3>
                <p className="text-gray-400">
                  When you make a booking, you enter into a direct agreement with the item owner. RentHub facilitates
                  the transaction but is not a party to the rental agreement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Payment Processing</h3>
                <p className="text-gray-400">
                  All payments are processed securely through our payment partners. We may charge service fees for using
                  the platform.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Cancellations and Refunds</h3>
                <p className="text-gray-400">
                  Cancellation and refund policies are set by individual item owners. Please review the specific policy
                  before booking.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Liability */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Liability and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Platform Disclaimer</h3>
                <p className="text-gray-400">
                  RentHub is a marketplace platform. We do not own, control, or manage any of the items listed. We are
                  not responsible for the quality, safety, or legality of items or the accuracy of listings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limitation of Liability</h3>
                <p className="text-gray-400">
                  RentHub's liability is limited to the maximum extent permitted by law. We are not liable for any
                  indirect, incidental, or consequential damages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">User Responsibility</h3>
                <p className="text-gray-400">
                  Users are responsible for their own actions and any damage or loss that occurs during rentals.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modifications */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-cyan-400" />
                Modifications to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via
                email or platform notifications.
              </p>
              <p className="text-gray-400">
                Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Account Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Termination by User</h3>
                <p className="text-gray-400">
                  You may terminate your account at any time by contacting our support team or using the account
                  deletion feature.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Termination by RentHub</h3>
                <p className="text-gray-400">
                  We may suspend or terminate accounts that violate these terms or engage in harmful behavior.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">If you have questions about these terms, please contact us:</p>
              <div className="space-y-2 text-gray-400">
                <p>Email: legal@renthub.com</p>
                <p>Address: 123 Innovation Drive, San Francisco, CA 94105</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
