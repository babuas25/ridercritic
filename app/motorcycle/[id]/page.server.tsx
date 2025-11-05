import { getMotorcycle } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'

// Generate metadata for the motorcycle page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const motorcycle = await getMotorcycle(id) as MotorcycleFormData
    
    if (!motorcycle) {
      return {
        title: 'Motorcycle Not Found',
        description: 'The requested motorcycle could not be found.'
      }
    }

    // Generate default SEO values if not provided
    const seoTitle = motorcycle.seoMetaTitle || `${motorcycle.brand} ${motorcycle.modelName} ${motorcycle.modelYear} - Specs, Price & Reviews`
    const seoDescription = motorcycle.seoMetaDescription || `Discover the ${motorcycle.brand} ${motorcycle.modelName} ${motorcycle.modelYear}. Check detailed specs, pricing, user reviews, and expert critics. Find out if this motorcycle is right for you.`

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [motorcycle.brand, motorcycle.modelName, motorcycle.category, ...motorcycle.tags].filter(Boolean).join(', '),
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: 'website',
        images: motorcycle.coverImage ? [motorcycle.coverImage] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: motorcycle.coverImage ? [motorcycle.coverImage] : [],
      },
      alternates: {
        canonical: `https://ridercritic.com/motorcycle/${id}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Motorcycle Details',
      description: 'View detailed specifications and reviews for this motorcycle.',
      alternates: {
        canonical: 'https://ridercritic.com/motorcycle'
      }
    }
  }
}