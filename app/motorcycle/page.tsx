'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, Bike } from 'lucide-react'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'

export default function MotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<MotorcycleFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchMotorcycles = async () => {
      try {
        setLoading(true)
        // Fetch all motorcycles without filtering (no index required)
        const data = await getAllMotorcycles({}, 100)
        // Filter for published ones in the client
        const published = data.filter(m => m.status === 'published')
        setMotorcycles(published)
      } catch (error) {
        console.error('Error fetching motorcycles:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycles()
  }, [])

  // Filter motorcycles by category if selected
  const filteredMotorcycles = selectedCategory
    ? motorcycles.filter(m => m.category?.toLowerCase() === selectedCategory.toLowerCase())
    : motorcycles

  // Get unique categories from motorcycles
  const categories = Array.from(new Set(motorcycles.map(m => m.category).filter(Boolean)))
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Motorcycle Collection</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of motorcycles from top manufacturers.
          Each bike represents the pinnacle of engineering and design.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      ) : filteredMotorcycles.length === 0 ? (
        <div className="text-center py-12">
          <Bike className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">No motorcycles available yet</p>
          <p className="text-sm text-gray-500">Check back soon for new additions!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMotorcycles.map((bike) => (
            <Link key={bike.id} href={`/motorcycle/${bike.id}`} className="group">
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
                {bike.coverImage ? (
                  <div className="w-full h-48 relative overflow-hidden rounded-t-lg">
                    <Image 
                      src={bike.coverImage} 
                      alt={bike.modelName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white rounded-t-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1 capitalize">{bike.brand}</div>
                      <div className="text-sm opacity-90">{bike.category}</div>
                    </div>
                  </div>
                )}
                <CardContent className="flex-1 flex flex-col gap-3 p-4">
                  <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                    <span className="capitalize">{bike.brand}</span> {bike.modelName}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {bike.modelYear && <Badge variant="secondary">{bike.modelYear}</Badge>}
                    {bike.category && <Badge variant="outline">{bike.category}</Badge>}
                  </div>
                  {bike.description && (
                    <p className="text-sm text-muted-foreground flex-1 line-clamp-2">
                      {bike.description}
                    </p>
                  )}
                  {bike.exShowroomPrice && (
                    <div className="text-lg font-bold text-primary">
                      ৳ {parseInt(bike.exShowroomPrice).toLocaleString()}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-auto">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {categories.length > 0 && (
        <div className="text-center mt-12">
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button 
              variant={selectedCategory === null ? "default" : "outline"} 
              className="mb-2"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button 
                key={category} 
                variant={selectedCategory === category ? "default" : "outline"} 
                className="mb-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}