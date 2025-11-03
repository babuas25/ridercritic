'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Search,
  Filter,
  Check,
  X,
  Trash2,
  Eye
} from 'lucide-react'

interface Critic {
  id: string
  title: string
  topic: string
  content: string
  userId: string
  authorName: string
  createdAt: Date
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

interface CriticApiResponse {
  critics: Critic[]
}

interface ErrorApiResponse {
  error: string
  details?: string
}

export default function CriticManagement() {
  const { data: session } = useSession()
  const [critics, setCritics] = useState<Critic[]>([])
  const [filteredCritics, setFilteredCritics] = useState<Critic[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
  const [rejectingCritic, setRejectingCritic] = useState<Critic | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch critics
  useEffect(() => {
    const fetchCritics = async () => {
      try {
        setLoading(true)
        console.log('Fetching critics from API...')
        const response = await fetch('/api/critics?limit=100')
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
            // For existing critics without status, treat them as approved (published)
            status: critic.status || 'approved'
          }
          console.log('Processed critic:', processedCritic)
          return processedCritic
        })
        
        console.log('All processed critics:', processedCritics)
        setCritics(processedCritics)
        setFilteredCritics(processedCritics)
      } catch (err: unknown) {
        console.error('Error fetching critics:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load critics'
        setError(`${errorMessage}. Please check the browser console for more details.`)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      fetchCritics()
    }
  }, [session])

  // Filter critics based on search and status
  useEffect(() => {
    let result = critics
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(critic => 
        critic.title.toLowerCase().includes(term) ||
        critic.authorName.toLowerCase().includes(term) ||
        critic.topic.toLowerCase().includes(term)
      )
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      result = result.filter(critic => critic.status === selectedStatus)
    }
    
    setFilteredCritics(result)
  }, [searchTerm, selectedStatus, critics])

  const handleApprove = async (criticId: string) => {
    try {
      const response = await fetch('/api/critics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          criticId,
          status: 'approved'
        }),
      })
      
      if (!response.ok) {
        const errorData: ErrorApiResponse = await response.json()
        throw new Error(errorData.error || 'Failed to approve critic')
      }
      
      // Update local state
      setCritics(critics.map(critic => 
        critic.id === criticId ? { ...critic, status: 'approved' } : critic
      ))
    } catch (error: unknown) {
      console.error('Error approving critic:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to approve critic'
      alert(errorMessage)
    }
  }

  const handleReject = async () => {
    if (!rejectingCritic) return
    
    try {
      const response = await fetch('/api/critics', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          criticId: rejectingCritic.id,
          status: 'rejected',
          rejectionReason
        }),
      })
      
      if (!response.ok) {
        const errorData: ErrorApiResponse = await response.json()
        throw new Error(errorData.error || 'Failed to reject critic')
      }
      
      // Update local state
      setCritics(critics.map(critic => 
        critic.id === rejectingCritic.id ? { 
          ...critic, 
          status: 'rejected',
          rejectionReason 
        } : critic
      ))
      
      setIsRejectDialogOpen(false)
      setRejectingCritic(null)
      setRejectionReason('')
    } catch (error: unknown) {
      console.error('Error rejecting critic:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to reject critic'
      alert(errorMessage)
    }
  }

  const handleDelete = async (criticId: string) => {
    if (!confirm('Are you sure you want to delete this critic? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/critics?id=${criticId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData: ErrorApiResponse = await response.json()
        throw new Error(errorData.error || 'Failed to delete critic')
      }
      
      // Update local state
      setCritics(critics.filter(critic => critic.id !== criticId))
    } catch (error: unknown) {
      console.error('Error deleting critic:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete critic'
      alert(errorMessage)
    }
  }

  const openRejectDialog = (critic: Critic) => {
    setRejectingCritic(critic)
    setIsRejectDialogOpen(true)
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Critic Management</h1>
            <p className="text-gray-600">Manage and moderate user critics</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Critics</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{critics.length}</div>
              <p className="text-xs text-muted-foreground">
                All submitted critics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {critics.filter(r => r.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Published critics
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <X className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {critics.filter(r => r.status === 'rejected').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Not approved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Critics Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Critics</CardTitle>
                <CardDescription>
                  Manage and moderate user submitted critics
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search critics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Users</TableHead>
                    <TableHead>Critic Title</TableHead>
                    <TableHead>Topics</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Critics (Preview)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCritics.map((critic) => (
                    <TableRow key={critic.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{critic.authorName}</div>
                          <div className="text-sm text-muted-foreground">
                            {critic.userId}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{critic.title}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{critic.topic}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(critic.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-sm">
                          {critic.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                        </div>
                        {critic.rejectionReason && (
                          <div className="text-xs text-red-500 mt-1">
                            Reason: {critic.rejectionReason}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(critic.status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {critic.status === 'pending' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApprove(critic.id)}
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openRejectDialog(critic)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(critic.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Reject Critic Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Critic</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this critic. The user will be notified of this reason.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <textarea
                  id="reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="col-span-3 border rounded-md p-2 min-h-[100px]"
                  placeholder="Enter reason for rejection (e.g., Violation of policy, Inappropriate content, etc.)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
              >
                Reject Critic
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}