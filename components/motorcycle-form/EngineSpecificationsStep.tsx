import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

interface EngineSpecificationsStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function EngineSpecificationsStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: EngineSpecificationsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Engine Specifications</h2>
        <p className="text-muted-foreground">Core mechanical specifications and architecture</p>
      </div>

      {/* 2.1 Engine Architecture */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2.1 Engine Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="engineType">Engine Type *</Label>
            <Select value={formData.engineType} onValueChange={(value) => setFormData({ ...formData, engineType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select engine type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single-cylinder</SelectItem>
                <SelectItem value="parallel-twin">Parallel Twin</SelectItem>
                <SelectItem value="v-twin">V-Twin</SelectItem>
                <SelectItem value="inline-3">Inline-3</SelectItem>
                <SelectItem value="inline-4">Inline-4</SelectItem>
                <SelectItem value="v4">V4</SelectItem>
                <SelectItem value="boxer">Boxer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displacement">Displacement (cc) *</Label>
            <Input
              id="displacement"
              type="number"
              placeholder="e.g., 155"
              value={formData.displacement}
              onChange={(e) => setFormData({ ...formData, displacement: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cylinderCount">Cylinder Count</Label>
            <Input
              id="cylinderCount"
              type="number"
              placeholder="e.g., 1, 2, 4"
              value={formData.cylinderCount}
              onChange={(e) => setFormData({ ...formData, cylinderCount: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valveSystem">Valve System</Label>
            <Select value={formData.valveSystem} onValueChange={(value) => setFormData({ ...formData, valveSystem: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select valve system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sohc">SOHC</SelectItem>
                <SelectItem value="dohc">DOHC</SelectItem>
                <SelectItem value="ohv">OHV</SelectItem>
                <SelectItem value="desmodromic">Desmodromic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valvesPerCylinder">Valves per Cylinder</Label>
            <Input
              id="valvesPerCylinder"
              type="number"
              placeholder="e.g., 2, 4"
              value={formData.valvesPerCylinder}
              onChange={(e) => setFormData({ ...formData, valvesPerCylinder: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="strokeType">Stroke Type</Label>
            <Select value={formData.strokeType} onValueChange={(value) => setFormData({ ...formData, strokeType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select stroke type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2-stroke">2-Stroke</SelectItem>
                <SelectItem value="4-stroke">4-Stroke</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="boreXStroke">Bore x Stroke (mm)</Label>
            <Input
              id="boreXStroke"
              placeholder="e.g., 58.0 x 58.7"
              value={formData.boreXStroke}
              onChange={(e) => setFormData({ ...formData, boreXStroke: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="compressionRatio">Compression Ratio</Label>
            <Input
              id="compressionRatio"
              placeholder="e.g., 11.6:1"
              value={formData.compressionRatio}
              onChange={(e) => setFormData({ ...formData, compressionRatio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type *</Label>
            <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="e10">E10 Compatible</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuelSupplySystem">Fuel Supply System</Label>
            <Select value={formData.fuelSupplySystem} onValueChange={(value) => setFormData({ ...formData, fuelSupplySystem: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select fuel supply" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fuel-injection">Fuel Injection</SelectItem>
                <SelectItem value="carburetor">Carburetor</SelectItem>
                <SelectItem value="throttle-body">Throttle Body</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ignitionType">Ignition Type</Label>
            <Select value={formData.ignitionType} onValueChange={(value) => setFormData({ ...formData, ignitionType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select ignition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tci">TCI</SelectItem>
                <SelectItem value="cdi">CDI</SelectItem>
                <SelectItem value="efi">EFI</SelectItem>
                <SelectItem value="digital">Digital</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lubricationSystem">Lubrication System</Label>
            <Select value={formData.lubricationSystem} onValueChange={(value) => setFormData({ ...formData, lubricationSystem: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select lubrication" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wet-sump">Wet Sump</SelectItem>
                <SelectItem value="dry-sump">Dry Sump</SelectItem>
                <SelectItem value="forced">Forced Lubrication</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="engineCoolingType">Engine Cooling Type *</Label>
            <Select value={formData.engineCoolingType} onValueChange={(value) => setFormData({ ...formData, engineCoolingType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select cooling" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="air">Air-cooled</SelectItem>
                <SelectItem value="liquid">Liquid-cooled</SelectItem>
                <SelectItem value="oil">Oil-cooled</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="radiatorFanType">Radiator / Fan Type</Label>
            <Input
              id="radiatorFanType"
              placeholder="e.g., Aluminum radiator with fan"
              value={formData.radiatorFanType}
              onChange={(e) => setFormData({ ...formData, radiatorFanType: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="airFilterType">Air Filter Type</Label>
            <Select value={formData.airFilterType} onValueChange={(value) => setFormData({ ...formData, airFilterType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select air filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="paper">Paper</SelectItem>
                <SelectItem value="foam">Foam</SelectItem>
                <SelectItem value="oil-bath">Oil Bath</SelectItem>
                <SelectItem value="washable">Washable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startType">Start Type</Label>
            <Select value={formData.startType} onValueChange={(value) => setFormData({ ...formData, startType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select start type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">Self Start</SelectItem>
                <SelectItem value="kick">Kick Start</SelectItem>
                <SelectItem value="both">Both</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2 pt-8">
            <input
              type="checkbox"
              id="idleStopSystem"
              checked={formData.idleStopSystem}
              onChange={(e) => setFormData({ ...formData, idleStopSystem: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="idleStopSystem" className="font-normal cursor-pointer">
              Idle Stop System
            </Label>
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Engine Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/engine`)}
          currentImages={stepImages}
          onUpload={(urls) => setStepImages([...stepImages, ...urls])}
          onRemove={(url) => setStepImages(stepImages.filter(img => img !== url))}
          multiple={true}
          maxFiles={10}
        />
      </div>
    </div>
  )
}
