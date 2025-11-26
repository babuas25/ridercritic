// Generate metadata for the critics listing page
export async function generateMetadata() {
  const title = 'Motorcycle Critics & Reviews - ridercritic'
  const description = 'Browse curated motorcycle critic articles, long-term reviews, and opinion pieces from the ridercritic community.'

  return {
    title,
    description,
    keywords: 'motorcycle critics, bike reviews, riding culture, motorcycle comparisons, bike review bangladesh, বাইক রিভিউ বাংলাদেশ, honda hornet 2.0 review, হোন্ডা হর্নেট ২ রিভিউ, yamaha fzs v3 review, ইয়ামাহা FZS V3 রিভিউ, best bikes in bangladesh, বাংলাদেশে সেরা বাইক, motorcycle reviews bangladesh, মোটরসাইকেল রিভিউ বাংলাদেশ',
    openGraph: {
      title,
      description,
      type: 'website',
      url: 'https://ridercritic.com/critics',
      images: [
        {
          url: 'https://ridercritic.com/og-critics.jpg',
          width: 1200,
          height: 630,
          alt: 'RiderCritic Critics Collection',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-critics.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/critics'
    }
  }
}