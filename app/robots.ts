import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = 'https://ridercritic.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // accessories page already uses page-level robots: noindex,nofollow
    },
    sitemap: `${base}/sitemap.xml`,
    host: 'ridercritic.com',
  }
}
