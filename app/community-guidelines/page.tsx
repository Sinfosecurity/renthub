import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Users, Camera, MessageSquare, AlertTriangle, Flag, Shield, CheckCircle } from "lucide-react"

export default function CommunityGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Community Guidelines</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Building a Better Community
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our guidelines help create a safe, respectful, and trustworthy environment for everyone.
          </p>
          <p className="text-sm text-gray-400 mt-4">Last updated: January 1, {new Date().getFullYear()}</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 pb-20">
        <div className="space-y-8">
          {/* Core Values */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                Our Core Values
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Respect</h3>
                  <p className="text-gray-400 text-sm">Treat everyone with kindness and consideration</p>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Trust</h3>
                  <p className="text-gray-400 text-sm">Be honest and reliable in all interactions</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Quality</h3>
                  <p className="text-gray-400 text-sm">Maintain high standards for listings and service</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Respectful Interactions */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />
                Respectful Interactions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-green-400">Do:</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Communicate clearly and politely</li>
                  <li>• Respond to messages in a timely manner</li>
                  <li>• Be understanding of different perspectives</li>
                  <li>• Resolve conflicts through respectful dialogue</li>
                  <li>• Report inappropriate behavior</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-red-400">Don't:</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Use offensive, discriminatory, or hateful language</li>
                  <li>• Harass, threaten, or intimidate other users</li>
                  <li>• Share personal information without consent</li>
                  <li>• Engage in spam or unwanted solicitation</li>
                  <li>• Discriminate based on race, gender, religion, or other protected characteristics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Quality Listings */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-green-400" />
                Quality Listings and Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Listing Requirements</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Provide accurate and detailed descriptions</li>
                  <li>• Use clear, well-lit photos that show the actual item</li>
                  <li>• Set fair and reasonable pricing</li>
                  <li>• Keep availability calendars up to date</li>
                  <li>• Disclose any defects or limitations</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Photo Guidelines</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Photos must show the actual item being rented</li>
                  <li>• No stock photos or images from other sources</li>
                  <li>• Include multiple angles and important details</li>
                  <li>• Ensure photos are appropriate and family-friendly</li>
                  <li>• Avoid watermarks or promotional text</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Communication Standards */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                Communication and Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Messaging Guidelines</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Keep all communication on the platform</li>
                  <li>• Be professional and courteous</li>
                  <li>• Respond to inquiries within 24 hours</li>
                  <li>• Provide clear pickup/return instructions</li>
                  <li>• Confirm booking details in writing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Review Standards</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Write honest, constructive reviews</li>
                  <li>• Focus on the rental experience and item quality</li>
                  <li>• Avoid personal attacks or irrelevant comments</li>
                  <li>• Be specific about issues or positive aspects</li>
                  <li>• Update reviews if issues are resolved</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Content */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Prohibited Content and Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Prohibited Items</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Illegal items or substances</li>
                  <li>• Weapons, firearms, or dangerous materials</li>
                  <li>• Stolen or counterfeit goods</li>
                  <li>• Items that violate intellectual property rights</li>
                  <li>• Adult content or services</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Fraud, scams, or deceptive practices</li>
                  <li>• Attempting to circumvent platform fees</li>
                  <li>• Creating fake accounts or reviews</li>
                  <li>• Sharing contact information to avoid platform fees</li>
                  <li>• Using the platform for commercial advertising</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Reporting and Enforcement */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-red-400" />
                Reporting and Enforcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How to Report Violations</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Use the "Report" button on listings or profiles</li>
                  <li>• Contact our support team directly</li>
                  <li>• Provide specific details and evidence</li>
                  <li>• Report issues promptly</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Enforcement Actions</h3>
                <ul className="space-y-1 text-gray-400">
                  <li>• Warning for minor violations</li>
                  <li>• Temporary suspension for repeated violations</li>
                  <li>• Permanent ban for serious violations</li>
                  <li>• Removal of listings or content</li>
                  <li>• Legal action for illegal activities</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Appeals Process</h3>
                <p className="text-gray-400">
                  If you believe an enforcement action was taken in error, you can appeal by contacting our support team
                  within 30 days.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Questions About Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-4">
                If you have questions about these community guidelines, please contact us:
              </p>
              <div className="space-y-2 text-gray-400">
                <p>Email: community@renthub.com</p>
                <p>Support: support@renthub.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
