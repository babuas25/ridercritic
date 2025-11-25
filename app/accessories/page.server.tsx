// Generate metadata for the accessories listing page
export async function generateMetadata() {
  const title = 'Motorcycle Accessories & Customization - ridercritic'
  const description = 'Explore motorcycle accessories, luggage, and customization ideas to make your bike more practical, comfortable, and stylish in Bangladesh.'

  return {
    title,
    description,
    keywords: 'motorcycle accessories, bike accessories, customization, tank bag, phone mount, led lights, exhaust system, windshield, luggage rack, motorcycle customization bangladesh, মোটরসাইকেল কাস্টমাইজেশন বাংলাদেশ',
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://ridercritic.com/og-accessories.jpg',
          width: 1200,
          height: 630,
          alt: 'RiderCritic Motorcycle Accessories',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-accessories.jpg'],
    },
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: 'https://ridercritic.com/accessories'
    }
  }
}