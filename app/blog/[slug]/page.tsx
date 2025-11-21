import type { Metadata } from 'next'
import type { PortableTextBlock } from '@portabletext/types'
import { notFound } from 'next/navigation'
import { PortableText } from '@portabletext/react'
import { sanityClient } from '@/lib/sanity.client'

interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt?: string
  body?: PortableTextBlock[]
  publishedAt?: string
}

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const post = await sanityClient.fetch<BlogPost | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      "slug": slug.current,
      excerpt,
      body,
      publishedAt
    }`,
    { slug }
  )

  return post
}

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<Array<{ slug: string }>>(
    `*[_type == "post" && defined(slug.current)][]{
      "slug": slug.current
    }`
  )

  return slugs.map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params

  const post = await getPost(slug)

  if (!post) {
    return {
      title: 'Post not found | ridercritic',
    }
  }

  return {
    title: `${post.title} | ridercritic`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          {post.publishedAt && (
            <p className="text-xs text-muted-foreground">
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          )}
        </header>

        {post.excerpt && (
          <p className="text-lg text-muted-foreground">{post.excerpt}</p>
        )}

        {post.body && (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <PortableText value={post.body} />
          </div>
        )}
      </div>
    </div>
  )
}
