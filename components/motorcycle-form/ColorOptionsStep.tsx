import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X, Plus, Trash2 } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

interface ColorOptionsStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function ColorOptionsStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: ColorOptionsStepProps) {
  const addColor = () => {
    setFormData({ 
      ...formData, 
      availableColors: [...formData.availableColors, ''] 
    })
  }

  const removeColor = (index: number) => {
    setFormData({ 
      ...formData, 
      availableColors: formData.availableColors.filter((_, i) => i !== index) 
    })
  }

  const updateColor = (index: number, value: string) => {
    const updatedColors = formData.availableColors.map((color, i) => 
      i === index ? value : color
    )
    setFormData({ ...formData, availableColors: updatedColors })
  }

  const addColorImage = () => {
    setFormData({ 
      ...formData, 
      colorImages: [...formData.colorImages, ''] 
    })
  }

  const removeColorImage = (index: number) => {
    setFormData({ 
      ...formData, 
      colorImages: formData.colorImages.filter((_, i) => i !== index) 
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Color Options</h2>
        <p className="text-muted-foreground">Available colors and special editions</p>
      </div>

      {/* Available Colors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Available Colors *</Label>
          <Button type="button" onClick={addColor} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Color
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.availableColors.map((color, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., Matte Black, Pearl White"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeColor(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        {formData.availableColors.length === 0 && (
          <p className="text-sm text-gray-500">No colors added yet. Click "Add Color" to add colors.</p>
        )}
      </div>

      {/* Color Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Color Image URLs (Optional)</Label>
          <Button type="button" onClick={addColorImage} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Image URL
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {formData.colorImages.map((imageUrl, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="https://example.com/color-image.jpg"
                value={imageUrl}
                onChange={(e) => {
                  const updatedImages = formData.colorImages.map((img, i) => 
                    i === index ? e.target.value : img
                  )
                  setFormData({ ...formData, colorImages: updatedImages })
                }}
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeColorImage(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        {formData.colorImages.length === 0 && (
          <p className="text-sm text-gray-500">No color images added yet.</p>
        )}
      </div>

      {/* Special Editions */}
      <div className="space-y-2">
        <Label htmlFor="specialEditions">Special Editions / Limited Editions</Label>
        <Input
          id="specialEditions"
          placeholder="e.g., GP Edition, MotoGP Replica"
          value={formData.specialEditions}
          onChange={(e) => setFormData({ ...formData, specialEditions: e.target.value })}
        />
        <p className="text-xs text-gray-500">Separate multiple editions with commas</p>
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Color Variant Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Color swatches, color variants, special edition images</p>
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
