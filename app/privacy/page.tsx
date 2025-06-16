import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Cookie, Mail, Database, UserCheck } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Privacy Policy</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Your Privacy Matters
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We're committed to protecting your personal information and being transparent about how we use it.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: January 1, {new Date().getFullYear()}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-8">
          {/* Information We Collect */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-gray-400">
                  When you create an account, we collect your name, email address, phone number, and profile
                  information.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Usage Data</h3>
                <p className="text-gray-400">
                  We collect information about how you use our platform, including pages visited, features used, and
                  time spent.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Device Information</h3>
                <p className="text-gray-400">
                  We may collect device information such as IP address, browser type, and operating system.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-400" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-400">
                <li>• Provide and maintain our rental platform services</li>
                <li>• Process bookings and facilitate transactions</li>
                <li>• Send important notifications about your bookings</li>
                <li>• Improve our platform and develop new features</li>
                <li>• Prevent fraud and ensure platform security</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-400" />
                Data Sharing and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">We Never Sell Your Data</h3>
                <p className="text-gray-400">
                  We do not sell, rent, or trade your personal information to third parties for marketing purposes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limited Sharing</h3>
                <p className="text-gray-400">
                  We only share information when necessary to provide our services, comply with law, or protect our
                  users.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Security Measures</h3>
                <p className="text-gray-400">
                  We use industry-standard encryption and security measures to protect your personal information.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cookie className="w-5 h-5 text-yellow-400" />
                Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                We use cookies and similar technologies to enhance your experience, remember your preferences, and
                analyze platform usage.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Types of Cookies</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Essential cookies for platform functionality</li>
                  <li>• Analytics cookies to understand usage patterns</li>
                  <li>• Preference cookies to remember your settings</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-400" />
                Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-gray-400">
                <li>• Access and review your personal information</li>
                <li>• Update or correct your information</li>
                <li>• Delete your account and associated data</li>
                <li>• Opt out of marketing communications</li>
                <li>• Request data portability</li>
                <li>• File complaints with data protection authorities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-cyan-400" />
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                If you have questions about this privacy policy or how we handle your data, please contact us:
              </p>
              <div className="space-y-2 text-gray-400">
                <p>Email: privacy@renthub.com</p>
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
