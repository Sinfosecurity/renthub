import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HelpCircle, MessageSquare, Phone, Mail, User, Calendar, CreditCard, Shield, Settings } from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const faqItems = [
    {
      question: "How do I create an account?",
      answer:
        "Click the 'Get Started' button in the top right corner and fill out the registration form with your email, name, and password.",
    },
    {
      question: "How do I list an item for rent?",
      answer:
        "After logging in, click 'List Item' in the navigation bar. Fill out the item details, upload photos, set your price and availability.",
    },
    {
      question: "How do I book an item?",
      answer:
        "Browse items, select your desired dates on the calendar, and click 'Book Now'. You'll need to provide payment information to confirm the booking.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, debit cards, and PayPal. All payments are processed securely through our payment partners.",
    },
    {
      question: "How do I cancel a booking?",
      answer:
        "Go to your profile, find the booking under 'My Bookings', and click 'Cancel'. Refund policies vary by item owner.",
    },
    {
      question: "How do I contact the item owner?",
      answer:
        "Once you have a confirmed booking, you can message the owner directly through our platform messaging system.",
    },
    {
      question: "What if an item is damaged during my rental?",
      answer:
        "Report any damage immediately through the platform. Depending on the situation, you may be responsible for repair costs.",
    },
    {
      question: "How do I leave a review?",
      answer:
        "After your rental period ends, you'll receive a notification to leave a review. You can also access this from your booking history.",
    },
    {
      question: "How do I update my profile information?",
      answer:
        "Go to your profile page and click 'Edit Profile'. You can update your name, photo, bio, and contact information.",
    },
    {
      question: "What are the platform fees?",
      answer:
        "We charge a small service fee on each booking to maintain the platform. Fees are clearly displayed before you confirm any booking.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "Go to Settings > Account Settings > Delete Account. Note that this action is permanent and cannot be undone.",
    },
    {
      question: "Is my personal information secure?",
      answer:
        "Yes, we use industry-standard encryption and security measures. Read our Privacy Policy for detailed information about data protection.",
    },
  ]

  const helpCategories = [
    {
      icon: User,
      title: "Account & Profile",
      description: "Managing your account, profile settings, and personal information",
      color: "text-blue-400",
    },
    {
      icon: Calendar,
      title: "Bookings & Rentals",
      description: "How to book items, manage rentals, and handle cancellations",
      color: "text-green-400",
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Payment methods, fees, refunds, and billing questions",
      color: "text-purple-400",
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Platform safety, security measures, and reporting issues",
      color: "text-red-400",
    },
    {
      icon: Settings,
      title: "Platform Features",
      description: "How to use platform features, notifications, and settings",
      color: "text-yellow-400",
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Messaging, reviews, and communicating with other users",
      color: "text-cyan-400",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">Help Center</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions or get in touch with our support team.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link href="/contact">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Contact Support</h3>
                <p className="text-gray-400 text-sm">Get help from our support team</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Email Support</h3>
              <p className="text-gray-400 text-sm">support@renthub.com</p>
            </CardContent>
          </Card>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Browse by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card
                key={index}
                className="bg-gray-900/50 border-gray-800 backdrop-blur-sm hover:bg-gray-800/50 transition-colors"
              >
                <CardContent className="p-6">
                  <category.icon className={`w-8 h-8 ${category.color} mb-3`} />
                  <h3 className="font-semibold mb-2">{category.title}</h3>
                  <p className="text-gray-400 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <HelpCircle className="w-5 h-5 text-blue-400" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Still Need Help */}
        <div className="mt-12 text-center">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Still Need Help?</h3>
              <p className="text-gray-400 mb-6">
                Can't find what you're looking for? Our support team is here to help you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Contact Support
                  </Button>
                </Link>
                <Button variant="outline" className="border-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  Call +1 (555) 123-4567
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
