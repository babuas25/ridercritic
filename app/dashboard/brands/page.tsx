"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function BrandsPage() {
  const [brands, setBrands] = useState<Array<{
    id: string;
    name: string;
    distributor: string;
  }>>([])
  const [newBrand, setNewBrand] = useState('')
  const [newDistributor, setNewDistributor] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/brands')
      console.log('Brands API response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Brands API error response:', errorText)
        throw new Error('Failed to fetch brands')
      }
      const data = await response.json()
      console.log('Brands API data:', data)
      setBrands(data.brands)
    } catch (error) {
      console.error('Error fetching brands:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBrand = async () => {
    if (!newBrand.trim() || !newDistributor.trim()) return
    
    try {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrand, distributor: newDistributor })
      })
      
      if (!response.ok) throw new Error('Failed to add brand')
      
      setNewBrand('')
      setNewDistributor('')
      fetchBrands()
    } catch (error) {
      console.error('Error adding brand:', error)
    }
  }

  const handleDeleteBrand = async (id: string) => {
    if (!id) return
    
    try {
      const response = await fetch(`/api/brands?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete brand')
      fetchBrands()
    } catch (error) {
      console.error('Error deleting brand:', error)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Brands Management</h1>
      
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Brand Name"
          value={newBrand}
          onChange={(e) => setNewBrand(e.target.value)}
        />
        <Input
          placeholder="Distributor"
          value={newDistributor}
          onChange={(e) => setNewDistributor(e.target.value)}
        />
        <Button onClick={handleAddBrand}>Add Brand</Button>
      </div>
      
      {isLoading ? (
        <p>Loading brands...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Distributor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand, index) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.distributor}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this brand?')) {
                        handleDeleteBrand(brand.id)
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
