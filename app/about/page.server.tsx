// Generate metadata for the about page
export async function generateMetadata() {
  const title = 'About RiderCritic - Motorcycle Reviews & Community'
  const description = 'রাইডারদের জন্য বাইক রিভিউ এবং মোটরসাইকেল গাইড। Discover expert bike reviews, comparisons, prices & riding culture in Bangladesh and beyond.'

  return {
    title,
    description,
    keywords: 'motorcycle reviews, bike reviews, riding community, motorcycle critics, rider community, motorcycle culture, মোটরসাইকেল রিভিউ, বাইক রিভিউ, রাইডার কমিউনিটি',
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://ridercritic.com/og-about.jpg',
          width: 1200,
          height: 630,
          alt: 'About RiderCritic - Motorcycle Reviews & Community',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-about.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/about'
    }
  }
}