import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, Gauge, Settings, Weight, Zap } from "lucide-react"

const sampleMotorcycle = {
  id: 1,
  name: "Honda CBR1000RR",
  brand: "Honda",
  type: "Sport Bike",
  year: 2024,
  description: "The ultimate performance sport bike featuring advanced aerodynamics, electronic rider aids, and race-inspired technology.",
  specifications: "Engine: 1000cc inline-4, Power: 214 HP, Torque: 112 Nm, Weight: 201 kg",
  features: ["Quick Shifter", "Traction Control", "ABS", "Riding Modes", "LED Lighting", "Carbon Fiber Components"],
  technicalSpecs: {
    engine: "999cc liquid-cooled inline four-cylinder",
    power: "214 HP @ 14,500 RPM",
    torque: "112 Nm @ 12,500 RPM",
    transmission: "6-speed with quick shifter",
    suspension: "Front: 43mm inverted fork, Rear: Pro-Link single shock",
    brakes: "Front: 330mm discs with 4-piston calipers, Rear: 220mm disc"
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function MotorcycleDetailPage({ params: _params }: { params: Promise<{ id: string }> }) {
  // Since this is static, we'll show sample data for any ID
  const motorcycle = sampleMotorcycle

  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <Link href="/motorcycle">
        <Button variant="ghost" className="gap-2 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Motorcycles
        </Button>
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="w-full h-96 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">{motorcycle.brand}</div>
              <div className="text-xl">{motorcycle.name}</div>
              <div className="text-sm opacity-90 mt-2">{motorcycle.year} • {motorcycle.type}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg flex items-center justify-center text-white text-xs">
                View {i}
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{motorcycle.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{motorcycle.year}</Badge>
              <Badge variant="outline">{motorcycle.type}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">4.8</span>
                <span className="text-sm text-muted-foreground">(127 reviews)</span>
              </div>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {motorcycle.description}
            </p>
          </div>

          {/* Key Specs */}
          <Card>
            <CardHeader>
              <CardTitle>Key Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{motorcycle.specifications.split(',')[0]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{motorcycle.specifications.split(',')[1]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{motorcycle.specifications.split(',')[2]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{motorcycle.specifications.split(',')[3]}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(motorcycle.technicalSpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between items-start">
                  <Badge variant="outline" className="capitalize">
                    {key.replace('_', ' ')}
                  </Badge>
                  <span className="text-sm text-muted-foreground text-right flex-1 ml-3">
                    {value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {motorcycle.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1">
              View Reviews
            </Button>
            <Button variant="outline" className="flex-1">
              Compare Models
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
