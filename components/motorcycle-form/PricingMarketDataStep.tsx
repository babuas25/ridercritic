import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X, Plus, Trash2 } from 'lucide-react'
import { MotorcycleFormData, VariantData } from '@/types/motorcycle'

interface PricingMarketDataStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function PricingMarketDataStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: PricingMarketDataStepProps) {
  const addVariant = () => {
    const newVariant: VariantData = {
      variantName: '',
      price: '',
      color: '',
      status: 'Available',
      specialFeatures: ''
    }
    setFormData({ ...formData, variants: [...formData.variants, newVariant] })
  }

  const removeVariant = (index: number) => {
    setFormData({ 
      ...formData, 
      variants: formData.variants.filter((_, i) => i !== index) 
    })
  }

  const updateVariant = (index: number, field: keyof VariantData, value: string) => {
    const updatedVariants = formData.variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    )
    setFormData({ ...formData, variants: updatedVariants })
  }

  const addCompetitorModel = () => {
    setFormData({ 
      ...formData, 
      competitorModels: [...formData.competitorModels, ''] 
    })
  }

  const removeCompetitorModel = (index: number) => {
    setFormData({ 
      ...formData, 
      competitorModels: formData.competitorModels.filter((_, i) => i !== index) 
    })
  }

  const updateCompetitorModel = (index: number, value: string) => {
    const updatedModels = formData.competitorModels.map((model, i) => 
      i === index ? value : model
    )
    setFormData({ ...formData, competitorModels: updatedModels })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Pricing & Market Data</h2>
        <p className="text-muted-foreground">Price, availability, and variant information</p>
      </div>

      {/* Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="exShowroomPrice">Ex-Showroom Price *</Label>
          <Input
            id="exShowroomPrice"
            placeholder="e.g., 149500"
            value={formData.exShowroomPrice}
            onChange={(e) => setFormData({ ...formData, exShowroomPrice: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="onRoadPrice">On-Road Price (Estimated)</Label>
          <Input
            id="onRoadPrice"
            placeholder="e.g., 165000"
            value={formData.onRoadPrice}
            onChange={(e) => setFormData({ ...formData, onRoadPrice: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency *</Label>
          <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="availability">Availability Status *</Label>
          <Select value={formData.availability} onValueChange={(value) => setFormData({ ...formData, availability: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="in-stock">In Stock</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="launchDate">Launch Date</Label>
          <Input
            id="launchDate"
            type="date"
            value={formData.launchDate}
            onChange={(e) => setFormData({ ...formData, launchDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marketSegment">Market Segment *</Label>
          <Select value={formData.marketSegment} onValueChange={(value) => setFormData({ ...formData, marketSegment: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select segment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Competitor Models */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Competitor Models</Label>
          <Button type="button" onClick={addCompetitorModel} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Competitor
          </Button>
        </div>
        {formData.competitorModels.map((model, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="e.g., Honda CB350RS"
              value={model}
              onChange={(e) => updateCompetitorModel(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeCompetitorModel(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Variants Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Variants</Label>
          <Button type="button" onClick={addVariant} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Variant
          </Button>
        </div>
        {formData.variants.length > 0 && (
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Variant Name</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Color</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Special Features</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {formData.variants.map((variant, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">
                        <Input
                          placeholder="Variant name"
                          value={variant.variantName}
                          onChange={(e) => updateVariant(index, 'variantName', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          placeholder="Price"
                          value={variant.price}
                          onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) => updateVariant(index, 'color', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Select value={variant.status} onValueChange={(value) => updateVariant(index, 'status', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                            <SelectItem value="Discontinued">Discontinued</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-2">
                        <Input
                          placeholder="Special features"
                          value={variant.specialFeatures}
                          onChange={(e) => updateVariant(index, 'specialFeatures', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Pricing Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Price tags, showroom images, variant comparison</p>
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
