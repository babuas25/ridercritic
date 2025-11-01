"use client"

import { useState, useEffect } from "react"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function WriteReviewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your review content here...'
      })
    ],
    content: '',
  })

  // Check if user is authorized to write reviews
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    // Allow User Admin with any subrole to write reviews
    // According to requirements, NewStar should be able to write reviews
    const role = session.user.role
    // subRole is not used in this component
    
    if (role !== 'User Admin') {
      router.push('/dashboard')
      return
    }
    
    // All User Admin subroles can write reviews
    // NewStar, CriticStar, CriticMaster
  }, [session, status, router])

  if (status === 'loading') {
    return <div className="p-6">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Write a Review</h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter review title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
          <div className="border rounded-md">
            <EditorContent editor={editor} className="min-h-48 p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="youtube" className="block text-sm font-medium mb-1">YouTube Link</label>
          <input
            type="text"
            id="youtube"
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
  );
}