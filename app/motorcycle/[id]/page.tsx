'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from "next/link"
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
    <div className="container py-8 max-w-6xl mx-auto">
      <Link href="/motorcycle">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Motorcycles
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          {motorcycle.coverImage ? (
            <div className="w-full h-96 relative overflow-hidden rounded-lg">
              <img 
                src={motorcycle.coverImage} 
                alt={motorcycle.modelName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-96 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2 capitalize">{motorcycle.brand}</div>
                <div className="text-xl">{motorcycle.modelName}</div>
                <div className="text-sm opacity-90 mt-2">{motorcycle.modelYear} • {motorcycle.category}</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-4 gap-2">
            {motorcycle.galleryImages && motorcycle.galleryImages.length > 0 ? (
              motorcycle.galleryImages.slice(0, 4).map((img, i) => (
                <div key={i} className="h-20 relative overflow-hidden rounded-lg">
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center text-white text-xs">
                  View {i}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2"><span className="capitalize">{motorcycle.brand}</span> {motorcycle.modelName}</h1>
            <div className="flex items-center gap-4 mb-4">
              {motorcycle.modelYear && <Badge variant="secondary">{motorcycle.modelYear}</Badge>}
              {motorcycle.category && <Badge variant="outline">{motorcycle.category}</Badge>}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
                <span className="text-sm text-muted-foreground">(127 reviews)</span>
              </div>
            </div>
            {motorcycle.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {motorcycle.description}
              </p>
            )}
          </div>

          {/* Key Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Key Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {motorcycle.engineType && (
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Engine: {motorcycle.engineType}</span>
                  </div>
                )}
                {motorcycle.maxPowerHP && (
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Power: {motorcycle.maxPowerHP} HP</span>
                  </div>
                )}
                {motorcycle.maxTorqueNm && (
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Torque: {motorcycle.maxTorqueNm} Nm</span>
                  </div>
                )}
                {motorcycle.kerbWeight && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Weight: {motorcycle.kerbWeight} kg</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Technical Details - All Available Specs */}
          <div className="space-y-6">
            {/* Engine Specifications */}
            {(motorcycle.displacement || motorcycle.engineType || motorcycle.maxPowerHP || motorcycle.maxTorqueNm || motorcycle.fuelSupplySystem || motorcycle.engineCoolingType || motorcycle.cylinderCount || motorcycle.valveSystem || motorcycle.compressionRatio || motorcycle.boreXStroke) && (
              <Card>
                <CardHeader>
                  <CardTitle>Engine Specifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.displacement && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Displacement</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.displacement}cc
                      </span>
                    </div>
                  )}
                  {motorcycle.engineType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Engine Type</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.engineType}
                      </span>
                    </div>
                  )}
                  {motorcycle.cylinderCount && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Cylinders</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.cylinderCount}
                      </span>
                    </div>
                  )}
                  {motorcycle.valveSystem && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Valve System</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.valveSystem}
                      </span>
                    </div>
                  )}
                  {motorcycle.maxPowerHP && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Max Power</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.maxPowerHP} HP{motorcycle.maxPowerRPM && ` @ ${motorcycle.maxPowerRPM} RPM`}
                      </span>
                    </div>
                  )}
                  {motorcycle.maxTorqueNm && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Max Torque</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.maxTorqueNm} Nm{motorcycle.maxTorqueRPM && ` @ ${motorcycle.maxTorqueRPM} RPM`}
                      </span>
                    </div>
                  )}
                  {motorcycle.compressionRatio && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Compression Ratio</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.compressionRatio}
                      </span>
                    </div>
                  )}
                  {motorcycle.boreXStroke && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Bore x Stroke</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.boreXStroke}
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelSupplySystem && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Fuel System</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.fuelSupplySystem}
                      </span>
                    </div>
                  )}
                  {motorcycle.engineCoolingType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Cooling</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.engineCoolingType}
                      </span>
                    </div>
                  )}
                  {motorcycle.startType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Starting</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.startType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Performance Metrics */}
            {(motorcycle.topSpeed || motorcycle.mileage || motorcycle.acceleration0to60 || motorcycle.acceleration0to100 || motorcycle.powerToWeightRatio) && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.topSpeed && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Top Speed</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.topSpeed} km/h
                      </span>
                    </div>
                  )}
                  {motorcycle.acceleration0to60 && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">0-60 km/h</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.acceleration0to60} seconds
                      </span>
                    </div>
                  )}
                  {motorcycle.acceleration0to100 && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">0-100 km/h</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.acceleration0to100} seconds
                      </span>
                    </div>
                  )}
                  {motorcycle.mileage && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Mileage</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.mileage} km/l
                      </span>
                    </div>
                  )}
                  {motorcycle.powerToWeightRatio && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Power/Weight</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.powerToWeightRatio}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Transmission & Drive */}
            {(motorcycle.transmissionType || motorcycle.numberOfGears || motorcycle.clutchType || motorcycle.finalDriveType) && (
              <Card>
                <CardHeader>
                  <CardTitle>Transmission & Drive</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.transmissionType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Transmission</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.numberOfGears && `${motorcycle.numberOfGears}-speed `}{motorcycle.transmissionType}
                      </span>
                    </div>
                  )}
                  {motorcycle.clutchType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Clutch</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.clutchType}
                      </span>
                    </div>
                  )}
                  {motorcycle.finalDriveType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Final Drive</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.finalDriveType}
                      </span>
                    </div>
                  )}
                  {motorcycle.gearIndicator && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Gear Indicator</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        Yes
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Chassis & Suspension */}
            {(motorcycle.frameType || motorcycle.frontSuspension || motorcycle.rearSuspension || motorcycle.swingarmType) && (
              <Card>
                <CardHeader>
                  <CardTitle>Chassis & Suspension</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.frameType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Frame</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.frameType}
                      </span>
                    </div>
                  )}
                  {motorcycle.swingarmType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Swingarm</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.swingarmType}
                      </span>
                    </div>
                  )}
                  {motorcycle.frontSuspension && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Front Suspension</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.frontSuspension}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearSuspension && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Rear Suspension</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.rearSuspension}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Brakes & Wheels */}
            {(motorcycle.frontBrakeType || motorcycle.rearBrakeType || motorcycle.absSupport || motorcycle.frontTyreSize || motorcycle.rearTyreSize) && (
              <Card>
                <CardHeader>
                  <CardTitle>Brakes & Wheels</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.frontBrakeType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Front Brake</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.frontBrakeSize} {motorcycle.frontBrakeType}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearBrakeType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Rear Brake</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.rearBrakeSize} {motorcycle.rearBrakeType}
                      </span>
                    </div>
                  )}
                  {motorcycle.absSupport && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">ABS</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.absSupport}
                      </span>
                    </div>
                  )}
                  {motorcycle.frontTyreSize && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Front Tyre</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.frontTyreSize}
                      </span>
                    </div>
                  )}
                  {motorcycle.rearTyreSize && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Rear Tyre</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.rearTyreSize}
                      </span>
                    </div>
                  )}
                  {motorcycle.wheelType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Wheel Type</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.wheelType}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Dimensions & Weight */}
            {(motorcycle.kerbWeight || motorcycle.fuelTankCapacity || motorcycle.seatHeight || motorcycle.groundClearance || motorcycle.wheelbase || motorcycle.overallLength || motorcycle.overallWidth || motorcycle.overallHeight) && (
              <Card>
                <CardHeader>
                  <CardTitle>Dimensions & Weight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.kerbWeight && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Kerb Weight</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.kerbWeight} kg
                      </span>
                    </div>
                  )}
                  {motorcycle.fuelTankCapacity && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Fuel Tank</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.fuelTankCapacity} liters
                      </span>
                    </div>
                  )}
                  {motorcycle.seatHeight && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Seat Height</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.seatHeight} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.groundClearance && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Ground Clearance</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.groundClearance} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.wheelbase && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Wheelbase</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.wheelbase} mm
                      </span>
                    </div>
                  )}
                  {motorcycle.overallLength && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Length x Width x Height</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.overallLength} x {motorcycle.overallWidth} x {motorcycle.overallHeight} mm
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features & Equipment */}
            {(motorcycle.instrumentConsole || motorcycle.headlightType || motorcycle.drl || motorcycle.connectivity) && (
              <Card>
                <CardHeader>
                  <CardTitle>Features & Equipment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {motorcycle.instrumentConsole && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Instrument Console</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.instrumentConsole}
                      </span>
                    </div>
                  )}
                  {motorcycle.headlightType && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Headlight</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.headlightType}{motorcycle.drl && ' with DRL'}
                      </span>
                    </div>
                  )}
                  {motorcycle.connectivity && (
                    <div className="flex justify-between items-start">
                      <Badge variant="outline">Connectivity</Badge>
                      <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                        {motorcycle.connectivity}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Pricing */}
          {motorcycle.exShowroomPrice && (
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  ৳ {parseInt(motorcycle.exShowroomPrice).toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Ex-showroom price</p>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1">
              View Reviews
            </Button>
            <Button variant="outline" className="flex-1">
              Compare Models
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
