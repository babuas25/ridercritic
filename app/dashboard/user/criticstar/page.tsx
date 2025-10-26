'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PenTool,
  Star,
  MessageSquare,
  FileText,
  Plus,
  Eye,
  ThumbsUp
} from 'lucide-react'

export default function CriticStarDashboard() {
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
              <PenTool className="h-5 w-5 text-blue-500" />
              Welcome back, CriticStar!
            </CardTitle>
            <CardDescription>
              You now have the power to write reviews and share your motorcycle experiences with the community.
              Help other riders make informed decisions!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                CriticStar Level
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Can Write Reviews
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Written</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                Start writing your first review!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Based on your reviews
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Helpful Votes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                From other community members
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                People viewed your profile
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Write Reviews</CardTitle>
              <CardDescription>
                Share your motorcycle experiences and help other riders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Write New Review
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                My Draft Reviews
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Review Guidelines</CardTitle>
              <CardDescription>
                Learn how to write helpful and informative reviews
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Be honest and objective</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Include specific details</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Use clear, helpful language</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Rate different aspects separately</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Full Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity & Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>
              Track your activity and work towards becoming a CriticMaster
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="activity" className="w-full">
              <TabsList>
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="progress">Level Progress</TabsTrigger>
              </TabsList>
              <TabsContent value="activity" className="space-y-4">
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No recent activity</h3>
                  <p className="text-sm text-muted-foreground">
                    Start writing reviews to see your activity here!
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="progress" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Reviews Written</span>
                      <span className="text-sm text-muted-foreground">0 / 10</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Community Engagement</span>
                      <span className="text-sm text-muted-foreground">0 / 25</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Helpful Votes Received</span>
                      <span className="text-sm text-muted-foreground">0 / 50</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Path to CriticMaster</h4>
                  <p className="text-sm text-blue-800">
                    Write 10 quality reviews, engage with the community, and receive 50 helpful votes
                    to unlock moderation powers and become a CriticMaster.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks for CriticStar members:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <PenTool className="h-6 w-6" />
                Write Review
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <Star className="h-6 w-6" />
                Rate Products
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                Join Discussion
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                Browse Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
