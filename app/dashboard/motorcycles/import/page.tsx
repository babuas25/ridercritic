'use client'

import { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layouts/DashboardLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Upload, 
  FileJson, 
  FileSpreadsheet, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { importMotorcycleFromJSON, importMotorcycleFromCSV } from '@/lib/motorcycles'

export default function ImportMotorcyclePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jsonText, setJsonText] = useState('')
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [importMessage, setImportMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check if user is Admin or Super Admin
  if (!session || (session.user.role !== 'Admin' && session.user.role !== 'Super Admin')) {
    router.push('/dashboard')
    return null
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleImportFromFile = async () => {
    if (!file) {
      setImportStatus('error')
      setImportMessage('Please select a file to import')
      return
    }

    try {
      const fileContent = await file.text()
      
      let motorcycleId: string
      
      if (file.name.endsWith('.json')) {
        motorcycleId = await importMotorcycleFromJSON(fileContent, session.user.id)
      } else if (file.name.endsWith('.csv')) {
        motorcycleId = await importMotorcycleFromCSV(fileContent, session.user.id)
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV files.')
      }
      
      setImportStatus('success')
      setImportMessage(`Motorcycle imported successfully with ID: ${motorcycleId}`)
    } catch (error) {
      console.error('Error importing motorcycle:', error)
      setImportStatus('error')
      setImportMessage(error instanceof Error ? error.message : 'Failed to import motorcycle')
    }
  }

  const handleImportFromJSON = async () => {
    if (!jsonText.trim()) {
      setImportStatus('error')
      setImportMessage('Please enter JSON data')
      return
    }

    try {
      const motorcycleId = await importMotorcycleFromJSON(jsonText, session.user.id)
      setImportStatus('success')
      setImportMessage(`Motorcycle imported successfully with ID: ${motorcycleId}`)
    } catch (error) {
      console.error('Error importing motorcycle:', error)
      setImportStatus('error')
      setImportMessage(error instanceof Error ? error.message : 'Failed to import motorcycle')
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import Motorcycle</h1>
            <p className="text-gray-600">Import individual motorcycle data from JSON or CSV</p>
          </div>
        </div>

        {/* Import Options */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* File Import */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                File Import
              </CardTitle>
              <CardDescription>
                Import motorcycle data from JSON or CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">Select File</Label>
                <div className="flex gap-2">
                  <input
                    id="file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json,.csv"
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleImportFromFile}
                    disabled={!file}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Supported formats: JSON, CSV
                </p>
              </div>
              
              {file && (
                <div className="text-sm text-muted-foreground">
                  Selected file: {file.name}
                </div>
              )}
            </CardContent>
          </Card>

          {/* JSON Text Import */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                JSON Import
              </CardTitle>
              <CardDescription>
                Paste JSON data directly to import a motorcycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="json">JSON Data</Label>
                <Textarea
                  id="json"
                  placeholder='{ "brand": "Yamaha", "modelName": "R15 V4", ... }'
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  rows={8}
                />
              </div>
              <Button 
                onClick={handleImportFromJSON}
                disabled={!jsonText.trim()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import from JSON
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Import Status */}
        {importStatus !== 'idle' && (
          <div className={`p-4 rounded-lg border ${
            importStatus === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-start">
              {importStatus === 'success' ? (
                <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <h3 className="font-medium">
                  {importStatus === 'success' ? 'Success' : 'Error'}
                </h3>
                <p className="text-sm">
                  {importMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Import Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              1. For file import, select a JSON or CSV file containing motorcycle data
            </p>
            <p className="text-sm text-muted-foreground">
              2. For JSON import, paste the JSON data directly into the text area
            </p>
            <p className="text-sm text-muted-foreground">
              3. Required fields: brand, modelName, modelYear
            </p>
            <p className="text-sm text-muted-foreground">
              4. After successful import, the motorcycle will appear in your motorcycle list
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}