import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

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
        <p className="text-muted-foreground">Main frame and damping configuration</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="frameType">Frame Type *</Label>
          <Select value={formData.frameType} onValueChange={(value) => setFormData({ ...formData, frameType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select frame type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="deltabox">Deltabox</SelectItem>
              <SelectItem value="diamond">Diamond</SelectItem>
              <SelectItem value="trellis">Trellis</SelectItem>
              <SelectItem value="perimeter">Perimeter</SelectItem>
              <SelectItem value="tubular">Steel Tubular</SelectItem>
              <SelectItem value="backbone">Backbone</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="swingarmType">Swingarm Type</Label>
          <Select value={formData.swingarmType} onValueChange={(value) => setFormData({ ...formData, swingarmType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select swingarm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aluminum">Aluminum</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="cast">Cast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="frontSuspension">Front Suspension *</Label>
          <Input
            id="frontSuspension"
            placeholder="e.g., USD Forks, 37mm"
            value={formData.frontSuspension}
            onChange={(e) => setFormData({ ...formData, frontSuspension: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rearSuspension">Rear Suspension *</Label>
          <Input
            id="rearSuspension"
            placeholder="e.g., Monoshock"
            value={formData.rearSuspension}
            onChange={(e) => setFormData({ ...formData, rearSuspension: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="suspensionTravelFront">Suspension Travel Front (mm)</Label>
          <Input
            id="suspensionTravelFront"
            placeholder="e.g., 130"
            value={formData.suspensionTravelFront}
            onChange={(e) => setFormData({ ...formData, suspensionTravelFront: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="suspensionTravelRear">Suspension Travel Rear (mm)</Label>
          <Input
            id="suspensionTravelRear"
            placeholder="e.g., 120"
            value={formData.suspensionTravelRear}
            onChange={(e) => setFormData({ ...formData, suspensionTravelRear: e.target.value })}
          />
        </div>

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

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Chassis Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Frame, swingarm, suspension components</p>
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
