"use client"

import { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createReview, uploadReviewImages } from '@/lib/reviews'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Image from 'next/image'

// Tiptap Editor Components
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'

// Define the MenuBar component for formatting options
const MenuBar = ({ editor }: { editor: ReturnType<typeof useEditor> | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-muted/50">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded ${editor.isActive('bold') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Bold"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 12a4 4 0 0 0 0-8H6v8"></path>
          <path d="M6 12h9a4 4 0 0 1 0 8H6V12z"></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${editor.isActive('italic') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Italic"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="4" x2="10" y2="4"></line>
          <line x1="14" y1="20" x2="5" y2="20"></line>
          <line x1="15" y1="4" x2="9" y2="20"></line>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        disabled={!editor.can().chain().focus().toggleUnderline().run()}
        className={`p-2 rounded ${editor.isActive('underline') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Underline"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v6a6 6 0 0 0 12 0V4"></path>
          <line x1="4" y1="20" x2="20" y2="20"></line>
        </svg>
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Heading 1"
      >
        <span className="font-bold">H1</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Heading 2"
      >
        <span className="font-bold">H2</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Heading 3"
      >
        <span className="font-bold">H3</span>
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Bullet List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Ordered List"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="6" x2="21" y2="6"></line>
          <line x1="10" y1="12" x2="21" y2="12"></line>
          <line x1="10" y1="18" x2="21" y2="18"></line>
          <path d="M4 6h1v4"></path>
          <path d="M4 10h2"></path>
          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
        </svg>
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Align Left"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="15" y1="12" x2="3" y2="12"></line>
          <line x1="17" y1="18" x2="3" y2="18"></line>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Align Center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="17" y1="12" x2="7" y2="12"></line>
          <line x1="19" y1="18" x2="5" y2="18"></line>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Align Right"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="21" y1="6" x2="3" y2="6"></line>
          <line x1="21" y1="12" x2="9" y2="12"></line>
          <line x1="21" y1="18" x2="7" y2="18"></line>
        </svg>
      </button>
      <div className="w-px h-6 bg-border mx-1"></div>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded ${editor.isActive('codeBlock') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
        title="Code Block"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      </button>
    </div>
  )
}

// Tag component for displaying selected topics
const Tag = ({ 
  label, 
  onRemove 
}: { 
  label: string; 
  onRemove: () => void 
}) => (
  <div className="inline-flex items-center gap-1 bg-muted rounded-full px-3 py-1 text-sm">
    <span>{label}</span>
    <button 
      type="button" 
      onClick={onRemove}
      className="ml-1 rounded-full hover:bg-muted-foreground/20 transition-colors"
      aria-label={`Remove ${label}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
)

// Motorcycle suggestion card component
const MotorcycleCard = ({ 
  motorcycle, 
  onSelect 
}: { 
  motorcycle: { 
    id: string; 
    name: string; 
    brand: string; 
    modelName: string; 
    modelYear: string; 
    displacement: string; 
    coverImage: string;
  }; 
  onSelect: (name: string) => void 
}) => {
  // Capitalize the first letter of the brand name
  const capitalizeBrand = (brand: string) => {
    if (!brand) return '';
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  return (
    <div 
      className="flex items-center gap-3 p-2 rounded-md hover:bg-muted cursor-pointer transition-colors"
      onClick={() => onSelect(motorcycle.name)}
    >
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-muted">
        {motorcycle.coverImage ? (
          <Image 
            src={motorcycle.coverImage} 
            alt={motorcycle.name} 
            width={64}
            height={64}
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement!.innerHTML = '<div class="w-full h-full bg-muted flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="w-6 h-6 text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></div>';
            }}
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-muted-foreground">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
            </svg>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{capitalizeBrand(motorcycle.brand)} {motorcycle.modelName}</h4>
        <div className="flex flex-wrap gap-2 mt-1">
          {motorcycle.modelYear && (
            <span className="text-xs bg-secondary text-secondary-foreground rounded px-1.5 py-0.5">
              {motorcycle.modelYear}
            </span>
          )}
          {motorcycle.displacement && (
            <span className="text-xs bg-secondary text-secondary-foreground rounded px-1.5 py-0.5">
              {motorcycle.displacement}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Rating component
const Rating = ({ 
  value, 
  onChange 
}: { 
  value: number; 
  onChange: (rating: number) => void 
}) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="text-2xl focus:outline-none"
          aria-label={`Rate ${star} stars`}
        >
          {star <= value ? (
            <span className="text-yellow-500">★</span>
          ) : (
            <span className="text-muted-foreground">☆</span>
          )}
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {value} of 5
      </span>
    </div>
  )
}

export default function WriteReviewPage() {
  const [title, setTitle] = useState("")
  const [topics, setTopics] = useState<string[]>([])
  const [topicInput, setTopicInput] = useState("")
  const [existingTopics] = useState<string[]>(['Motorcycles', 'Brands', 'Types'])
  const [motorcycleSuggestions, setMotorcycleSuggestions] = useState<{
    id: string; 
    name: string; 
    brand: string; 
    modelName: string; 
    modelYear: string; 
    displacement: string; 
    coverImage: string;
  }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [rating, setRating] = useState(0)
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previewContent, setPreviewContent] = useState("")
  const [isClient, setIsClient] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [isFirebaseAuthenticated, setIsFirebaseAuthenticated] = useState(false)
  const isMounted = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const { data: session, status } = useSession()
  const router = useRouter()

  // Initialize Tiptap editor with SSR configuration
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your review here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      if (isMounted.current) {
        const html = editor.getHTML()
        setPreviewContent(html)
      }
    },
  })

  useEffect(() => {
    setIsClient(true)
    isMounted.current = true
    
    // Check Firebase authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('Firebase user authenticated:', user)
        setIsFirebaseAuthenticated(true)
      } else {
        console.log('No Firebase user authenticated')
        setIsFirebaseAuthenticated(false)
      }
    })
    
    // Load motorcycle suggestions
    const loadMotorcycleSuggestions = async () => {
      try {
        const response = await fetch('/api/motorcycles?limit=20')
        if (response.ok) {
          const motorcycles = await response.json()
          setMotorcycleSuggestions(motorcycles)
        }
      } catch (error) {
        console.error('Error loading motorcycles:', error)
      }
    }
    
    loadMotorcycleSuggestions()
    
    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      isMounted.current = false
      unsubscribe()
      document.removeEventListener('mousedown', handleClickOutside)
      if (editor) {
        editor.destroy()
      }
    }
  }, [editor])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Form submission started')
    console.log('Session data:', session)
    console.log('Status:', status)
    console.log('Firebase authenticated:', isFirebaseAuthenticated)
    
    if (!session?.user) {
      setError("You must be logged in to submit a review")
      return
    }
    
    // Let's remove the Firebase authentication check for now to test
    // if (!isFirebaseAuthenticated) {
    //   setError("Firebase authentication required. Please refresh the page and try again.")
    //   return
    // }
    
    // Check if user has permission to write reviews
    const userSubRole = session.user.subRole
    // Allow all User Admin subroles to write reviews (NewStar, CriticStar, CriticMaster)
    const canWrite = userSubRole === 'NewStar' || userSubRole === 'CriticStar' || userSubRole === 'CriticMaster'
    
    console.log('User subRole:', userSubRole)
    console.log('Can write reviews:', canWrite)
    
    if (!canWrite) {
      setError("You don't have permission to write reviews. All User Admin subroles can write reviews.")
      return
    }
    
    if (!title.trim()) {
      setError("Please enter a title for your review")
      return
    }
    
    if (topics.length === 0) {
      setError("Please select at least one topic")
      return
    }
    
    if (rating === 0) {
      setError("Please provide a rating")
      return
    }
    
    const content = editor ? editor.getHTML() : ''
    if (!content.trim()) {
      setError("Please write your review content")
      return
    }
    
    setIsSubmitting(true)
    setError("")
    
    try {
      console.log('Submitting review with session:', session)
      
      // Upload images if any
      let imageUrls: string[] = []
      if (images.length > 0) {
        console.log('Uploading images...')
        imageUrls = await uploadReviewImages(images)
        console.log('Uploaded images:', imageUrls)
      }
      
      // Create review data
      const reviewData = {
        title,
        topic: topics[0], // Use the first topic for now
        rating,
        content,
        images: imageUrls,
        youtubeLink: youtubeUrl || undefined
      }
      
      console.log('Review data to submit:', reviewData)
      
      // Create the review in Firestore
      const reviewId = await createReview(
        reviewData,
        session.user.id,
        session.user.name || 'Anonymous'
      )
      
      console.log('Review created with ID:', reviewId)
      
      // Redirect to reviews page
      router.push('/reviews')
    } catch (err) {
      console.error('Error submitting review:', err)
      setError("Failed to submit review. Please try again. Error: " + (err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTopicInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTopic()
    } else if (e.key === 'Backspace' && topicInput === '' && topics.length > 0) {
      // Remove the last topic when backspace is pressed on empty input
      removeTopic(topics.length - 1)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const addTopic = () => {
    const trimmedInput = topicInput.trim()
    if (trimmedInput && !topics.includes(trimmedInput)) {
      setTopics(prev => [...prev, trimmedInput])
      setTopicInput('')
      setShowSuggestions(false)
    }
  }

  const removeTopic = (index: number) => {
    setTopics(prev => prev.filter((_, i) => i !== index))
  }

  const selectExistingTopic = (topic: string) => {
    if (!topics.includes(topic)) {
      setTopics(prev => [...prev, topic])
    }
    setTopicInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleTopicInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTopicInput(value)
    
    // Show suggestions when there's input
    if (value.trim()) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectMotorcycle = (motorcycleName: string) => {
    if (!topics.includes(motorcycleName)) {
      setTopics(prev => [...prev, motorcycleName])
    }
    setTopicInput('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setImages(prev => [...prev, ...files])
    }
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  // Filter suggestions based on input
  const filteredSuggestions = motorcycleSuggestions.filter(motorcycle => 
    `${motorcycle.brand} ${motorcycle.modelName} ${motorcycle.modelYear || ''}`.toLowerCase().includes(topicInput.toLowerCase()) && 
    !topics.includes(motorcycle.name)
  )

  // Don't render the editor on the server to prevent hydration issues
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-80 bg-muted rounded animate-pulse mt-2"></div>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-7/12">
              <div className="h-96 bg-muted rounded animate-pulse"></div>
            </div>
            <div className="w-full lg:w-5/12">
              <div className="h-96 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Write Review</h1>
          <p className="text-muted-foreground mt-2">
            Share your thoughts on this motorcycle with our community
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Panel - Editor */}
            <div className="w-full lg:w-7/12">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-xl font-semibold">Compose</CardTitle>
                </CardHeader>
                <CardContent className="px-0 py-0 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium">
                      Title
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Give your review a title"
                      className="border-border bg-background"
                    />
                  </div>

                  {/* Topic Selection Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Topic
                    </Label>
                    <div className="border rounded-md bg-background relative" ref={suggestionsRef}>
                      <div className="p-3 flex flex-wrap gap-2 items-center min-h-[40px]">
                        {topics.map((topic, index) => (
                          <Tag 
                            key={index} 
                            label={topic} 
                            onRemove={() => removeTopic(index)} 
                          />
                        ))}
                        <input
                          ref={inputRef}
                          type="text"
                          value={topicInput}
                          onChange={handleTopicInputChange}
                          onKeyDown={handleTopicInputKeyDown}
                          onFocus={() => topicInput && setShowSuggestions(true)}
                          placeholder={topics.length === 0 ? "Type a topic, brand, or motorcycle name" : ""}
                          className="flex-1 min-w-[120px] bg-transparent border-0 focus:outline-none focus:ring-0 p-0 text-sm"
                        />
                      </div>
                      {topicInput && (
                        <div className="border-t border-border p-2">
                          <button
                            type="button"
                            onClick={addTopic}
                            className="text-sm text-muted-foreground hover:text-foreground w-full text-left px-2 py-1 rounded hover:bg-muted"
                          >
                            Add "{topicInput}"
                          </button>
                        </div>
                      )}
                      {showSuggestions && (
                        <div className="border-t border-border p-2 max-h-80 overflow-y-auto">
                          <p className="text-xs text-muted-foreground px-2 py-1">Motorcycle suggestions:</p>
                          <div className="mt-1 space-y-1">
                            {filteredSuggestions.length > 0 ? (
                              filteredSuggestions.map((motorcycle) => (
                                <MotorcycleCard 
                                  key={motorcycle.id} 
                                  motorcycle={motorcycle} 
                                  onSelect={selectMotorcycle} 
                                />
                              ))
                            ) : (
                              <p className="text-xs text-muted-foreground px-2 py-1">
                                No matching motorcycles found
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      <div className="border-t border-border p-2">
                        <p className="text-xs text-muted-foreground px-2 py-1">Common topics:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {existingTopics
                            .filter(topic => !topics.includes(topic))
                            .map((topic, index) => (
                              <button
                                key={index}
                                type="button"
                                onClick={() => selectExistingTopic(topic)}
                                className="text-xs bg-muted hover:bg-muted/80 rounded-full px-2 py-1 m-1 transition-colors"
                              >
                                {topic}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Press Enter or comma to add a topic. Backspace to remove last topic.
                    </p>
                  </div>

                  {/* Rating Section */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Rating
                    </Label>
                    <div className="border rounded-md bg-background p-4">
                      <Rating value={rating} onChange={setRating} />
                    </div>
                  </div>

                  {/* Content Editor */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Content
                    </Label>
                    <div className="border rounded-md overflow-hidden bg-background">
                      <MenuBar editor={editor} />
                      <EditorContent 
                        editor={editor} 
                        className="min-h-[300px] prose prose-gray dark:prose-invert max-w-none p-3 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Images
                    </Label>
                    <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        id="image-upload"
                        onChange={handleImageChange}
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                            <path d="m21 12-9-9"></path>
                            <path d="M18 3v7h-7"></path>
                          </svg>
                          <span>Click to upload images</span>
                          <p className="text-xs text-muted-foreground mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </label>
                    </div>
                    
                    {/* Preview of selected images */}
                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <Image 
                              src={URL.createObjectURL(image)} 
                              alt={`Preview ${index}`}
                              width={96}
                              height={96}
                              className="object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs"
                              aria-label={`Remove image ${index + 1}`}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* YouTube Link */}
                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="text-sm font-medium">
                      YouTube Link
                    </Label>
                    <Input
                      id="youtube"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="border-border bg-background"
                    />
                    {youtubeUrl && (
                      <div className="mt-4">
                        <div className="bg-muted border rounded-md w-full h-48 flex items-center justify-center">
                          <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 mx-auto text-muted-foreground">
                              <path d="M22 8s-5.5-2-8-2c-2.5 0-8 2-8 2l-2-2 14 14 14-14-2 2z"></path>
                            </svg>
                            <p className="text-sm text-muted-foreground mt-2">
                              YouTube Preview
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full lg:w-5/12">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-6">
                  <CardTitle className="text-xl font-semibold">Preview</CardTitle>
                </CardHeader>
                <CardContent className="px-0 py-0">
                  <div className="border rounded-md bg-background h-full min-h-[600px]">
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">{title || "Review Title"}</h2>
                      {topics.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {topics.map((topic, index) => (
                            <span key={index} className="bg-muted rounded-full px-2 py-1 text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                      {rating > 0 && (
                        <div className="mb-4">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-lg">
                                {star <= rating ? (
                                  <span className="text-yellow-500">★</span>
                                ) : (
                                  <span className="text-muted-foreground">☆</span>
                                )}
                              </span>
                            ))}
                            <span className="ml-2 text-sm text-muted-foreground">
                              {rating} of 5
                            </span>
                          </div>
                        </div>
                      )}
                      <Separator className="my-4" />
                      <div 
                        className="prose prose-gray dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: previewContent || "<p class='text-muted-foreground'>Your content will appear here as you type...</p>" }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Publish Button - Fixed at the bottom on mobile, normal flow on desktop */}
          <div className="mt-8 flex justify-end sticky bottom-4 bg-background py-4 border-t border-border -mx-4 px-4 lg:static lg:bg-transparent lg:border-0 lg:px-0 lg:py-0 lg:mt-8">
            <Button 
              type="submit" 
              className="px-6 w-full sm:w-auto" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Publishing...
                </>
              ) : (
                "Publish Review"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}