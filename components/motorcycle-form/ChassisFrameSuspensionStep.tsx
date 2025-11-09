import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

interface ChassisFrameSuspensionStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function ChassisFrameSuspensionStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: ChassisFrameSuspensionStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Chassis, Frame & Suspension</h2>
        <p className="text-muted-foreground">Frame design, swingarm, and suspension specifications</p>
      </div>

      {/* 6.1 Frame & Chassis */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6.1 Frame & Chassis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="frameType">Frame Type</Label>
            <Input
              id="frameType"
              placeholder="e.g., Diamond, Perimeter, Trellis"
              value={formData.frameType}
              onChange={(e) => setFormData({ ...formData, frameType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="swingarmType">Swingarm Type</Label>
            <Input
              id="swingarmType"
              placeholder="e.g., Single-sided, Double-sided"
              value={formData.swingarmType}
              onChange={(e) => setFormData({ ...formData, swingarmType: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 6.2 Suspension System */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6.2 Suspension System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="frontSuspension">Front Suspension</Label>
            <Input
              id="frontSuspension"
              placeholder="e.g., Telescopic Fork, USD Fork"
              value={formData.frontSuspension}
              onChange={(e) => setFormData({ ...formData, frontSuspension: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rearSuspension">Rear Suspension</Label>
            <Input
              id="rearSuspension"
              placeholder="e.g., Monoshock, Twin Shock"
              value={formData.rearSuspension}
              onChange={(e) => setFormData({ ...formData, rearSuspension: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspensionTravelFront">Front Suspension Travel (mm)</Label>
            <Input
              id="suspensionTravelFront"
              placeholder="e.g., 130"
              value={formData.suspensionTravelFront}
              onChange={(e) => setFormData({ ...formData, suspensionTravelFront: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suspensionTravelRear">Rear Suspension Travel (mm)</Label>
            <Input
              id="suspensionTravelRear"
              placeholder="e.g., 120"
              value={formData.suspensionTravelRear}
              onChange={(e) => setFormData({ ...formData, suspensionTravelRear: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 6.3 Steering & Handling */}
      <div>
        <h3 className="text-lg font-semibold mb-4">6.3 Steering & Handling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="steeringAngle">Steering Angle (°)</Label>
            <Input
              id="steeringAngle"
              placeholder="e.g., 35"
              value={formData.steeringAngle}
              onChange={(e) => setFormData({ ...formData, steeringAngle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="turningRadius">Turning Radius (m)</Label>
            <Input
              id="turningRadius"
              placeholder="e.g., 2.5"
              value={formData.turningRadius}
              onChange={(e) => setFormData({ ...formData, turningRadius: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Chassis Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/chassis`)}
          currentImages={stepImages}
          onUpload={(urls) => setStepImages([...stepImages, ...urls])}
          onRemove={(url) => setStepImages(stepImages.filter((img: string) => img !== url))}
          multiple={true}
          maxFiles={10}
        />
      </div>
    </div>
  )
}