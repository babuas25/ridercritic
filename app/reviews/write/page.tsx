'use client'

import { useState, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function WriteReviewPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ title, content, images, youtubeUrl })
    // Redirect to reviews page after submission
    router.push("/reviews")
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">Write a Review</h1>
        
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Give your review a title"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded"
              rows={10}
              placeholder="Write your review here..."
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Images</label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
            />
            
            {images.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <Image 
                      src={URL.createObjectURL(image)} 
                      alt={`Preview ${index}`}
                      width={96}
                      height={96}
                      className="object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <label htmlFor="youtube" className="block text-sm font-medium mb-1">YouTube Link</label>
            <input
              type="text"
              id="youtube"
              name="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {youtubeUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">YouTube Preview</h3>
                <div className="bg-gray-200 border-2 border-dashed rounded-md w-full h-48 flex items-center justify-center">
                  YouTube Player Placeholder
                </div>
              </div>
            )}
          </div>
          
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit Review</button>
        </form>
      </div>
    </div>
  )
}