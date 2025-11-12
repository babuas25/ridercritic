'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Mic, GitCompare, Calculator, CreditCard, Users, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { getAllBrands } from '@/lib/brands-types'
import { Brand } from '@/lib/brands-types'
import { cn } from '@/lib/utils'

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [brands, setBrands] = useState<Brand[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/motorcycle?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/motorcycle')
    }
  }

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const brandsData = await getAllBrands()
        setBrands(brandsData)
      } catch (error) {
        console.error('Error fetching brands:', error)
      } finally {
        setLoadingBrands(false)
      }
    }

    fetchBrands()
  }, [])

  const scrollBrands = (direction: 'left' | 'right') => {
    const container = document.getElementById('brands-scroll-container')
    if (container) {
      const scrollAmount = 300
      const currentScroll = container.scrollLeft
      const newPosition = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleBrandsScroll = () => {
    const container = document.getElementById('brands-scroll-container')
    if (container) {
      const scrollLeft = container.scrollLeft
      const scrollWidth = container.scrollWidth
      const clientWidth = container.clientWidth
      
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = document.getElementById('brands-scroll-container')
    if (container && brands.length > 0) {
      // Check scroll state after a brief delay to ensure container is rendered
      setTimeout(() => {
        handleBrandsScroll()
      }, 100)
    }
  }, [brands])

  return (
    <div className="flex flex-col items-center justify-start px-4 pt-8 pb-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo/Title Section */}
        <div className="text-center space-y-2">
          <h1 className={cn("text-4xl md:text-5xl font-nordique font-bold tracking-tight")}>
            <span className="text-foreground">rider</span>
            <span className="text-red-600">critic</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Search motorcycles, reviews, and more
          </p>
        </div>

        {/* Google-style Search Bar */}
        <form onSubmit={handleSearch} className="w-full">
          <div className="relative group">
            <div
              className={cn(
                "flex items-center w-full rounded-full border border-input",
                "bg-background shadow-sm hover:shadow-md transition-shadow duration-200",
                "focus-within:shadow-lg focus-within:border-ring",
                "px-4 py-3 md:px-6 md:py-4"
              )}
            >
              {/* Search Icon */}
              <Search className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground mr-3 md:mr-4 flex-shrink-0" />
              
              {/* Search Input */}
              <Input
                type="text"
                id="home-search"
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search motorcycles..."
                className={cn(
                  "flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                  "text-base md:text-lg placeholder:text-muted-foreground",
                  "px-0"
                )}
                autoFocus
              />
              
              {/* Voice Search Icon (optional, can be removed if not needed) */}
              <button
                type="button"
                className="ml-2 md:ml-4 p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Voice search"
                title="Voice search (coming soon)"
              >
                <Mic className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Search Buttons */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
            >
              Search
            </Button>
            <Button
              type="button"
              variant="outline"
              className="px-6 py-2 rounded-full"
              onClick={() => router.push('/motorcycle')}
            >
              Browse All
            </Button>
          </div>
        </form>

        {/* Toolbox Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add compare functionality
              router.push('/motorcycle?compare=true')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <GitCompare className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">Compare</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add EMI calculator functionality
              router.push('/emi-calculator')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <Calculator className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">EMI Calculator</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add loan available functionality
              router.push('/loan')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <CreditCard className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">Loan Available</h3>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-md transition-shadow duration-200 border hover:border-red-600/50 dark:hover:border-red-500/50"
            onClick={() => {
              // Add join community functionality
              router.push('/community')
            }}
          >
            <CardContent className="flex flex-col items-center justify-center p-4 text-center">
              <div className="p-3 rounded-full bg-red-600/10 dark:bg-red-500/10 mb-2">
                <Users className="h-6 w-6 md:h-7 md:w-7 text-red-600 dark:text-red-500" />
              </div>
              <h3 className="font-semibold text-sm md:text-base">Join Community</h3>
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Brands Section - Full Width */}
      <div className="w-full mt-8">
        <Card className="border border-gray-200 dark:border-gray-800">
          <CardContent className="px-6 py-3">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Official Brands
                </h2>
              </div>
              <Link href="/brands">
                <Button variant="ghost" className="text-red-600 dark:text-red-500 hover:text-red-700 dark:hover:text-red-400">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {loadingBrands ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : brands.length > 0 ? (
              <div className="relative">
                {/* Left Arrow */}
                {canScrollLeft && (
                  <button
                    onClick={() => scrollBrands('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Scroll left"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                )}

                {/* Scrollable Brands Container */}
                <div
                  id="brands-scroll-container"
                  onScroll={handleBrandsScroll}
                  className="flex gap-3 overflow-x-auto scroll-smooth pb-1 px-1 scrollbar-hide"
                >
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${encodeURIComponent(brand.name.toLowerCase())}`}
                      className="flex-shrink-0"
                    >
                      <div className="group p-2 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-red-600 dark:hover:border-red-500 hover:shadow-md transition-all duration-200 cursor-pointer bg-white dark:bg-gray-900 w-24 md:w-28">
                        <div className="flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3 group-hover:bg-red-600/10 dark:group-hover:bg-red-500/10 transition-colors overflow-hidden">
                            {brand.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={brand.logoUrl}
                                alt={`${brand.name} logo`}
                                className="w-full h-full object-contain p-2"
                              />
                            ) : (
                              <span className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                                {brand.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white capitalize group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors line-clamp-2">
                            {brand.name}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Right Arrow */}
                {canScrollRight && (
                  <button
                    onClick={() => scrollBrands('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Scroll right"
                  >
                    <ArrowRight className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No brands available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
