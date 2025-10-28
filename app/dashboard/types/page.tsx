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

export default function TypesPage() {
  const [types, setTypes] = useState<Array<{
    id: string;
    name: string;
    description: string;
  }>>([])
  const [newType, setNewType] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTypes()
  }, [])

  const fetchTypes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/types')
      if (!response.ok) throw new Error('Failed to fetch types')
      const data = await response.json()
      setTypes(data.types)
    } catch (error) {
      console.error('Error fetching types:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddType = async () => {
    if (!newType.trim()) return
    
    try {
      const response = await fetch('/api/types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newType, 
          description: newDescription 
        })
      })
      
      if (!response.ok) throw new Error('Failed to add type')
      
      setNewType('')
      setNewDescription('')
      fetchTypes()
    } catch (error) {
      console.error('Error adding type:', error)
    }
  }

  const handleDeleteType = async (id: string) => {
    if (!id) return
    
    try {
      const response = await fetch(`/api/types?id=${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete type')
      fetchTypes()
    } catch (error) {
      console.error('Error deleting type:', error)
    }
  }

  const initialTypes = [
    { name: "Standard", description: "All-purpose, upright position, simple design" },
    { name: "Commuter", description: "Daily use, fuel-efficient, low maintenance" },
    { name: "Sport", description: "High speed, aerodynamic design, aggressive riding" },
    { name: "Cruiser", description: "Long-distance comfort, relaxed seating, high torque" },
    { name: "Adventure (ADV)", description: "Long-ride capable, large tank, luggage mounts" },
    { name: "Dirt", description: "Lightweight, high ground clearance, knobby tires" },
    { name: "Dual-Sport", description: "Street-legal dirt bike — mix of road and off-road" },
    { name: "Scooter / Moped", description: "Automatic (CVT), step-through frame, storage under seat" },
    { name: "Café Racer", description: "Retro styling, minimalist build, sport posture" },
    { name: "Bobber / Chopper", description: "Custom-styled cruiser with cut-down features" },
    { name: "Electric Motorcycle / Scooter", description: "Battery powered, quiet, low running cost" },
    { name: "Mini Bike / Pocket Bike", description: "Small-size, fun or beginner bikes" },
  ];

  const addInitialTypes = async () => {
    try {
      for (const type of initialTypes) {
        const response = await fetch('/api/types', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(type)
        });
        
        if (!response.ok) throw new Error('Failed to add type');
      }
      
      fetchTypes();
      alert('Initial types added successfully!');
    } catch (error) {
      console.error('Error adding initial types:', error);
      alert('Failed to add initial types');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Motorcycle Types Management</h1>
      
      <div className="mb-6 flex gap-4">
        <Input
          placeholder="Type Name"
          value={newType}
          onChange={(e) => setNewType(e.target.value)}
        />
        <Input
          placeholder="Description"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
        />
        <Button onClick={handleAddType}>Add Type</Button>
        <Button 
          variant="outline" 
          onClick={addInitialTypes}
          disabled={types.length > 0}
        >
          Add Initial Types
        </Button>
      </div>
      
      {isLoading ? (
        <p>Loading types...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Type Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type, index) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>{type.name}</TableCell>
                <TableCell>{type.description}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this type?')) {
                        handleDeleteType(type.id)
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
