"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Check, ChevronDown, Filter } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const types = [
  "All Types",
  "Sport Bike",
  "Cruiser",
  "Adventure",
  "Naked",
  "Touring",
  "Scooter"
]

const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A to Z", value: "name_asc" },
  { label: "Name: Z to A", value: "name_desc" },
]

// Sample data - In a real app, this would come from an API or database
const motorcycles = [
  {
    id: 1,
    name: "Honda CBR1000RR-R",
    type: "Sport Bike",
    price: 28500,
    image: "/motorcycles/honda-cbr.jpg",
    description: "The ultimate racing machine with cutting-edge technology",
    specs: {
      engine: "999cc",
      power: "214 HP",
      weight: "201 kg"
    }
  },
  {
    id: 2,
    name: "Harley-Davidson Iron 883",
    type: "Cruiser",
    price: 11499,
    image: "/motorcycles/harley-iron.jpg",
    description: "A classic cruiser with authentic H-D style",
    specs: {
      engine: "883cc",
      power: "50 HP",
      weight: "247 kg"
    }
  },
  // Add more motorcycles here
]

export default function MotorcyclePage() {
  const [selectedType, setSelectedType] = useState("All Types")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("newest")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const filteredMotorcycles = motorcycles
    .filter(moto => 
      (selectedType === "All Types" || moto.type === selectedType) &&
      moto.price >= priceRange[0] &&
      moto.price <= priceRange[1]
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price_asc":
          return a.price - b.price
        case "price_desc":
          return b.price - a.price
        case "name_asc":
          return a.name.localeCompare(b.name)
        case "name_desc":
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })

  const FilterSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Type</h3>
        <div className="space-y-3">
          {types.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setSelectedType(type)}
            >
              {selectedType === type && (
                <Check className="mr-2 h-4 w-4" />
              )}
              {type}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 50000]}
            max={50000}
            step={1000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Motorcycles</h1>
          <p className="text-muted-foreground">
            Explore our collection of motorcycles from various manufacturers
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block w-[240px] flex-none">
            <FilterSection />
          </div>

          <div className="flex-1">
            {/* Mobile Filter Button & Sort */}
            <div className="flex items-center gap-4 mb-6">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Refine your motorcycle search
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSection />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Motorcycle Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredMotorcycles.map((motorcycle) => (
                <Card key={motorcycle.id} className="flex flex-col">
                  <CardHeader>
                    <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                      <Image
                        src={motorcycle.image}
                        alt={motorcycle.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <CardTitle>{motorcycle.name}</CardTitle>
                      <Badge variant="secondary">{motorcycle.type}</Badge>
                    </div>
                    <CardDescription>{motorcycle.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Engine</span>
                        <span className="font-medium">{motorcycle.specs.engine}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Power</span>
                        <span className="font-medium">{motorcycle.specs.power}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">{motorcycle.specs.weight}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-lg font-bold">{formatPrice(motorcycle.price)}</span>
                    <Button>View Details</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 