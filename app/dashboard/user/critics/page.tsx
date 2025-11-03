'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Star, Eye, Calendar, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface Critic {
  id: string
  title: string
  topic: string
  content: string
  rating: number
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
}

interface CriticApiResponse {
  critics: Critic[]
}

interface ErrorApiResponse {
  error: string
  details?: string
}

export default function UserCritics() {
  const { data: session } = useSession()
  const [critics, setCritics] = useState<Critic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUserCritics = async () => {
      try {
        if (!session?.user?.id) return
        
        setLoading(true)
        console.log('Fetching critics for user:', session.user.id)
        
        // Fetch user critics from API
        const response = await fetch(`/api/critics?authorId=${session.user.id}`)
        console.log('API response status:', response.status)
        
        if (!response.ok) {
          const errorData: ErrorApiResponse = await response.json()
          console.error('API error response:', errorData)
          throw new Error(`${errorData.error}${errorData.details ? `: ${errorData.details}` : ''}`)
        }
        
        const data: CriticApiResponse = await response.json()
        console.log('API success response:', data)
        
        // Process critics with proper date formatting
        const processedCritics = data.critics.map((critic) => {
          console.log('Processing critic:', critic)
          
          // Handle createdAt field
          let createdAt: Date
          if (critic.createdAt instanceof Date) {
            createdAt = critic.createdAt
          } else if (critic.createdAt && typeof critic.createdAt === 'object' && 'toDate' in critic.createdAt) {
            // Firestore Timestamp with toDate method
            createdAt = (critic.createdAt as unknown as { toDate: () => Date }).toDate()
          } else if (critic.createdAt && typeof critic.createdAt === 'object' && 'seconds' in critic.createdAt) {
            // Firestore Timestamp with seconds
            createdAt = new Date((critic.createdAt as { seconds: number }).seconds * 1000)
          } else if (critic.createdAt) {
            // String or number date
            createdAt = new Date(critic.createdAt as string | number)
          } else {
            // Fallback to current date
            createdAt = new Date()
          }
          
          const processedCritic = {
            ...critic,
            createdAt: createdAt,
            // For existing critics without status, treat them as approved (published) since you mentioned they're already published
            status: critic.status || 'approved'
          }
          console.log('Processed critic:', processedCritic)
          return processedCritic
        })
        
        console.log('All processed critics:', processedCritics)
        setCritics(processedCritics)
      } catch (err: unknown) {
        console.error('Error fetching user critics:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load your critics'
        setError(`${errorMessage}. Please check the browser console for more details.`)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchUserCritics()
    }
  }, [session])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Published</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
    }
  }

  // Format date for display
  const formatDate = (date: Date | string | number | null | undefined) => {
    if (!date) return 'Unknown date'
    
    try {
      console.log('Formatting date:', date, typeof date)
      
      // Handle different date formats
      let d: Date
      
      if (date instanceof Date) {
        d = date
      } else if (typeof date === 'object' && date !== null) {
        // Handle Firestore Timestamp
        if ('toDate' in date) {
          d = (date as unknown as { toDate: () => Date }).toDate()
        } 
        // Handle Firestore timestamp object with seconds/nanoseconds
        else if ('seconds' in date) {
          d = new Date((date as { seconds: number }).seconds * 1000)
        } 
        // Handle other object formats
        else {
          d = new Date()
        }
      } else if (typeof date === 'string') {
        // Try to parse string date
        d = new Date(date)
      } else if (typeof date === 'number') {
        // Handle timestamp numbers
        d = new Date(date)
      } else {
        // Handle any other type by converting to string
        const dateString = String(date)
        if (dateString.trim() === '') {
          return 'Unknown date'
        }
        d = new Date(dateString)
      }
      
      console.log('Parsed date object:', d)
      
      // Check if date is valid
      if (isNaN(d.getTime())) {
        console.log('Invalid date, returning fallback')
        return 'Unknown date'
      }
      
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Unknown date'
    }
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Critics</h1>
            <p className="text-gray-600">View and manage all critics you've created</p>
          </div>
          <Button asChild>
            <Link href="/critics/write">
              <Star className="w-4 h-4 mr-2" />
              Write New Critic
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Critics</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{critics.length}</div>
              <p className="text-xs text-muted-foreground">
                Critics you've written
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {critics.filter(r => r.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live on the site
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {critics.filter(r => r.status === 'pending').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting moderation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Critics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Critics</CardTitle>
            <CardDescription>
              All critics you've written for motorcycles and other products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                {error}
              </div>
            ) : critics.length === 0 ? (
              <div className="text-center py-10">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No critics yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't written any critics yet. Start sharing your motorcycle experiences!
                </p>
                <Button asChild>
                  <Link href="/critics/write">
                    <Star className="w-4 h-4 mr-2" />
                    Write Your First Critic
                  </Link>
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Topic</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {critics.map((critic) => (
                    <TableRow key={critic.id}>
                      <TableCell>
                        <div className="font-medium">{critic.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{critic.topic}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.round(critic.rating || 0) ? 'fill-foreground' : 'fill-muted stroke-muted-foreground'}`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            {critic.rating}/5
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(critic.createdAt)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(critic.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/critics/${critic.id}`}>
                              View
                            </Link>
                          </Button>
                          {(critic.status === 'pending' || critic.status === 'rejected') && (
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/critics/write?edit=${critic.id}`}>
                                Edit
                              </Link>
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}