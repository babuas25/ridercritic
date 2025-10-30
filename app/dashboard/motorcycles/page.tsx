'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
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
  Bike,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { getAllMotorcycles, deleteMotorcycle } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'

export default function MotorcyclesManagementPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Check if user is Admin or Super Admin - use useEffect to avoid rendering issues
  useEffect(() => {
    if (session && session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
      router.push('/dashboard')
    }
  }, [session, router])

  // Fetch motorcycles from Firestore
  useEffect(() => {
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
      return // Don't fetch if not authorized
    }

    const fetchMotorcycles = async () => {
      try {
        setLoading(true)
        const filters: Record<string, string> = {}
        if (statusFilter !== 'all') {
          filters.status = statusFilter
        }
        const data = await getAllMotorcycles(filters)
        setMotorcycles(data)
      } catch (error) {
        console.error('Error fetching motorcycles:', error)
        alert('Failed to load motorcycles')
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycles()
  }, [statusFilter, session])

  // Filter motorcycles by search query
  const filteredMotorcycles = motorcycles.filter(m => {
    const searchLower = searchQuery.toLowerCase()
    return (
      m.brand?.toLowerCase().includes(searchLower) ||
      m.modelName?.toLowerCase().includes(searchLower) ||
      m.category?.toLowerCase().includes(searchLower)
    )
  })

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    const confirmed = confirm(`Are you sure you want to delete ${name}?`)
    if (!confirmed) return

    try {
      await deleteMotorcycle(id)
      setMotorcycles(motorcycles.filter(m => m.id !== id))
      alert('Motorcycle deleted successfully')
    } catch (error) {
      console.error('Error deleting motorcycle:', error)
      alert('Failed to delete motorcycle')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'draft': return 'bg-yellow-100 text-yellow-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Show loading or redirect if not authorized
  if (!session) {
    return null // Loading session
  }

  if (session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
    return null // Redirecting
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Motorcycle Management</h1>
            <p className="text-gray-600">Manage motorcycle models, specifications, and pricing</p>
          </div>
          <Button onClick={() => router.push('/dashboard/motorcycles/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Motorcycle
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Models</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{motorcycles.length}</div>
              <p className="text-xs text-muted-foreground">
                Active motorcycle models
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
                {motorcycles.filter(m => m.status === 'published').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live on website
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">—</div>
              <p className="text-xs text-muted-foreground">
                Coming soon
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ৳ {motorcycles.length > 0 ? Math.round(motorcycles.reduce((sum, m) => sum + (parseInt(m.exShowroomPrice) || 0), 0) / motorcycles.length).toLocaleString() : '0'}
              </div>
              <p className="text-xs text-muted-foreground">
                Average showroom price
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Motorcycles Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Motorcycles</CardTitle>
                <CardDescription>
                  Manage motorcycle specifications and pricing
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search motorcycles..."
                    className="pl-8 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : filteredMotorcycles.length === 0 ? (
              <div className="text-center py-12">
                <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">No motorcycles found</p>
                <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Motorcycle</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price (BDT)</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMotorcycles.map((motorcycle) => (
                  <TableRow key={motorcycle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{motorcycle.brand} {motorcycle.modelName}</div>
                        <div className="text-sm text-muted-foreground">{motorcycle.modelYear}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{motorcycle.category}</Badge>
                    </TableCell>
                    <TableCell>
                      ৳ {parseInt(motorcycle.exShowroomPrice || '0').toLocaleString()}
                    </TableCell>
                    <TableCell>
                      —
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(motorcycle.status)}>
                        {motorcycle.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/motorcycle/${motorcycle.id}`)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/motorcycles/edit/${motorcycle.id}`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDelete(motorcycle.id!, `${motorcycle.brand} ${motorcycle.modelName}`)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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
      </div>
    </DashboardLayout>
  )
}
