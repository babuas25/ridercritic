import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const sampleProducts = [
  {
    id: 1,
    name: "Premium Motorcycle Helmet",
    brand: "AGV",
    type: "Full Face",
    price: "$299",
    description: "Professional-grade helmet with advanced safety features and aerodynamic design",
    features: ["Carbon Fiber Shell", "Anti-Fog Visor", "Bluetooth Ready"]
  },
  {
    id: 2,
    name: "Riding Jacket",
    brand: "Dainese",
    type: "Leather",
    price: "$449",
    description: "Premium leather jacket with CE-certified protection and classic styling",
    features: ["CE Level 2 Protection", "Perforated Leather", "Removable Liner"]
  },
  {
    id: 3,
    name: "Motorcycle Boots",
    brand: "Alpinestars",
    type: "Sport",
    price: "$189",
    description: "High-performance boots designed for track and street riding",
    features: ["Ankle Protection", "Waterproof", "Quick Lacing"]
  },
  {
    id: 4,
    name: "Riding Gloves",
    brand: "REV'IT!",
    type: "Summer",
    price: "$89",
    description: "Lightweight summer gloves with excellent ventilation and protection",
    features: ["Knuckle Protection", "Touch Screen", "Breathable"]
  }
]

export default function ProductsPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Motorcycle Products</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Essential gear and accessories to enhance your riding experience.
          Quality products from trusted brands for safety and comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <div className="w-full h-32 bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white rounded-t-lg">
              <div className="text-center">
                <div className="text-lg font-bold">{product.brand}</div>
                <div className="text-xs opacity-90">{product.type}</div>
              </div>
            </div>
            <CardContent className="flex-1 flex flex-col gap-3 p-4">
              <div className="font-semibold text-lg">
                {product.name}
              </div>
              <div className="text-xl font-bold text-primary">
                {product.price}
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                {product.description}
              </p>
              <div className="space-y-2">
                <div className="text-xs font-medium">Features:</div>
                <div className="flex flex-wrap gap-1">
                  {product.features.map((feature, index) => (
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
        <h2 className="text-2xl font-semibold mb-4">Product Categories</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Helmets', 'Jackets', 'Boots', 'Gloves', 'Pants', 'Accessories'].map((category) => (
            <Button key={category} variant="outline" className="mb-2">
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
