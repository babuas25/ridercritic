import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const sampleReviews = [
  {
    id: 1,
    title: "2024 Honda CBR1000RR - A Rider's Dream",
    motorcycle: "Honda CBR1000RR",
    rating: 5,
    author: "Mike Chen",
    date: "2024-10-15",
    excerpt: "The perfect blend of power, handling, and technology. This bike exceeded all my expectations on both track and street.",
    category: "Sport Bike"
  },
  {
    id: 2,
    title: "BMW R1250GS Adventure - Ultimate Touring Companion",
    motorcycle: "BMW R1250GS",
    rating: 5,
    author: "Sarah Johnson",
    date: "2024-10-12",
    excerpt: "Crossed three states in comfort. The adaptive suspension and electronic aids make long rides effortless.",
    category: "Adventure"
  },
  {
    id: 3,
    title: "Harley-Davidson Fat Boy - American Icon",
    motorcycle: "Harley-Davidson Fat Boy",
    rating: 4,
    author: "David Wilson",
    date: "2024-10-10",
    excerpt: "The rumble, the style, the heritage - everything you expect from a Harley. Comfortable for long cruises.",
    category: "Cruiser"
  },
  {
    id: 4,
    title: "Kawasaki Ninja 400 - Perfect Starter Bike",
    motorcycle: "Kawasaki Ninja 400",
    rating: 4,
    author: "Alex Rodriguez",
    date: "2024-10-08",
    excerpt: "Great power delivery for beginners. Forgiving handling and enough power to grow into. Highly recommended.",
    category: "Sport Bike"
  },
  {
    id: 5,
    title: "Ducati Multistrada V4 - Italian Excellence",
    motorcycle: "Ducati Multistrada V4",
    rating: 5,
    author: "Maria Santos",
    date: "2024-10-05",
    excerpt: "The electronics package is incredible. Multiple riding modes make it versatile for any condition or mood.",
    category: "Adventure"
  }
]

export default function ReviewsPage() {
  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Motorcycle Reviews</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real reviews from real riders. Get honest insights about motorcycles
          before you make your next purchase decision.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleReviews.map((review) => (
          <Card key={review.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-1">{review.title}</CardTitle>
                  <CardDescription className="text-sm">
                    Review of {review.motorcycle}
                  </CardDescription>
                </div>
                <Badge variant="secondary">
                  {Array(review.rating).fill('★').join('')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                &quot;{review.excerpt}&quot;
              </p>
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>By {review.author}</span>
                <span>{review.date}</span>
              </div>
              <div className="mt-3">
                <Badge variant="outline" className="text-xs">
                  {review.category}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Review Categories</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {['All Reviews', 'Sport Bikes', 'Adventure', 'Cruisers', 'Touring', 'Classics'].map((category) => (
            <Button key={category} variant="outline" className="mb-2">
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
