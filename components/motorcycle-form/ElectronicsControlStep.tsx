import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

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
        <p className="text-muted-foreground">Advanced riding aids and emission systems</p>
      </div>

      {/* 5.1 Emission */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5.1 Emission</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="emissionStandard">Emission Standard *</Label>
            <Select value={formData.emissionStandard} onValueChange={(value) => setFormData({ ...formData, emissionStandard: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select standard" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bs4">BS4</SelectItem>
                <SelectItem value="bs6">BS6</SelectItem>
                <SelectItem value="euro4">Euro 4</SelectItem>
                <SelectItem value="euro5">Euro 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
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
            <Label htmlFor="obd">OBD (Onboard Diagnostics)</Label>
            <Input
              id="obd"
              placeholder="e.g., OBD-II"
              value={formData.obd}
              onChange={(e) => setFormData({ ...formData, obd: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* 5.2 Ride Technology */}
      <div>
        <h3 className="text-lg font-semibold mb-4">5.2 Ride Technology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fuelEconomyRideModes">Fuel Economy / Ride Modes</Label>
            <Input
              id="fuelEconomyRideModes"
              placeholder="e.g., Eco, Sport, Track, Rain"
              value={formData.fuelEconomyRideModes}
              onChange={(e) => setFormData({ ...formData, fuelEconomyRideModes: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelInjectionMapping">Fuel Injection Mapping</Label>
            <Input
              id="fuelInjectionMapping"
              placeholder="e.g., Multiple ride modes"
              value={formData.fuelInjectionMapping}
              onChange={(e) => setFormData({ ...formData, fuelInjectionMapping: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="throttleResponse">Throttle Response</Label>
            <Select value={formData.throttleResponse} onValueChange={(value) => setFormData({ ...formData, throttleResponse: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select throttle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ride-by-wire">Ride-by-Wire</SelectItem>
                <SelectItem value="cable">Cable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="absType">ABS Type *</Label>
            <Select value={formData.absType} onValueChange={(value) => setFormData({ ...formData, absType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ABS type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="single">Single Channel</SelectItem>
                <SelectItem value="dual">Dual Channel</SelectItem>
                <SelectItem value="cornering">Cornering ABS</SelectItem>
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
              Slipper Clutch / Quick Shift Assist
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
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Dashboard, ride modes screen, TFT display</p>
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
