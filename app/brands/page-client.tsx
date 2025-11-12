'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search } from 'lucide-react'
import { getAllBrands } from '@/lib/brands-types'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { Brand } from '@/lib/brands-types'
import { MotorcycleFormData } from '@/types/motorcycle'
import { Input } from '@/components/ui/input'

export default function BrandsPageClient() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, motorcyclesData] = await Promise.all([
          getAllBrands(),
          getAllMotorcycles()
        ])
        setBrands(brandsData)
        setMotorcycles(motorcyclesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get motorcycle count for each brand
  const getMotorcycleCount = (brandName: string) => {
    return motorcycles.filter(
      m => m.brand?.toLowerCase() === brandName.toLowerCase()
    ).length
  }

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand => {
    const searchLower = searchQuery.toLowerCase()
    return (
      brand.name.toLowerCase().includes(searchLower) ||
      brand.distributor?.toLowerCase().includes(searchLower)
    )
  })

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
          All Motorcycle Brands
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore all motorcycle brands available in Bangladesh
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            id="brands-search"
            name="q"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Brands Grid */}
      {filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => {
            const motorcycleCount = getMotorcycleCount(brand.name)
            return (
              <Link key={brand.id} href={`/brands/${encodeURIComponent(brand.name.toLowerCase())}`}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                          {brand.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={brand.logoUrl} alt={`${brand.name} logo`} className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                              {brand.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                          {brand.name}
                        </h3>
                      </div>
                      {motorcycleCount > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {motorcycleCount} {motorcycleCount === 1 ? 'Model' : 'Models'}
                        </Badge>
                      )}
                    </div>
                    
                    {brand.distributor && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Distributor: {brand.distributor}
                      </p>
                    )}

                    <div className="flex items-center text-sm text-red-600 dark:text-red-500 font-medium">
                      View Models →
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No brands found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}

