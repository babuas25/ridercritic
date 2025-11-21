'use client'

export default function BlogStudioPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">Blog Studio</h1>
      <p className="text-sm text-muted-foreground">
        The embedded Sanity Studio is disabled in this Next.js app to keep the build stable.
        Use your external Sanity Studio project to manage blog content, and this dashboard will
        consume that content via the Sanity API.
      </p>
    </div>
  )
}
