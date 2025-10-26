'use client'

import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Users,
  UserPlus,
  Shield,
  Settings,
  Database,
  Activity,
  Crown,
  AlertTriangle
} from 'lucide-react'

export default function SuperAdminDashboard() {
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
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600">Complete system control and user management</p>
          </div>
          <Badge className="bg-purple-100 text-purple-800">
            <Crown className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +20% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">573</div>
              <p className="text-xs text-muted-foreground">
                +12% from last hour
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Health</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Excellent</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Actions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Create, edit, and manage user accounts and roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                Add New User
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Manage Existing Users
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Role Assignment
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Administration</CardTitle>
              <CardDescription>
                Monitor and configure system settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                System Settings
              </Button>
              <Button variant="outline" className="w-full">
                <Database className="w-4 h-4 mr-2" />
                Database Management
              </Button>
              <Button variant="outline" className="w-full">
                <Activity className="w-4 h-4 mr-2" />
                System Monitoring
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Admin Activity</CardTitle>
            <CardDescription>
              Latest actions and changes in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registered</p>
                  <p className="text-xs text-muted-foreground">john.doe@example.com - 2 minutes ago</p>
                </div>
                <Badge variant="outline">Auto-assigned</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Role updated</p>
                  <p className="text-xs text-muted-foreground">jane.smith@example.com promoted to Admin - 15 minutes ago</p>
                </div>
                <Badge variant="outline">Manual</Badge>
              </div>

              <div className="flex items-center gap-4 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System backup completed</p>
                  <p className="text-xs text-muted-foreground">Automated backup - 1 hour ago</p>
                </div>
                <Badge variant="outline">System</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-yellow-700">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <span>High server load detected - consider scaling</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-yellow-700">
                <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                <span>Database backup due in 2 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
