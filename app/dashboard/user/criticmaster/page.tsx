'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Shield,
  CheckCircle,
  XCircle,
  MessageSquare,
  Award,
  TrendingUp,
  FileText,
  Users,
  AlertTriangle,
  Clock
} from 'lucide-react'

export default function CriticMasterDashboard() {
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
              <Shield className="h-5 w-5 text-purple-500" />
              Welcome, CriticMaster!
            </CardTitle>
            <CardDescription>
              You have earned the highest level of community trust. Help maintain quality standards
              by moderating reviews and guiding the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                CriticMaster Level
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Can Moderate Content
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Community Leader
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Moderation Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">12</div>
              <p className="text-xs text-muted-foreground">
                Awaiting moderation
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">8</div>
              <p className="text-xs text-muted-foreground">
                Reviews approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">2</div>
              <p className="text-xs text-muted-foreground">
                Reviews rejected
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Reports</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">3</div>
              <p className="text-xs text-muted-foreground">
                Need attention
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Moderation Queue</CardTitle>
            <CardDescription>
              Reviews and content that need your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList>
                <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
                <TabsTrigger value="reports">Community Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="pending" className="space-y-4">
                <div className="space-y-4">
                  {/* Mock pending reviews */}
                  {[
                    {
                      id: 1,
                      title: "2024 Honda CBR1000RR Review",
                      author: "john_rider",
                      date: "2024-01-20",
                      type: "Motorcycle Review",
                      content: "This bike is absolutely amazing! The power delivery is smooth and the handling is precise..."
                    },
                    {
                      id: 2,
                      title: "Best Motorcycle Gear for 2024",
                      author: "safety_first",
                      date: "2024-01-19",
                      type: "Gear Review",
                      content: "I've been riding for 10 years and this gear has saved me multiple times..."
                    },
                    {
                      id: 3,
                      title: "Track Day Experience at Laguna Seca",
                      author: "track_enthusiast",
                      date: "2024-01-18",
                      type: "Experience Review",
                      content: "What an incredible experience! The track is challenging but rewarding..."
                    }
                  ].map((review) => (
                    <div key={review.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{review.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {review.author} • {review.date} • {review.type}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline">
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {review.content}
                      </p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="reports" className="space-y-4">
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">No reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Community reports will appear here when users flag content.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Moderation Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Moderation Guidelines</CardTitle>
            <CardDescription>
              Remember these key principles when moderating content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Approve Quality Content</div>
                    <div className="text-xs text-muted-foreground">
                      Well-written, helpful reviews that follow guidelines
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Encourage Constructive Feedback</div>
                    <div className="text-xs text-muted-foreground">
                      Reviews that provide value to the community
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Promote Safety</div>
                    <div className="text-xs text-muted-foreground">
                      Content that emphasizes safe riding practices
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Reject Spam</div>
                    <div className="text-xs text-muted-foreground">
                      Promotional content or repetitive posts
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Remove Inappropriate Content</div>
                    <div className="text-xs text-muted-foreground">
                      Offensive, harmful, or inappropriate material
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">Block Misinformation</div>
                    <div className="text-xs text-muted-foreground">
                      False or dangerous information about motorcycles
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Your Community Impact</CardTitle>
            <CardDescription>
              See how your moderation efforts help the community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-muted-foreground">Reviews Moderated</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">89%</div>
                <div className="text-sm text-muted-foreground">Community Satisfaction</div>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">+12%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common moderation tasks:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Clock className="h-6 w-6" />
                View Queue
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <CheckCircle className="h-6 w-6" />
                Bulk Approve
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <MessageSquare className="h-6 w-6" />
                Community Reports
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <FileText className="h-6 w-6" />
                Guidelines
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
