import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityClient } from '@/lib/sanity.client'

type BlogPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
}

export const metadata: Metadata = {
  title: 'Blog | ridercritic',
  description: 'Stories, editorials, and deep dives from the ridercritic community.',
}

async function getPosts(): Promise<BlogPost[]> {
  const posts = await sanityClient.fetch<BlogPost[]>(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt)]
      | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt
      }`
  )

  return posts
}

export default async function BlogPage() {
  const posts = await getPosts()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "ridercritic blog",
    "description": metadata.description,
    "url": "https://ridercritic.com/blog",
    "blogPost": posts.map((post) => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `https://ridercritic.com/blog/${post.slug}`,
      "datePublished": post.publishedAt,
      "description": post.excerpt,
    })),
  }

  return (
    <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Blog</h1>
          <p className="text-muted-foreground text-lg">
            Long-form stories, riding experiences, and editorials.
          </p>
        </header>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">
            No blog posts published yet. Please check back soon.
          </p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post._id} className="border rounded-lg p-4 hover:bg-accent transition">
                <h2 className="text-xl font-semibold mb-1">
                  <Link href={`/blog/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.publishedAt && (
                  <p className="text-xs text-muted-foreground mb-2">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                )}
                {post.excerpt && (
                  <p className="text-sm text-muted-foreground mb-2">{post.excerpt}</p>
                )}
                <Link href={`/blog/${post.slug}`} className="text-sm font-medium text-primary hover:underline">
                  Read more
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
