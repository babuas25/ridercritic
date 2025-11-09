import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

interface DimensionsWeightStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function DimensionsWeightStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: DimensionsWeightStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Dimensions & Weight</h2>
        <p className="text-muted-foreground">Physical dimensions and weight specifications</p>
      </div>

      {/* 8.1 Physical Dimensions */}
      <div>
        <h3 className="text-lg font-semibold mb-4">8.1 Physical Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="overallLength">Overall Length (mm) *</Label>
            <Input
              id="overallLength"
              placeholder="e.g., 2000"
              value={formData.overallLength}
              onChange={(e) => setFormData({ ...formData, overallLength: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overallWidth">Overall Width (mm) *</Label>
            <Input
              id="overallWidth"
              placeholder="e.g., 800"
              value={formData.overallWidth}
              onChange={(e) => setFormData({ ...formData, overallWidth: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="overallHeight">Overall Height (mm) *</Label>
            <Input
              id="overallHeight"
              placeholder="e.g., 1100"
              value={formData.overallHeight}
              onChange={(e) => setFormData({ ...formData, overallHeight: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wheelbase">Wheelbase (mm) *</Label>
            <Input
              id="wheelbase"
              placeholder="e.g., 1350"
              value={formData.wheelbase}
              onChange={(e) => setFormData({ ...formData, wheelbase: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="groundClearance">Ground Clearance (mm) *</Label>
            <Input
              id="groundClearance"
              placeholder="e.g., 180"
              value={formData.groundClearance}
              onChange={(e) => setFormData({ ...formData, groundClearance: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seatHeight">Seat Height (mm) *</Label>
            <Input
              id="seatHeight"
              placeholder="e.g., 795"
              value={formData.seatHeight}
              onChange={(e) => setFormData({ ...formData, seatHeight: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 8.2 Weight Specifications */}
      <div>
        <h3 className="text-lg font-semibold mb-4">8.2 Weight Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="kerbWeight">Kerb Weight (kg) *</Label>
            <Input
              id="kerbWeight"
              placeholder="e.g., 145"
              value={formData.kerbWeight}
              onChange={(e) => setFormData({ ...formData, kerbWeight: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dryWeight">Dry Weight (kg)</Label>
            <Input
              id="dryWeight"
              placeholder="e.g., 135"
              value={formData.dryWeight}
              onChange={(e) => setFormData({ ...formData, dryWeight: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelTankCapacity">Fuel Tank Capacity (L) *</Label>
            <Input
              id="fuelTankCapacity"
              placeholder="e.g., 12"
              value={formData.fuelTankCapacity}
              onChange={(e) => setFormData({ ...formData, fuelTankCapacity: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reserveFuelCapacity">Reserve Fuel Capacity (L)</Label>
            <Input
              id="reserveFuelCapacity"
              placeholder="e.g., 2"
              value={formData.reserveFuelCapacity}
              onChange={(e) => setFormData({ ...formData, reserveFuelCapacity: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loadCapacity">Load Capacity (kg)</Label>
            <Input
              id="loadCapacity"
              placeholder="e.g., 150"
              value={formData.loadCapacity}
              onChange={(e) => setFormData({ ...formData, loadCapacity: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="oilCapacity">Engine Oil Capacity (L)</Label>
            <Input
              id="oilCapacity"
              placeholder="e.g., 1.2"
              value={formData.oilCapacity}
              onChange={(e) => setFormData({ ...formData, oilCapacity: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="batteryCapacity">Battery Capacity (Ah)</Label>
            <Input
              id="batteryCapacity"
              placeholder="e.g., 12"
              value={formData.batteryCapacity}
              onChange={(e) => setFormData({ ...formData, batteryCapacity: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="centerOfGravityHeight">Center of Gravity Height (mm)</Label>
            <Input
              id="centerOfGravityHeight"
              placeholder="e.g., 650"
              value={formData.centerOfGravityHeight}
              onChange={(e) => setFormData({ ...formData, centerOfGravityHeight: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Dimension Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/dimensions`)}
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