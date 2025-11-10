'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, Star, Gauge, Zap, Settings, Weight } from 'lucide-react'
import { getMotorcycle } from '@/lib/motorcycles'
import { listFolderImages, listImagesFromFolders, sanitizeStoragePath } from '@/lib/storage'
import { MotorcycleFormData } from '@/types/motorcycle'

export default function MotorcycleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [motorcycle, setMotorcycle] = useState<MotorcycleFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [derivedGallery, setDerivedGallery] = useState<string[]>([])
  const [derivedSteps, setDerivedSteps] = useState<string[]>([])
  // Toggle for showing step image galleries below specs
  const showStepImageGalleries = false

  // Fetch motorcycle data
  useEffect(() => {
    const fetchMotorcycle = async () => {
      try {
        setLoading(true)
        // Resolve the params promise
        const resolvedParams = await params;
        const data = await getMotorcycle(resolvedParams.id)
        console.log('Fetched motorcycle data:', data) // Debug log
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

  // If gallery/step images are missing in Firestore, try to load from Storage
  useEffect(() => {
    const fetchFromStorageIfMissing = async () => {
      if (!motorcycle?.brand || !motorcycle?.modelName) return
      const basePathRaw = `motorcycles/${motorcycle.brand}/${motorcycle.modelName}`
      const basePathSan = sanitizeStoragePath(basePathRaw)
      const uniq = (arr: string[]) => Array.from(new Set(arr.filter(Boolean)))

      // Load gallery if missing
      if (!motorcycle.galleryImages || motorcycle.galleryImages.length === 0) {
        const [g1, g2] = await Promise.all([
          listFolderImages(`${basePathRaw}/gallery`),
          listFolderImages(`${basePathSan}/gallery`)
        ])
        setDerivedGallery(uniq([...g1, ...g2]))
      } else {
        setDerivedGallery([])
      }

      // Load step images if missing
      const hasAnyStep =
        !!motorcycle.stepImages &&
        Object.values(motorcycle.stepImages).some(arr => Array.isArray(arr) && arr.length > 0)
      if (!hasAnyStep) {
        // Use known step folders that match uploaders
        const order = [
          'brakes-wheels',
          'chassis',
          'cover',
          'electronics',
          'engine',
          'features',
          'performance',
          'transmission'
        ]
        const [s1, s2] = await Promise.all([
          listImagesFromFolders(basePathRaw, order),
          listImagesFromFolders(basePathSan, order)
        ])
        setDerivedSteps(uniq([...s1, ...s2]))
      } else {
        setDerivedSteps([])
      }
    }
    fetchFromStorageIfMissing()
  }, [motorcycle])

  // Function to get valid cover image with fallbacks
  const getValidCoverImage = () => {
    if (motorcycle?.coverImage) return motorcycle.coverImage
    // Fallback 1: first gallery image
    const gallery = (motorcycle?.galleryImages?.filter(Boolean) ?? []).concat(derivedGallery)
    if (gallery.length > 0) return gallery[0]
    // Fallback 2: first available step image
    const steps = motorcycle?.stepImages
    if (steps) {
      const firstFromSteps =
        steps.step1?.[0] ||
        steps.step2?.[0] ||
        steps.step3?.[0] ||
        steps.step4?.[0] ||
        steps.step5?.[0] ||
        steps.step6?.[0] ||
        steps.step7?.[0] ||
        steps.step8?.[0] ||
        steps.step9?.[0] ||
        steps.step10?.[0] ||
        steps.step11?.[0] ||
        steps.step12?.[0] ||
        null
      if (firstFromSteps) return firstFromSteps
    }
    if (derivedSteps.length > 0) return derivedSteps[0]
    return null
  }
  
  // Function to get valid gallery images with fallbacks
  const getValidGalleryImages = () => {
    const gallery = (motorcycle?.galleryImages?.filter(Boolean) ?? []).concat(derivedGallery)
    if (gallery.length > 0) return gallery
    // Fallback: collect from step images (keep order by step)
    const steps = motorcycle?.stepImages
    if (!steps) return derivedSteps
    const fromSteps = [
      ...(steps.step1 ?? []),
      ...(steps.step2 ?? []),
      ...(steps.step3 ?? []),
      ...(steps.step4 ?? []),
      ...(steps.step5 ?? []),
      ...(steps.step6 ?? []),
      ...(steps.step7 ?? []),
      ...(steps.step8 ?? []),
      ...(steps.step9 ?? []),
      ...(steps.step10 ?? []),
      ...(steps.step11 ?? []),
      ...(steps.step12 ?? []),
    ].filter(Boolean)
    return fromSteps.length > 0 ? fromSteps : derivedSteps
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
    console.log('Motorcycle data not found or error occurred')
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

  // Log the motorcycle data for debugging
  console.log('Motorcycle data:', motorcycle)
  console.log('Gallery images:', motorcycle.galleryImages)
  console.log('Cover image:', motorcycle.coverImage)

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
            {(() => {
              const galleryImages = getValidGalleryImages()
              console.log('Rendering gallery images:', galleryImages)
              return galleryImages.length > 0 ? (
                galleryImages.slice(0, 4).map((img, i) => {
                  console.log(`Rendering gallery image ${i}:`, img)
                  return (
                    <div key={`${img}-${i}`}>
                      <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                        <Image 
                          src={img} 
                          alt={`View ${i + 1}`} 
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 25vw, 10vw"
                          quality={80}
                          unoptimized
                          loading="lazy"
                        />
                      </div>
                      {/* Credit line outside the image container */}
                      {renderCreditLine(img)}
                    </div>
                  )
                })
              ) : (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">View {i}</span>
                  </div>
                ))
              )
            })()}
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
            {(motorcycle.displacement || motorcycle.engineType || motorcycle.maxPowerHP || motorcycle.maxTorqueNm || motorcycle.fuelSupplySystem || motorcycle.engineCoolingType || motorcycle.cylinderCount || motorcycle.valveSystem || motorcycle.compressionRatio || motorcycle.boreXStroke || motorcycle.strokeType || motorcycle.lubricationSystem || motorcycle.ignitionType || motorcycle.valvesPerCylinder || typeof motorcycle.idleStopSystem === 'boolean' || typeof motorcycle.catalyticConverter === 'boolean' || motorcycle.emissionStandard || motorcycle.engineRedline || motorcycle.revLimiter || typeof motorcycle.engineBrakingManagement === 'boolean' || motorcycle.fuelInjectionMapping || motorcycle.obd || motorcycle.throttleResponse || motorcycle.startType || motorcycle.fuelType || motorcycle.radiatorFanType) && (
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
                  {motorcycle.strokeType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Stroke Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.strokeType}
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
                  {motorcycle.radiatorFanType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Cooling Details</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.radiatorFanType}
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
                  {motorcycle.lubricationSystem && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Lubrication</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.lubricationSystem}
                      </span>
                    </div>
                  )}
                  {motorcycle.ignitionType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Ignition</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.ignitionType}
                      </span>
                    </div>
                  )}
                  {motorcycle.valvesPerCylinder && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Valves per Cylinder</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.valvesPerCylinder}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.idleStopSystem === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Idle Stop System</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.idleStopSystem ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.catalyticConverter === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Catalytic Converter</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.catalyticConverter ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {motorcycle.emissionStandard && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Emission Standard</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.emissionStandard}
                      </span>
                    </div>
                  )}
                  {motorcycle.engineRedline && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Engine Redline</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.engineRedline}
                      </span>
                    </div>
                  )}
                  {motorcycle.revLimiter && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rev Limiter</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.revLimiter}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.engineBrakingManagement === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Engine Braking Mgmt</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.engineBrakingManagement ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelInjectionMapping && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Injection Mapping</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelInjectionMapping}
                      </span>
                    </div>
                  )}
                  {motorcycle.obd && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">OBD</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.obd}
                      </span>
                    </div>
                  )}
                  {motorcycle.throttleResponse && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Throttle Response</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.throttleResponse}
                      </span>
                    </div>
                  )}
                  {motorcycle.startType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Start Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.startType}
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelType}
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
            {(motorcycle.transmissionType || motorcycle.numberOfGears || motorcycle.finalDriveType || motorcycle.clutchType || motorcycle.shiftPattern || typeof motorcycle.gearIndicator === 'boolean') && (
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
                  {motorcycle.clutchType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Clutch</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.clutchType}
                      </span>
                    </div>
                  )}
                  {motorcycle.shiftPattern && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Shift Pattern</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.shiftPattern}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.gearIndicator === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Gear Indicator</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.gearIndicator ? 'Yes' : 'No'}
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
            {(motorcycle.overallLength || motorcycle.overallWidth || motorcycle.overallHeight || motorcycle.kerbWeight || motorcycle.wheelbase || motorcycle.turningRadius || motorcycle.steeringAngle || motorcycle.centerOfGravityHeight || motorcycle.loadCapacity) && (
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
                  {motorcycle.wheelbase && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wheelbase</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.wheelbase} 
                      </span>
                    </div>
                  )}
                  {motorcycle.turningRadius && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Turning Radius</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.turningRadius}
                      </span>
                    </div>
                  )}
                  {motorcycle.steeringAngle && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Steering Angle</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.steeringAngle}
                      </span>
                    </div>
                  )}
                  {motorcycle.centerOfGravityHeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Center of Gravity Height</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.centerOfGravityHeight}
                      </span>
                    </div>
                  )}
                  {motorcycle.loadCapacity && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Load Capacity</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.loadCapacity}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features & Equipment */}
            {(motorcycle.headlightType || motorcycle.indicatorType || motorcycle.tailLightType || motorcycle.instrumentConsole || motorcycle.displaySize || motorcycle.connectivity || typeof motorcycle.mobileAppIntegration === 'boolean' || typeof motorcycle.cruiseControl === 'boolean' || typeof motorcycle.tractionControlSystem === 'boolean' || typeof motorcycle.ridingModes === 'boolean' || typeof motorcycle.slipperClutchAssist === 'boolean' || typeof motorcycle.sideStandEngineCutoff === 'boolean' || typeof motorcycle.adjustableSuspension === 'boolean' || typeof motorcycle.adjustableWindshield === 'boolean' || typeof motorcycle.quickShifter === 'boolean' || typeof motorcycle.tpms === 'boolean' || typeof motorcycle.launchControl === 'boolean' || typeof motorcycle.antiStallHillAssist === 'boolean' || typeof motorcycle.autoBlipper === 'boolean' || typeof motorcycle.keylessIgnition === 'boolean' || typeof motorcycle.centralLocking === 'boolean' || typeof motorcycle.immobilizer === 'boolean' || typeof motorcycle.sosCrashDetection === 'boolean' || typeof motorcycle.turnByTurnNavigation === 'boolean') && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Features & Equipment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.instrumentConsole && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Instrument Console</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.instrumentConsole}
                      </span>
                    </div>
                  )}
                  {motorcycle.displaySize && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Display Size</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.displaySize}
                      </span>
                    </div>
                  )}
                  {motorcycle.connectivity && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Connectivity</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.connectivity}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.mobileAppIntegration === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Mobile App Integration</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.mobileAppIntegration ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
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
                  {typeof motorcycle.gearIndicator === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Gear Indicator</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.gearIndicator ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.drl === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">DRL</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.drl ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.cruiseControl === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Cruise Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.cruiseControl ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.tractionControlSystem === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Traction Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.tractionControlSystem ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.ridingModes === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Riding Modes</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.ridingModes ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.slipperClutchAssist === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Slipper Clutch Assist</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.slipperClutchAssist ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.sideStandEngineCutoff === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Side Stand Engine Cutoff</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.sideStandEngineCutoff ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.adjustableSuspension === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Adjustable Suspension</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.adjustableSuspension ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.adjustableWindshield === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Adjustable Windshield</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.adjustableWindshield ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.quickShifter === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Quick Shifter</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.quickShifter ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.tpms === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">TPMS</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.tpms ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.launchControl === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Launch Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.launchControl ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.antiStallHillAssist === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Anti-Stall Hill Assist</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.antiStallHillAssist ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.autoBlipper === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Auto Blipper</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.autoBlipper ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.keylessIgnition === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Keyless Ignition</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.keylessIgnition ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.centralLocking === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Central Locking</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.centralLocking ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.immobilizer === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Immobilizer</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.immobilizer ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.sosCrashDetection === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">SOS Crash Detection</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.sosCrashDetection ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                  {typeof motorcycle.turnByTurnNavigation === 'boolean' && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Turn-by-turn Navigation</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.turnByTurnNavigation ? 'Yes' : 'No'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Pricing & Warranty */}
            {(motorcycle.currency || motorcycle.warrantyYears || motorcycle.warrantyKm || motorcycle.freeServiceCount || motorcycle.serviceIntervalKm || motorcycle.serviceIntervalMonths) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Pricing & Warranty</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.currency && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Currency</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.currency}
                      </span>
                    </div>
                  )}
                  {(motorcycle.warrantyYears || motorcycle.warrantyKm) && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Warranty</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {[motorcycle.warrantyYears, motorcycle.warrantyKm].filter(Boolean).join(' / ')}
                      </span>
                    </div>
                  )}
                  {motorcycle.freeServiceCount && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Free Services</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.freeServiceCount}
                      </span>
                    </div>
                  )}
                  {(motorcycle.serviceIntervalKm || motorcycle.serviceIntervalMonths) && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Service Interval</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {[motorcycle.serviceIntervalKm, motorcycle.serviceIntervalMonths].filter(Boolean).join(' / ')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Fuel & Efficiency */}
            {(motorcycle.ecoModeEfficiency || motorcycle.reserveFuelCapacity || motorcycle.fuelEconomyRideModes || motorcycle.powerToWeightRatio) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Fuel & Efficiency</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.ecoModeEfficiency && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Eco Mode Efficiency</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.ecoModeEfficiency}
                      </span>
                    </div>
                  )}
                  {motorcycle.reserveFuelCapacity && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Reserve Fuel</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.reserveFuelCapacity}
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelEconomyRideModes && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Economy Ride Modes</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelEconomyRideModes}
                      </span>
                    </div>
                  )}
                  {motorcycle.powerToWeightRatio && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Power-to-Weight Ratio</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.powerToWeightRatio}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step Images Gallery - disabled by design (set showStepImageGalleries to true to enable) */}
            {showStepImageGalleries && motorcycle.stepImages && Object.values(motorcycle.stepImages).some(step => step && step.length > 0) && (
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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
                          unoptimized
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