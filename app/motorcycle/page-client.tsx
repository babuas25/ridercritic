'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, X } from 'lucide-react'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { getAllBrands, getAllTypes } from '@/lib/brands-types'
import { MotorcycleFormData } from '@/types/motorcycle'
import { Brand, MotorcycleType } from '@/lib/brands-types'

// Safe Image Component with error handling
// Uses native img tag for better error handling when unoptimized
function SafeImageWrapper({
  src,
  alt,
  className,
  onError,
}: {
  src: string
  alt: string
  className?: string
  onError?: () => void
}) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return null // Return null to trigger parent fallback
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      onError={(e) => {
        e.preventDefault()
        setHasError(true)
        onError?.()
      }}
    />
  )
}

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [types, setTypes] = useState<MotorcycleType[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const motorcyclesPerPage = 12
  
  // Track failed image loads to prevent retries
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  

  
  // Handle image load error
  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl))
  }
  
  // Function to render credit line for Honda images
  const renderCreditLine = (motorcycle: MotorcycleFormData, imageUrl: string) => {
    if (!imageUrl || !motorcycle.brand) return null
    
    // Check if it's a Honda motorcycle (show credit line for ALL Honda motorcycles)
    const isHonda = motorcycle.brand.toLowerCase() === 'honda'
    
    if (isHonda) {
      return (
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-2 text-center py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded">
          Image © Honda Bangladesh (used under fair review purpose)
        </div>
      )
    }
    
    return null
  }

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [motorcyclesData, brandsData, typesData] = await Promise.all([
          getAllMotorcycles(),
          getAllBrands(),
          getAllTypes()
        ])
        
        setMotorcycles(motorcyclesData)
        setBrands(brandsData)
        setTypes(typesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter motorcycles based on selected filters
  const filteredMotorcycles = motorcycles.filter(motorcycle => {
    const matchesBrand = !selectedBrand || motorcycle.brand.toLowerCase() === selectedBrand.toLowerCase()
    const matchesType = !selectedType || motorcycle.category.toLowerCase() === selectedType.toLowerCase()
    const matchesSearch = !searchQuery || 
      motorcycle.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      motorcycle.brand.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesBrand && matchesType && matchesSearch
  })

  // Pagination
  const totalPages = Math.ceil(filteredMotorcycles.length / motorcyclesPerPage)
  const startIndex = (currentPage - 1) * motorcyclesPerPage
  const paginatedMotorcycles = filteredMotorcycles.slice(startIndex, startIndex + motorcyclesPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedBrand, selectedType, searchQuery])

  if (loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Motorcycle Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover detailed reviews, specifications, and comparisons of the latest motorcycles
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search motorcycles..."
              id="motorcycle-search"
              name="motorcycleSearch"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Brand Filter */}
          <select
            id="brand-filter"
            name="brand"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={selectedBrand || ''}
            onChange={(e) => setSelectedBrand(e.target.value || null)}
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.name.toLowerCase()}>
                {brand.name}
              </option>
            ))}
          </select>
          
          {/* Type Filter */}
          <select
            id="type-filter"
            name="type"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            value={selectedType || ''}
            onChange={(e) => setSelectedType(e.target.value || null)}
          >
            <option value="">All Types</option>
            {types.map(type => (
              <option key={type.id} value={type.name.toLowerCase()}>
                {type.name}
              </option>
            ))}
          </select>
          
          {/* Clear Filters */}
          {(selectedBrand || selectedType || searchQuery) && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedBrand(null)
                setSelectedType(null)
                setSearchQuery('')
              }}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(startIndex + motorcyclesPerPage, filteredMotorcycles.length)} of {filteredMotorcycles.length} motorcycles
        </p>
      </div>

      {/* Motorcycles Grid */}
      {paginatedMotorcycles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {paginatedMotorcycles.map((motorcycle) => (
            <Link key={motorcycle.id} href={`/motorcycle/${motorcycle.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden rounded-t-xl bg-gray-100 dark:bg-gray-800">
                    {(() => {
                      const imageUrl = motorcycle.coverImage
                      const hasValidImage = imageUrl && !failedImages.has(imageUrl)
                      
                      if (hasValidImage) {
                        return (
                          <>
                            <SafeImageWrapper
                              src={imageUrl}
                              alt={`${motorcycle.brand} ${motorcycle.modelName}`}
                              className="object-cover"
                              onError={() => {
                                if (imageUrl) handleImageError(imageUrl)
                              }}
                            />
                            {/* Credit line - shown only when image loads successfully */}
                            {renderCreditLine(motorcycle, imageUrl)}
                          </>
                        )
                      }
                      
                      // Fallback when no image or image failed
                      return (
                        <div className="w-full h-full flex items-center justify-center absolute inset-0">
                          <div className="text-center px-4">
                            <div className="text-lg font-bold mb-1 capitalize text-gray-900 dark:text-white">
                              {motorcycle.brand}
                            </div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                              {motorcycle.modelName}
                            </div>
                            {motorcycle.modelYear && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {motorcycle.modelYear}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                        {motorcycle.brand} {motorcycle.modelName}
                      </h3>
                      {motorcycle.modelYear && (
                        <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {motorcycle.modelYear}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      {motorcycle.category && (
                        <Badge variant="outline" className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                          {motorcycle.category}
                        </Badge>
                      )}
                    </div>
                    
                    {motorcycle.exShowroomPrice && (
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        ৳ {parseFloat(motorcycle.exShowroomPrice.replace(/[^0-9.]/g, '')).toLocaleString()}
                      </div>
                    )}
                    
                    <Button variant="outline" className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No motorcycles found matching your criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum: number
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => setCurrentPage(pageNum)}
                  className={
                    currentPage === pageNum 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}