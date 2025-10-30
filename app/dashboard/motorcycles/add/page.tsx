'use client'

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Save, Eye, Loader2 } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'
import { createMotorcycle, saveDraft } from '@/lib/motorcycles'

// Import all 13 modular step components
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
import ReviewValidationStep from '@/components/motorcycle-form/ReviewValidationStep'

export default function AddMotorcyclePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return null
  }
  
  // Initialize form data with all fields
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
    currency: 'INR',
    availability: '',
    launchDate: '',
    marketSegment: '',
    competitorModels: [],
    variants: [],
    
    // 1️⃣1️⃣ COLOR OPTIONS
    availableColors: [],
    colorImages: [],
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
    
    // 1️⃣3️⃣ REVIEW & VALIDATION
    dataCompletionPercentage: 0,
    reviewStatus: 'Pending Review',
    lastUpdatedBy: '',
    lastUpdatedDate: ''
  })

  // Initialize step images state for all 12 steps (step1-step12)
  const [stepImages, setStepImages] = useState<{
    step1: string[]
    step2: string[]
    step3: string[]
    step4: string[]
    step5: string[]
    step6: string[]
    step7: string[]
    step8: string[]
    step9: string[]
    step10: string[]
    step11: string[]
    step12: string[]
  }>({
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
      await saveDraft(formData, session.user.id)
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
    const stepKey = `step${currentStep}` as keyof typeof stepImages
    return stepImages[stepKey] || []
  }

  // Helper function to set current step images
  const setCurrentStepImages = (images: string[]) => {
    if (currentStep >= 13) return // Step 13 has no images
    const stepKey = `step${currentStep}` as keyof typeof stepImages
    setStepImages({ ...stepImages, [stepKey]: images })
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
              <ReviewValidationStep
                formData={formData}
                setFormData={setFormData}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  disabled={currentStep === totalSteps}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handlePreview} disabled={saving || publishing}>
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline" onClick={handleSaveDraft} disabled={saving || publishing}>
                  {saving ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" />Save Draft</>
                  )}
                </Button>
                <Button 
                  onClick={handlePublish} 
                  disabled={formData.dataCompletionPercentage < 80 || saving || publishing}
                >
                  {publishing ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Publishing...</>
                  ) : (
                    <>Publish Motorcycle</>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
