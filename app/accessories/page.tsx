import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const sampleAccessories = [
  {
    id: 1,
    name: "Tank Bag",
    brand: "SW-MOTECH",
    type: "Storage",
    price: "$129",
    description: "Expandable tank bag with quick-release mounting system",
    features: ["Waterproof", "Expandable", "Quick Release"]
  },
  {
    id: 2,
    name: "Phone Mount",
    brand: "RAM Mounts",
    type: "Electronics",
    price: "$45",
    description: "Universal smartphone mount with vibration damping",
    features: ["Universal Fit", "Vibration Dampening", "360° Rotation"]
  },
  {
    id: 3,
    name: "LED Light Kit",
    brand: "Denali",
    type: "Lighting",
    price: "$299",
    description: "High-performance auxiliary LED lighting system",
    features: ["High Output", "Multiple Modes", "Weatherproof"]
  },
  {
    id: 4,
    name: "Exhaust System",
    brand: "Akrapovič",
    type: "Performance",
    price: "$899",
    description: "Premium exhaust system for improved performance and sound",
    features: ["Carbon Fiber", "Performance Gain", "Lightweight"]
  },
  {
    id: 5,
    name: "Windshield",
    brand: "Puig",
    type: "Comfort",
    price: "$179",
    description: "Adjustable windshield for improved aerodynamics",
    features: ["Adjustable", "Clear View", "Easy Installation"]
  },
  {
    id: 6,
    name: "Luggage Rack",
    brand: "Givi",
    type: "Storage",
    price: "$199",
    description: "Heavy-duty luggage rack for touring and commuting",
    features: ["High Capacity", "Durable", "Universal Fit"]
  }
]

export default function AccessoriesPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Motorcycle Accessories</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Customize and enhance your motorcycle with premium accessories.
          From storage solutions to performance upgrades, find everything you need.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleAccessories.map((accessory) => (
          <Card key={accessory.id} className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div className="w-full h-32 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white rounded-t-lg">
              <div className="text-center">
                <div className="text-lg font-bold">{accessory.brand}</div>
                <div className="text-xs opacity-90">{accessory.type}</div>
              </div>
            </div>
            <CardContent className="flex-1 flex flex-col gap-3 p-4">
              <div className="font-semibold text-lg">
                {accessory.name}
              </div>
              <div className="text-xl font-bold text-primary">
                {accessory.price}
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                {accessory.description}
              </p>
              <div className="space-y-2">
                <div className="text-xs font-medium">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {accessory.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-auto">
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Accessory Categories</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Storage', 'Electronics', 'Lighting', 'Performance', 'Comfort', 'Protection', 'Tools'].map((category) => (
            <Button key={category} variant="outline" className="mb-2">
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
