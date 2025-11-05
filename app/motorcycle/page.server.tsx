// Generate metadata for the motorcycles listing page
export async function generateMetadata() {
  const title = 'All Motorcycles - RiderCritic'
  const description = 'Discover our curated selection of motorcycles from top manufacturers. Compare specs, read reviews, and find your perfect ride.'

  return {
    title,
    description,
    keywords: 'motorcycles, bike reviews, motorcycle specs, bike comparison, riding culture',
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://ridercritic.com/og-motorcycles.jpg',
          width: 1200,
          height: 630,
          alt: 'RiderCritic Motorcycles Collection',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-motorcycles.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/motorcycle'
    }
  }
}