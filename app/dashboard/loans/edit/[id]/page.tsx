'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { getLoanOffer, updateLoanOffer } from '@/lib/loans'
import { LoanOffer } from '@/types/loan'

export default function EditLoanOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loanId, setLoanId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState<Omit<LoanOffer, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'lastUpdatedBy' | 'lastUpdatedDate'>>({
    bankName: '',
    loanType: 'Official',
    interestRate: 0,
    maxTerm: 0,
    processingFee: '',
    minimumLoanAmount: 0,
    maximumLoanAmount: 0,
    description: '',
    eligibilityCriteria: '',
    requiredDocuments: [],
    status: 'Active',
    seoMetaTitle: '',
    seoMetaDescription: '',
    tags: []
  })
  
  const [newDocument, setNewDocument] = useState('')
  const [newTag, setNewTag] = useState('')

  // Resolve params promise and fetch loan offer
  useEffect(() => {
    const fetchLoanOffer = async () => {
      try {
        // Resolve the params promise
        const resolvedParams = await params;
        setLoanId(resolvedParams.id)
        
        if (!resolvedParams.id) {
          router.push('/dashboard/loans')
          return
        }

        const loanData = await getLoanOffer(resolvedParams.id)
        if (loanData) {
          // Remove system fields before setting form data
          const formDataWithoutSystemFields = { ...loanData }
          delete formDataWithoutSystemFields.id
          delete formDataWithoutSystemFields.createdBy
          delete formDataWithoutSystemFields.createdAt
          delete formDataWithoutSystemFields.updatedAt
          delete formDataWithoutSystemFields.lastUpdatedBy
          delete formDataWithoutSystemFields.lastUpdatedDate
          setFormData(formDataWithoutSystemFields)
        } else {
          alert('Loan offer not found')
          router.push('/dashboard/loans')
        }
      } catch (error) {
        console.error('Error fetching loan offer:', error)
        alert('Failed to load loan offer')
        router.push('/dashboard/loans')
      } finally {
        setLoading(false)
      }
    }

    fetchLoanOffer()
  }, [params, router])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Amount') || name.includes('Rate') || name.includes('Term') 
        ? Number(value) || 0 
        : value
    }))
  }

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Add document to required documents
  const addDocument = () => {
    if (newDocument.trim()) {
      setFormData(prev => ({
        ...prev,
        requiredDocuments: [...prev.requiredDocuments, newDocument.trim()]
      }))
      setNewDocument('')
    }
  }

  // Remove document from required documents
  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_: string, i: number) => i !== index)
    }))
  }

  // Add tag
  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // Remove tag
  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_: string, i: number) => i !== index)
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session?.user?.id) {
      alert('You must be logged in to update a loan offer')
      return
    }

    if (!loanId) {
      alert('Loan offer ID is missing')
      return
    }

    try {
      setSaving(true)
      await updateLoanOffer(loanId, formData as LoanOffer, session.user.id)
      alert('Loan offer updated successfully!')
      router.push('/dashboard/loans')
    } catch (error) {
      console.error('Error updating loan offer:', error)
      alert('Failed to update loan offer')
    } finally {
      setSaving(false)
    }
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You must be logged in to view this page.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // Check if user is Admin or Super Admin
  if (session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p>You do not have permission to access this page.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (loading) {
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Loan Offer</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Update the motorcycle loan offer details
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => router.push('/dashboard/loans')}
          >
            Back to Loans
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Loan Offer Details</CardTitle>
              <CardDescription>
                Update the details for this loan offer
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="Enter bank name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type *</Label>
                  <Select 
                    value={formData.loanType} 
                    onValueChange={(value) => handleSelectChange('loanType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Official">Official</SelectItem>
                      <SelectItem value="Unofficial">Unofficial</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                  <Input
                    id="interestRate"
                    name="interestRate"
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={handleChange}
                    placeholder="Enter interest rate"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxTerm">Maximum Term (months) *</Label>
                  <Input
                    id="maxTerm"
                    name="maxTerm"
                    type="number"
                    value={formData.maxTerm}
                    onChange={handleChange}
                    placeholder="Enter maximum term"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimumLoanAmount">Minimum Loan Amount *</Label>
                  <Input
                    id="minimumLoanAmount"
                    name="minimumLoanAmount"
                    type="number"
                    value={formData.minimumLoanAmount}
                    onChange={handleChange}
                    placeholder="Enter minimum loan amount"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maximumLoanAmount">Maximum Loan Amount *</Label>
                  <Input
                    id="maximumLoanAmount"
                    name="maximumLoanAmount"
                    type="number"
                    value={formData.maximumLoanAmount}
                    onChange={handleChange}
                    placeholder="Enter maximum loan amount"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee</Label>
                  <Input
                    id="processingFee"
                    name="processingFee"
                    value={formData.processingFee}
                    onChange={handleChange}
                    placeholder="Enter processing fee"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter loan offer description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibilityCriteria">Eligibility Criteria</Label>
                <Textarea
                  id="eligibilityCriteria"
                  name="eligibilityCriteria"
                  value={formData.eligibilityCriteria}
                  onChange={handleChange}
                  placeholder="Enter eligibility criteria"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Required Documents</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newDocument}
                      onChange={(e) => setNewDocument(e.target.value)}
                      placeholder="Add document"
                      className="w-48"
                    />
                    <Button type="button" onClick={addDocument} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
                {formData.requiredDocuments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.requiredDocuments.map((doc, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{doc}</span>
                        <button 
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      className="w-48"
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      Add
                    </Button>
                  </div>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string, index: number) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 text-sm"
                      >
                        <span>{tag}</span>
                        <button 
                          type="button"
                          onClick={() => removeTag(index)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoMetaTitle">SEO Meta Title</Label>
                <Input
                  id="seoMetaTitle"
                  name="seoMetaTitle"
                  value={formData.seoMetaTitle}
                  onChange={handleChange}
                  placeholder="Enter SEO meta title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seoMetaDescription">SEO Meta Description</Label>
                <Textarea
                  id="seoMetaDescription"
                  name="seoMetaDescription"
                  value={formData.seoMetaDescription}
                  onChange={handleChange}
                  placeholder="Enter SEO meta description"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push('/dashboard/loans')}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Loan Offer'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )

}
