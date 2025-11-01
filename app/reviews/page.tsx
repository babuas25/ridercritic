'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getAllReviews, ReviewData } from '@/lib/reviews'
import Link from 'next/link'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getAllReviews(20)
        setReviews(reviewsData)
      } catch (err) {
        console.error('Error fetching reviews:', err)
        setError("Failed to load reviews")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [])

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown date'
    
    try {
      const d = date instanceof Date ? date : new Date(date)
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Unknown date'
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-destructive">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Motorcycle Reviews</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Real reviews from real riders. Get honest insights about motorcycles
          before you make your next purchase decision.
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
          <Button className="mt-4" asChild>
            <Link href="/dashboard/reviews/write">Write a Review</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg mb-1">
                      <Link 
                        href={`/reviews/${review.id}`} 
                        className="hover:text-primary transition-colors"
                      >
                        {review.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Review of {review.topic}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    {Array(review.rating).fill('★').join('')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="text-sm text-muted-foreground mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ 
                    __html: review.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...' 
                  }}
                />
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>By {review.authorName}</span>
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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