'use client'

import { useState, useEffect, useRef } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Bike, X } from 'lucide-react'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { getAllBrands, getAllTypes } from '@/lib/brands-types'
import { MotorcycleFormData } from '@/types/motorcycle'
import { Brand, MotorcycleType } from '@/lib/brands-types'

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [types, setTypes] = useState<MotorcycleType[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filter states
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [ccRange, setCcRange] = useState<[number, number]>([0, 750])
  
  // Dropdown states
  const [showBrandDropdown, setShowBrandDropdown] = useState(false)
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  
  // Refs for dropdowns
  const brandDropdownRef = useRef<HTMLDivElement>(null)
  const typeDropdownRef = useRef<HTMLDivElement>(null)

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false)
      }
      if (typeDropdownRef.current && !typeDropdownRef.current.contains(event.target as Node)) {
        setShowTypeDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch all data in parallel
        const [motorcyclesData, brandsData, typesData] = await Promise.all([
          getAllMotorcycles({}, 100),
          getAllBrands(),
          getAllTypes()
        ])
        
        // Filter for published motorcycles
        const published = motorcyclesData.filter(m => m.status === 'published')
        setMotorcycles(published)
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

  // Apply all filters
  const filteredMotorcycles = motorcycles
    .filter(m => {
      // Brand filter
      if (selectedBrand && m.brand?.toLowerCase() !== selectedBrand.toLowerCase()) return false
      
      // Type filter
      if (selectedType && m.segment?.toLowerCase() !== selectedType.toLowerCase()) return false
      
      // Price filter
      const price = parseFloat(m.exShowroomPrice?.replace(/[^0-9.]/g, '') || '0')
      if (price < priceRange[0] || price > priceRange[1]) return false
      
      // CC filter
      const cc = parseFloat(m.displacement || '0')
      if (cc < ccRange[0] || cc > ccRange[1]) return false
      
      return true
    })

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrand(null)
    setSelectedType(null)
    setPriceRange([0, 1000000])
    setCcRange([0, 750])
  }
  
  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-3 text-gray-900 dark:text-white">All Motorcycles</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover our curated selection of motorcycles from top manufacturers
        </p>
      </div>

      {/* Filter Bar - Desktop Horizontal */}
      <div className="hidden md:flex items-center flex-wrap gap-6 mb-6 p-4 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
        {/* Brand Filter */}
        <div className="relative" ref={brandDropdownRef}>
          <Button 
            variant="ghost" 
            className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            onClick={() => setShowBrandDropdown(!showBrandDropdown)}
          >
            {selectedBrand || 'Brand'}
          </Button>
          {showBrandDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
              <div className="max-h-60 overflow-y-auto">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setSelectedBrand(null)
                    setShowBrandDropdown(false)
                  }}
                >
                  All Brands
                </button>
                {brands.map((brand) => (
                  <button
                    key={brand.id}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedBrand(brand.name)
                      setShowBrandDropdown(false)
                    }}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Type Filter */}
        <div className="relative" ref={typeDropdownRef}>
          <Button 
            variant="ghost" 
            className="px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
          >
            {selectedType || 'Type'}
          </Button>
          {showTypeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
              <div className="max-h-60 overflow-y-auto">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => {
                    setSelectedType(null)
                    setShowTypeDropdown(false)
                  }}
                >
                  All Types
                </button>
                {types.map((type) => (
                  <button
                    key={type.id}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedType(type.name)
                      setShowTypeDropdown(false)
                    }}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Price Range Slider */}
        <div className="flex flex-col gap-2 min-w-[200px] flex-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Price (BDT)</span>
            <span className="text-sm text-gray-900 dark:text-white">
              ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
            </span>
          </div>
          <div className="relative pt-2">
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="absolute h-2 bg-black dark:bg-white rounded-full" 
                style={{
                  left: `${(priceRange[0] / 1000000) * 100}%`,
                  width: `${((priceRange[1] - priceRange[0]) / 1000000) * 100}%`
                }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
            />
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
            />
          </div>
        </div>
        
        {/* CC Range Slider */}
        <div className="flex flex-col gap-2 min-w-[160px]">
          <div className="flex justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">CC</span>
            <span className="text-sm text-gray-900 dark:text-white">
              {ccRange[0]}cc - {ccRange[1]}cc
            </span>
          </div>
          <div className="relative pt-2">
            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="absolute h-2 bg-black dark:bg-white rounded-full" 
                style={{
                  left: `${(ccRange[0] / 750) * 100}%`,
                  width: `${((ccRange[1] - ccRange[0]) / 750) * 100}%`
                }}
              ></div>
            </div>
            <input
              type="range"
              min="0"
              max="750"
              step="10"
              value={ccRange[0]}
              onChange={(e) => setCcRange([parseInt(e.target.value), ccRange[1]])}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
            />
            <input
              type="range"
              min="0"
              max="750"
              step="10"
              value={ccRange[1]}
              onChange={(e) => setCcRange([ccRange[0], parseInt(e.target.value)])}
              className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
            />
          </div>
        </div>
        
        {/* Clear Filters - Always visible when filters are applied */}
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center gap-1 px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={clearFilters}
        >
          <X className="w-4 h-4" />
          Clear
        </Button>
      </div>

      {/* Filter Bar - Mobile Two Rows - UNCHANGED */}
      <div className="md:hidden mb-6">
        {/* First Row - Brand, Type */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1" ref={brandDropdownRef}>
            <Button 
              variant="ghost" 
              className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
            >
              {selectedBrand || 'Brand'}
            </Button>
            {showBrandDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
                <div className="max-h-40 overflow-y-auto">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedBrand(null)
                      setShowBrandDropdown(false)
                    }}
                  >
                    All Brands
                  </button>
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setSelectedBrand(brand.name)
                        setShowBrandDropdown(false)
                      }}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="relative flex-1" ref={typeDropdownRef}>
            <Button 
              variant="ghost" 
              className="w-full px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              {selectedType || 'Type'}
            </Button>
            {showTypeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10">
                <div className="max-h-40 overflow-y-auto">
                  <button
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => {
                      setSelectedType(null)
                      setShowTypeDropdown(false)
                    }}
                  >
                    All Types
                  </button>
                  {types.map((type) => (
                    <button
                      key={type.id}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => {
                        setSelectedType(type.name)
                        setShowTypeDropdown(false)
                      }}
                    >
                      {type.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Second Row - Price, CC Sliders */}
        <div className="grid grid-cols-1 gap-6">
          {/* Price Range */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Price (BDT)</span>
              <span className="text-xs text-gray-900 dark:text-white">
                ৳{priceRange[0].toLocaleString()} - ৳{priceRange[1].toLocaleString()}
              </span>
            </div>
            <div className="relative pt-2">
              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="absolute h-2 bg-black dark:bg-white rounded-full" 
                  style={{
                    left: `${(priceRange[0] / 1000000) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / 1000000) * 100}%`
                  }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                step="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
              />
            </div>
          </div>
          
          {/* CC Range */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">CC</span>
              <span className="text-xs text-gray-900 dark:text-white">
                {ccRange[0]}cc - {ccRange[1]}cc
              </span>
            </div>
            <div className="relative pt-2">
              <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div 
                  className="absolute h-2 bg-black dark:bg-white rounded-full" 
                  style={{
                    left: `${(ccRange[0] / 750) * 100}%`,
                    width: `${((ccRange[1] - ccRange[0]) / 750) * 100}%`
                  }}
                ></div>
              </div>
              <input
                type="range"
                min="0"
                max="750"
                step="10"
                value={ccRange[0]}
                onChange={(e) => setCcRange([parseInt(e.target.value), ccRange[1]])}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
              />
              <input
                type="range"
                min="0"
                max="750"
                step="10"
                value={ccRange[1]}
                onChange={(e) => setCcRange([ccRange[0], parseInt(e.target.value)])}
                className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:z-10 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white dark:[&::-webkit-slider-thumb]:border-gray-900"
              />
            </div>
          </div>
        </div>
        
        {/* Clear Filters Button - Always visible when filters are applied */}
        <div className="mt-6">
          <Button 
            variant="outline" 
            size="sm"
            className="w-full text-sm"
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredMotorcycles.length} of {motorcycles.length} motorcycles
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : filteredMotorcycles.length === 0 ? (
        <div className="text-center py-16">
          <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No motorcycles found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters</p>
          <Button 
            variant="outline" 
            onClick={clearFilters}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMotorcycles.map((bike) => (
            <Link key={bike.id} href={`/motorcycle/${bike.id}`} className="group">
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:shadow-sm transition-all duration-300 cursor-pointer h-full flex flex-col">
                {bike.coverImage ? (
                  <div className="w-full aspect-video relative overflow-hidden rounded-t-xl">
                    <Image 
                      src={bike.coverImage} 
                      alt={bike.modelName}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded-t-xl">
                    <div className="text-center">
                      <div className="text-xl font-semibold capitalize text-gray-900 dark:text-white">{bike.brand}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{bike.category}</div>
                    </div>
                  </div>
                )}
                <CardContent className="flex-1 flex flex-col gap-3 p-5">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-gray-900 transition-colors text-gray-900 dark:text-white">
                      <span className="capitalize">{bike.brand}</span> {bike.modelName}
                    </h3>
                    <div className="flex gap-2 flex-wrap mt-2">
                      {bike.modelYear && (
                        <Badge variant="secondary" className="px-2 py-1 rounded-full text-xs font-normal bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                          {bike.modelYear}
                        </Badge>
                      )}
                      {bike.category && (
                        <Badge variant="outline" className="px-2 py-1 rounded-full text-xs font-normal border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                          {bike.category}
                        </Badge>
                      )}
                      {bike.displacement && (
                        <Badge variant="outline" className="px-2 py-1 rounded-full text-xs font-normal border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                          {bike.displacement}cc
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {bike.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex-1 line-clamp-2">
                      {bike.description}
                    </p>
                  )}
                  
                  {bike.exShowroomPrice && (
                    <div className="text-xl font-semibold text-gray-900 dark:text-white">
                      ৳ {parseInt(bike.exShowroomPrice.replace(/[^0-9]/g, '')).toLocaleString()}
                    </div>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-auto py-2 text-sm font-medium rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}