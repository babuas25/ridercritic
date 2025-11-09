import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

interface ElectronicsControlStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function ElectronicsControlStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: ElectronicsControlStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Electronics & Control Systems</h2>
        <p className="text-muted-foreground">Emission standards, fuel systems, and electronic controls</p>
      </div>

      {/* 5.1 Emission & Fuel Systems */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5.1 Emission & Fuel Systems</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="emissionStandard">Emission Standard</Label>
            <Select value={formData.emissionStandard} onValueChange={(value) => setFormData({ ...formData, emissionStandard: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select emission standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bs4">BS4</SelectItem>
                <SelectItem value="bs6">BS6</SelectItem>
                <SelectItem value="euro3">Euro 3</SelectItem>
                <SelectItem value="euro4">Euro 4</SelectItem>
                <SelectItem value="euro5">Euro 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="catalyticConverter"
              checked={formData.catalyticConverter}
              onChange={(e) => setFormData({ ...formData, catalyticConverter: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="catalyticConverter" className="font-normal cursor-pointer">
              Catalytic Converter
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="obd">OBD (On-Board Diagnostics)</Label>
            <Input
              id="obd"
              placeholder="e.g., OBD-II, None"
              value={formData.obd}
              onChange={(e) => setFormData({ ...formData, obd: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 5.2 Fuel Economy & Ride Modes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5.2 Fuel Economy & Ride Modes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fuelEconomyRideModes">Fuel Economy / Ride Modes</Label>
            <Input
              id="fuelEconomyRideModes"
              placeholder="e.g., Eco, Sport, Rain"
              value={formData.fuelEconomyRideModes}
              onChange={(e) => setFormData({ ...formData, fuelEconomyRideModes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelInjectionMapping">Fuel Injection Mapping</Label>
            <Input
              id="fuelInjectionMapping"
              placeholder="e.g., Multi-point, Sequential"
              value={formData.fuelInjectionMapping}
              onChange={(e) => setFormData({ ...formData, fuelInjectionMapping: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="throttleResponse">Throttle Response</Label>
            <Input
              id="throttleResponse"
              placeholder="e.g., Ride-by-Wire, Cable"
              value={formData.throttleResponse}
              onChange={(e) => setFormData({ ...formData, throttleResponse: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 5.3 Braking Electronics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5.3 Braking Electronics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="absType">ABS Type</Label>
            <Select value={formData.absType} onValueChange={(value) => setFormData({ ...formData, absType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ABS type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-channel">Single Channel</SelectItem>
                <SelectItem value="dual-channel">Dual Channel</SelectItem>
                <SelectItem value="cornering">Cornering ABS</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="tractionControlSystem"
              checked={formData.tractionControlSystem}
              onChange={(e) => setFormData({ ...formData, tractionControlSystem: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="tractionControlSystem" className="font-normal cursor-pointer">
              Traction Control System (TCS)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="launchControl"
              checked={formData.launchControl}
              onChange={(e) => setFormData({ ...formData, launchControl: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="launchControl" className="font-normal cursor-pointer">
              Launch Control
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="wheelieControl"
              checked={formData.wheelieControl}
              onChange={(e) => setFormData({ ...formData, wheelieControl: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="wheelieControl" className="font-normal cursor-pointer">
              Wheelie Control
            </Label>
          </div>
        </div>
      </div>

      {/* 5.4 Ride Assistance */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5.4 Ride Assistance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="cruiseControl"
              checked={formData.cruiseControl}
              onChange={(e) => setFormData({ ...formData, cruiseControl: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="cruiseControl" className="font-normal cursor-pointer">
              Cruise Control
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="engineBrakingManagement"
              checked={formData.engineBrakingManagement}
              onChange={(e) => setFormData({ ...formData, engineBrakingManagement: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="engineBrakingManagement" className="font-normal cursor-pointer">
              Engine Braking Management
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="slipperClutchAssist"
              checked={formData.slipperClutchAssist}
              onChange={(e) => setFormData({ ...formData, slipperClutchAssist: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="slipperClutchAssist" className="font-normal cursor-pointer">
              Slipper Clutch Assist
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="antiStallHillAssist"
              checked={formData.antiStallHillAssist}
              onChange={(e) => setFormData({ ...formData, antiStallHillAssist: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="antiStallHillAssist" className="font-normal cursor-pointer">
              Anti-Stall / Hill Assist
            </Label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Electronics Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/electronics`)}
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