// Loan Offer Data Interface

export interface LoanOffer {
  // System fields
  id?: string
  createdBy?: string
  createdAt?: Date | string | null
  updatedAt?: Date | string | null
  
  // Loan details
  bankName: string
  loanType: 'Official' | 'Unofficial' | 'Bank'
  interestRate: number
  maxTerm: number
  processingFee: string
  minimumLoanAmount: number
  maximumLoanAmount: number
  description: string
  eligibilityCriteria: string
  requiredDocuments: string[]
  status: 'Active' | 'Inactive'
  
  // SEO fields
  seoMetaTitle: string
  seoMetaDescription: string
  tags: string[]
  
  // Admin fields
  lastUpdatedBy?: string
  lastUpdatedDate?: string
}