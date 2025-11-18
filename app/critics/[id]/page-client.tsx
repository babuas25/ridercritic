'use client'

import { useState } from "react"
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { CriticData } from '@/lib/critics'
import type { CommentData } from '@/lib/comments'
import Link from 'next/link'
import Image from 'next/image'
import { Star } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface CriticDetailClientProps {
  critic: CriticData
  initialComments: CommentData[]
}

export default function CriticDetailClient({ critic, initialComments }: CriticDetailClientProps) {
  const [comments, setComments] = useState<CommentData[]>(initialComments)
  const [commentForm, setCommentForm] = useState({
    content: "",
    authorName: "",
    isAnonymous: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState("")
  const { data: session } = useSession()

  // JSON-LD structured data for the critic (Review + Breadcrumbs + optional Video)
  const generateJsonLd = (critic: CriticData) => {
    const baseUrl = 'https://ridercritic.com'
    const criticUrl = critic.id ? `${baseUrl}/critics/${encodeURIComponent(critic.id)}` : `${baseUrl}/critics`

    let publishedIso: string | undefined

    if (critic.createdAt instanceof Date) {
      if (!isNaN(critic.createdAt.getTime())) {
        publishedIso = critic.createdAt.toISOString()
      }
    } else if (
      typeof critic.createdAt === 'object' &&
      critic.createdAt !== null &&
      'toDate' in (critic.createdAt as unknown as { toDate?: () => Date })
    ) {
      const date = (critic.createdAt as unknown as { toDate: () => Date }).toDate()
      if (!isNaN(date.getTime())) {
        publishedIso = date.toISOString()
      }
    } else if (typeof critic.createdAt === 'string' && critic.createdAt) {
      const date = new Date(critic.createdAt)
      if (!isNaN(date.getTime())) {
        publishedIso = date.toISOString()
      }
    }

    const review = {
      "@type": "Review",
      "url": criticUrl,
      "itemReviewed": {
        "@type": "Product",
        "name": critic.topic,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": critic.rating,
        "bestRating": "5",
        "worstRating": "1",
      },
      "name": critic.title,
      "image": critic.images && critic.images.length > 0 ? critic.images[0] : undefined,
      "reviewBody": critic.content
        ? critic.content.replace(/<[^>]*>/g, '').substring(0, 500)
        : "",
      "author": {
        "@type": "Person",
        "name": critic.authorName,
      },
      ...(publishedIso
        ? {
            datePublished: publishedIso,
          }
        : {}),
      "publisher": {
        "@type": "Organization",
        "name": "ridercritic",
        "sameAs": "https://ridercritic.com",
      },
    }

    const breadcrumb = {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl,
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Critics",
          "item": `${baseUrl}/critics`,
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": critic.title,
          "item": criticUrl,
        },
      ],
    }

    const graph: unknown[] = [review, breadcrumb]

    if (critic.youtubeLink) {
      const videoId = extractYouTubeId(critic.youtubeLink)
      if (videoId) {
        graph.push({
          "@type": "VideoObject",
          "name": critic.title,
          "description": critic.content
            ? critic.content.replace(/<[^>]*>/g, '').substring(0, 200)
            : critic.topic,
          ...(publishedIso
            ? {
                uploadDate: publishedIso,
              }
            : {}),
          "thumbnailUrl": critic.images && critic.images.length > 0 ? [critic.images[0]] : undefined,
          "embedUrl": `https://www.youtube.com/embed/${videoId}`,
        })
      }
    }

    return {
      "@context": "https://schema.org",
      "@graph": graph,
    }
  }

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return 'Unknown date'

    try {
      let d: Date
      if (date instanceof Date) {
        d = date
      } else if (typeof date === 'object' && date !== null && 'toDate' in date) {
        d = (date as unknown as { toDate: () => Date }).toDate()
      } else {
        d = new Date(date)
      }

      if (isNaN(d.getTime())) {
        return 'Unknown date'
      }

      return (
        d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) +
        ' ' +
        d.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })
      )
    } catch {
      return 'Unknown date'
    }
  }

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Handle comment form submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!critic?.id) {
      setCommentError('Critic not found')
      return
    }

    if (!commentForm.content.trim()) {
      setCommentError('Please enter a comment')
      return
    }

    if (commentForm.isAnonymous && !commentForm.authorName.trim()) {
      setCommentError('Please enter your name for anonymous comments')
      return
    }

    setIsSubmitting(true)
    setCommentError("")

    try {
      let authorName = 'Anonymous'
      let userId: string | null = null

      if (session?.user) {
        authorName = session.user.name || 'User'
        userId = session.user.id // typed via next-auth.d.ts
      } else if (!commentForm.isAnonymous) {
        setCommentError('You must be logged in or comment anonymously')
        setIsSubmitting(false)
        return
      } else {
        authorName = commentForm.authorName.trim() || 'Anonymous'
      }

      const { createComment } = await import('@/lib/comments')

      const newCommentId = await createComment(
        {
          criticId: critic.id,
          content: commentForm.content,
          authorName,
          isAnonymous: !session?.user,
        },
        userId,
        authorName,
      )

      const newComment: CommentData = {
        id: newCommentId,
        criticId: critic.id,
        content: commentForm.content,
        authorName,
        userId: userId || undefined,
        isAnonymous: !session?.user,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setComments([...comments, newComment])

      setCommentForm({
        content: "",
        authorName: "",
        isAnonymous: false,
      })
    } catch (err) {
      console.error('Error submitting comment:', err)
      setCommentError('Failed to submit comment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd(critic)) }}
      />
      <div className="container py-8">
        <Button variant="outline" asChild className="mb-8 border-border/50">
          <Link href="/critics">← Back to Critics</Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card className="border-border/50 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-6 mb-8 pb-6 border-b border-border/50">
                <div>
                  <h1 className="text-2xl md:text-3xl font-medium tracking-tight mb-2">
                    {critic.title}
                  </h1>
                  <p className="text-muted-foreground">Critic of {critic.topic}</p>
                </div>

                <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-full">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.round(critic.rating || 0)
                            ? 'fill-foreground'
                            : 'fill-muted stroke-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium ml-2">{critic.rating}/5</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 mb-8 pb-6 border-b border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="font-medium text-sm">
                      {critic.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{critic.authorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(critic.createdAt as Date | string | null)}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full">
                  {critic.topic}
                </span>
              </div>

              {critic.images && critic.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Images</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {critic.images.map((image, index) => (
                      <div
                        key={index}
                        className="overflow-hidden rounded-lg border border-border/50 aspect-square"
                      >
                        <Image
                          src={image}
                          alt={`Critic image ${index + 1}`}
                          width={400}
                          height={400}
                          className="object-contain w-full h-full"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {critic.youtubeLink && (
                <div className="mb-8">
                  <h3 className="text-xl font-medium mb-4">Video</h3>
                  <div className="rounded-lg overflow-hidden border border-border/50">
                    {extractYouTubeId(critic.youtubeLink) ? (
                      <iframe
                        className="w-full aspect-video"
                        src={`https://www.youtube.com/embed/${extractYouTubeId(critic.youtubeLink)}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="bg-muted p-8 text-center">
                        <p className="text-muted-foreground">
                          Invalid YouTube URL: {critic.youtubeLink}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="prose prose-gray dark:prose-invert max-w-none mb-12">
                <div
                  className="text-foreground"
                  dangerouslySetInnerHTML={{ __html: critic.content }}
                />
              </div>

              {/* Comments Section */}
              <div className="border-t border-border/50 pt-8">
                <h3 className="text-xl font-medium mb-6">Comments ({comments.length})</h3>

                {/* Comments List */}
                <div className="space-y-6 mb-8">
                  {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-b border-border/30 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <span className="font-medium text-xs">
                              {comment.authorName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">
                                {comment.authorName}
                              </span>
                              {comment.isAnonymous && (
                                <span className="text-xs bg-muted px-2 py-0.5 rounded">
                                  Anonymous
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {comment.createdAt instanceof Date
                                  ? formatDate(comment.createdAt)
                                  : 'Unknown date'}
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
                                onChange={(e) =>
                                  setCommentForm({
                                    ...commentForm,
                                    isAnonymous: e.target.checked,
                                  })
                                }
                                className="mr-2"
                              />
                              <span className="text-sm">Comment anonymously</span>
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
                                onChange={(e) =>
                                  setCommentForm({
                                    ...commentForm,
                                    authorName: e.target.value,
                                  })
                                }
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
                          placeholder={
                            session?.user
                              ? `Comment as ${session.user.name || 'user'}...`
                              : 'Enter your comment...'
                          }
                          value={commentForm.content}
                          onChange={(e) =>
                            setCommentForm({
                              ...commentForm,
                              content: e.target.value,
                            })
                          }
                          rows={4}
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-xs text-muted-foreground">
                          {session?.user
                            ? `Commenting as ${session.user.name || 'user'}`
                            : 'You can comment anonymously or log in to comment'}
                        </p>
                        <Button type="submit" disabled={isSubmitting} size="sm">
                          {isSubmitting ? 'Posting...' : 'Post Comment'}
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