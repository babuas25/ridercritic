import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'All Motorcycle Brands | ridercritic',
    description: 'Browse all motorcycle brands available in Bangladesh. Find your favorite brand and explore their latest models, reviews, and specifications.',
    keywords: 'motorcycle brands bangladesh, bike brands, honda motorcycles, yamaha motorcycles, bajaj motorcycles, tvs motorcycles, motorcycle manufacturers',
  }
}

