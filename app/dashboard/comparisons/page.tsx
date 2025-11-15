'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  GitCompare,
  Plus,
  Search,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react'
import { getRecentComparisons, SavedComparison } from '@/lib/comparisons'

export default function ComparisonsManagementPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [comparisons, setComparisons] = useState<SavedComparison[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Check if user is Admin or Super Admin
  useEffect(() => {
    if (session && session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
      router.push('/dashboard')
    }
  }, [session, router])

  // Fetch comparisons from Firestore
  useEffect(() => {
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
      return // Don't fetch if not authorized
    }

    const fetchComparisons = async () => {
      try {
        setLoading(true)
        const data = await getRecentComparisons(100)
        setComparisons(data)
      } catch (error) {
        console.error('Error fetching comparisons:', error)
        alert('Failed to load comparisons')
      } finally {
        setLoading(false)
      }
    }

    fetchComparisons()
  }, [session])

  // Filter comparisons by search query
  const filteredComparisons = comparisons.filter(comp => {
    const searchLower = searchQuery.toLowerCase()
    return (
      comp.motorcycles.some(moto => 
        moto.brand?.toLowerCase().includes(searchLower) ||
        moto.modelName?.toLowerCase().includes(searchLower)
      )
    )
  })

  // Handle delete (placeholder - would need to implement actual delete functionality)
  const handleDelete = async (id: string) => {
    const confirmed = confirm('Are you sure you want to delete this comparison?')
    if (!confirmed) return

    alert(`Delete functionality for comparison ${id} would be implemented here`)
    // TODO: Implement actual delete functionality
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Comparison Management</h1>
            <p className="text-muted-foreground">
              Manage all saved motorcycle comparisons
            </p>
          </div>
          <Button onClick={() => router.push('/comparisons')}>
            <Plus className="mr-2 h-4 w-4" />
            Create Comparison
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Saved Comparisons</CardTitle>
            <CardDescription>
              View and manage all saved motorcycle comparisons
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search comparisons..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredComparisons.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <GitCompare className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No comparisons found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? 'No comparisons match your search.' : 'No comparisons have been saved yet.'}
                </p>
                <Button onClick={() => router.push('/comparisons')}>
                  Create Comparison
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Motorcycles</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredComparisons.map((comp) => (
                      <TableRow key={comp.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{comp.motorcycles[0]?.brand} {comp.motorcycles[0]?.modelName}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="font-medium">{comp.motorcycles[1]?.brand} {comp.motorcycles[1]?.modelName}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {comp.createdByEmail ? (
                            <div>
                              <div>{comp.createdByEmail}</div>
                              <div className="text-xs text-muted-foreground capitalize">{comp.createdByRole}</div>
                            </div>
                          ) : (
                            <div className="text-muted-foreground">System</div>
                          )}
                        </TableCell>
                        <TableCell>
                          {comp.createdAt ? new Date(comp.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const [a, b] = comp.motorcycles
                                if (a?.id && b?.id) {
                                  router.push(`/motorcycle?compare=true&id1=${encodeURIComponent(a.id)}&id2=${encodeURIComponent(b.id)}`)
                                }
                              }}
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(comp.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}