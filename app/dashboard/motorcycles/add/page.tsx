'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Eye, Upload } from 'lucide-react'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import BasicInformationStep from '@/components/motorcycle-form/BasicInformationStep'
import EngineSpecificationsStep from '@/components/motorcycle-form/EngineSpecificationsStep'
import PerformanceMetricsStep from '@/components/motorcycle-form/PerformanceMetricsStep'
import TransmissionDriveStep from '@/components/motorcycle-form/TransmissionDriveStep'
import ElectronicsControlStep from '@/components/motorcycle-form/ElectronicsControlStep'
import ChassisFrameSuspensionStep from '@/components/motorcycle-form/ChassisFrameSuspensionStep'
import BrakesWheelsTyresStep from '@/components/motorcycle-form/BrakesWheelsTyresStep'
import DimensionsWeightStep from '@/components/motorcycle-form/DimensionsWeightStep'
import FeaturesEquipmentStep from '@/components/motorcycle-form/FeaturesEquipmentStep'
import PricingMarketDataStep from '@/components/motorcycle-form/PricingMarketDataStep'
import ColorOptionsStep from '@/components/motorcycle-form/ColorOptionsStep'
import AdditionalInformationStep from '@/components/motorcycle-form/AdditionalInformationStep'
import { createMotorcycle } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'

export default function AddMotorcyclePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  
  const [formData, setFormData] = useState<MotorcycleFormData>({
    // 1️⃣ BASIC INFORMATION
    brand: '',
    modelName: '',
    variantName: '',
    modelYear: '',
    category: '',
    segment: '',
    originCountry: '',
    assemblyCountry: '',
    status: 'draft',
    coverImage: '',
    galleryImages: [],
    modelVideo: '',
    stepImages: {
      step1: [],
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      step6: [],
      step7: [],
      step8: [],
      step9: [],
      step10: [],
      step11: [],
      step12: []
    },
    
    // 2️⃣ ENGINE SPECIFICATIONS
    engineType: '',
    displacement: '',
    cylinderCount: '',
    valveSystem: '',
    valvesPerCylinder: '',
    strokeType: '',
    boreXStroke: '',
    compressionRatio: '',
    fuelType: '',
    fuelSupplySystem: '',
    ignitionType: '',
    lubricationSystem: '',
    engineCoolingType: '',
    radiatorFanType: '',
    airFilterType: '',
    startType: '',
    idleStopSystem: false,
    
    // 3️⃣ PERFORMANCE METRICS
    maxPowerHP: '',
    maxPowerKW: '',
    maxPowerRPM: '',
    maxTorqueNm: '',
    maxTorqueRPM: '',
    powerToWeightRatio: '',
    topSpeed: '',
    acceleration0to60: '',
    acceleration0to100: '',
    mileage: '',
    range: '',
    revLimiter: '',
    engineRedline: '',
    ecoModeEfficiency: '',
    
    // 4️⃣ TRANSMISSION & DRIVE
    transmissionType: '',
    numberOfGears: '',
    gearRatio: '',
    clutchType: '',
    finalDriveType: '',
    shiftPattern: '',
    quickShifter: false,
    autoBlipper: false,
    gearIndicator: false,
    
    // 5️⃣ ELECTRONICS & CONTROL SYSTEMS
    emissionStandard: '',
    catalyticConverter: false,
    obd: '',
    fuelEconomyRideModes: '',
    fuelInjectionMapping: '',
    throttleResponse: '',
    absType: '',
    tractionControlSystem: false,
    launchControl: false,
    wheelieControl: false,
    cruiseControl: false,
    engineBrakingManagement: false,
    slipperClutchAssist: false,
    antiStallHillAssist: false,
    
    // 6️⃣ CHASSIS, FRAME & SUSPENSION
    frameType: '',
    swingarmType: '',
    frontSuspension: '',
    rearSuspension: '',
    suspensionTravelFront: '',
    suspensionTravelRear: '',
    steeringAngle: '',
    turningRadius: '',
    
    // 7️⃣ BRAKES, WHEELS & TYRES
    frontBrakeType: '',
    frontBrakeSize: '',
    rearBrakeType: '',
    rearBrakeSize: '',
    absSupport: '',
    brakeCaliperType: '',
    cbs: false,
    wheelType: '',
    frontTyreSize: '',
    rearTyreSize: '',
    tyreType: '',
    tyreBrand: '',
    wheelSizeFront: '',
    wheelSizeRear: '',
    
    // 8️⃣ DIMENSIONS & WEIGHT
    overallLength: '',
    overallWidth: '',
    overallHeight: '',
    wheelbase: '',
    groundClearance: '',
    seatHeight: '',
    kerbWeight: '',
    dryWeight: '',
    fuelTankCapacity: '',
    reserveFuelCapacity: '',
    loadCapacity: '',
    oilCapacity: '',
    batteryCapacity: '',
    centerOfGravityHeight: '',
    
    // 9️⃣ FEATURES & EQUIPMENT
    instrumentConsole: '',
    displaySize: '',
    connectivity: '',
    mobileAppIntegration: false,
    turnByTurnNavigation: false,
    ridingStatistics: false,
    headlightType: '',
    drl: false,
    tailLightType: '',
    indicatorType: '',
    adjustableWindshield: false,
    seatType: '',
    handleType: '',
    footpegPosition: '',
    sideStandEngineCutoff: false,
    tpms: false,
    keylessIgnition: false,
    immobilizer: false,
    centralLocking: false,
    sosCrashDetection: false,
    adjustableSuspension: false,
    ridingModes: false,
    warrantyYears: '',
    warrantyKm: '',
    freeServiceCount: '',
    serviceIntervalKm: '',
    serviceIntervalMonths: '',
    
    // 🔟 PRICING & MARKET DATA
    exShowroomPrice: '',
    onRoadPrice: '',
    currency: 'BDT',
    availability: '',
    launchDate: '',
    marketSegment: '',
    competitorModels: [],
    variants: [],
    
    // 1️⃣1️⃣ COLOR OPTIONS
    availableColors: [],
    colorImages: [], // This will be initialized as a 2D array in the ColorOptionsStep
    specialEditions: '',
    
    // 1️⃣2️⃣ ADDITIONAL INFORMATION
    description: '',
    keyHighlights: [],
    pros: [],
    cons: [],
    seoMetaTitle: '',
    seoMetaDescription: '',
    tags: [],
    relatedModels: [],
    adminNotes: '',
    
    // 1️⃣3️⃣ CRITIC & VALIDATION
    dataCompletionPercentage: 0,
    reviewStatus: 'Pending Critic',
    lastUpdatedBy: '',
    lastUpdatedDate: ''
  })

  // Check if user is Admin or Super Admin
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
    router.push('/dashboard')
    return null
  }

  const totalSteps = 13
  const completionPercentage = Math.round((currentStep / totalSteps) * 100)

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSaveDraft = async () => {
    if (!session?.user?.id) return
    
    setSaving(true)
    try {
      // TODO: Implement save draft functionality
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    console.log('Preview...', formData)
    alert('Preview feature coming soon!')
  }

  const handlePublish = async () => {
    if (!session?.user?.id) return
    
    // Validate required fields
    if (!formData.brand || !formData.modelName || !formData.modelYear) {
      alert('Please fill in all required fields (Brand, Model Name, Year)')
      return
    }
    
    if (formData.dataCompletionPercentage < 50) {
      const confirmed = confirm('Data completion is less than 50%. Do you want to continue publishing?')
      if (!confirmed) return
    }
    
    setPublishing(true)
    try {
      await createMotorcycle(formData, session.user.id)
      alert('Motorcycle published successfully!')
      router.push(`/dashboard/motorcycles`)
    } catch (error) {
      console.error('Error publishing motorcycle:', error)
      alert('Failed to publish motorcycle. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  // Helper function to get current step images
  const getCurrentStepImages = () => {
    if (currentStep >= 13) return [] // Step 13 has no images
    const stepKey = `step${currentStep}` as keyof typeof formData.stepImages
    return formData.stepImages[stepKey] || []
  }

  // Helper function to set current step images
  const setCurrentStepImages = (images: string[]) => {
    if (currentStep >= 13) return // Step 13 has no images
    const stepKey = `step${currentStep}` as keyof typeof formData.stepImages
    setFormData({
      ...formData,
      stepImages: {
        ...formData.stepImages,
        [stepKey]: images
      }
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Motorcycle</h1>
              <p className="text-gray-600">Complete all 13 sections to publish a motorcycle</p>
            </div>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            Step {currentStep} of {totalSteps}
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Steps */}
        <Card>
          <CardContent className="pt-6">
            {currentStep === 1 && (
              <BasicInformationStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 2 && (
              <EngineSpecificationsStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 3 && (
              <PerformanceMetricsStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 4 && (
              <TransmissionDriveStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 5 && (
              <ElectronicsControlStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 6 && (
              <ChassisFrameSuspensionStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 7 && (
              <BrakesWheelsTyresStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 8 && (
              <DimensionsWeightStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 9 && (
              <FeaturesEquipmentStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 10 && (
              <PricingMarketDataStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 11 && (
              <ColorOptionsStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 12 && (
              <AdditionalInformationStep
                formData={formData}
                setFormData={setFormData}
                stepImages={getCurrentStepImages()}
                setStepImages={setCurrentStepImages}
              />
            )}

            {currentStep === 13 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Review & Publish</h2>
                <p className="text-muted-foreground">
                  Review all information before publishing. You can go back to edit any section.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Brand:</span>
                        <span>{formData.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{formData.modelName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year:</span>
                        <span>{formData.modelYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span>{formData.category}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ex-Showroom Price:</span>
                        <span>৳ {formData.exShowroomPrice}</span>
                      </div>
                      {formData.onRoadPrice && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">On-Road Price:</span>
                          <span>৳ {formData.onRoadPrice}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={handlePrevious}>
                    Previous
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleSaveDraft} disabled={saving}>
                      <Save className="w-4 h-4 mr-2" />
                      {saving ? 'Saving...' : 'Save Draft'}
                    </Button>
                    <Button variant="outline" onClick={handlePreview}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={handlePublish} disabled={publishing} className="bg-black text-white hover:bg-gray-800">
                      <Upload className="w-4 h-4 mr-2" />
                      {publishing ? 'Publishing...' : 'Publish'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 13 && (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious} 
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              Next
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}