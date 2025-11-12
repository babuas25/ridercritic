'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { getAllBrands } from '@/lib/brands-types'
import { MotorcycleFormData } from '@/types/motorcycle'

// Safe Image Component with error handling
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
    return null
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

export default function BrandDetailPageClient() {
  const params = useParams()
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [brandLogoUrl, setBrandLogoUrl] = useState<string | null>(null)

  const brandId = params.id as string
  const brandName = decodeURIComponent(brandId).replace(/-/g, ' ').split(' ').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        const allMotorcycles = await getAllMotorcycles()
        // Filter motorcycles by brand name (case-insensitive)
        const brandMotorcycles = allMotorcycles.filter(
          m => m.brand?.toLowerCase() === brandName.toLowerCase()
        )
        setMotorcycles(brandMotorcycles)
      } catch (error) {
        console.error('Error fetching motorcycles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycles()
  }, [brandName])

  useEffect(() => {
    const fetchBrandLogo = async () => {
      try {
        const brands = await getAllBrands()
        const matched = brands.find(b => b.name?.toLowerCase() === brandName.toLowerCase())
        setBrandLogoUrl(matched?.logoUrl || null)
      } catch (e) {
        console.error('Error fetching brand logo:', e)
        setBrandLogoUrl(null)
      }
    }
    fetchBrandLogo()
  }, [brandName])

  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl))
  }

  const renderCreditLine = (motorcycle: MotorcycleFormData, imageUrl: string) => {
    if (!imageUrl || !motorcycle.brand) return null
    
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

  if (loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      {/* Back Button */}
      <Link href="/brands">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to All Brands
        </Button>
      </Link>

      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        {brandLogoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={brandLogoUrl} alt={`${brandName} logo`} className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 object-contain p-1" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 capitalize">
            {brandName} Motorcycles
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {motorcycles.length} {motorcycles.length === 1 ? 'Model' : 'Models'} Available
          </p>
        </div>
      </div>

      {/* Motorcycles Grid */}
      {motorcycles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {motorcycles.map((motorcycle) => (
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
                            {renderCreditLine(motorcycle, imageUrl)}
                          </>
                        )
                      }
                      
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No motorcycles found for {brandName}.
          </p>
          <Link href="/brands">
            <Button variant="outline">Browse All Brands</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

