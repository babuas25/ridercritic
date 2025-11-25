import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tips & guides | ridercritic',
  description: 'Practical motorcycle tips, riding guides, and maintenance checklists from the ridercritic team.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TipsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Motorcycle tips & guides | ridercritic",
    "description": metadata.description,
    "url": "https://ridercritic.com/tips",
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
          "name": "Tips & guides",
          "item": "https://ridercritic.com/tips"
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
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Tips &amp; guides</h1>
          <p className="text-muted-foreground text-lg">
            Practical riding advice, safety tips, and maintenance guides for everyday riders.
          </p>
        </header>

        <p className="text-muted-foreground">
          We are preparing curated tips and how-to guides for Bangladeshi riders and beyond.
          Soon you will find structured content here around riding techniques, safety,
          bike care, long-ride preparation, and ownership checklists.
        </p>
      </div>
    </div>
  )
}
