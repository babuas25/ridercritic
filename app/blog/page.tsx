import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | ridercritic',
  description: 'Stories, editorials, and deep dives from the ridercritic community.',
}

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ridercritic blog",
    "description": metadata.description,
    "url": "https://ridercritic.com/blog",
    "blogPost": [],
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ridercritic.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://ridercritic.com/blog"
        }
      ]
    }
  }

  return (
    <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog</h1>
          <p className="text-muted-foreground text-lg">
            Long-form stories, riding experiences, and editorials.
          </p>
        </header>

        <p className="text-muted-foreground">
          ridercritic blog posts are coming soon. Expect in-depth stories from real
          riders, event coverage, and opinion pieces about the future of motorcycling.
        </p>
      </div>
    </div>
  )
}
