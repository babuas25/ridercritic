import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About RiderCritic</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your ultimate destination for motorcycle reviews, community insights,
            and everything related to the world of two wheels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To empower motorcycle enthusiasts with honest, detailed reviews and
                comprehensive information to help them make informed decisions about
                their riding passion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Community</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Join thousands of riders sharing their experiences, from weekend
                warriors to professional racers, all united by the love of motorcycles.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Expert Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  In-depth analysis from experienced riders covering performance,
                  handling, comfort, and value.
                </p>
                <Badge>Professional</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">User Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Real experiences from everyday riders sharing their honest
                  opinions and practical insights.
                </p>
                <Badge>Community</Badge>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Comprehensive Database</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Detailed specifications, comparisons, and guides to help you
                  find your perfect motorcycle.
                </p>
                <Badge>Complete</Badge>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Motorcycle Categories</h2>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {['Sport Bikes', 'Adventure', 'Cruisers', 'Touring', 'Naked Bikes', 'Classics', 'Electric', 'Off-Road'].map((category) => (
              <Badge key={category} variant="outline" className="text-sm py-1 px-3">
                {category}
              </Badge>
            ))}
          </div>
          <p className="text-muted-foreground">
            Whether you&apos;re looking for your first bike or upgrading to your dream machine,
            we cover all categories and riding styles.
          </p>
        </div>
      </div>
    </div>
  )
}
