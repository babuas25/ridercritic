import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News | ridercritic',
  description: 'Motorcycle news, launches, and updates relevant to riders in Bangladesh and beyond.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NewsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Motorcycle news | ridercritic",
    "description": metadata.description,
    "url": "https://ridercritic.com/news",
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
          "name": "News",
          "item": "https://ridercritic.com/news"
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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">News</h1>
          <p className="text-muted-foreground text-lg">
            Launch updates, brand announcements, and important motorcycle news.
          </p>
        </header>

        <p className="text-muted-foreground">
          News coverage for motorcycles and riding culture is coming soon. We will
          highlight key launches, regulation changes, and market updates that matter
          to riders in Bangladesh.
        </p>
      </div>
    </div>
  )
}
