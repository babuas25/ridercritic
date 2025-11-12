"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { uploadImage } from "@/lib/storage"

export default function EditBrandPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params.id

  const [name, setName] = useState("")
  const [distributor, setDistributor] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetch(`/api/brands/${id}`)
        if (!res.ok) {
          throw new Error(`Failed to load brand (${res.status})`)
        }
        const data = await res.json()
        setName(data.name || "")
        setDistributor(data.distributor || "")
        setLogoUrl(data.logoUrl || "")
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e))
      } finally {
        setIsLoading(false)
      }
    }
    if (typeof id === 'string' && id) load()
  }, [id])

  const onSave = async () => {
    if (!name.trim()) return
    setIsSaving(true)
    setError(null)
    try {
      let uploadedLogoUrl: string | undefined
      if (logoFile) {
        setIsUploadingLogo(true)
        uploadedLogoUrl = await uploadImage(logoFile, `brands/${id}`)
        setIsUploadingLogo(false)
      }
      const res = await fetch(`/api/brands?id=${encodeURIComponent(String(id))}` , {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: name.trim(), 
          distributor: distributor.trim(), 
          ...(uploadedLogoUrl ? { logoUrl: uploadedLogoUrl } : {})
        })
      })
      if (!res.ok) throw new Error("Failed to update brand")
      router.push("/dashboard/brands")
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Edit Brand</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Yamaha" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Distributor</label>
            <Input value={distributor} onChange={(e) => setDistributor(e.target.value)} placeholder="e.g. ACI Motors" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Brand Logo</label>
            {logoUrl && (
              <div className="flex items-center gap-3">
                <Image src={logoUrl} alt="Brand logo" width={64} height={64} className="rounded bg-muted object-contain" />
                <span className="text-xs text-muted-foreground">Current</span>
              </div>
            )}
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
            {isUploadingLogo && <p className="text-xs text-muted-foreground">Uploading logo...</p>}
          </div>
          <div className="flex gap-2 pt-2">
            <Button disabled={isSaving} onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
      )}
    </div>
  )
}
