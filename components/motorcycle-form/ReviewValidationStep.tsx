import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { MotorcycleFormData } from '@/types/motorcycle'
import { useEffect } from 'react'

interface ReviewValidationStepProps {
  formData: MotorcycleFormData
  setFormData: (data: MotorcycleFormData) => void
}

export default function ReviewValidationStep({
  formData,
  setFormData
}: ReviewValidationStepProps) {
  // Calculate data completion percentage
  useEffect(() => {
    const calculateCompletion = () => {
      const fields = Object.keys(formData)
      const filledFields = fields.filter(key => {
        const value = formData[key as keyof MotorcycleFormData]
        if (Array.isArray(value)) {
          return value.length > 0
        }
        if (typeof value === 'boolean') {
          return true // Boolean fields are always counted as filled
        }
        if (typeof value === 'number') {
          return true // Number fields are always counted
        }
        return value !== '' && value !== null && value !== undefined
      })
      
      const percentage = Math.round((filledFields.length / fields.length) * 100)
      
      if (formData.dataCompletionPercentage !== percentage) {
        setFormData({ ...formData, dataCompletionPercentage: percentage })
      }
    }

    calculateCompletion()
  }, [formData, setFormData])

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getCompletionIcon = (percentage: number) => {
    if (percentage >= 80) {
      return <CheckCircle2 className="w-6 h-6 text-green-600" />
    }
    return <AlertCircle className="w-6 h-6 text-yellow-600" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Review & Validation</h2>
        <p className="text-muted-foreground">Final review and data validation status</p>
      </div>

      {/* Data Completion Status */}
      <div className="border rounded-lg p-6 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Data Completion Status</h3>
          {getCompletionIcon(formData.dataCompletionPercentage)}
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className={`text-sm font-bold ${getCompletionColor(formData.dataCompletionPercentage)}`}>
                {formData.dataCompletionPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  formData.dataCompletionPercentage >= 80 
                    ? 'bg-green-600' 
                    : formData.dataCompletionPercentage >= 50 
                    ? 'bg-yellow-600' 
                    : 'bg-red-600'
                }`}
                style={{ width: `${formData.dataCompletionPercentage}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs text-gray-500 mb-1">Required Fields</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.dataCompletionPercentage >= 80 ? '✓' : '—'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formData.dataCompletionPercentage >= 80 ? 'Completed' : 'In Progress'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs text-gray-500 mb-1">Images</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.coverImage ? '✓' : '—'}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formData.coverImage ? 'Cover Added' : 'No Cover'}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border">
              <p className="text-xs text-gray-500 mb-1">Variants</p>
              <p className="text-2xl font-bold text-gray-900">
                {formData.variants.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {formData.variants.length > 0 ? 'Configured' : 'None'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Status */}
      <div className="space-y-2">
        <Label htmlFor="reviewStatus">Review Status *</Label>
        <Select 
          value={formData.reviewStatus} 
          onValueChange={(value) => setFormData({ ...formData, reviewStatus: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select review status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending Review">Pending Review</SelectItem>
            <SelectItem value="Under Review">Under Review</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-gray-500">Current approval status of this motorcycle entry</p>
      </div>

      {/* System Information (Read-Only) */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">System Information (Read-Only)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="lastUpdatedBy">Last Updated By</Label>
            <Input
              id="lastUpdatedBy"
              value={formData.lastUpdatedBy || 'System'}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastUpdatedDate">Last Updated Date</Label>
            <Input
              id="lastUpdatedDate"
              value={formData.lastUpdatedDate || new Date().toLocaleDateString()}
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Validation Warnings */}
      {formData.dataCompletionPercentage < 80 && (
        <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-yellow-800 mb-1">Incomplete Data</h4>
              <p className="text-sm text-yellow-700">
                This motorcycle entry is only {formData.dataCompletionPercentage}% complete. 
                Please fill in all required fields before publishing.
              </p>
            </div>
          </div>
        </div>
      )}

      {formData.dataCompletionPercentage >= 80 && (
        <div className="border border-green-300 bg-green-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-green-800 mb-1">Ready for Review</h4>
              <p className="text-sm text-green-700">
                This motorcycle entry is {formData.dataCompletionPercentage}% complete and ready for publication.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Important Notes</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Ensure all mandatory fields (marked with *) are filled</li>
          <li>Add at least one cover image for better visibility</li>
          <li>Verify all technical specifications for accuracy</li>
          <li>Review pricing information before publishing</li>
          <li>Only Super Admin can change review status to "Published"</li>
        </ul>
      </div>
    </div>
  )
}
