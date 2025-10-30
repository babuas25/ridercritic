import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

interface TransmissionDriveStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function TransmissionDriveStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: TransmissionDriveStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Transmission & Drive</h2>
        <p className="text-muted-foreground">Gearbox, drive type, and control systems</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="transmissionType">Transmission Type *</Label>
          <Select value={formData.transmissionType} onValueChange={(value) => setFormData({ ...formData, transmissionType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">Manual</SelectItem>
              <SelectItem value="automatic">Automatic</SelectItem>
              <SelectItem value="cvt">CVT</SelectItem>
              <SelectItem value="semi-auto">Semi-Automatic</SelectItem>
              <SelectItem value="dual-clutch">Dual Clutch (DCT)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numberOfGears">Number of Gears *</Label>
          <Input
            id="numberOfGears"
            type="number"
            placeholder="e.g., 6"
            value={formData.numberOfGears}
            onChange={(e) => setFormData({ ...formData, numberOfGears: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gearRatio">Gear Ratio (Full Table)</Label>
          <Input
            id="gearRatio"
            placeholder="e.g., 1st: 3.083, 2nd: 2.000, 3rd: 1.560..."
            value={formData.gearRatio}
            onChange={(e) => setFormData({ ...formData, gearRatio: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clutchType">Clutch Type</Label>
          <Select value={formData.clutchType} onValueChange={(value) => setFormData({ ...formData, clutchType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select clutch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="wet-multiplate">Wet Multi-Plate</SelectItem>
              <SelectItem value="slipper">Slipper</SelectItem>
              <SelectItem value="assist-slipper">Assist & Slipper</SelectItem>
              <SelectItem value="dry">Dry</SelectItem>
              <SelectItem value="hydraulic">Hydraulic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="finalDriveType">Final Drive Type</Label>
          <Select value={formData.finalDriveType} onValueChange={(value) => setFormData({ ...formData, finalDriveType: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select drive type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chain">Chain</SelectItem>
              <SelectItem value="belt">Belt</SelectItem>
              <SelectItem value="shaft">Shaft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shiftPattern">Shift Pattern</Label>
          <Input
            id="shiftPattern"
            placeholder="e.g., 1 Down, 5 Up"
            value={formData.shiftPattern}
            onChange={(e) => setFormData({ ...formData, shiftPattern: e.target.value })}
          />
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="quickShifter"
            checked={formData.quickShifter}
            onChange={(e) => setFormData({ ...formData, quickShifter: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="quickShifter" className="font-normal cursor-pointer">
            Quick Shifter
          </Label>
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="autoBlipper"
            checked={formData.autoBlipper}
            onChange={(e) => setFormData({ ...formData, autoBlipper: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="autoBlipper" className="font-normal cursor-pointer">
            Auto Blipper
          </Label>
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="gearIndicator"
            checked={formData.gearIndicator}
            onChange={(e) => setFormData({ ...formData, gearIndicator: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="gearIndicator" className="font-normal cursor-pointer">
            Gear Indicator
          </Label>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Transmission Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Gearbox, clutch, drive chain components</p>
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
