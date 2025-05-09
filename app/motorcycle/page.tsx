"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Motorcycle {
  id: number
  name: string
  brand_id?: number
  type_id?: number
  model_year?: number
  image_urls?: string[]
  brand?: { name: string }
  type?: { name: string }
}

interface Brand { id: number; name: string; }
interface Type { id: number; name: string; }

export default function PublicMotorcyclesPage() {
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [types, setTypes] = useState<Type[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [brandFilter, setBrandFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  // const [ccMin, setCcMin] = useState("")
  // const [ccMax, setCcMax] = useState("")
  const [sortBy, setSortBy] = useState("")

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/motorcycles/?skip=0&limit=100`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/brands/`).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/types/`).then(res => res.json()),
    ])
      .then(([motos, brands, types]) => {
        setMotorcycles(motos)
        setBrands(brands)
        setTypes(types)
        setLoading(false)
      })
      .catch(() => {
        setError("Could not load motorcycles")
        setLoading(false)
      })
  }, [])

  let filtered = motorcycles.filter(moto =>
    (!search || moto.name.toLowerCase().includes(search.toLowerCase())) &&
    (!brandFilter || String(moto.brand_id) === brandFilter) &&
    (!typeFilter || String(moto.type_id) === typeFilter)
    // && (!ccMin || (moto.engine_cc && moto.engine_cc >= Number(ccMin)))
    // && (!ccMax || (moto.engine_cc && moto.engine_cc <= Number(ccMax)))
  )

  if (sortBy === "brand") filtered = filtered.sort((a, b) => (a.brand_id || 0) - (b.brand_id || 0))
  if (sortBy === "type") filtered = filtered.sort((a, b) => (a.type_id || 0) - (b.type_id || 0))
  if (sortBy === "year") filtered = filtered.sort((a, b) => (b.model_year || 0) - (a.model_year || 0))
  // if (sortBy === "cc") filtered = filtered.sort((a, b) => (b.engine_cc || 0) - (a.engine_cc || 0))

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">All Motorcycles</h1>
      <div className="flex flex-wrap gap-4 mb-6 items-end justify-center">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-3 py-2 min-w-[200px]"
        />
        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Brands</option>
          {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Types</option>
          {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        {/* <input type="number" placeholder="Min CC" value={ccMin} onChange={e => setCcMin(e.target.value)} className="border rounded px-3 py-2 w-20" />
        <input type="number" placeholder="Max CC" value={ccMax} onChange={e => setCcMax(e.target.value)} className="border rounded px-3 py-2 w-20" /> */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Sort By</option>
          <option value="brand">Brand</option>
          <option value="type">Type</option>
          <option value="year">Year</option>
          {/* <option value="cc">Engine CC</option> */}
        </select>
      </div>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((moto) => (
            <Link key={moto.id} href={`/motorcycle/${moto.id}`} className="group">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                {moto.image_urls && moto.image_urls.length > 0 ? (
                  <img
                    src={moto.image_urls[0]}
                    alt={moto.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-muted flex items-center justify-center text-muted-foreground rounded-t-lg">
                    No Image
                  </div>
                )}
                <CardContent className="flex-1 flex flex-col gap-2 p-4">
                  <div className="font-semibold text-lg group-hover:text-primary transition-colors">{moto.name}</div>
                  <div className="flex gap-2 flex-wrap text-sm">
                    {moto.model_year && <Badge variant="secondary">{moto.model_year}</Badge>}
                    {moto.brand_id && <Badge variant="outline">Brand ID: {moto.brand_id}</Badge>}
                    {moto.type_id && <Badge variant="outline">Type ID: {moto.type_id}</Badge>}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 