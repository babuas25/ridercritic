import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

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
        <p className="text-muted-foreground">Physical measurements and capacities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="overallLength">Overall Length (mm) *</Label>
          <Input
            id="overallLength"
            placeholder="e.g., 2050"
            value={formData.overallLength}
            onChange={(e) => setFormData({ ...formData, overallLength: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overallWidth">Overall Width (mm) *</Label>
          <Input
            id="overallWidth"
            placeholder="e.g., 780"
            value={formData.overallWidth}
            onChange={(e) => setFormData({ ...formData, overallWidth: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="overallHeight">Overall Height (mm) *</Label>
          <Input
            id="overallHeight"
            placeholder="e.g., 1065"
            value={formData.overallHeight}
            onChange={(e) => setFormData({ ...formData, overallHeight: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wheelbase">Wheelbase (mm) *</Label>
          <Input
            id="wheelbase"
            placeholder="e.g., 1353"
            value={formData.wheelbase}
            onChange={(e) => setFormData({ ...formData, wheelbase: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="groundClearance">Ground Clearance (mm) *</Label>
          <Input
            id="groundClearance"
            placeholder="e.g., 165"
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

        <div className="space-y-2">
          <Label htmlFor="kerbWeight">Kerb Weight (kg) *</Label>
          <Input
            id="kerbWeight"
            placeholder="e.g., 142"
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
          <Label htmlFor="fuelTankCapacity">Fuel Tank Capacity (litres) *</Label>
          <Input
            id="fuelTankCapacity"
            placeholder="e.g., 10"
            value={formData.fuelTankCapacity}
            onChange={(e) => setFormData({ ...formData, fuelTankCapacity: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reserveFuelCapacity">Reserve Fuel Capacity (litres)</Label>
          <Input
            id="reserveFuelCapacity"
            placeholder="e.g., 1.5"
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
          <Label htmlFor="centerOfGravityHeight">Center of Gravity Height (mm)</Label>
          <Input
            id="centerOfGravityHeight"
            placeholder="e.g., 500"
            value={formData.centerOfGravityHeight}
            onChange={(e) => setFormData({ ...formData, centerOfGravityHeight: e.target.value })}
          />
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Dimension Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Technical drawings, dimension diagrams</p>
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
