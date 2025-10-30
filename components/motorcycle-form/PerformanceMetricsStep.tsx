import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

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
  // Auto-calculate power-to-weight ratio
  const calculatePowerToWeight = () => {
    const power = parseFloat(formData.maxPowerHP)
    const weight = parseFloat(formData.kerbWeight)
    if (power && weight) {
      return (power / weight).toFixed(3)
    }
    return '—'
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Performance Metrics</h2>
        <p className="text-muted-foreground">Power, torque, speed, and efficiency data</p>
      </div>

      {/* 3.1 Engine Output */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3.1 Engine Output</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="maxPowerHP">Max Power (HP)</Label>
            <Input
              id="maxPowerHP"
              placeholder="e.g., 18.6"
              value={formData.maxPowerHP}
              onChange={(e) => setFormData({ ...formData, maxPowerHP: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPowerKW">Max Power (kW)</Label>
            <Input
              id="maxPowerKW"
              placeholder="e.g., 13.8"
              value={formData.maxPowerKW}
              onChange={(e) => setFormData({ ...formData, maxPowerKW: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxPowerRPM">Max Power @ RPM</Label>
            <Input
              id="maxPowerRPM"
              placeholder="e.g., 10000"
              value={formData.maxPowerRPM}
              onChange={(e) => setFormData({ ...formData, maxPowerRPM: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTorqueNm">Max Torque (Nm)</Label>
            <Input
              id="maxTorqueNm"
              placeholder="e.g., 14.1"
              value={formData.maxTorqueNm}
              onChange={(e) => setFormData({ ...formData, maxTorqueNm: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxTorqueRPM">Max Torque @ RPM</Label>
            <Input
              id="maxTorqueRPM"
              placeholder="e.g., 7500"
              value={formData.maxTorqueRPM}
              onChange={(e) => setFormData({ ...formData, maxTorqueRPM: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Power-to-Weight Ratio (HP/kg)</Label>
            <Input
              value={calculatePowerToWeight()}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Auto-calculated from power & kerb weight</p>
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
              placeholder="e.g., 136"
              value={formData.topSpeed}
              onChange={(e) => setFormData({ ...formData, topSpeed: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceleration0to60">Acceleration 0-60 km/h (sec)</Label>
            <Input
              id="acceleration0to60"
              placeholder="e.g., 4.2"
              value={formData.acceleration0to60}
              onChange={(e) => setFormData({ ...formData, acceleration0to60: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="acceleration0to100">Acceleration 0-100 km/h (sec)</Label>
            <Input
              id="acceleration0to100"
              placeholder="e.g., 11.5"
              value={formData.acceleration0to100}
              onChange={(e) => setFormData({ ...formData, acceleration0to100: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">Mileage / Fuel Efficiency (km/l)</Label>
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
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Dyno charts, performance graphs, speed tests</p>
          <Button type="button" variant="outline" size="sm" className="mt-3">
            Choose Files
          </Button>
        </div>
        {stepImages.length > 0 && (
          <div className="grid grid-cols-4 gap-3 mt-3">
            {stepImages.map((img, index) => (
              <div key={index} className="relative border rounded-lg overflow-hidden group">
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <Bike className="w-8 h-8 text-gray-400" />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setStepImages(stepImages.filter((_, i) => i !== index))}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
