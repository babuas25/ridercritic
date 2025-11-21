import type { MetadataRoute } from 'next'

const BASE_URL = 'https://ridercritic.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/motorcycle',
    '/critics',
    '/comparisons',
    '/offers',
    '/accessories',
    '/tips',
    '/news',
    '/upcoming',
    '/blog',
    '/products',
    '/about',
    '/contact',
    '/brands'
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
  }))

  return staticRoutes
}
