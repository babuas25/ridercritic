'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, X } from 'lucide-react'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { getAllBrands, getAllTypes } from '@/lib/brands-types'
import { MotorcycleFormData } from '@/types/motorcycle'
import { Brand, MotorcycleType } from '@/lib/brands-types'
import { saveComparison } from '@/lib/comparisons'

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

export default function MotorcyclesPageClient() {
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [types, setTypes] = useState<MotorcycleType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Filter states - initialize searchQuery from URL params
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const compareMode = searchParams.get('compare') === 'true'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const motorcyclesPerPage = 12
  
  // Track failed image loads to prevent retries
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [isSavingComparison, setIsSavingComparison] = useState(false)

  const canSaveComparison = !!session && (session.user.role === 'Super Admin' || session.user.role === 'Admin')
  
  // Update search query when URL params change
  useEffect(() => {
    const queryParam = searchParams.get('q')
    if (queryParam !== null) {
      setSearchQuery(queryParam)
    }
  }, [searchParams])
  
  // Handle image load error
  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl))
  }
  
  const handleSaveComparison = async () => {
    if (!canSaveComparison) return
    // selectedMotorcycles is derived later from motorcycles and selectedIds
    const selectedMotorcycles = motorcycles.filter(moto => selectedIds.includes(moto.id || ''))
    if (selectedMotorcycles.length < 2) return

    try {
      setIsSavingComparison(true)
      await saveComparison({
        motorcycles: selectedMotorcycles,
        createdByRole: session?.user?.role,
        createdByEmail: session?.user?.email || null,
      })
      alert('Comparison saved successfully')
    } catch (error) {
      console.error('Error saving comparison:', error)
      alert('Failed to save comparison. Please try again.')
    } finally {
      setIsSavingComparison(false)
    }
  }
  
  // Function to render credit line for Honda images
  const renderCreditLine = (motorcycle: MotorcycleFormData, imageUrl: string) => {
    if (!imageUrl || !motorcycle.brand) return null
    
    // Check if it's a Honda motorcycle (show credit line for ALL Honda motorcycles)
    const isHonda = motorcycle.brand.toLowerCase() === 'honda'
    
    if (isHonda) {
      return (
        <div className="text-xs text-gray-600 dark:text-gray-300 mt-2 text-center py-1 px-2 bg-gray-100 dark:bg-gray-800 rounded">
          Image &copy; Honda Bangladesh (used under fair review purpose)
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

  const toggleSelect = (id?: string) => {
    if (!id) return
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const selectedMotorcycles = motorcycles.filter(m => m.id && selectedIds.includes(m.id))

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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {compareMode ? 'Compare Motorcycles' : 'Motorcycle Reviews'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {compareMode
            ? 'Select motorcycles below to compare their specifications side by side.'
            : 'Discover detailed reviews, specifications, and comparisons of the latest motorcycles'}
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
                    
                    {compareMode ? (
                      <Button
                        type="button"
                        variant={selectedIds.includes(motorcycle.id || '') ? 'default' : 'outline'}
                        className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleSelect(motorcycle.id)
                        }}
                      >
                        {selectedIds.includes(motorcycle.id || '') ? 'Selected for Compare' : 'Add to Compare'}
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                        View Details
                      </Button>
                    )}
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

      {/* Sticky selected bar in compare mode */}
      {compareMode && selectedMotorcycles.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-xl w-full px-4">
          <div className="flex items-center justify-between gap-3 rounded-full bg-white dark:bg-gray-900 shadow-lg border border-gray-200 dark:border-gray-800 px-4 py-3">
            <div className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
              {selectedMotorcycles.length} motorcycle{selectedMotorcycles.length > 1 ? 's' : ''} selected for compare
            </div>
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => {
                const section = document.getElementById('compare-section')
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              View Comparison
            </Button>
          </div>
        </div>
      )}
      {compareMode && selectedMotorcycles.length >= 2 && (
        <section id="compare-section" className="mt-12">
          {/* Selected motorcycles preview row */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Models in this comparison</h2>
              {canSaveComparison && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSaveComparison}
                  disabled={isSavingComparison}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50"
                >
                  {isSavingComparison ? 'Saving…' : 'Save comparison'}
                </Button>
              )}
            </div>
            <div className="px-2">
              <div className="relative border-2 border-orange-500 rounded-2xl px-3 py-3 bg-white/60 dark:bg-gray-900/60">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2">
                  {selectedMotorcycles.map((moto) => (
                    <div
                      key={moto.id + '-preview'}
                      className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm"
                    >
                      <div className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-t-xl" style={{ height: 120 }}>
                        {/* Simple image preview using native img for robustness */}
                        {moto.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={moto.coverImage}
                            alt={`${moto.brand} ${moto.modelName}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              No image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="px-3 py-2">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white capitalize truncate">
                          {moto.brand} {moto.modelName}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                          {moto.modelYear && <span>{moto.modelYear}</span>}
                          {moto.category && (
                            <span className="inline-flex items-center rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-[11px] text-gray-700 dark:text-gray-300">
                              {moto.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* VS badge centered between first two items */}
                {selectedMotorcycles.length >= 2 && (
                  <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 -top-4 z-20 flex justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg border-2 border-white dark:border-gray-900">
                      VS
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Comparison Overview</h2>
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-[11px] md:text-sm">
            <table className="w-full table-fixed md:table-auto">
              <thead className="bg-gray-50 dark:bg-gray-800/60">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 align-top w-40">Specification</th>
                  {selectedMotorcycles.map((moto) => (
                    <th key={moto.id} className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-white align-top">
                      <div className="capitalize">{moto.brand} {moto.modelName}</div>
                      {moto.modelYear && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">{moto.modelYear}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Basic info */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Basic Information
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Category</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-cat'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.category || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Segment</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-segment'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.segment || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Origin / Assembly</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-origin'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.originCountry, moto.assemblyCountry].filter(Boolean).join(' / ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Engine */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Engine
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Engine Type</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-engine'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.engineType || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Displacement</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-cc'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.displacement || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Cylinder / Valves</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-cyl'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.cylinderCount, moto.valvesPerCylinder && `${moto.valvesPerCylinder} valves`].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Valve / Stroke</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-valve'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.valveSystem, moto.strokeType].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Bore x Stroke / Compression</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-bore'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.boreXStroke, moto.compressionRatio].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Fuel & Supply</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-fuel'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.fuelType, moto.fuelSupplySystem].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Ignition & Lubrication</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-ignition'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.ignitionType, moto.lubricationSystem].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Cooling & Air Filter</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-cool'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.engineCoolingType, moto.radiatorFanType, moto.airFilterType].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Start / Idle Stop</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-start'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.startType, moto.idleStopSystem ? 'Idle stop' : ''].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Performance */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Performance
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Max Power</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-power'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.maxPowerHP || moto.maxPowerKW
                        ? [moto.maxPowerHP && `${moto.maxPowerHP} HP`, moto.maxPowerKW && `${moto.maxPowerKW} kW`, moto.maxPowerRPM && `@ ${moto.maxPowerRPM} rpm`].filter(Boolean).join(' • ')
                        : '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Max Torque</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-torque'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.maxTorqueNm
                        ? [moto.maxTorqueNm && `${moto.maxTorqueNm} Nm`, moto.maxTorqueRPM && `@ ${moto.maxTorqueRPM} rpm`].filter(Boolean).join(' • ')
                        : '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Top Speed / Acceleration</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-speed'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.topSpeed, moto.acceleration0to60 && `0-60: ${moto.acceleration0to60}`, moto.acceleration0to100 && `0-100: ${moto.acceleration0to100}`].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Mileage / Range</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-mileage'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.mileage, moto.range].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Rev Limiter / Redline</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-rev'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.revLimiter, moto.engineRedline].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Transmission & Drive */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Transmission & Drive
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Transmission</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-gearbox'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.transmissionType, moto.numberOfGears && `${moto.numberOfGears} gears`, moto.shiftPattern].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Clutch & Final Drive</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-clutch'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.clutchType, moto.finalDriveType].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Quickshifter / Aids</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-qs'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[
                        moto.quickShifter && 'Quickshifter',
                        moto.autoBlipper && 'Auto-blipper',
                        moto.gearIndicator && 'Gear indicator'
                      ].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Electronics & Rider Aids */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Electronics & Rider Aids
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Emission / OBD</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-emis'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.emissionStandard, moto.catalyticConverter && 'Catalytic converter', moto.obd].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Ride Modes & Mapping</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-modes'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.fuelEconomyRideModes, moto.fuelInjectionMapping, moto.throttleResponse].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ABS / Traction / Launch</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-abs'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.absType, moto.tractionControlSystem && 'TCS', moto.launchControl && 'Launch control', moto.wheelieControl && 'Wheelie control'].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Cruise / Engine Braking / Slipper</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-ebc'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[
                        moto.cruiseControl && 'Cruise control',
                        moto.engineBrakingManagement && 'Engine braking control',
                        moto.slipperClutchAssist && 'Slipper/assist clutch',
                        moto.antiStallHillAssist && 'Hill/anti-stall assist'
                      ].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Chassis & Suspension */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Chassis, Frame & Suspension
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Frame & Swingarm</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-frame'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.frameType, moto.swingarmType].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Front Suspension</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-fsus'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.frontSuspension, moto.suspensionTravelFront].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Rear Suspension</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-rsus'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.rearSuspension, moto.suspensionTravelRear].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Steering / Turning</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-steer'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.steeringAngle, moto.turningRadius].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Brakes, Wheels & Tyres */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Brakes, Wheels & Tyres
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Front Brake</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-fbrake'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.frontBrakeType, moto.frontBrakeSize].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Rear Brake</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-rbrake'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.rearBrakeType, moto.rearBrakeSize].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ABS / CBS</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-absSupport'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.absSupport, moto.brakeCaliperType, moto.cbs && 'CBS'].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Wheel Type / Sizes</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-wheel'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.wheelType, moto.wheelSizeFront && `Front: ${moto.wheelSizeFront}`, moto.wheelSizeRear && `Rear: ${moto.wheelSizeRear}`].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Tyre Sizes / Type</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-tyre'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.frontTyreSize && `Front: ${moto.frontTyreSize}`, moto.rearTyreSize && `Rear: ${moto.rearTyreSize}`, moto.tyreType, moto.tyreBrand].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Dimensions & Weight */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Dimensions & Weight
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">L x W x H</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-dim'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.overallLength, moto.overallWidth, moto.overallHeight].filter(Boolean).join(' x ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Wheelbase / Ground Clearance</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-wb'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.wheelbase, moto.groundClearance].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Seat Height</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-seat'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.seatHeight || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Kerb / Dry Weight</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-weight'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.kerbWeight, moto.dryWeight].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Fuel / Oil / Battery</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-fluids'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.fuelTankCapacity && `Fuel: ${moto.fuelTankCapacity}`, moto.reserveFuelCapacity && `Reserve: ${moto.reserveFuelCapacity}`, moto.oilCapacity && `Oil: ${moto.oilCapacity}`, moto.batteryCapacity && `Battery: ${moto.batteryCapacity}`].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Features & Equipment */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Features & Equipment
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Console & Connectivity</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-console'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.instrumentConsole, moto.displaySize, moto.connectivity].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Smart Features</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-smart'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[
                        moto.mobileAppIntegration && 'App connectivity',
                        moto.turnByTurnNavigation && 'Turn-by-turn navigation',
                        moto.ridingStatistics && 'Riding statistics'
                      ].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Lighting</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-light'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.headlightType, moto.tailLightType, moto.indicatorType, moto.drl && 'DRL'].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Ergonomics & Comfort</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-erg'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.seatType, moto.handleType, moto.footpegPosition, moto.adjustableWindshield && 'Adjustable windshield'].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Safety & Security */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Safety & Security
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Safety Assist</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-safety'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[
                        moto.sideStandEngineCutoff && 'Side-stand engine cut-off',
                        moto.tpms && 'TPMS',
                        moto.adjustableSuspension && 'Adjustable suspension',
                        moto.ridingModes && 'Riding modes'
                      ].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Security</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-security'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[
                        moto.keylessIgnition && 'Keyless ignition',
                        moto.immobilizer && 'Immobilizer',
                        moto.centralLocking && 'Central locking',
                        moto.sosCrashDetection && 'SOS / crash detection'
                      ].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>

                {/* Pricing & Market */}
                <tr className="border-t border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/40">
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100" colSpan={selectedMotorcycles.length + 1}>
                    Pricing & Market
                  </td>
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Ex-showroom / On-road</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-price'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {moto.exShowroomPrice || moto.onRoadPrice
                        ? [
                            moto.exShowroomPrice && `Ex: ৳ ${parseFloat(moto.exShowroomPrice.replace(/[^0-9.]/g, '')).toLocaleString()}`,
                            moto.onRoadPrice && `On-road: ${moto.onRoadPrice}`
                          ].filter(Boolean).join(' • ')
                        : '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Availability / Launch</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-avail'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[moto.availability, moto.launchDate].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
                <tr className="border-t border-gray-200 dark:border-gray-800">
                  <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">Warranty & Service</td>
                  {selectedMotorcycles.map(moto => (
                    <td key={moto.id + '-warranty'} className="px-4 py-3 text-gray-900 dark:text-white">
                      {[
                        moto.warrantyYears && `${moto.warrantyYears} years`,
                        moto.warrantyKm && `${moto.warrantyKm} km`,
                        moto.freeServiceCount && `${moto.freeServiceCount} free services`,
                        moto.serviceIntervalKm && `Service every ${moto.serviceIntervalKm} km`,
                        moto.serviceIntervalMonths && `${moto.serviceIntervalMonths} months`
                      ].filter(Boolean).join(' • ') || '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}