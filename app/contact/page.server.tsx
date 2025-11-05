// Generate metadata for the contact page
export async function generateMetadata() {
  const title = 'Contact RiderCritic - Motorcycle Reviews & Community'
  const description = 'রাইডারদের জন্য বাইক রিভিউ এবং মোটরসাইকেল গাইড। Get in touch with us for motorcycle reviews, critics, and riding culture insights.'

  return {
    title,
    description,
    keywords: 'contact ridercritic, motorcycle reviews contact, bike reviews contact, riding community contact, মোটরসাইকেল রিভিউ যোগাযোগ, বাইক রিভিউ যোগাযোগ',
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: 'https://ridercritic.com/og-contact.jpg',
          width: 1200,
          height: 630,
          alt: 'Contact RiderCritic - Motorcycle Reviews & Community',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://ridercritic.com/og-contact.jpg'],
    },
    alternates: {
      canonical: 'https://ridercritic.com/contact'
    }
  }
}