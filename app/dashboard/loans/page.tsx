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
  Edit,
  Trash2,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { getAllLoanOffers, deleteLoanOffer } from '@/lib/loans'
import { LoanOffer } from '@/types/loan'

export default function LoansManagementPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loans, setLoans] = useState<LoanOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loanTypeFilter, setLoanTypeFilter] = useState('all')

  // Check if user is Admin or Super Admin
  useEffect(() => {
    if (session && session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
      router.push('/dashboard')
    }
  }, [session, router])

  // Fetch loan offers from Firestore
  useEffect(() => {
    if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
      return // Don't fetch if not authorized
    }

    const fetchLoans = async () => {
      try {
        setLoading(true)
        const filters: {
          loanType?: 'Official' | 'Unofficial' | 'Bank'
          status?: 'Active' | 'Inactive'
        } = {}
        
        if (loanTypeFilter !== 'all') {
          filters.loanType = loanTypeFilter as 'Official' | 'Unofficial' | 'Bank'
        }
        if (statusFilter !== 'all') {
          filters.status = statusFilter as 'Active' | 'Inactive'
        }
        
        const data = await getAllLoanOffers(
          Object.keys(filters).length > 0 ? filters : undefined,
          100
        )
        setLoans(data)
      } catch (error) {
        console.error('Error fetching loan offers:', error)
        alert('Failed to load loan offers')
      } finally {
        setLoading(false)
      }
    }

    fetchLoans()
  }, [statusFilter, loanTypeFilter, session])

  // Filter loans by search query
  const filteredLoans = loans.filter(loan => {
    const searchLower = searchQuery.toLowerCase()
    return (
      loan.bankName?.toLowerCase().includes(searchLower) ||
      loan.description?.toLowerCase().includes(searchLower)
    )
  })

  // Handle delete
  const handleDelete = async (id: string, name: string) => {
    const confirmed = confirm(`Are you sure you want to delete ${name}?`)
    if (!confirmed) return

    try {
      await deleteLoanOffer(id)
      setLoans(loans.filter(loan => loan.id !== id))
      alert('Loan offer deleted successfully')
    } catch (error) {
      console.error('Error deleting loan offer:', error)
      alert('Failed to delete loan offer')
    }
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Offers</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage motorcycle loan offers and financing options
            </p>
          </div>
          <Button 
            onClick={() => router.push('/dashboard/loans/add')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Loan Offer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              <Bike className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loans.length}</div>
              <p className="text-xs text-muted-foreground">
                Active loan offers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Official Loans</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loans.filter(loan => loan.loanType === 'Official').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Government-backed offers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bank Loans</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loans.filter(loan => loan.loanType === 'Bank').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Traditional bank financing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loans.filter(loan => loan.status === 'Active').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Currently available
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Loan Offers</CardTitle>
            <CardDescription>
              Manage all motorcycle loan offers and financing options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search loan offers..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select value={loanTypeFilter} onValueChange={setLoanTypeFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Loan Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Official">Official</SelectItem>
                    <SelectItem value="Unofficial">Unofficial</SelectItem>
                    <SelectItem value="Bank">Bank</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bank Name</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Max Term</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.length > 0 ? (
                    filteredLoans.map((loan) => (
                      <TableRow key={loan.id}>
                        <TableCell className="font-medium">{loan.bankName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{loan.loanType}</Badge>
                        </TableCell>
                        <TableCell>{loan.interestRate}%</TableCell>
                        <TableCell>{loan.maxTerm} months</TableCell>
                        <TableCell>
                          <Badge 
                            variant={loan.status === 'Active' ? 'default' : 'secondary'}
                          >
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/dashboard/loans/edit/${loan.id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(loan.id!, loan.bankName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Bike className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">No loan offers found</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}