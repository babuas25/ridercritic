import type { Metadata } from 'next'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params
  const brandName = decodeURIComponent(id).replace(/-/g, ' ').split(' ').map(
    word => word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return {
    title: `${brandName} Motorcycles | ridercritic`,
    description: `Browse all ${brandName} motorcycle models, reviews, specifications, and prices in Bangladesh.`,
    keywords: `${brandName} motorcycles, ${brandName} bikes, ${brandName} models, ${brandName} price bangladesh`,
  }
}

