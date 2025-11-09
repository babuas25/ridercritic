import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/ui/image-uploader'
import { Plus, Trash2 } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'
import { sanitizeStoragePath } from '@/lib/storage'

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
  const [newHighlight, setNewHighlight] = useState('')
  const [newPro, setNewPro] = useState('')
  const [newCon, setNewCon] = useState('')
  const [newTag, setNewTag] = useState('')
  const [newRelatedModel, setNewRelatedModel] = useState('')

  // Key Highlights
  const addHighlight = () => {
    if (newHighlight.trim()) {
      setFormData({ 
        ...formData, 
        keyHighlights: [...formData.keyHighlights, newHighlight.trim()] 
      })
      setNewHighlight('')
    }
  }

  const removeHighlight = (index: number) => {
    setFormData({ 
      ...formData, 
      keyHighlights: formData.keyHighlights.filter((_, i) => i !== index) 
    })
  }

  const updateHighlight = (index: number, value: string) => {
    const updatedHighlights = formData.keyHighlights.map((highlight, i) => 
      i === index ? value : highlight
    )
    setFormData({ ...formData, keyHighlights: updatedHighlights })
  }

  // Pros
  const addPro = () => {
    if (newPro.trim()) {
      setFormData({ 
        ...formData, 
        pros: [...formData.pros, newPro.trim()] 
      })
      setNewPro('')
    }
  }

  const removePro = (index: number) => {
    setFormData({ 
      ...formData, 
      pros: formData.pros.filter((_, i) => i !== index) 
    })
  }

  const updatePro = (index: number, value: string) => {
    const updatedPros = formData.pros.map((pro, i) => 
      i === index ? value : pro
    )
    setFormData({ ...formData, pros: updatedPros })
  }

  // Cons
  const addCon = () => {
    if (newCon.trim()) {
      setFormData({ 
        ...formData, 
        cons: [...formData.cons, newCon.trim()] 
      })
      setNewCon('')
    }
  }

  const removeCon = (index: number) => {
    setFormData({ 
      ...formData, 
      cons: formData.cons.filter((_, i) => i !== index) 
    })
  }

  const updateCon = (index: number, value: string) => {
    const updatedCons = formData.cons.map((con, i) => 
      i === index ? value : con
    )
    setFormData({ ...formData, cons: updatedCons })
  }

  // Tags
  const addTag = () => {
    if (newTag.trim()) {
      setFormData({ 
        ...formData, 
        tags: [...formData.tags, newTag.trim()] 
      })
      setNewTag('')
    }
  }

  const removeTag = (index: number) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter((_, i) => i !== index) 
    })
  }

  const updateTag = (index: number, value: string) => {
    const updatedTags = formData.tags.map((tag, i) => 
      i === index ? value : tag
    )
    setFormData({ ...formData, tags: updatedTags })
  }

  // Related Models
  const addRelatedModel = () => {
    if (newRelatedModel.trim()) {
      setFormData({ 
        ...formData, 
        relatedModels: [...formData.relatedModels, newRelatedModel.trim()] 
      })
      setNewRelatedModel('')
    }
  }

  const removeRelatedModel = (index: number) => {
    setFormData({ 
      ...formData, 
      relatedModels: formData.relatedModels.filter((_, i) => i !== index) 
    })
  }

  const updateRelatedModel = (index: number, value: string) => {
    const updatedModels = formData.relatedModels.map((model, i) => 
      i === index ? value : model
    )
    setFormData({ ...formData, relatedModels: updatedModels })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Additional Information</h2>
        <p className="text-muted-foreground">Key highlights, pros/cons, SEO metadata, and related models</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Detailed Description *</Label>
        <Textarea
          id="description"
          placeholder="Comprehensive description of the motorcycle..."
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      {/* Key Highlights */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Add a key highlight (e.g., Fuel injected engine)"
            value={newHighlight}
            onChange={(e) => setNewHighlight(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
            className="flex-1"
          />
          <Button type="button" onClick={addHighlight} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
        {formData.keyHighlights.map((highlight, index) => (
          <div key={index} className="flex gap-2">
            <Input
              placeholder="e.g., Fuel injected engine"
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
        <ImageUploader
          storagePath={sanitizeStoragePath(`motorcycles/${formData.brand}/${formData.modelName}/additional`)}
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