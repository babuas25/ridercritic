'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getReview, ReviewData } from '@/lib/reviews'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'

export default function ReviewDetailPage() {
  const [review, setReview] = useState<ReviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const params = useParams()
  const { id } = params

  useEffect(() => {
    const fetchReview = async () => {
      if (!id || typeof id !== 'string') {
        notFound()
        return
      }

      try {
        const reviewData = await getReview(id)
        if (!reviewData) {
          notFound()
          return
        }
        setReview(reviewData)
      } catch (err) {
        console.error('Error fetching review:', err)
        setError("Failed to load review")
      } finally {
        setLoading(false)
      }
    }

    fetchReview()
  }, [id])

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown date'
    
    try {
      const d = date instanceof Date ? date : new Date(date)
      return d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) + ' ' + d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
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
          <p className="mt-4 text-muted-foreground">Loading review...</p>
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

  if (!review) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Review Not Found</h1>
          <p className="text-muted-foreground mb-6">The review you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/reviews">Back to Reviews</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/reviews">← Back to Reviews</Link>
      </Button>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div>
              <CardTitle className="text-2xl md:text-3xl mb-2">{review.title}</CardTitle>
              <CardDescription className="text-lg">
                Review of {review.topic}
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="text-lg py-2 px-3">
                {Array(review.rating).fill('★').join('')}
                <span className="ml-2">{review.rating}/5</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {review.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-medium">{review.authorName}</p>
                <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
              </div>
            </div>
            <Badge variant="outline">{review.topic}</Badge>
          </div>

          {review.images && review.images.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {review.images.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-lg border">
                    <img 
                      src={image} 
                      alt={`Review image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {review.youtubeLink && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Video</h3>
              <div className="bg-muted rounded-lg p-8 text-center">
                <p className="text-muted-foreground">YouTube video: {review.youtubeLink}</p>
                <Button className="mt-4" variant="outline">
                  Watch Video
                </Button>
              </div>
            </div>
          )}

          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div dangerouslySetInnerHTML={{ __html: review.content }} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}