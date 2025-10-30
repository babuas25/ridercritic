import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ImageUploader } from '@/components/ui/image-uploader'
import { MotorcycleFormData } from '@/types/motorcycle'
import { useState, useEffect } from 'react'
import { getAllBrands, getAllTypes } from '@/lib/brands-types'
import type { Brand, MotorcycleType } from '@/lib/brands-types'

interface BasicInformationStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
  stepImages: string[]
  setStepImages: (images: string[]) => void
}

export default function BasicInformationStep({
  formData,
  setFormData
}: BasicInformationStepProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [types, setTypes] = useState<MotorcycleType[]>([])
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingTypes, setLoadingTypes] = useState(true)

  // Fetch brands and types on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsData, typesData] = await Promise.all([
          getAllBrands(),
          getAllTypes()
        ])
        setBrands(brandsData)
        setTypes(typesData)
      } catch (error) {
        console.error('Error fetching brands/types:', error)
      } finally {
        setLoadingBrands(false)
        setLoadingTypes(false)
      }
    }
    
    fetchData()
  }, [])
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground">Identify and classify the motorcycle</p>
      </div>

      {/* 1.1 Model Identity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1.1 Model Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="brand">Brand *</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
              <SelectTrigger>
                <SelectValue placeholder={loadingBrands ? "Loading brands..." : "Select brand"} />
              </SelectTrigger>
              <SelectContent>
                {loadingBrands ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : brands.length === 0 ? (
                  <SelectItem value="none" disabled>No brands available</SelectItem>
                ) : (
                  brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.name.toLowerCase()}>
                      {brand.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelName">Model Name *</Label>
            <Input
              id="modelName"
              placeholder="e.g., R15 V4"
              value={formData.modelName}
              onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="variantName">Variant Name</Label>
            <Input
              id="variantName"
              placeholder="e.g., Racing Blue ABS"
              value={formData.variantName}
              onChange={(e) => setFormData({ ...formData, variantName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelYear">Model Year *</Label>
            <Select value={formData.modelYear} onValueChange={(value) => setFormData({ ...formData, modelYear: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category / Type *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder={loadingTypes ? "Loading types..." : "Select category"} />
              </SelectTrigger>
              <SelectContent>
                {loadingTypes ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : types.length === 0 ? (
                  <SelectItem value="none" disabled>No types available</SelectItem>
                ) : (
                  types.map((type) => (
                    <SelectItem key={type.id} value={type.name.toLowerCase()}>
                      {type.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="segment">Segment *</Label>
            <Select value={formData.segment} onValueChange={(value) => setFormData({ ...formData, segment: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry-level">Entry-level</SelectItem>
                <SelectItem value="mid-range">Mid-range</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="flagship">Flagship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="originCountry">Origin Country</Label>
            <Input
              id="originCountry"
              placeholder="e.g., Japan"
              value={formData.originCountry}
              onChange={(e) => setFormData({ ...formData, originCountry: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="assemblyCountry">Assembly Country</Label>
            <Input
              id="assemblyCountry"
              placeholder="e.g., Bangladesh"
              value={formData.assemblyCountry}
              onChange={(e) => setFormData({ ...formData, assemblyCountry: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 1.2 Visual Identity */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1.2 Visual Identity</h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Upload Cover Image *</Label>
            <ImageUploader
              storagePath={`motorcycles/${formData.brand}/${formData.modelName}/cover`}
              currentImages={formData.coverImage ? [formData.coverImage] : []}
              onUpload={(urls) => setFormData({ ...formData, coverImage: urls[0] })}
              onRemove={() => setFormData({ ...formData, coverImage: '' })}
              multiple={false}
              maxFiles={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Gallery (Multiple Images)</Label>
            <ImageUploader
              storagePath={`motorcycles/${formData.brand}/${formData.modelName}/gallery`}
              currentImages={formData.galleryImages}
              onUpload={(urls) => setFormData({ ...formData, galleryImages: [...formData.galleryImages, ...urls] })}
              onRemove={(url) => setFormData({ ...formData, galleryImages: formData.galleryImages.filter(img => img !== url) })}
              multiple={true}
              maxFiles={10}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modelVideo">Model Video (YouTube / MP4 URL)</Label>
            <Input
              id="modelVideo"
              placeholder="e.g., https://youtube.com/watch?v=..."
              value={formData.modelVideo}
              onChange={(e) => setFormData({ ...formData, modelVideo: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
