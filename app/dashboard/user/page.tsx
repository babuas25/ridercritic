'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  User,
  Star,
  MessageSquare,
  Award,
  FileText
} from 'lucide-react'

export default function UserDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  const userRole = session.user.role
  const userSubRole = session.user.subRole

  const getSubRoleDescription = (subRole: string) => {
    switch (subRole) {
      case 'NewStar':
        return 'Welcome to RiderCritic! Start your journey by exploring reviews and sharing your thoughts.'
      case 'CriticStar':
        return 'You can now write reviews and rate content. Help other riders make informed decisions!'
      case 'CriticMaster':
        return 'You have the power to approve or reject reviews. Maintain quality standards for the community.'
      default:
        return 'Welcome to RiderCritic!'
    }
  }

  const getSubRoleFeatures = (subRole: string) => {
    switch (subRole) {
      case 'NewStar':
        return [
          'Browse motorcycle reviews',
          'Read expert opinions',
          'Access community discussions',
          'Save favorite motorcycles'
        ]
      case 'CriticStar':
        return [
          'Write motorcycle reviews',
          'Rate products and services',
          'Comment on other reviews',
          'Share riding experiences',
          'All NewStar features'
        ]
      case 'CriticMaster':
        return [
          'Approve/reject reviews',
          'Moderate community content',
          'Quality control oversight',
          'Community management',
          'All CriticStar features'
        ]
      default:
        return []
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-full lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Welcome back, {session.user.name}!
              </CardTitle>
              <CardDescription>
                {getSubRoleDescription(userSubRole)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Role: {userRole}</Badge>
                  <Badge variant="outline">Level: {userSubRole}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Active</div>
              <p className="text-xs text-muted-foreground">
                Member since {new Date().getFullYear()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Features & Permissions</CardTitle>
            <CardDescription>
              Based on your current role and subrole, you have access to the following features:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {getSubRoleFeatures(userSubRole).map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and features you might want to access:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                Browse Reviews
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <Star className="h-6 w-6" />
                Rate Products
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                Community
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Track your activity and contributions to the community:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-muted-foreground">Reviews Written</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-muted-foreground">Reviews Approved</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">0</div>
                    <div className="text-sm text-muted-foreground">Community Posts</div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="achievements" className="space-y-4">
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No achievements yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Start contributing to unlock achievements and badges!
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
