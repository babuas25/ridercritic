'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Star,
  FileText,
  MessageSquare,
  BookOpen,
  Users
} from 'lucide-react'

export default function NewStarDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Welcome to RiderCritic, NewStar!
            </CardTitle>
            <CardDescription>
              You&apos;re just getting started on your motorcycle journey. Explore reviews, learn from the community,
              and start building your reputation as a rider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                NewStar Level
              </Badge>
              <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                Basic Access
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Getting Started */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Browse Reviews</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,200+</div>
              <p className="text-xs text-muted-foreground">
                Motorcycle reviews available
              </p>
              <Button className="w-full mt-4" variant="outline">
                Start Browsing
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">500+</div>
              <p className="text-xs text-muted-foreground">
                Active community members
              </p>
              <Button className="w-full mt-4" variant="outline">
                Join Discussions
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learn</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">50+</div>
              <p className="text-xs text-muted-foreground">
                Beginner guides available
              </p>
              <Button className="w-full mt-4" variant="outline">
                Start Learning
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Available */}
        <Card>
          <CardHeader>
            <CardTitle>Your Current Features</CardTitle>
            <CardDescription>
              As a NewStar, you have access to these basic features:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Browse Reviews</div>
                  <div className="text-sm text-muted-foreground">Read and explore motorcycle reviews</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Community Forums</div>
                  <div className="text-sm text-muted-foreground">Join discussions and ask questions</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Save Favorites</div>
                  <div className="text-sm text-muted-foreground">Bookmark motorcycles and reviews</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Basic Profile</div>
                  <div className="text-sm text-muted-foreground">Customize your rider profile</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Level Up */}
        <Card>
          <CardHeader>
            <CardTitle>How to Become a CriticStar</CardTitle>
            <CardDescription>
              Ready to unlock more features? Here&apos;s how to level up:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">1</span>
                </div>
                <div>
                  <div className="font-medium">Complete your profile</div>
                  <div className="text-sm text-muted-foreground">Add a profile picture and bio</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">2</span>
                </div>
                <div>
                  <div className="font-medium">Read 10 reviews</div>
                  <div className="text-sm text-muted-foreground">Explore different motorcycle types</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">3</span>
                </div>
                <div>
                  <div className="font-medium">Participate in community</div>
                  <div className="text-sm text-muted-foreground">Comment on 5 discussions</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">4</span>
                </div>
                <div>
                  <div className="font-medium">Get promoted</div>
                  <div className="text-sm text-muted-foreground">Community managers will review your activity</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump into the RiderCritic community:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                Latest Reviews
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                Community
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <BookOpen className="h-6 w-6" />
                Guides
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <Star className="h-6 w-6" />
                Top Rated
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
