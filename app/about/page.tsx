import Link from "next/link"

const AboutPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">About RentHub</h1>
      <p className="mb-5">
        RentHub is a platform designed to connect renters with available properties. Our mission is to simplify the
        rental process and provide a seamless experience for both renters and landlords.
      </p>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Story</h2>
        <p>
          RentHub was founded in 2023 by a team of passionate individuals who recognized the challenges of finding
          suitable rental properties. We aim to address these challenges by providing a user-friendly platform with
          comprehensive listings and advanced search capabilities.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Our Values</h2>
        <ul>
          <li>Transparency: We believe in providing clear and accurate information to our users.</li>
          <li>Innovation: We are constantly striving to improve our platform and services.</li>
          <li>
            Customer Focus: We are dedicated to providing excellent customer support and a positive user experience.
          </li>
        </ul>
      </section>
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="text-xl font-bold">RentHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                Connecting communities through sharing. Rent what you need, earn from what you own.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/community-guidelines" className="hover:text-white transition-colors">
                    Community Guidelines
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>support@renthub.com</li>
                <li>+1 (555) 123-4567</li>
                <li>24/7 Customer Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} RentHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AboutPage
