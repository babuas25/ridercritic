import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

interface BrakesWheelsTyresStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function BrakesWheelsTyresStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: BrakesWheelsTyresStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Brakes, Wheels & Tyres</h2>
        <p className="text-muted-foreground">Braking system and wheel configuration</p>
      </div>

      {/* 7.1 Braking System */}
      <div>
        <h3 className="text-lg font-semibold mb-4">7.1 Braking System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="frontBrakeType">Front Brake Type *</Label>
            <Select value={formData.frontBrakeType} onValueChange={(value) => setFormData({ ...formData, frontBrakeType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select brake type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disc">Disc</SelectItem>
                <SelectItem value="dual-disc">Dual Disc</SelectItem>
                <SelectItem value="drum">Drum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frontBrakeSize">Front Brake Size (mm)</Label>
            <Input
              id="frontBrakeSize"
              placeholder="e.g., 300"
              value={formData.frontBrakeSize}
              onChange={(e) => setFormData({ ...formData, frontBrakeSize: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rearBrakeType">Rear Brake Type *</Label>
            <Select value={formData.rearBrakeType} onValueChange={(value) => setFormData({ ...formData, rearBrakeType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select brake type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="disc">Disc</SelectItem>
                <SelectItem value="drum">Drum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rearBrakeSize">Rear Brake Size (mm)</Label>
            <Input
              id="rearBrakeSize"
              placeholder="e.g., 220"
              value={formData.rearBrakeSize}
              onChange={(e) => setFormData({ ...formData, rearBrakeSize: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="absSupport">ABS Support</Label>
            <Select value={formData.absSupport} onValueChange={(value) => setFormData({ ...formData, absSupport: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ABS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="optional">Optional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="brakeCaliperType">Brake Caliper Type</Label>
            <Input
              id="brakeCaliperType"
              placeholder="e.g., Radial, Axial"
              value={formData.brakeCaliperType}
              onChange={(e) => setFormData({ ...formData, brakeCaliperType: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <input
              type="checkbox"
              id="cbs"
              checked={formData.cbs}
              onChange={(e) => setFormData({ ...formData, cbs: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="cbs" className="font-normal cursor-pointer">
              CBS (Combined Braking System)
            </Label>
          </div>
        </div>
      </div>

      {/* 7.2 Wheel & Tyre Setup */}
      <div>
        <h3 className="text-lg font-semibold mb-4">7.2 Wheel & Tyre Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="wheelType">Wheel Type *</Label>
            <Select value={formData.wheelType} onValueChange={(value) => setFormData({ ...formData, wheelType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select wheel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alloy">Alloy</SelectItem>
                <SelectItem value="spoke">Spoke</SelectItem>
                <SelectItem value="cast">Cast</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frontTyreSize">Front Tyre Size</Label>
            <Input
              id="frontTyreSize"
              placeholder="e.g., 110/70-17"
              value={formData.frontTyreSize}
              onChange={(e) => setFormData({ ...formData, frontTyreSize: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rearTyreSize">Rear Tyre Size</Label>
            <Input
              id="rearTyreSize"
              placeholder="e.g., 150/60-17"
              value={formData.rearTyreSize}
              onChange={(e) => setFormData({ ...formData, rearTyreSize: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tyreType">Tyre Type</Label>
            <Select value={formData.tyreType} onValueChange={(value) => setFormData({ ...formData, tyreType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select tyre type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tubeless">Tubeless</SelectItem>
                <SelectItem value="tube">Tube Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tyreBrand">Tyre Brand</Label>
            <Input
              id="tyreBrand"
              placeholder="e.g., MRF, CEAT, Michelin"
              value={formData.tyreBrand}
              onChange={(e) => setFormData({ ...formData, tyreBrand: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wheelSizeFront">Front Wheel Size (inches)</Label>
            <Input
              id="wheelSizeFront"
              placeholder="e.g., 17"
              value={formData.wheelSizeFront}
              onChange={(e) => setFormData({ ...formData, wheelSizeFront: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="wheelSizeRear">Rear Wheel Size (inches)</Label>
            <Input
              id="wheelSizeRear"
              placeholder="e.g., 17"
              value={formData.wheelSizeRear}
              onChange={(e) => setFormData({ ...formData, wheelSizeRear: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Brake & Wheel Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Brake calipers, discs, wheels, tyres</p>
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
