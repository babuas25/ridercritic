import type { MetadataRoute } from 'next'
import { sanityClient } from '@/lib/sanity.client'

const BASE_URL = 'https://ridercritic.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    '/',
    '/motorcycle',
    '/critics',
    '/comparisons',
    '/offers',
    '/blog',
    '/about',
    '/contact',
    '/brands',
    '/loan-calculator',
    '/fuel-calculator',
    '/terms',
    '/privacy'
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
  }))

  // Include individual blog posts from Sanity
  const blogPosts = await sanityClient.fetch<
    { slug?: { current?: string | null } | null }[]
  >(
    `*[_type == "post" && defined(slug.current)]{
      "slug": slug
    }`
  )

  const blogRoutes: MetadataRoute.Sitemap = blogPosts
    .filter((post) => post.slug?.current)
    .map((post) => ({
      url: `${BASE_URL}/blog/${post.slug!.current}`,
      lastModified: now,
    }))

  return [...staticRoutes, ...blogRoutes]
}
