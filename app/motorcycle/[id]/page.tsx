'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Gauge, Settings, Weight, Zap, Loader2 } from "lucide-react"
import { getMotorcycle } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'

export default function MotorcycleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const motorcycleId = params?.id as string
  
  const [motorcycle, setMotorcycle] = useState<MotorcycleFormData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMotorcycle = async () => {
      if (!motorcycleId) return
      
      try {
        setLoading(true)
        const data = await getMotorcycle(motorcycleId)
        if (data) {
          setMotorcycle(data)
        } else {
          alert('Motorcycle not found')
          router.push('/motorcycle')
        }
      } catch (error) {
        console.error('Error fetching motorcycle:', error)
        alert('Failed to load motorcycle')
        router.push('/motorcycle')
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycle()
  }, [motorcycleId, router])

  if (loading || !motorcycle) {
    return (
      <div className="container py-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
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
            {motorcycle.coverImage ? (
              <Image 
                src={motorcycle.coverImage} 
                alt={motorcycle.modelName}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
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

          {/* Gallery Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {motorcycle.galleryImages && motorcycle.galleryImages.length > 0 ? (
              motorcycle.galleryImages.slice(0, 4).map((img, i) => (
                <div key={i} className="aspect-square relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <Image 
                    src={img} 
                    alt={`View ${i + 1}`} 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 10vw"
                  />
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
                  {motorcycle.fuelSupplySystem && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fuel System</span>
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
                  {motorcycle.startType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Starting</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.startType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            {(motorcycle.topSpeed || motorcycle.mileage || motorcycle.acceleration0to60 || motorcycle.acceleration0to100 || motorcycle.powerToWeightRatio) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Performance</CardTitle>
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
                  {motorcycle.powerToWeightRatio && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Power/Weight</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.powerToWeightRatio}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transmission & Drive */}
            {(motorcycle.transmissionType || motorcycle.numberOfGears || motorcycle.clutchType || motorcycle.finalDriveType) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Transmission & Drive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.transmissionType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Transmission</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.numberOfGears && `${motorcycle.numberOfGears}-speed `}{motorcycle.transmissionType}
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
                  {motorcycle.finalDriveType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Final Drive</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.finalDriveType}
                      </span>
                    </div>
                  )}
                  {motorcycle.gearIndicator && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Gear Indicator</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Chassis & Suspension */}
            {(motorcycle.frameType || motorcycle.frontSuspension || motorcycle.rearSuspension || motorcycle.swingarmType) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Chassis & Suspension</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.frameType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Frame</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.frameType}
                      </span>
                    </div>
                  )}
                  {motorcycle.swingarmType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Swingarm</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.swingarmType}
                      </span>
                    </div>
                  )}
                  {motorcycle.frontSuspension && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Front Suspension</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.frontSuspension}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearSuspension && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rear Suspension</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.rearSuspension}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Brakes & Wheels */}
            {(motorcycle.frontBrakeType || motorcycle.rearBrakeType || motorcycle.absSupport || motorcycle.frontTyreSize || motorcycle.rearTyreSize) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Brakes & Wheels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.frontBrakeType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Front Brake</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.frontBrakeSize} {motorcycle.frontBrakeType}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearBrakeType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rear Brake</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.rearBrakeSize} {motorcycle.rearBrakeType}
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
                  {motorcycle.frontTyreSize && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Front Tyre</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.frontTyreSize}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearTyreSize && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Rear Tyre</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.rearTyreSize}
                      </span>
                    </div>
                  )}
                  {motorcycle.wheelType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wheel Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.wheelType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dimensions & Weight */}
            {(motorcycle.kerbWeight || motorcycle.fuelTankCapacity || motorcycle.seatHeight || motorcycle.groundClearance || motorcycle.wheelbase || motorcycle.overallLength || motorcycle.overallWidth || motorcycle.overallHeight) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Dimensions & Weight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.kerbWeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Kerb Weight</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.kerbWeight} kg
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelTankCapacity && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Tank</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelTankCapacity} liters
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
                        {motorcycle.wheelbase} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.overallLength && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Length x Width x Height</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.overallLength} x {motorcycle.overallWidth} x {motorcycle.overallHeight} mm
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features & Equipment */}
            {(motorcycle.instrumentConsole || motorcycle.headlightType || motorcycle.drl || motorcycle.connectivity) && (
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
                  {motorcycle.headlightType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Headlight</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.headlightType}{motorcycle.drl && ' with DRL'}
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
                  {motorcycle.indicatorType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Indicator</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.indicatorType}
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
                  {motorcycle.mobileAppIntegration && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Mobile App</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.turnByTurnNavigation && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Turn-by-Turn Navigation</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.ridingStatistics && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Riding Statistics</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.adjustableWindshield && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Adjustable Windshield</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.seatType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Seat Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.seatType}
                      </span>
                    </div>
                  )}
                  {motorcycle.handleType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Handle Type</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.handleType}
                      </span>
                    </div>
                  )}
                  {motorcycle.footpegPosition && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Footpeg Position</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.footpegPosition}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Electronics & Safety */}
            {(motorcycle.absType || motorcycle.tractionControlSystem || motorcycle.launchControl || motorcycle.wheelieControl || motorcycle.cruiseControl || motorcycle.engineBrakingManagement || motorcycle.slipperClutchAssist || motorcycle.antiStallHillAssist || motorcycle.sideStandEngineCutoff || motorcycle.tpms || motorcycle.keylessIgnition || motorcycle.immobilizer || motorcycle.centralLocking || motorcycle.sosCrashDetection || motorcycle.adjustableSuspension || motorcycle.ridingModes) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Electronics & Safety</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.ridingModes && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Riding Modes</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.tractionControlSystem && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Traction Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.launchControl && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Launch Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.wheelieControl && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Wheelie Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.cruiseControl && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Cruise Control</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.engineBrakingManagement && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Engine Braking Mgmt</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.slipperClutchAssist && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Slipper Clutch</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.antiStallHillAssist && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Hill Assist</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.sideStandEngineCutoff && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Side Stand Cutoff</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.tpms && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">TPMS</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.keylessIgnition && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Keyless Ignition</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.immobilizer && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Immobilizer</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.centralLocking && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Central Locking</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.sosCrashDetection && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">SOS Crash Detection</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.adjustableSuspension && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Adjustable Suspension</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Emission & Environment */}
            {(motorcycle.emissionStandard || motorcycle.catalyticConverter || motorcycle.obd || motorcycle.fuelEconomyRideModes || motorcycle.fuelInjectionMapping || motorcycle.throttleResponse || motorcycle.ecoModeEfficiency) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Emission & Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.emissionStandard && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Emission Standard</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.emissionStandard.toUpperCase()}
                      </span>
                    </div>
                  )}
                  {motorcycle.catalyticConverter && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Catalytic Converter</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
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
                  {motorcycle.fuelEconomyRideModes && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Eco Mode</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelEconomyRideModes}
                      </span>
                    </div>
                  )}
                  {motorcycle.ecoModeEfficiency && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Eco Efficiency</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.ecoModeEfficiency}
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelInjectionMapping && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Fuel Injection</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.fuelInjectionMapping}
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
                </CardContent>
              </Card>
            )}

            {/* Advanced Technical Details */}
            {(motorcycle.suspensionTravelFront || motorcycle.suspensionTravelRear || motorcycle.steeringAngle || motorcycle.turningRadius || motorcycle.centerOfGravityHeight || motorcycle.radiatorFanType || motorcycle.lubricationSystem || motorcycle.airFilterType || motorcycle.idleStopSystem || motorcycle.engineRedline || motorcycle.revLimiter || motorcycle.gearRatio || motorcycle.quickShifter || motorcycle.autoBlipper || motorcycle.shiftPattern || motorcycle.brakeCaliperType || motorcycle.cbs || motorcycle.tyreBrand || motorcycle.reserveFuelCapacity || motorcycle.oilCapacity || motorcycle.batteryCapacity || motorcycle.loadCapacity || motorcycle.dryWeight || motorcycle.range) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Advanced Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.suspensionTravelFront && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Suspension Travel (F/R)</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.suspensionTravelFront} / {motorcycle.suspensionTravelRear}
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
                  {motorcycle.turningRadius && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Turning Radius</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.turningRadius}
                      </span>
                    </div>
                  )}
                  {motorcycle.centerOfGravityHeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Center of Gravity</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.centerOfGravityHeight}
                      </span>
                    </div>
                  )}
                  {motorcycle.radiatorFanType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Radiator/Cooling</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.radiatorFanType}
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
                  {motorcycle.airFilterType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Air Filter</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.airFilterType}
                      </span>
                    </div>
                  )}
                  {motorcycle.idleStopSystem && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Idle Stop System</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
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
                  {motorcycle.gearRatio && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Gear Ratio</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right whitespace-pre-line">
                        {motorcycle.gearRatio}
                      </span>
                    </div>
                  )}
                  {motorcycle.quickShifter && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Quick Shifter</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.autoBlipper && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Auto Blipper</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
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
                  {motorcycle.brakeCaliperType && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Brake Caliper</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.brakeCaliperType}
                      </span>
                    </div>
                  )}
                  {motorcycle.cbs && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">CBS</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        Yes
                      </span>
                    </div>
                  )}
                  {motorcycle.tyreBrand && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Tyre Brand</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.tyreBrand}
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
                  {motorcycle.oilCapacity && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Oil Capacity</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.oilCapacity}
                      </span>
                    </div>
                  )}
                  {motorcycle.batteryCapacity && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Battery</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.batteryCapacity}
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
                  {motorcycle.dryWeight && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Dry Weight</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.dryWeight}
                      </span>
                    </div>
                  )}
                  {motorcycle.range && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Range</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.range}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Warranty & Service */}
            {(motorcycle.warrantyYears || motorcycle.warrantyKm || motorcycle.freeServiceCount || motorcycle.serviceIntervalKm || motorcycle.serviceIntervalMonths) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Warranty & Service</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.warrantyYears && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Warranty</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.warrantyYears} or {motorcycle.warrantyKm}
                      </span>
                    </div>
                  )}
                  {motorcycle.freeServiceCount && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Free Service</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.freeServiceCount}
                      </span>
                    </div>
                  )}
                  {motorcycle.serviceIntervalKm && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Service Interval</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.serviceIntervalKm} or {motorcycle.serviceIntervalMonths}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Origin & Availability */}
            {(motorcycle.originCountry || motorcycle.assemblyCountry || motorcycle.availability || motorcycle.launchDate || motorcycle.marketSegment) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Origin & Availability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.originCountry && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Origin</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.originCountry}
                      </span>
                    </div>
                  )}
                  {motorcycle.assemblyCountry && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Assembly</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {motorcycle.assemblyCountry}
                      </span>
                    </div>
                  )}
                  {motorcycle.availability && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Availability</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right capitalize">
                        {motorcycle.availability}
                      </span>
                    </div>
                  )}
                  {motorcycle.launchDate && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Launch Date</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right">
                        {new Date(motorcycle.launchDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {motorcycle.marketSegment && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Market Segment</span>
                      <span className="text-sm text-gray-900 dark:text-white text-right capitalize">
                        {motorcycle.marketSegment}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Colors & Variants */}
            {(motorcycle.availableColors && motorcycle.availableColors.length > 0) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Available Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {motorcycle.availableColors.map((color, index) => (
                      <Badge key={index} variant="secondary" className="capitalize px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Highlights */}
            {(motorcycle.keyHighlights && motorcycle.keyHighlights.length > 0) && (
              <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Key Highlights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {motorcycle.keyHighlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Pros & Cons */}
            {((motorcycle.pros && motorcycle.pros.length > 0) || (motorcycle.cons && motorcycle.cons.length > 0)) && (
              <div className="grid md:grid-cols-2 gap-4">
                {motorcycle.pros && motorcycle.pros.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-green-700 dark:text-green-400">Pros</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {motorcycle.pros.map((pro, index) => (
                          <li key={index}>{pro}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
                {motorcycle.cons && motorcycle.cons.length > 0 && (
                  <Card className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-semibold text-red-700 dark:text-red-400">Cons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        {motorcycle.cons.map((con, index) => (
                          <li key={index}>{con}</li>
                        ))}
                      </ul>
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