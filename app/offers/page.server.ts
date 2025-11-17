import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Motorcycle Offers & Finance Deals - ridercritic'
  const description = 'Explore upcoming motorcycle offers, finance options and special deals curated for Bangladeshi riders by ridercritic.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://ridercritic.com/offers',
      images: [
        {
          url: 'https://ridercritic.com/og-offers.jpg',
          width: 1200,
          height: 630,
          alt: 'Motorcycle offers and finance deals on ridercritic',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-offers.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/offers',
    },
  }
}
