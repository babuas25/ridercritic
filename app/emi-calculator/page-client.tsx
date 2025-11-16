'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'
import { Loader2 } from 'lucide-react'

// Define type for loan offers
interface LoanOffer {
  id: string
  bankName: string
  interestRate: number
  maxTerm: number
  processingFee: string
  loanType: 'Official' | 'Unofficial' | 'Bank'
  description: string
}

export default function EMICalculatorPageClient() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMotorcycle, setSelectedMotorcycle] = useState<string>('')
  const [loanType, setLoanType] = useState<'Official' | 'Unofficial' | 'Bank'>('Official')
  const [interestRate, setInterestRate] = useState<string>('')
  const [term, setTerm] = useState<string>('')
  const [results, setResults] = useState<{
    monthlyPayment: number
    totalInterest: number
    totalAmount: number
  } | null>(null)
  
  // Sample loan offers data
  const [loanOffers] = useState<LoanOffer[]>([
    {
      id: '1',
      bankName: 'City Bank',
      interestRate: 8.5,
      maxTerm: 36,
      processingFee: '1.5%',
      loanType: 'Official',
      description: 'Low interest rate for new motorcycles'
    },
    {
      id: '2',
      bankName: 'Prime Finance',
      interestRate: 9.0,
      maxTerm: 48,
      processingFee: '2%',
      loanType: 'Official',
      description: 'Extended tenure options'
    },
    {
      id: '3',
      bankName: 'Quick Loans',
      interestRate: 12.0,
      maxTerm: 24,
      processingFee: 'No fee',
      loanType: 'Unofficial',
      description: 'Fast approval, no documentation'
    },
    {
      id: '4',
      bankName: 'Auto Finance Co.',
      interestRate: 10.5,
      maxTerm: 36,
      processingFee: '1%',
      loanType: 'Unofficial',
      description: 'Flexible repayment options'
    },
    {
      id: '5',
      bankName: 'National Bank',
      interestRate: 7.5,
      maxTerm: 60,
      processingFee: '1%',
      loanType: 'Bank',
      description: 'Government-backed motorcycle loans'
    },
    {
      id: '6',
      bankName: 'Regional Finance',
      interestRate: 9.5,
      maxTerm: 36,
      processingFee: '1.5%',
      loanType: 'Bank',
      description: 'Special regional financing programs'
    }
  ])

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const data = await getAllMotorcycles(undefined, 100)
        setMotorcycles(data)
      } catch (error) {
        console.error('Error fetching motorcycles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycles()
  }, [])

  const calculateEMI = () => {
    if (!selectedMotorcycle || !interestRate || !term) return

    const motorcycle = motorcycles.find(m => m.id === selectedMotorcycle)
    if (!motorcycle?.exShowroomPrice) return

    // Extract numeric value from price string (e.g., "৳ 500,000" -> 500000)
    const price = parseFloat(motorcycle.exShowroomPrice.replace(/[^0-9.]/g, ''))
    if (isNaN(price)) return

    const rate = parseFloat(interestRate)
    const months = parseInt(term)

    if (isNaN(rate) || isNaN(months) || months <= 0) return

    // EMI formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
    // Where P = Principal, r = monthly interest rate, n = number of months
    const monthlyRate = rate / 100 / 12
    const emi = price * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1)
    
    const totalAmount = emi * months
    const totalInterest = totalAmount - price

    setResults({
      monthlyPayment: emi,
      totalInterest: totalInterest,
      totalAmount: totalAmount
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BDT',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Filter loan offers based on selected loan type
  const filteredLoanOffers = loanOffers.filter(offer => offer.loanType === loanType)

  return (
    <div className="container py-8 max-w-4xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Loan Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Calculate your monthly motorcycle loan payments and explore available loan offers
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Loan Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="loan-type">Loan Type</Label>
              <Select value={loanType} onValueChange={(value: 'Official' | 'Unofficial' | 'Bank') => setLoanType(value)}>
                <SelectTrigger id="loan-type">
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
              <Label htmlFor="motorcycle">Select Motorcycle</Label>
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <Select value={selectedMotorcycle} onValueChange={setSelectedMotorcycle}>
                  <SelectTrigger id="motorcycle">
                    <SelectValue placeholder="Select a motorcycle" />
                  </SelectTrigger>
                  <SelectContent>
                    {motorcycles.map((motorcycle) => (
                      <SelectItem key={motorcycle.id} value={motorcycle.id || ''}>
                        {motorcycle.brand} {motorcycle.modelName} ({motorcycle.modelYear}) - {motorcycle.exShowroomPrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest-rate">Interest Rate (%)</Label>
              <Input
                id="interest-rate"
                type="number"
                step="0.1"
                placeholder="Enter interest rate"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term (months)</Label>
              <Input
                id="term"
                type="number"
                placeholder="Enter loan term in months"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>

            <Button 
              className="w-full" 
              onClick={calculateEMI}
              disabled={!selectedMotorcycle || !interestRate || !term}
            >
              Calculate EMI
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Payment (EMI)</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(results.monthlyPayment)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Interest to pay:</span>
                    <span className="font-medium">{formatCurrency(results.totalInterest)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Amount with Interest:</span>
                    <span className="font-medium">{formatCurrency(results.totalAmount)}</span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between font-semibold">
                      <span>Principal Amount:</span>
                      <span>
                        {selectedMotorcycle && (
                          formatCurrency(
                            parseFloat(
                              motorcycles.find(m => m.id === selectedMotorcycle)?.exShowroomPrice?.replace(/[^0-9.]/g, '') || '0'
                            )
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">Calculate Your Loan</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Fill in the loan details and click calculate to see your payment breakdown
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Available Loan Offers Section */}
      <div className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Available Loan Offers</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Explore current loan offers based on your selected loan type: {loanType}
            </p>
          </CardHeader>
          <CardContent>
            {filteredLoanOffers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLoanOffers.map((offer) => (
                  <div 
                    key={offer.id} 
                    className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{offer.bankName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{offer.description}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 dark:bg-blue-900 dark:text-blue-300">
                        {offer.loanType}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Interest Rate</p>
                        <p className="font-medium">{offer.interestRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Max Term</p>
                        <p className="font-medium">{offer.maxTerm} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Processing Fee</p>
                        <p className="font-medium">{offer.processingFee}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4"
                      onClick={() => {
                        setInterestRate(offer.interestRate.toString())
                        setTerm(offer.maxTerm.toString())
                      }}
                    >
                      Use This Offer
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">No loan offers available for the selected type.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}