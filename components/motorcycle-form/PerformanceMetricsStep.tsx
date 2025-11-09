import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

interface PerformanceMetricsStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function PerformanceMetricsStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: PerformanceMetricsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Performance Metrics</h2>
        <p className="text-muted-foreground">Power output, torque, speed, and efficiency data</p>
      </div>

      {/* 3.1 Engine Output */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3.1 Engine Output</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxPowerHP">Max Power (HP) *</Label>
            <Input
              id="maxPowerHP"
              placeholder="e.g., 16.5"
              value={formData.maxPowerHP}
              onChange={(e) => setFormData({ ...formData, maxPowerHP: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPowerKW">Max Power (kW)</Label>
            <Input
              id="maxPowerKW"
              placeholder="e.g., 12.1"
              value={formData.maxPowerKW}
              onChange={(e) => setFormData({ ...formData, maxPowerKW: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPowerRPM">Max Power RPM *</Label>
            <Input
              id="maxPowerRPM"
              placeholder="e.g., 8500"
              value={formData.maxPowerRPM}
              onChange={(e) => setFormData({ ...formData, maxPowerRPM: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTorqueNm">Max Torque (Nm) *</Label>
            <Input
              id="maxTorqueNm"
              placeholder="e.g., 14.1"
              value={formData.maxTorqueNm}
              onChange={(e) => setFormData({ ...formData, maxTorqueNm: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTorqueRPM">Max Torque RPM *</Label>
            <Input
              id="maxTorqueRPM"
              placeholder="e.g., 6500"
              value={formData.maxTorqueRPM}
              onChange={(e) => setFormData({ ...formData, maxTorqueRPM: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="powerToWeightRatio">Power-to-Weight Ratio (HP/kg)</Label>
            <Input
              id="powerToWeightRatio"
              placeholder="e.g., 0.114"
              value={formData.powerToWeightRatio}
              onChange={(e) => setFormData({ ...formData, powerToWeightRatio: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 3.2 Speed & Efficiency */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3.2 Speed & Efficiency</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="topSpeed">Top Speed (km/h)</Label>
            <Input
              id="topSpeed"
              placeholder="e.g., 115"
              value={formData.topSpeed}
              onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceleration0to60">0-60 km/h (seconds)</Label>
            <Input
              id="acceleration0to60"
              placeholder="e.g., 4.2"
              value={formData.acceleration0to60}
              onChange={(e) => setFormData({ ...formData, acceleration0to60: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceleration0to100">0-100 km/h (seconds)</Label>
            <Input
              id="acceleration0to100"
              placeholder="e.g., 9.8"
              value={formData.acceleration0to100}
              onChange={(e) => setFormData({ ...formData, acceleration0to100: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage (km/l) *</Label>
            <Input
              id="mileage"
              placeholder="e.g., 45"
              value={formData.mileage}
              onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="range">Range (km)</Label>
            <Input
              id="range"
              placeholder="e.g., 450"
              value={formData.range}
              onChange={(e) => setFormData({ ...formData, range: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revLimiter">Rev Limiter (RPM)</Label>
            <Input
              id="revLimiter"
              placeholder="e.g., 11000"
              value={formData.revLimiter}
              onChange={(e) => setFormData({ ...formData, revLimiter: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="engineRedline">Engine Redline (RPM)</Label>
            <Input
              id="engineRedline"
              placeholder="e.g., 10500"
              value={formData.engineRedline}
              onChange={(e) => setFormData({ ...formData, engineRedline: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ecoModeEfficiency">Eco Mode Efficiency (km/l)</Label>
            <Input
              id="ecoModeEfficiency"
              placeholder="e.g., 55"
              value={formData.ecoModeEfficiency}
              onChange={(e) => setFormData({ ...formData, ecoModeEfficiency: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Performance Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/performance`)}
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