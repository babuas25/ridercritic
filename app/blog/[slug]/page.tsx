import type { Metadata } from 'next'
import type { PortableTextBlock } from '@portabletext/types'
import Link from 'next/link'
import Image from 'next/image'
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
  coverImageUrl?: string
  tags?: string[]
  authorName?: string
  authorImageUrl?: string
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
      publishedAt,
      "coverImageUrl": mainImage.asset->url,
      tags,
      "authorName": author->name,
      "authorImageUrl": author->image.asset->url
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

  const description =
    post.excerpt && post.excerpt.trim().length > 0
      ? post.excerpt
      : `Read ${post.title} on ridercritic.`

  return {
    title: `${post.title} | ridercritic`,
    description,
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params

  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `https://ridercritic.com/blog/${post.slug}`,
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.publishedAt ?? undefined,
    image: post.coverImageUrl ?? undefined,
    keywords: post.tags && post.tags.length > 0 ? post.tags.join(', ') : undefined,
    author: post.authorName
      ? {
          '@type': 'Person',
          name: post.authorName,
        }
      : {
          '@type': 'Organization',
          name: 'ridercritic',
        },
    publisher: {
      '@type': 'Organization',
      name: 'ridercritic',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://ridercritic.com/blog/${post.slug}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <header>
            <div className="mb-3 text-xs text-muted-foreground">
              <Link href="/blog" className="hover:underline">
                ← Back to blog
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
            {(post.authorName || post.publishedAt) && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                {post.authorImageUrl && (
                  <Image
                    src={post.authorImageUrl}
                    alt={post.authorName ?? 'Author'}
                    width={28}
                    height={28}
                    className="rounded-full object-cover flex-shrink-0"
                  />
                )}
                <div className="flex flex-col">
                  {post.authorName && <span>By {post.authorName}</span>}
                  {post.publishedAt && (
                    <span className="italic">
                      {new Date(post.publishedAt).toLocaleDateString(undefined, {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  )}
                </div>
              </div>
            )}
          </header>

          {post.coverImageUrl && (
            <div className="w-full rounded-lg overflow-hidden bg-muted">
              <Image
                src={post.coverImageUrl}
                alt={post.title}
                width={1024}
                height={576}
                className="w-full h-auto object-contain"
                sizes="(min-width: 768px) 768px, 100vw"
                priority
              />
            </div>
          )}

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
    </>
  )
}
