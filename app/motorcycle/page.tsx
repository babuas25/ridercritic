import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const sampleMotorcycles = [
  {
    id: 1,
    name: "Honda CBR1000RR",
    brand: "Honda",
    type: "Sport Bike",
    year: 2024,
    description: "Ultimate performance sport bike with advanced aerodynamics"
  },
  {
    id: 2,
    name: "BMW R1250GS",
    brand: "BMW",
    type: "Adventure",
    year: 2024,
    description: "The ultimate adventure touring motorcycle"
  },
  {
    id: 3,
    name: "Harley-Davidson Fat Boy",
    brand: "Harley-Davidson",
    type: "Cruiser",
    year: 2024,
    description: "Iconic American cruiser with timeless design"
  },
  {
    id: 4,
    name: "Kawasaki Ninja 400",
    brand: "Kawasaki",
    type: "Sport Bike",
    year: 2024,
    description: "Perfect entry-level sport bike for new riders"
  },
  {
    id: 5,
    name: "Ducati Multistrada V4",
    brand: "Ducati",
    type: "Adventure",
    year: 2024,
    description: "Italian performance meets adventure capability"
  },
  {
    id: 6,
    name: "Triumph Bonneville T120",
    brand: "Triumph",
    type: "Classic",
    year: 2024,
    description: "Modern classic with retro styling and modern performance"
  }
]

export default function MotorcyclesPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Motorcycle Collection</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of motorcycles from top manufacturers.
          Each bike represents the pinnacle of engineering and design.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleMotorcycles.map((bike) => (
          <Link key={bike.id} href={`/motorcycle/${bike.id}`} className="group">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
              <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white rounded-t-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{bike.brand}</div>
                  <div className="text-sm opacity-90">{bike.type}</div>
                </div>
              </div>
              <CardContent className="flex-1 flex flex-col gap-3 p-4">
                <div className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {bike.name}
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">{bike.year}</Badge>
                  <Badge variant="outline">{bike.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground flex-1">
                  {bike.description}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-auto">
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Popular Categories</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Sport Bikes', 'Adventure', 'Cruisers', 'Touring', 'Classics', 'Naked Bikes'].map((category) => (
            <Button key={category} variant="outline" className="mb-2">
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}