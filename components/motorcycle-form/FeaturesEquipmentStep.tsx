import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

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
        <p className="text-muted-foreground">Console, lighting, safety features, and warranty</p>
      </div>

      {/* 9.1 Console & Connectivity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">9.1 Console & Connectivity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instrumentConsole">Instrument Console *</Label>
            <Select value={formData.instrumentConsole} onValueChange={(value) => setFormData({ ...formData, instrumentConsole: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select console type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analog">Analog</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
                <SelectItem value="semi-digital">Semi-Digital</SelectItem>
                <SelectItem value="tft">TFT Display</SelectItem>
                <SelectItem value="lcd">LCD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displaySize">Display Size (inches)</Label>
            <Input
              id="displaySize"
              placeholder="e.g., 5"
              value={formData.displaySize}
              onChange={(e) => setFormData({ ...formData, displaySize: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="connectivity">Connectivity</Label>
            <Input
              id="connectivity"
              placeholder="e.g., Bluetooth, WiFi"
              value={formData.connectivity}
              onChange={(e) => setFormData({ ...formData, connectivity: e.target.value })}
            />
          </div>

          <div className="flex items-center space-x-2 pt-8">
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
              Riding Statistics
            </Label>
          </div>
        </div>
      </div>

      {/* 9.2 Lighting & Comfort */}
      <div>
        <h3 className="text-lg font-semibold mb-4">9.2 Lighting & Comfort</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="headlightType">Headlight Type *</Label>
            <Select value={formData.headlightType} onValueChange={(value) => setFormData({ ...formData, headlightType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select headlight type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="halogen">Halogen</SelectItem>
                <SelectItem value="projector">Projector LED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
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
                <SelectValue placeholder="Select tail light" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="bulb">Bulb</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="indicatorType">Indicator Type</Label>
            <Select value={formData.indicatorType} onValueChange={(value) => setFormData({ ...formData, indicatorType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select indicator" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="led">LED</SelectItem>
                <SelectItem value="bulb">Bulb</SelectItem>
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
              placeholder="e.g., Split, Single, Step-up"
              value={formData.seatType}
              onChange={(e) => setFormData({ ...formData, seatType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="handleType">Handle Type</Label>
            <Input
              id="handleType"
              placeholder="e.g., Flat, Raised, Clip-on"
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
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Console, display, lights, connectivity features</p>
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
