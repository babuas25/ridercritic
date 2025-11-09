'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Star, Gauge, Zap, Settings, Weight } from 'lucide-react'
import { getMotorcycle } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'

export default function MotorcycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [motorcycle, setMotorcycle] = useState<MotorcycleFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch motorcycle data
  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        setLoading(true)
        // Resolve the params promise
        const resolvedParams = await params;
        const data = await getMotorcycle(resolvedParams.id)
        if (data) {
          setMotorcycle(data)
        } else {
          setError('Motorcycle not found')
        }
      } catch (err) {
        console.error('Error fetching motorcycle:', err)
        setError('Failed to load motorcycle details')
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycle()
  }, [params])

  // Function to get valid cover image (show all images now)
  const getValidCoverImage = () => {
    return motorcycle?.coverImage || null
  }
  
  // Function to get valid gallery images (show all images now)
  const getValidGalleryImages = () => {
    return motorcycle?.galleryImages || []
  }
  
  // Function to render credit line for Honda images
  const renderCreditLine = (imageUrl: string) => {
    if (!imageUrl || !motorcycle?.brand) return null
    
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

  if (loading) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !motorcycle) {
    return (
      <div className="container py-8 max-w-6xl mx-auto px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Motorcycle Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The motorcycle you're looking for doesn't exist or has been removed.</p>
          <Link href="/motorcycle">
            <Button>Back to Motorcycles</Button>
          </Link>
        </div>
      </div>
    )
  }

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${motorcycle.brand} ${motorcycle.modelName}`,
    "image": [
      getValidCoverImage(),
      ...getValidGalleryImages()
    ].filter(Boolean),
    "description": motorcycle.description,
    "brand": {
      "@type": "Brand",
      "name": motorcycle.brand
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "BDT",
      "price": motorcycle.exShowroomPrice ? parseFloat(motorcycle.exShowroomPrice.replace(/[^0-9.]/g, '')) : undefined,
      "availability": "InStock"
    },
    "review": {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4.8",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      }
    }
  };

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Link href="/motorcycle">
        <Button variant="ghost" className="gap-2 mb-6 px-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
          <ArrowLeft className="h-4 w-4" />
          Back to Motorcycles
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Image and Basic Info */}
        <div className="space-y-6">
          {/* Main Image */}
          <div className="w-full aspect-video relative overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
            {getValidCoverImage() ? (
              <Image 
                src={getValidCoverImage() as string} 
                alt={motorcycle.modelName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1 capitalize text-gray-900 dark:text-white">{motorcycle.brand}</div>
                  <div className="text-lg text-gray-700 dark:text-gray-300">{motorcycle.modelName}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">{motorcycle.modelYear} • {motorcycle.category}</div>
                </div>
              </div>
            )}
          </div>
          {/* Credit line outside the image container */}
          {renderCreditLine(motorcycle.coverImage)}

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {getValidGalleryImages().length > 0 ? (
              getValidGalleryImages().slice(0, 4).map((img, i) => (
                <div key={i}>
                  <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                    <Image 
                      src={img} 
                      alt={`View ${i + 1}`} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 25vw, 10vw"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                  {/* Credit line outside the image container */}
                  {renderCreditLine(img)}
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">View {i}</span>
                </div>
              ))
            )}
          </div>

          {/* Basic Info Card */}
          <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                <span className="capitalize">{motorcycle.brand}</span> {motorcycle.modelName}
              </CardTitle>
              <div className="flex items-center gap-3 mt-2">
                {motorcycle.modelYear && <Badge variant="secondary" className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">{motorcycle.modelYear}</Badge>}
                {motorcycle.category && <Badge variant="outline" className="text-xs px-2 py-1 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300">{motorcycle.category}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">4.8</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">(127 critics)</span>
              </div>
              
              {/* Pricing */}
              <div className="mb-4">
                {motorcycle.exShowroomPrice && (
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      ৳ {parseFloat(motorcycle.exShowroomPrice.replace(/[^0-9.]/g, '')).toLocaleString()}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ex-showroom price</p>
                  </div>
                )}
                {motorcycle.onRoadPrice && (
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
                    <div className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                      ৳ {motorcycle.onRoadPrice}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">On-road price (approx.)</p>
                  </div>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
                  View Critics
                </Button>
                <Button variant="outline" className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                  Compare Models
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Specifications */}
        <div className="space-y-6">
          {/* Description */}
          {motorcycle.description && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {motorcycle.description}
              </p>
            </div>
          )}

          {/* Key Specs */}
          <div className="grid grid-cols-2 gap-4">
            {motorcycle.engineType && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Engine</div>
                      <div className="font-medium text-gray-900 dark:text-white">{motorcycle.engineType}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {motorcycle.maxPowerHP && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Power</div>
                      <div className="font-medium text-gray-900 dark:text-white">{motorcycle.maxPowerHP} HP</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {motorcycle.maxTorqueNm && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Torque</div>
                      <div className="font-medium text-gray-900 dark:text-white">{motorcycle.maxTorqueNm} Nm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {motorcycle.kerbWeight && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Weight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Weight</div>
                      <div className="font-medium text-gray-900 dark:text-white">{motorcycle.kerbWeight} kg</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Technical Details - All Available Specs */}
          <div className="space-y-6">
            {/* Engine Specifications */}
            {(motorcycle.displacement || motorcycle.engineType || motorcycle.maxPowerHP || motorcycle.maxTorqueNm || motorcycle.fuelSupplySystem || motorcycle.engineCoolingType || motorcycle.cylinderCount || motorcycle.valveSystem || motorcycle.compressionRatio || motorcycle.boreXStroke) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Engine Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.displacement && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Displacement</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.displacement}cc
                      </span>
                    </div>
                  )}
                  {motorcycle.engineType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Engine Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.engineType}
                      </span>
                    </div>
                  )}
                  {motorcycle.cylinderCount && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Cylinders</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.cylinderCount}
                      </span>
                    </div>
                  )}
                  {motorcycle.valveSystem && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Valve System</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.valveSystem}
                      </span>
                    </div>
                  )}
                  {motorcycle.maxPowerHP && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Max Power</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.maxPowerHP} HP{motorcycle.maxPowerRPM && ` @ ${motorcycle.maxPowerRPM} RPM`}
                      </span>
                    </div>
                  )}
                  {motorcycle.maxTorqueNm && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Max Torque</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.maxTorqueNm} Nm{motorcycle.maxTorqueRPM && ` @ ${motorcycle.maxTorqueRPM} RPM`}
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelSupplySystem && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Supply</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelSupplySystem}
                      </span>
                    </div>
                  )}
                  {motorcycle.engineCoolingType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Cooling</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.engineCoolingType}
                      </span>
                    </div>
                  )}
                  {motorcycle.compressionRatio && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Compression Ratio</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.compressionRatio}
                      </span>
                    </div>
                  )}
                  {motorcycle.boreXStroke && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Bore x Stroke</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.boreXStroke}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            {(motorcycle.topSpeed || motorcycle.acceleration0to60 || motorcycle.acceleration0to100 || motorcycle.mileage || motorcycle.range) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.topSpeed && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Top Speed</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.topSpeed} km/h
                      </span>
                    </div>
                  )}
                  {motorcycle.acceleration0to60 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">0-60 km/h</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.acceleration0to60} seconds
                      </span>
                    </div>
                  )}
                  {motorcycle.acceleration0to100 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">0-100 km/h</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.acceleration0to100} seconds
                      </span>
                    </div>
                  )}
                  {motorcycle.mileage && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Mileage</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.mileage} km/l
                      </span>
                    </div>
                  )}
                  {motorcycle.range && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Range</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.range} km
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transmission & Drive */}
            {(motorcycle.transmissionType || motorcycle.numberOfGears || motorcycle.finalDriveType) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Transmission & Drive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.transmissionType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Transmission</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.transmissionType}
                      </span>
                    </div>
                  )}
                  {motorcycle.numberOfGears && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Gears</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.numberOfGears}
                      </span>
                    </div>
                  )}
                  {motorcycle.finalDriveType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Drive Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.finalDriveType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Brakes & Wheels */}
            {(motorcycle.frontBrakeType || motorcycle.rearBrakeType || motorcycle.absSupport || motorcycle.wheelType) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Brakes & Wheels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.frontBrakeType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Front Brake</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.frontBrakeType}{motorcycle.frontBrakeSize && ` (${motorcycle.frontBrakeSize}mm)`}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearBrakeType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rear Brake</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.rearBrakeType}{motorcycle.rearBrakeSize && ` (${motorcycle.rearBrakeSize}mm)`}
                      </span>
                    </div>
                  )}
                  {motorcycle.absSupport && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">ABS</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.absSupport}
                      </span>
                    </div>
                  )}
                  {motorcycle.wheelType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wheels</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.wheelType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dimensions & Weight */}
            {(motorcycle.overallLength || motorcycle.overallWidth || motorcycle.overallHeight || motorcycle.kerbWeight) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Dimensions & Weight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.overallLength && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Length</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.overallLength} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.overallWidth && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Width</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.overallWidth} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.overallHeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Height</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.overallHeight} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.kerbWeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Kerb Weight</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.kerbWeight} kg
                      </span>
                    </div>
                  )}
                  {motorcycle.seatHeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Seat Height</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.seatHeight} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.groundClearance && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ground Clearance</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.groundClearance} mm
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features & Equipment */}
            {(motorcycle.headlightType || motorcycle.indicatorType || motorcycle.tailLightType) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Features & Equipment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.headlightType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Headlight</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.headlightType}
                      </span>
                    </div>
                  )}
                  {motorcycle.indicatorType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Indicators</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.indicatorType}
                      </span>
                    </div>
                  )}
                  {motorcycle.tailLightType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tail Light</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.tailLightType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step Images Gallery */}
            {motorcycle.stepImages && Object.values(motorcycle.stepImages).some(step => step && step.length > 0) && (
              <div className="space-y-6">
                {/* Basic Information Images */}
                {motorcycle.stepImages.step1 && motorcycle.stepImages.step1.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step1.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Basic Information ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Engine Specifications Images */}
                {motorcycle.stepImages.step2 && motorcycle.stepImages.step2.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Engine Specifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step2.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Engine Specifications ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Performance Metrics Images */}
                {motorcycle.stepImages.step3 && motorcycle.stepImages.step3.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step3.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Performance Metrics ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Transmission & Drive Images */}
                {motorcycle.stepImages.step4 && motorcycle.stepImages.step4.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Transmission & Drive</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step4.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Transmission & Drive ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Electronics & Control Images */}
                {motorcycle.stepImages.step5 && motorcycle.stepImages.step5.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Electronics & Control</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step5.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Electronics & Control ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Chassis & Suspension Images */}
                {motorcycle.stepImages.step6 && motorcycle.stepImages.step6.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Chassis & Suspension</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step6.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Chassis & Suspension ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Brakes, Wheels & Tyres Images */}
                {motorcycle.stepImages.step7 && motorcycle.stepImages.step7.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Brakes, Wheels & Tyres</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step7.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Brakes, Wheels & Tyres ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Dimensions & Weight Images */}
                {motorcycle.stepImages.step8 && motorcycle.stepImages.step8.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Dimensions & Weight</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step8.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Dimensions & Weight ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Features & Equipment Images */}
                {motorcycle.stepImages.step9 && motorcycle.stepImages.step9.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Features & Equipment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step9.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Features & Equipment ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Pricing & Market Data Images */}
                {motorcycle.stepImages.step10 && motorcycle.stepImages.step10.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Market Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step10.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Pricing & Market Data ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Color Options Images */}
                {motorcycle.stepImages.step11 && motorcycle.stepImages.step11.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Color Options</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step11.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Color Options ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Additional Information Images */}
                {motorcycle.stepImages.step12 && motorcycle.stepImages.step12.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {motorcycle.stepImages.step12.map((img, i) => (
                          <div key={i} className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                            <Image 
                              src={img} 
                              alt={`Additional Information ${i + 1}`} 
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 33vw"
                              quality={80}
                            />
                            {renderCreditLine(img)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}