// Generate metadata for the products listing page
export async function generateMetadata() {
  const title = 'Motorcycle Products & Gear - ridercritic'
  const description = 'রাইডারদের জন্য বাইক রিভিউ এবং মোটরসাইকেল গাইড। Discover expert bike reviews, comparisons, prices & riding culture in Bangladesh and beyond.'

  return {
    title,
    description,
    keywords: 'motorcycle gear, riding gear, motorcycle accessories, bike accessories, helmet, riding jacket, motorcycle boots, riding gloves, motorcycle products bangladesh, মোটরসাইকেল পণ্য বাংলাদেশ',
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://ridercritic.com/og-products.jpg',
          width: 1200,
          height: 630,
          alt: 'RiderCritic Motorcycle Products',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-products.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/products'
    }
  }
}