import './globals.css';
import type { Metadata } from 'next';
import { fonts } from './fonts';
import { Providers } from '@/components/providers';
import Header from '@/components/header';
import MainNav from '@/components/main-nav';
import Sidebar from '@/components/sidebar';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'ridercritic — It\'s Not Just a Ride, It\'s an Emotion',
  description: 'রাইডারদের জন্য বাইক রিভিউ এবং মোটরসাইকেল গাইড। Discover expert bike reviews, comparisons, prices & riding culture in Bangladesh and beyond.',
  keywords: 'motorcycle review bangladesh, মোটরসাইকেল রিভিউ বাংলাদেশ, bike review bangladesh, বাইক রিভিউ বাংলাদেশ, honda hornet 2.0 review, হোন্ডা হর্নেট ২ রিভিউ, yamaha fzs v3 review, ইয়ামাহা FZS V3 রিভিউ, motorcycle price bangladesh, মোটরসাইকেল দাম বাংলাদেশ, best bikes in bangladesh, বাংলাদেশে সেরা বাইক, bike comparisons, বাইক তুলনা, new bike launch bangladesh, নতুন বাইক লঞ্চ বাংলাদেশ, bike mileage review, বাইক মাইলেজ রিভিউ',
  authors: [{ name: 'ridercritic Team' }],
  creator: 'ridercritic',
  publisher: 'ridercritic',
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ridercritic.com',
    siteName: 'ridercritic',
    title: 'ridercritic — It\'s Not Just a Ride, It\'s an Emotion',
    description: 'রাইডারদের জন্য বাইক রিভিউ এবং মোটরসাইকেল গাইড। Discover expert bike reviews, comparisons, prices & riding culture in Bangladesh and beyond.',
    images: [
      {
        url: 'https://ridercritic.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ridercritic - Motorcycle Reviews & Insights'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ridercritic',
    creator: '@ridercritic',
    title: 'ridercritic — It\'s Not Just a Ride, It\'s an Emotion',
    description: 'রাইডারদের জন্য বাইক রিভিউ এবং মোটরসাইকেল গাইড। Discover expert bike reviews, comparisons, prices & riding culture in Bangladesh and beyond.',
    images: ['https://ridercritic.com/og-image.jpg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ridercritic",
    "alternateName": "রাইডারক্রিটিক",
    "url": "https://ridercritic.com",
    "description": "ridercritic is a motorcycle review and rider lifestyle platform — built for bikers, by bikers. More than a ride, it's an emotion.",
    "sameAs": [
      "https://facebook.com/ridercritic",
      "https://twitter.com/ridercritic",
      "https://instagram.com/ridercritic"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning className={fonts.geist.className}>
      <body className={cn(
        "min-h-screen bg-background antialiased",
        fonts.nordique.variable
      )}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            {/* MainNav on both mobile and desktop */}
            <MainNav />
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
            </div>
          </div>
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}