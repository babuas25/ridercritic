import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Upload, Bike, X, Plus, Trash2 } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'

interface AdditionalInformationStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function AdditionalInformationStep({
  formData,
  setFormData,
  stepImages,
  setStepImages
}: AdditionalInformationStepProps) {
  const addHighlight = () => {
    setFormData({ 
      ...formData, 
      keyHighlights: [...formData.keyHighlights, ''] 
    })
  }

  const removeHighlight = (index: number) => {
    setFormData({ 
      ...formData, 
      keyHighlights: formData.keyHighlights.filter((_, i) => i !== index) 
    })
  }

  const updateHighlight = (index: number, value: string) => {
    const updated = formData.keyHighlights.map((h, i) => i === index ? value : h)
    setFormData({ ...formData, keyHighlights: updated })
  }

  const addPro = () => {
    setFormData({ 
      ...formData, 
      pros: [...formData.pros, ''] 
    })
  }

  const removePro = (index: number) => {
    setFormData({ 
      ...formData, 
      pros: formData.pros.filter((_, i) => i !== index) 
    })
  }

  const updatePro = (index: number, value: string) => {
    const updated = formData.pros.map((p, i) => i === index ? value : p)
    setFormData({ ...formData, pros: updated })
  }

  const addCon = () => {
    setFormData({ 
      ...formData, 
      cons: [...formData.cons, ''] 
    })
  }

  const removeCon = (index: number) => {
    setFormData({ 
      ...formData, 
      cons: formData.cons.filter((_, i) => i !== index) 
    })
  }

  const updateCon = (index: number, value: string) => {
    const updated = formData.cons.map((c, i) => i === index ? value : c)
    setFormData({ ...formData, cons: updated })
  }

  const addTag = () => {
    setFormData({ 
      ...formData, 
      tags: [...formData.tags, ''] 
    })
  }

  const removeTag = (index: number) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter((_, i) => i !== index) 
    })
  }

  const updateTag = (index: number, value: string) => {
    const updated = formData.tags.map((t, i) => i === index ? value : t)
    setFormData({ ...formData, tags: updated })
  }

  const addRelatedModel = () => {
    setFormData({ 
      ...formData, 
      relatedModels: [...formData.relatedModels, ''] 
    })
  }

  const removeRelatedModel = (index: number) => {
    setFormData({ 
      ...formData, 
      relatedModels: formData.relatedModels.filter((_, i) => i !== index) 
    })
  }

  const updateRelatedModel = (index: number, value: string) => {
    const updated = formData.relatedModels.map((m, i) => i === index ? value : m)
    setFormData({ ...formData, relatedModels: updated })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Additional Information</h2>
        <p className="text-muted-foreground">Description, highlights, SEO metadata, and notes</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          placeholder="Detailed description of the motorcycle..."
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <p className="text-xs text-gray-500">Rich text description for product page</p>
      </div>

      {/* Key Highlights */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Key Highlights (Bullet Points)</Label>
          <Button type="button" onClick={addHighlight} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Highlight
          </Button>
        </div>
        {formData.keyHighlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="e.g., BS6 compliant engine"
              value={highlight}
              onChange={(e) => updateHighlight(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeHighlight(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Pros */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Pros</Label>
          <Button type="button" onClick={addPro} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Pro
          </Button>
        </div>
        {formData.pros.map((pro, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="e.g., Excellent fuel efficiency"
              value={pro}
              onChange={(e) => updatePro(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removePro(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Cons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Cons</Label>
          <Button type="button" onClick={addCon} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Con
          </Button>
        </div>
        {formData.cons.map((con, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="e.g., Limited top speed"
              value={con}
              onChange={(e) => updateCon(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeCon(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* SEO Metadata */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">SEO Metadata</h3>
        <div className="space-y-2">
          <Label htmlFor="seoMetaTitle">Meta Title *</Label>
          <Input
            id="seoMetaTitle"
            placeholder="e.g., TVS Apache RTR 160 4V - Price, Specs & Critics"
            value={formData.seoMetaTitle}
            onChange={(e) => setFormData({ ...formData, seoMetaTitle: e.target.value })}
          />
          <p className="text-xs text-gray-500">Recommended: 50-60 characters</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoMetaDescription">Meta Description *</Label>
          <Textarea
            id="seoMetaDescription"
            placeholder="Brief description for search engines..."
            rows={3}
            value={formData.seoMetaDescription}
            onChange={(e) => setFormData({ ...formData, seoMetaDescription: e.target.value })}
          />
          <p className="text-xs text-gray-500">Recommended: 150-160 characters</p>
        </div>
      </div>

      {/* Tags / Keywords */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Tags / Keywords</Label>
          <Button type="button" onClick={addTag} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Tag
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex gap-2">
              <Input
                placeholder="e.g., sports bike, 160cc"
                value={tag}
                onChange={(e) => updateTag(index, e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeTag(index)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Related Models */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Related Models</Label>
          <Button type="button" onClick={addRelatedModel} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-1" />
            Add Model
          </Button>
        </div>
        {formData.relatedModels.map((model, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="e.g., Apache RTR 200 4V"
              value={model}
              onChange={(e) => updateRelatedModel(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => removeRelatedModel(index)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Admin Notes */}
      <div className="space-y-2">
        <Label htmlFor="adminNotes">Admin Notes (Internal Use Only)</Label>
        <Textarea
          id="adminNotes"
          placeholder="Internal notes for admins..."
          rows={4}
          value={formData.adminNotes}
          onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
        />
      </div>

      {/* Image Upload */}
      <div className="space-y-2 mt-6">
        <Label>Upload Additional Images (Optional)</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600 mb-1">Brochures, certificates, awards</p>
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
