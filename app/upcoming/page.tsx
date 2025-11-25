import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Upcoming bikes | ridercritic',
  description: 'Upcoming motorcycles and scooters expected in the Bangladeshi market.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function UpcomingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Upcoming motorcycles | ridercritic",
    "description": metadata.description,
    "url": "https://ridercritic.com/upcoming",
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
          "name": "Upcoming motorcycles",
          "item": "https://ridercritic.com/upcoming"
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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Upcoming motorcycles</h1>
          <p className="text-muted-foreground text-lg">
            A sneak peek at bikes and scooters that are on the way.
          </p>
        </header>

        <p className="text-muted-foreground">
          This section will soon list upcoming models, expected launch timelines,
          and key specs so you can plan your next upgrade with confidence.
        </p>
      </div>
    </div>
  )
}
