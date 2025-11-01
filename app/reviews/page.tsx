'use client'

import { useState, useEffect } from "react"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllReviews, ReviewData } from '@/lib/reviews'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getAllReviews(20)
        // Process the reviews to handle Firestore timestamps properly
        const processedReviews = reviewsData.map(review => ({
          ...review,
          createdAt: review.createdAt instanceof Date ? review.createdAt : 
                    review.createdAt && typeof review.createdAt === 'object' && 'toDate' in review.createdAt ? 
                    (review.createdAt as unknown as { toDate: () => Date }).toDate() : 
                    review.createdAt ? new Date(review.createdAt as string) : null,
          rating: typeof review.rating === 'number' ? review.rating : 0
        }))
        setReviews(processedReviews)
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
      // Handle different date formats
      let d: Date
      if (date instanceof Date) {
        d = date
      } else if (typeof date === 'object' && date !== null && 'toDate' in date) {
        // Firestore Timestamp
        d = (date as unknown as { toDate: () => Date }).toDate()
      } else {
        d = new Date(date)
      }
      
      // Check if date is valid
      if (isNaN(d.getTime())) {
        return 'Unknown date'
      }
      
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
      <div className="min-h-screen bg-background">
        <div className="container py-16 md:py-24">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-muted rounded animate-pulse mx-auto mb-4"></div>
            <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto"></div>
          </div>
          
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-border/50">
                <div className="h-48 bg-muted animate-pulse"></div>
                <div className="p-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-3"></div>
                  <div className="h-4 bg-muted rounded animate-pulse mb-2 w-3/4"></div>
                  <div className="h-4 bg-muted rounded animate-pulse mb-4 w-1/2"></div>
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded animate-pulse w-1/3"></div>
                    <div className="h-4 bg-muted rounded animate-pulse w-1/4"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-destructive mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-16 md:py-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
            Motorcycle Reviews
          </h1>
          <p className="text-muted-foreground text-lg">
            Real reviews from real riders. Get honest insights about motorcycles before you make your next purchase decision.
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">No reviews yet. Be the first to write one!</p>
            <Button asChild>
              <Link href="/dashboard/reviews/write">Write a Review</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <Card key={review.id} className="overflow-hidden border-border/50 hover:shadow-sm transition-shadow duration-300">
                {/* Display review image if available */}
                {review.images && review.images.length > 0 ? (
                  <div className="relative h-48">
                    <Image 
                      src={review.images[0]} 
                      alt={review.title}
                      className="object-cover"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0} // Add priority to first image
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground/20">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <path d="M21 15l-5-5L5 21"></path>
                      </svg>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="font-medium text-lg mb-2 line-clamp-1">
                    <Link 
                      href={`/reviews/${review.id}`} 
                      className="hover:text-foreground transition-colors"
                    >
                      {review.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {review.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.round(review.rating || 0) ? 'fill-foreground' : 'fill-muted stroke-muted-foreground'}`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {review.rating}/5
                      </span>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {review.authorName}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                      {review.topic}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Categories Section */}
        <div className="mt-24 pt-12 border-t border-border/50">
          <h2 className="text-2xl font-medium tracking-tight text-center mb-8">
            Review Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['All Reviews', 'Sport Bikes', 'Adventure', 'Cruisers', 'Touring', 'Classics'].map((category) => (
              <Button 
                key={category} 
                variant="outline" 
                className="rounded-full px-5 py-2 h-auto text-sm border-border/50 hover:bg-muted/50"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}