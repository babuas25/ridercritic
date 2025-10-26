import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  Users,
  Shield,
  ChevronRight,
  CheckCircle
} from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Welcome to RiderCritic
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Ultimate
              <span className="text-blue-600"> Motorcycle Community</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of motorcycle enthusiasts sharing reviews, experiences, and insights.
              From beginner guides to expert opinions, find everything you need to make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/register">
                  Get Started Free
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose RiderCritic?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to make informed decisions about motorcycles, gear, and riding experiences.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Expert Reviews</CardTitle>
                <CardDescription>
                  Detailed reviews from real riders with years of experience
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Community Driven</CardTitle>
                <CardDescription>
                  Join discussions, share experiences, and learn from fellow riders
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Quality Moderation</CardTitle>
                <CardDescription>
                  Community-driven quality control ensures reliable information
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Levels Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Grow With Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start as a NewStar and work your way up through our merit-based system.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gray-600">1</span>
                </div>
                <CardTitle>NewStar</CardTitle>
                <CardDescription>
                  Welcome to the community! Browse reviews, read guides, and start your journey.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Browse all reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Join community discussions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Save favorite content
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <CardTitle className="text-blue-900">CriticStar</CardTitle>
                <CardDescription className="text-blue-700">
                  Share your experiences! Write reviews and help other riders make decisions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Write detailed reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Rate products and services
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    Comment on reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-blue-500" />
                    All NewStar features
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <CardTitle className="text-purple-900">CriticMaster</CardTitle>
                <CardDescription className="text-purple-700">
                  Lead the community! Moderate content and maintain quality standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Approve/reject reviews
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Moderate community content
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    Quality control oversight
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-500" />
                    All CriticStar features
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Reviews Written</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">5,000+</div>
              <div className="text-gray-600">Community Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600">Motorcycle Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8★</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your journey today and become part of the most trusted motorcycle community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="text-lg px-8">
              <Link href="/register">
                Create Free Account
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
              <Link href="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">RiderCritic</h3>
              <p className="text-gray-400">
                The ultimate motorcycle community for reviews, experiences, and insights.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
                <li><Link href="/community" className="hover:text-white">Discussions</Link></li>
                <li><Link href="/guides" className="hover:text-white">Guides</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/about" className="hover:text-white">About</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 RiderCritic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}