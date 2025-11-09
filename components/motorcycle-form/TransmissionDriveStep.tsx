import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

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
        <p className="text-muted-foreground">Gearbox, clutch, and final drive specifications</p>
      </div>

      {/* 4.1 Transmission System */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4.1 Transmission System</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="transmissionType">Transmission Type</Label>
            <Select value={formData.transmissionType} onValueChange={(value) => setFormData({ ...formData, transmissionType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select transmission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="cvt">CVT</SelectItem>
                <SelectItem value="dct">DCT (Dual Clutch)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfGears">Number of Gears *</Label>
            <Input
              id="numberOfGears"
              placeholder="e.g., 5"
              value={formData.numberOfGears}
              onChange={(e) => setFormData({ ...formData, numberOfGears: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gearRatio">Gear Ratio (Primary)</Label>
            <Input
              id="gearRatio"
              placeholder="e.g., 2.750"
              value={formData.gearRatio}
              onChange={(e) => setFormData({ ...formData, gearRatio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clutchType">Clutch Type</Label>
            <Select value={formData.clutchType} onValueChange={(value) => setFormData({ ...formData, clutchType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select clutch type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wet-multiplate">Wet Multiplate</SelectItem>
                <SelectItem value="dry-multiplate">Dry Multiplate</SelectItem>
                <SelectItem value="cable">Cable</SelectItem>
                <SelectItem value="hydraulic">Hydraulic</SelectItem>
                <SelectItem value="sliding">Sliding Mesh</SelectItem>
                <SelectItem value="constant-mesh">Constant Mesh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="shiftPattern">Shift Pattern</Label>
            <Input
              id="shiftPattern"
              placeholder="e.g., 1-N-2-3-4-5"
              value={formData.shiftPattern}
              onChange={(e) => setFormData({ ...formData, shiftPattern: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 4.2 Final Drive & Assist */}
      <div>
        <h3 className="text-lg font-semibold mb-4">4.2 Final Drive & Assist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="quickShifter"
              checked={formData.quickShifter}
              onChange={(e) => setFormData({ ...formData, quickShifter: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="quickShifter" className="font-normal cursor-pointer">
              Quick Shifter (Up/Down)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
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

          <div className="flex items-center space-x-2">
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
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Transmission Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/transmission`)}
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