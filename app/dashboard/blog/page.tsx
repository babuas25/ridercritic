'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { UserRole, UserSubRole } from '@/lib/auth'

export default function BlogDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!session) {
    return null
  }

  const role = session.user.role as UserRole | undefined
  const subRole = session.user.subRole as UserSubRole | undefined

  const isCriticMasterUser = role === 'User Admin' && subRole === 'CriticMaster'
  const canWrite = role === 'Freelancer Admin' || isCriticMasterUser
  const canManage =
    role === 'Super Admin' ||
    role === 'Admin' ||
    canWrite

  if (!canManage) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Access denied. You do not have permission to view this page.</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
            <p className="text-gray-600">Create and manage blog posts for ridercritic.</p>
          </div>
          {canWrite && (
            <Button
              onClick={() => {
                if (!studioUrl) {
                  // No Studio URL configured
                  alert('Sanity Studio URL is not configured. Please set NEXT_PUBLIC_SANITY_STUDIO_URL in .env.local.')
                  return
                }

                if (studioUrl.startsWith('http')) {
                  window.location.href = studioUrl
                } else {
                  router.push(studioUrl)
                }
              }}
            >
              New Post
            </Button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Your access</CardTitle>
              <CardDescription>Current permissions for blog module</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Role</span>
                <Badge variant="outline">{role}</Badge>
              </div>
              {subRole && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sub role</span>
                  <Badge variant="outline">{subRole}</Badge>
                </div>
              )}
              <div className="text-sm text-muted-foreground pt-2">
                {canWrite ? 'You can write and manage blog posts.' : 'You can manage blog posts only.'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Posts</CardTitle>
              <CardDescription>Overview of blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Post list and filters will appear here once wired to Sanity content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workflows</CardTitle>
              <CardDescription>Publishing and review</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Approval and review tools can be added here for Admin and Super Admin.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
