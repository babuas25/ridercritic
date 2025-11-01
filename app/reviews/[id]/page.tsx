'use client'

import { useState, useEffect } from "react"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { getReview, ReviewData } from '@/lib/reviews'
import { getCommentsByReview, createComment, CommentData } from '@/lib/comments'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'

export default function ReviewDetailPage() {
  const [review, setReview] = useState<ReviewData | null>(null)
  const [comments, setComments] = useState<CommentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [commentForm, setCommentForm] = useState({
    content: "",
    authorName: "",
    isAnonymous: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState("")
  const { data: session } = useSession()
  const params = useParams()
  const { id } = params

  useEffect(() => {
    const fetchReviewAndComments = async () => {
      if (!id || typeof id !== 'string') {
        notFound()
        return
      }

      try {
        // Fetch review
        const reviewData = await getReview(id)
        if (!reviewData) {
          notFound()
          return
        }
        
        // Process the review to handle Firestore timestamps properly
        const processedReview = {
          ...reviewData,
          createdAt: reviewData.createdAt instanceof Date ? reviewData.createdAt : 
                    reviewData.createdAt && typeof reviewData.createdAt === 'object' && 'toDate' in reviewData.createdAt ? 
                    (reviewData.createdAt as unknown as { toDate: () => Date }).toDate() : 
                    reviewData.createdAt ? new Date(reviewData.createdAt as string) : null,
          updatedAt: reviewData.updatedAt instanceof Date ? reviewData.updatedAt : 
                    reviewData.updatedAt && typeof reviewData.updatedAt === 'object' && 'toDate' in reviewData.updatedAt ? 
                    (reviewData.updatedAt as unknown as { toDate: () => Date }).toDate() : 
                    reviewData.updatedAt ? new Date(reviewData.updatedAt as string) : null,
          rating: typeof reviewData.rating === 'number' ? reviewData.rating : 0
        }
        
        setReview(processedReview)
        
        // Fetch comments
        const commentsData = await getCommentsByReview(id)
        // Process comments timestamps
        const processedComments = commentsData.map(comment => ({
          ...comment,
          createdAt: comment.createdAt instanceof Date ? comment.createdAt : 
                    comment.createdAt && typeof comment.createdAt === 'object' && 'toDate' in comment.createdAt ? 
                    (comment.createdAt as unknown as { toDate: () => Date }).toDate() : 
                    comment.createdAt ? new Date(comment.createdAt as string) : null,
          updatedAt: comment.updatedAt instanceof Date ? comment.updatedAt : 
                    comment.updatedAt && typeof comment.updatedAt === 'object' && 'toDate' in comment.updatedAt ? 
                    (comment.updatedAt as unknown as { toDate: () => Date }).toDate() : 
                    comment.updatedAt ? new Date(comment.updatedAt as string) : null,
        }))
        setComments(processedComments)
      } catch (err) {
        console.error('Error fetching review or comments:', err)
        setError("Failed to load review or comments")
      } finally {
        setLoading(false)
      }
    }

    fetchReviewAndComments()
  }, [id])

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

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  // Handle comment form submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!review?.id) {
      setCommentError("Review not found")
      return
    }
    
    if (!commentForm.content.trim()) {
      setCommentError("Please enter a comment")
      return
    }
    
    // For anonymous comments, require a name
    if (commentForm.isAnonymous && !commentForm.authorName.trim()) {
      setCommentError("Please enter your name for anonymous comments")
      return
    }
    
    setIsSubmitting(true)
    setCommentError("")
    
    try {
      // Determine author name and user ID
      let authorName = "Anonymous"
      let userId = null
      
      if (session?.user) {
        // Logged-in user
        authorName = session.user.name || "User"
        userId = session.user.id
      } else if (!commentForm.isAnonymous) {
        setCommentError("You must be logged in or comment anonymously")
        setIsSubmitting(false)
        return
      } else {
        // Anonymous user
        authorName = commentForm.authorName.trim() || "Anonymous"
      }
      
      // Create comment
      const newCommentId = await createComment(
        {
          reviewId: review.id,
          content: commentForm.content,
          authorName: authorName,
          isAnonymous: !session?.user,
        },
        userId,
        authorName
      )
      
      // Add new comment to state
      const newComment: CommentData = {
        id: newCommentId,
        reviewId: review.id,
        content: commentForm.content,
        authorName: authorName,
        userId: userId || undefined,
        isAnonymous: !session?.user,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      setComments([...comments, newComment])
      
      // Reset form
      setCommentForm({
        content: "",
        authorName: "",
        isAnonymous: false
      })
    } catch (err) {
      console.error('Error submitting comment:', err)
      setCommentError("Failed to submit comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 w-32 bg-muted rounded animate-pulse mb-8"></div>
            
            <Card className="border-border/50">
              <div className="p-8">
                <div className="h-8 bg-muted rounded animate-pulse mb-6 w-3/4"></div>
                <div className="h-6 bg-muted rounded animate-pulse mb-8 w-1/2"></div>
                
                <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-6 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse"></div>
                    <div>
                      <div className="h-4 bg-muted rounded animate-pulse mb-2 w-24"></div>
                      <div className="h-3 bg-muted rounded animate-pulse w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
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

  if (!review) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-medium mb-4">Review Not Found</h1>
          <p className="text-muted-foreground mb-6">The review you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/reviews">Back to Reviews</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Button variant="outline" asChild className="mb-8 border-border/50">
          <Link href="/reviews">← Back to Reviews</Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6 mb-8 pb-6 border-b border-border/50">
                <div>
                  <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
                    {review.title}
                  </h1>
                  <p className="text-muted-foreground">
                    Review of {review.topic}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.round(review.rating || 0) ? 'fill-foreground' : 'fill-muted stroke-muted-foreground'}`}
                      />
                    ))}
                  </div>
                  <span className="font-medium ml-2">
                    {review.rating}/5
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium text-sm">
                      {review.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{review.authorName}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                  {review.topic}
                </span>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {review.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border border-border/50 aspect-square">
                        <Image 
                          src={image} 
                          alt={`Review image ${index + 1}`}
                          width={400}
                          height={400}
                          className="object-contain w-full h-full"
                          priority={index === 0} // Add priority to first image
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {review.youtubeLink && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Video</h3>
                  <div className="rounded-lg overflow-hidden border border-border/50">
                    {extractYouTubeId(review.youtubeLink) ? (
                      <iframe
                        className="w-full aspect-video"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(review.youtubeLink)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="bg-muted p-8 text-center">
                        <p className="text-muted-foreground">Invalid YouTube URL: {review.youtubeLink}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
                <div 
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: review.content }} 
                />
              </div>

              {/* Comments Section */}
              <div className="border-t border-border/50 pt-8">
                <h3 className="text-xl font-medium mb-6">Comments ({comments.length})</h3>
                
                {/* Comments List */}
                <div className="space-y-6 mb-8">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="border-b border-border/30 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="font-medium text-xs">
                              {comment.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.authorName}</span>
                              {comment.isAnonymous && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                  Anonymous
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {comment.createdAt instanceof Date ? 
                                  formatDate(comment.createdAt) : 
                                  'Unknown date'}
                              </span>
                            </div>
                            <p className="text-foreground text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Comment Form */}
                <Card className="border-border/50">
                  <div className="p-6">
                    <h4 className="font-medium mb-4">Leave a Comment</h4>
                    
                    {commentError && (
                      <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded">
                        {commentError}
                      </div>
                    )}
                    
                    <form onSubmit={handleCommentSubmit} className="space-y-4">
                      {!session?.user && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                          <div className="flex items-center">
                            <label htmlFor="anonymous-checkbox" className="flex items-center">
                              <input
                                type="checkbox"
                                id="anonymous-checkbox"
                                name="anonymous"
                                checked={commentForm.isAnonymous}
                                onChange={(e) => setCommentForm({
                                  ...commentForm,
                                  isAnonymous: e.target.checked
                                })}
                                className="mr-2"
                              />
                              <span className="text-sm">
                                Comment anonymously
                              </span>
                            </label>
                          </div>
                          
                          {commentForm.isAnonymous && (
                            <div>
                              <label htmlFor="author-name" className="sr-only">
                                Your name
                              </label>
                              <Input
                                type="text"
                                id="author-name"
                                name="authorName"
                                placeholder="Your name"
                                value={commentForm.authorName}
                                onChange={(e) => setCommentForm({
                                  ...commentForm,
                                  authorName: e.target.value
                                })}
                                className="flex-1 max-w-xs"
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="comment-content" className="sr-only">
                          Comment
                        </label>
                        <Textarea
                          id="comment-content"
                          name="commentContent"
                          placeholder={session?.user 
                            ? `Comment as ${session.user.name || 'user'}...` 
                            : "Enter your comment..."}
                          value={commentForm.content}
                          onChange={(e) => setCommentForm({
                            ...commentForm,
                            content: e.target.value
                          })}
                          rows={4}
                          className="min-h-[100px]"
                        />
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          {session?.user 
                            ? `Commenting as ${session.user.name || 'user'}` 
                            : "You can comment anonymously or log in to comment"}
                        </p>
                        <Button 
                          type="submit" 
                          disabled={isSubmitting}
                          size="sm"
                        >
                          {isSubmitting ? "Posting..." : "Post Comment"}
                        </Button>
                      </div>
                    </form>
                  </div>
                </Card>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}