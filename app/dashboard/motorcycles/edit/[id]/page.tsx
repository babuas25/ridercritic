'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Save, Eye, Loader2 } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'
import { getMotorcycle, updateMotorcycle } from '@/lib/motorcycles'

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

export default function EditMotorcyclePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const motorcycleId = params?.id as string
  
  const [currentStep, setCurrentStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<MotorcycleFormData | null>(null)
  
  // Step-specific image states (for ImageUploader components)
  const [step1Images, setStep1Images] = useState<string[]>([])
  const [step2Images, setStep2Images] = useState<string[]>([])
  const [step3Images, setStep3Images] = useState<string[]>([])
  const [step4Images, setStep4Images] = useState<string[]>([])
  const [step5Images, setStep5Images] = useState<string[]>([])
  const [step6Images, setStep6Images] = useState<string[]>([])
  const [step7Images, setStep7Images] = useState<string[]>([])
  const [step8Images, setStep8Images] = useState<string[]>([])
  const [step9Images, setStep9Images] = useState<string[]>([])
  const [step10Images, setStep10Images] = useState<string[]>([])
  const [step11Images, setStep11Images] = useState<string[]>([])
  const [step12Images, setStep12Images] = useState<string[]>([])
  const [step13Images, setStep13Images] = useState<string[]>([])

  // Fetch motorcycle data on mount
  useEffect(() => {
    const fetchMotorcycleData = async () => {
      if (!motorcycleId) return
      
      try {
        setLoading(true)
        const data = await getMotorcycle(motorcycleId)
        if (data) {
          setFormData(data)
        } else {
          alert('Motorcycle not found')
          router.push('/dashboard/motorcycles')
        }
      } catch (error) {
        console.error('Error fetching motorcycle:', error)
        alert('Failed to load motorcycle data')
        router.push('/dashboard/motorcycles')
      } finally {
        setLoading(false)
      }
    }

    fetchMotorcycleData()
  }, [motorcycleId, router])

  // Redirect if not admin
  useEffect(() => {
    if (session && session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
      router.push('/dashboard')
    }
  }, [session, router])

  if (!session || loading || !formData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (session.user.role !== 'Admin' && session.user.role !== 'Super Admin') {
    return null
  }

  // Define all 13 steps
  const steps = [
    { number: 1, title: 'Basic Information', component: BasicInformationStep },
    { number: 2, title: 'Engine Specifications', component: EngineSpecificationsStep },
    { number: 3, title: 'Performance Metrics', component: PerformanceMetricsStep },
    { number: 4, title: 'Transmission & Drive', component: TransmissionDriveStep },
    { number: 5, title: 'Electronics & Control', component: ElectronicsControlStep },
    { number: 6, title: 'Chassis & Suspension', component: ChassisFrameSuspensionStep },
    { number: 7, title: 'Brakes, Wheels & Tyres', component: BrakesWheelsTyresStep },
    { number: 8, title: 'Dimensions & Weight', component: DimensionsWeightStep },
    { number: 9, title: 'Features & Equipment', component: FeaturesEquipmentStep },
    { number: 10, title: 'Pricing & Market Data', component: PricingMarketDataStep },
    { number: 11, title: 'Color Options', component: ColorOptionsStep },
    { number: 12, title: 'Additional Information', component: AdditionalInformationStep },
    { number: 13, title: 'Review & Validation', component: ReviewValidationStep }
  ]

  const totalSteps = steps.length
  const progress = (currentStep / totalSteps) * 100
  const CurrentStepComponent = steps[currentStep - 1].component

  // Step-specific image getters
  const getStepImages = (step: number) => {
    const imageStates = [
      step1Images, step2Images, step3Images, step4Images, step5Images,
      step6Images, step7Images, step8Images, step9Images, step10Images,
      step11Images, step12Images, step13Images
    ]
    return imageStates[step - 1]
  }

  const setStepImages = (step: number, images: string[]) => {
    const setters = [
      setStep1Images, setStep2Images, setStep3Images, setStep4Images, setStep5Images,
      setStep6Images, setStep7Images, setStep8Images, setStep9Images, setStep10Images,
      setStep11Images, setStep12Images, setStep13Images
    ]
    setters[step - 1](images)
  }

  // Navigation handlers
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

  // Save draft handler
  const handleSaveDraft = async () => {
    try {
      setSaving(true)
      await updateMotorcycle(motorcycleId, { ...formData, status: 'draft' }, session.user.id)
      alert('Draft saved successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  // Publish handler
  const handlePublish = async () => {
    try {
      setPublishing(true)
      
      // Validate required fields
      if (!formData.brand || !formData.modelName || !formData.modelYear || !formData.category) {
        alert('Please fill in all required fields (Brand, Model Name, Year, Category)')
        return
      }

      await updateMotorcycle(motorcycleId, { ...formData, status: 'published' }, session.user.id)
      alert('Motorcycle updated and published successfully!')
      router.push('/dashboard/motorcycles')
    } catch (error) {
      console.error('Error publishing motorcycle:', error)
      alert('Failed to publish motorcycle')
    } finally {
      setPublishing(false)
    }
  }

  // Preview handler
  const handlePreview = () => {
    alert('Preview feature coming soon!')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Motorcycle</h1>
              <p className="text-muted-foreground">Complete all 13 sections to update this motorcycle</p>
            </div>
          </div>
          <Badge variant="secondary">Step {currentStep} of {totalSteps}</Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step Form */}
        <Card>
          <CardContent className="p-8">
            <CurrentStepComponent
              formData={formData}
              setFormData={setFormData}
              stepImages={getStepImages(currentStep)}
              setStepImages={(images: string[]) => setStepImages(currentStep, images)}
            />
          </CardContent>
        </Card>

        {/* Navigation & Actions */}
        <div className="flex items-center justify-between pb-8">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handlePreview}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
            {currentStep === totalSteps ? (
              <Button onClick={handlePublish} disabled={publishing}>
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  'Publish Motorcycle'
                )}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
