"use client"

import { useState } from "react"
import dynamic from 'next/dynamic'
const Editor = dynamic(
  () => import('react-draft-wysiwyg').then(mod => mod.Editor),
  { ssr: false }
)
import { EditorState } from 'draft-js'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default function WriteReviewPage() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [youtubeUrl, setYoutubeUrl] = useState("")

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Write a Review</h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            id="title"
            className="w-full p-2 border rounded"
            placeholder="Enter review title"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium mb-1">Content</label>
          <Editor
            editorState={editorState}
            onEditorStateChange={setEditorState}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
            toolbar={{
              options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'image', 'remove', 'history'],
              inline: { inDropdown: true },
              list: { inDropdown: true },
              textAlign: { inDropdown: true },
              link: { inDropdown: true },
              image: { inDropdown: true },
              history: { inDropdown: true },
            }}
          />
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
