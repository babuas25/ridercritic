import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

interface FeaturesEquipmentStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function FeaturesEquipmentStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: FeaturesEquipmentStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Features & Equipment</h2>
        <p className="text-muted-foreground">Instrumentation, lighting, comfort, and safety features</p>
      </div>

      {/* 9.1 Instrumentation & Connectivity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">9.1 Instrumentation & Connectivity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instrumentConsole">Instrument Console Type</Label>
            <Input
              id="instrumentConsole"
              placeholder="e.g., TFT, LCD, Analog"
              value={formData.instrumentConsole}
              onChange={(e) => setFormData({ ...formData, instrumentConsole: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displaySize">Display Size (inch)</Label>
            <Input
              id="displaySize"
              placeholder="e.g., 4.3"
              value={formData.displaySize}
              onChange={(e) => setFormData({ ...formData, displaySize: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="connectivity">Connectivity Options</Label>
            <Input
              id="connectivity"
              placeholder="e.g., Bluetooth, USB, Wi-Fi"
              value={formData.connectivity}
              onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mobileAppIntegration"
              checked={formData.mobileAppIntegration}
              onChange={(e) => setFormData({ ...formData, mobileAppIntegration: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="mobileAppIntegration" className="font-normal cursor-pointer">
              Mobile App Integration
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="turnByTurnNavigation"
              checked={formData.turnByTurnNavigation}
              onChange={(e) => setFormData({ ...formData, turnByTurnNavigation: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="turnByTurnNavigation" className="font-normal cursor-pointer">
              Turn-by-Turn Navigation
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ridingStatistics"
              checked={formData.ridingStatistics}
              onChange={(e) => setFormData({ ...formData, ridingStatistics: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="ridingStatistics" className="font-normal cursor-pointer">
              Riding Statistics / Trip Computer
            </Label>
          </div>
        </div>
      </div>

      {/* 9.2 Lighting & Comfort */}
      <div>
        <h3 className="text-lg font-semibold mb-4">9.2 Lighting & Comfort</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="headlightType">Headlight Type</Label>
            <Select value={formData.headlightType} onValueChange={(value) => setFormData({ ...formData, headlightType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select headlight type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="halogen">Halogen</SelectItem>
                <SelectItem value="xenon">Xenon</SelectItem>
                <SelectItem value="laser">Laser</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="drl"
              checked={formData.drl}
              onChange={(e) => setFormData({ ...formData, drl: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="drl" className="font-normal cursor-pointer">
              DRL (Daytime Running Lights)
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tailLightType">Tail Light Type</Label>
            <Select value={formData.tailLightType} onValueChange={(value) => setFormData({ ...formData, tailLightType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select tail light type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="halogen">Halogen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicatorType">Indicator Type</Label>
            <Select value={formData.indicatorType} onValueChange={(value) => setFormData({ ...formData, indicatorType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select indicator type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="halogen">Halogen</SelectItem>
                <SelectItem value="lens">Lens</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adjustableWindshield"
              checked={formData.adjustableWindshield}
              onChange={(e) => setFormData({ ...formData, adjustableWindshield: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="adjustableWindshield" className="font-normal cursor-pointer">
              Adjustable Windshield
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seatType">Seat Type</Label>
            <Input
              id="seatType"
              placeholder="e.g., Single, Dual, Split"
              value={formData.seatType}
              onChange={(e) => setFormData({ ...formData, seatType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handleType">Handle Type</Label>
            <Input
              id="handleType"
              placeholder="e.g., Clip-on, Wide, Touring"
              value={formData.handleType}
              onChange={(e) => setFormData({ ...formData, handleType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footpegPosition">Footpeg Position</Label>
            <Input
              id="footpegPosition"
              placeholder="e.g., Mid-mounted, Rear-set"
              value={formData.footpegPosition}
              onChange={(e) => setFormData({ ...formData, footpegPosition: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 9.3 Safety & Assist */}
      <div>
        <h3 className="text-lg font-semibold mb-4">9.3 Safety & Assist</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sideStandEngineCutoff"
              checked={formData.sideStandEngineCutoff}
              onChange={(e) => setFormData({ ...formData, sideStandEngineCutoff: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="sideStandEngineCutoff" className="font-normal cursor-pointer">
              Side Stand Engine Cut-off
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tpms"
              checked={formData.tpms}
              onChange={(e) => setFormData({ ...formData, tpms: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="tpms" className="font-normal cursor-pointer">
              TPMS (Tyre Pressure Monitoring System)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="keylessIgnition"
              checked={formData.keylessIgnition}
              onChange={(e) => setFormData({ ...formData, keylessIgnition: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="keylessIgnition" className="font-normal cursor-pointer">
              Keyless Ignition
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="immobilizer"
              checked={formData.immobilizer}
              onChange={(e) => setFormData({ ...formData, immobilizer: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="immobilizer" className="font-normal cursor-pointer">
              Immobilizer
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="centralLocking"
              checked={formData.centralLocking}
              onChange={(e) => setFormData({ ...formData, centralLocking: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="centralLocking" className="font-normal cursor-pointer">
              Central Locking
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="sosCrashDetection"
              checked={formData.sosCrashDetection}
              onChange={(e) => setFormData({ ...formData, sosCrashDetection: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="sosCrashDetection" className="font-normal cursor-pointer">
              SOS / Crash Detection
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="adjustableSuspension"
              checked={formData.adjustableSuspension}
              onChange={(e) => setFormData({ ...formData, adjustableSuspension: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="adjustableSuspension" className="font-normal cursor-pointer">
              Adjustable Suspension
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="ridingModes"
              checked={formData.ridingModes}
              onChange={(e) => setFormData({ ...formData, ridingModes: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="ridingModes" className="font-normal cursor-pointer">
              Multiple Riding Modes
            </Label>
          </div>
        </div>
      </div>

      {/* 9.4 Warranty & Service */}
      <div>
        <h3 className="text-lg font-semibold mb-4">9.4 Warranty & Service</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="warrantyYears">Warranty (Years)</Label>
            <Input
              id="warrantyYears"
              placeholder="e.g., 2"
              value={formData.warrantyYears}
              onChange={(e) => setFormData({ ...formData, warrantyYears: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="warrantyKm">Warranty (km)</Label>
            <Input
              id="warrantyKm"
              placeholder="e.g., 30000"
              value={formData.warrantyKm}
              onChange={(e) => setFormData({ ...formData, warrantyKm: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="freeServiceCount">Free Service Count</Label>
            <Input
              id="freeServiceCount"
              placeholder="e.g., 3"
              value={formData.freeServiceCount}
              onChange={(e) => setFormData({ ...formData, freeServiceCount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceIntervalKm">Service Interval (km)</Label>
            <Input
              id="serviceIntervalKm"
              placeholder="e.g., 6000"
              value={formData.serviceIntervalKm}
              onChange={(e) => setFormData({ ...formData, serviceIntervalKm: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceIntervalMonths">Service Interval (months)</Label>
            <Input
              id="serviceIntervalMonths"
              placeholder="e.g., 6"
              value={formData.serviceIntervalMonths}
              onChange={(e) => setFormData({ ...formData, serviceIntervalMonths: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Feature Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/features`)}
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