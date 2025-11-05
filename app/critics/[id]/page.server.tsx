import { getCritic } from '@/lib/critics'
import { CriticData } from '@/lib/critics'

// Generate metadata for the critic detail page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const critic = await getCritic(id) as CriticData
    
    if (!critic) {
      return {
        title: 'Critic Not Found - ridercritic',
        description: 'The requested critic could not be found.'
      }
    }

    // Generate SEO values
    const seoTitle = `${critic.title} - ridercritic`
    const seoDescription = critic.content ? `${critic.content.replace(/<[^>]*>/g, '').substring(0, 150)}...` : `Read this motorcycle critic review about ${critic.topic}`

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: [critic.topic, 'motorcycle critic', 'bike review', 'riding culture', 'motorcycle reviews bangladesh', 'বাইক রিভিউ বাংলাদেশ'].filter(Boolean).join(', '),
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: 'article',
        images: critic.images && critic.images.length > 0 ? [critic.images[0]] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: critic.images && critic.images.length > 0 ? [critic.images[0]] : [],
      },
      alternates: {
        canonical: `https://ridercritic.com/critics/${id}`
      }
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Critic Details - ridercritic',
      description: 'View detailed motorcycle critic reviews and insights.',
      alternates: {
        canonical: 'https://ridercritic.com/critics'
      }
    }
  }
}