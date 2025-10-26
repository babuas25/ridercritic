'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Calendar,
  Award,
  Plus
} from 'lucide-react'

export default function SponsorAdminDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sponsor Management</h1>
            <p className="text-gray-600">Manage sponsorships and campaign partnerships</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            <Building2 className="w-3 h-3 mr-1" />
            Sponsor Admin
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sponsorships</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Campaign ROI</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">340%</div>
              <p className="text-xs text-muted-foreground">
                Above target
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Partner Satisfaction</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">
                Excellent rating
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sponsorship Management</CardTitle>
              <CardDescription>
                Create and manage sponsorship campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                New Sponsorship
              </Button>
              <Button variant="outline" className="w-full">
                <Building2 className="w-4 h-4 mr-2" />
                Manage Partners
              </Button>
              <Button variant="outline" className="w-full">
                <Target className="w-4 h-4 mr-2" />
                Campaign Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Tracking</CardTitle>
              <CardDescription>
                Monitor sponsorship performance and revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue Reports
              </Button>
              <Button variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Performance Metrics
              </Button>
              <Button variant="outline" className="w-full">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Reports
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Active Campaigns */}
        <Card>
          <CardHeader>
            <CardTitle>Active Sponsorship Campaigns</CardTitle>
            <CardDescription>
              Currently running sponsorships and their performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "Honda Spring Campaign",
                  partner: "Honda Motorcycles",
                  status: "Active",
                  revenue: "$8,500",
                  roi: "285%",
                  endDate: "2024-03-15"
                },
                {
                  name: "Dainese Safety Gear",
                  partner: "Dainese",
                  status: "Active",
                  revenue: "$5,200",
                  roi: "420%",
                  endDate: "2024-02-28"
                },
                {
                  name: "Track Day Series",
                  partner: "MotoTrack Events",
                  status: "Planning",
                  revenue: "$3,800",
                  roi: "-",
                  endDate: "2024-04-01"
                }
              ].map((campaign, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {campaign.partner} • Ends {campaign.endDate}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{campaign.revenue}</div>
                      <div className="text-sm text-muted-foreground">
                        ROI: {campaign.roi}
                      </div>
                    </div>
                  </div>
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
              Common sponsor management tasks:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Plus className="h-6 w-6" />
                New Campaign
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="h-6 w-6" />
                Partner Portal
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="h-6 w-6" />
                Analytics
              </Button>

              <Button variant="outline" className="h-20 flex-col gap-2">
                <DollarSign className="h-6 w-6" />
                Revenue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
