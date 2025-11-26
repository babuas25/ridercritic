import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Fuel Cost Calculator - ridercritic'
  const description =
    'Estimate your motorcycle fuel cost per day, week, and month. Calculate fuel usage based on mileage, fuel price, and daily riding distance in Bangladesh.'

  return {
    title,
    description,
    keywords:
      'motorcycle fuel calculator, bike fuel cost, petrol cost calculator, mileage calculator, fuel calculator bangladesh, daily fuel cost, monthly fuel cost',
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://ridercritic.com/fuel-calculator',
      images: [
        {
          url: 'https://ridercritic.com/og-fuel-calculator.jpg',
          width: 1200,
          height: 630,
          alt: 'ridercritic Fuel Cost Calculator - Estimate Motorcycle Fuel Cost',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-fuel-calculator.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/fuel-calculator',
    },
  }
}
