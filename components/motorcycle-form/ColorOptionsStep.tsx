import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { Plus, Trash2 } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

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
  const [newColor, setNewColor] = useState('')

  const addColor = () => {
    if (newColor.trim()) {
      setFormData({ 
        ...formData, 
        availableColors: [...formData.availableColors, newColor.trim()] 
      })
      setNewColor('')
    }
  }

  const removeColor = (index: number) => {
    setFormData({ 
      ...formData, 
      availableColors: formData.availableColors.filter((_, i) => i !== index) 
    })
  }

  // Ensure colorImages is properly initialized as a 2D array
  const getColorImages = (index: number): string[] => {
    if (!formData.colorImages || !Array.isArray(formData.colorImages)) {
      return []
    }
    
    const colorImage = formData.colorImages[index]
    if (!colorImage) {
      return []
    }
    
    // If colorImage is already an array, return it
    if (Array.isArray(colorImage)) {
      return colorImage
    }
    
    // If colorImage is a string, return it as a single-item array
    if (typeof colorImage === 'string') {
      return [colorImage]
    }
    
    // Otherwise return empty array
    return []
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Color Options</h2>
        <p className="text-muted-foreground">Available colors and color-specific images</p>
      </div>

      {/* Available Colors */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a color (e.g., Matte Black, Pearl White)"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addColor()}
            className="flex-1"
          />
          <Button type="button" onClick={addColor} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        {formData.availableColors.length > 0 && (
          <div className="space-y-3">
            {formData.availableColors.map((color, index) => (
              <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.toLowerCase() }} />
                <span className="flex-1">{color}</span>
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
        )}
      </div>

      {/* Color Images */}
      <div className="space-y-4">
        <Label>Color-Specific Images</Label>
        {formData.availableColors.length > 0 ? (
          <div className="space-y-4">
            {formData.availableColors.map((color, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full border" style={{ backgroundColor: color.toLowerCase() }} />
                  {color} Images
                </h4>
                <ImageUploader
                  storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/colors/${color.toLowerCase().replace(/\s+/g, '-')}`)}
                  currentImages={getColorImages(index)}
                  onUpload={(urls) => {
                    const updatedColorImages = [...formData.colorImages]
                    // Ensure the index exists and is an array
                    if (!updatedColorImages[index]) {
                      updatedColorImages[index] = []
                    } else if (!Array.isArray(updatedColorImages[index])) {
                      updatedColorImages[index] = []
                    }
                    updatedColorImages[index] = [...updatedColorImages[index], ...urls]
                    setFormData({ ...formData, colorImages: updatedColorImages })
                  }}
                  onRemove={(url) => {
                    const updatedColorImages = [...formData.colorImages]
                    if (updatedColorImages[index] && Array.isArray(updatedColorImages[index])) {
                      updatedColorImages[index] = updatedColorImages[index].filter((img: string) => img !== url)
                      setFormData({ ...formData, colorImages: updatedColorImages })
                    }
                  }}
                  multiple={true}
                  maxFiles={5}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">Add colors first to upload color-specific images</p>
        )}
      </div>

      {/* General Color Images */}
      <div className="space-y-2">
        <Label>Upload General Color Images (Optional)</Label>
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/colors/general`)}
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