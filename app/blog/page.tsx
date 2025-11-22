import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { sanityClient } from '@/lib/sanity.client'
import { trackEvent } from '@/lib/ga4'

type BlogPost = {
  _id: string
  title: string
  slug: string
  excerpt?: string
  publishedAt?: string
  coverImageUrl?: string
  authorName?: string
  authorImageUrl?: string
}

type BlogCategory = {
  _id: string
  title: string
}

export const metadata: Metadata = {
  title: 'Blog | ridercritic',
  description: 'Stories, editorials, and deep dives from the ridercritic community.',
}

const PAGE_SIZE = 6

async function getPosts(categoryTitle: string, page: number): Promise<BlogPost[]> {
  const offset = (page - 1) * PAGE_SIZE
  const end = offset + PAGE_SIZE - 1
  const posts = await sanityClient.fetch<BlogPost[]>(
    `*[_type == "post" && defined(slug.current) && defined(publishedAt) && (!defined($category) || $category == '' || $category in categories[]->title)]
      | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        publishedAt,
        "coverImageUrl": mainImage.asset->url,
        "authorName": author->name,
        "authorImageUrl": author->image.asset->url
      }[$offset...$end]`,
    { category: categoryTitle, offset, end }
  )

  return posts
}

async function getCategories(): Promise<BlogCategory[]> {
  const categories = await sanityClient.fetch<BlogCategory[]>(
    `*[_type == "category"] | order(title asc) {
      _id,
      title
    }`
  )

  return categories
}

async function getPostCount(categoryTitle: string): Promise<number> {
  const count = await sanityClient.fetch<number>(
    `count(*[_type == "post" && defined(slug.current) && defined(publishedAt) && (!defined($category) || $category == '' || $category in categories[]->title)])`,
    { category: categoryTitle }
  )

  return count
}

interface BlogPageProps {
  searchParams?: Promise<{
    category?: string
    page?: string
  }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const activeCategory = resolvedSearchParams.category || ''
  const currentPage = Math.max(1, Number(resolvedSearchParams.page) || 1)

  const [posts, categories, totalCount] = await Promise.all([
    getPosts(activeCategory, currentPage),
    getCategories(),
    getPostCount(activeCategory),
  ])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const hasPrev = currentPage > 1
  const hasNext = currentPage < totalPages

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
      "image": post.coverImageUrl,
    })),
  }

  return (
    <div className="container py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto lg:flex lg:gap-10">
        <aside className="lg:w-64 lg:flex-shrink-0 mb-8 lg:mb-0">
          <div className="hidden lg:block space-y-4">
            <h2 className="text-xl font-semibold">Blog</h2>
            <p className="text-sm text-muted-foreground">
              Long-form stories, riding experiences, and editorials from ridercritic.
            </p>
            {categories.length > 0 && (
              <nav className="space-y-1 mt-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Categories
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <Link
                      href="/blog"
                      className={
                        activeCategory
                          ? 'text-muted-foreground hover:text-foreground'
                          : 'font-medium text-foreground'
                      }
                      onClick={() =>
                        trackEvent('blog_category_select', {
                          category_title: 'All',
                          source: 'sidebar',
                        })
                      }
                    >
                      All
                    </Link>
                  </li>
                  {categories.map((category) => {
                    const isActive = category.title === activeCategory
                    return (
                      <li key={category._id}>
                        <Link
                          href={`/blog?category=${encodeURIComponent(category.title)}`}
                          className={
                            isActive
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }
                          onClick={() =>
                            trackEvent('blog_category_select', {
                              category_title: category.title,
                              source: 'sidebar',
                            })
                          }
                        >
                          {category.title}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            )}
          </div>

          {categories.length > 0 && (
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-semibold">Blog</h2>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                <Link
                  href="/blog"
                  className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs ${
                    activeCategory
                      ? 'text-muted-foreground'
                      : 'bg-foreground text-background border-foreground'
                  }`}
                  onClick={() =>
                    trackEvent('blog_category_select', {
                      category_title: 'All',
                      source: 'chip',
                    })
                  }
                >
                  All
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/blog?category=${encodeURIComponent(category.title)}`}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs ${
                      category.title === activeCategory
                        ? 'bg-foreground text-background border-foreground'
                        : 'text-muted-foreground'
                    }`}
                    onClick={() =>
                      trackEvent('blog_category_select', {
                        category_title: category.title,
                        source: 'chip',
                      })
                    }
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="flex-1">
          <header className="mb-6 lg:mb-8 hidden lg:block">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Latest stories</h1>
            <p className="text-muted-foreground text-sm">
              New posts from the ridercritic team and community.
            </p>
          </header>

          {posts.length === 0 ? (
            <p className="text-muted-foreground">
              No blog posts published yet. Please check back soon.
            </p>
          ) : (
            <>
              <div className="grid gap-6 md:gap-8 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="group border rounded-xl overflow-hidden hover:shadow-sm transition bg-background flex flex-col h-full"
                  >
                    {post.coverImageUrl && (
                      <div className="relative w-full h-40 md:h-44 bg-muted overflow-hidden">
                        <Image
                          src={post.coverImageUrl}
                          alt={post.title}
                          fill
                          sizes="(min-width: 768px) 384px, 100vw"
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-200"
                          priority
                        />
                      </div>
                    )}
                    <div className="p-4 md:p-5 flex flex-col gap-2 flex-1">
                      {(post.authorName || post.publishedAt) && (
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          {post.authorImageUrl && (
                            <Image
                              src={post.authorImageUrl}
                              alt={post.authorName ?? 'Author'}
                              width={18}
                              height={18}
                              className="rounded-full object-cover flex-shrink-0"
                            />
                          )}
                          {post.authorName && <span>{post.authorName}</span>}
                          {post.publishedAt && (
                            <span className="italic">
                              •
                              {new Date(post.publishedAt).toLocaleDateString(undefined, {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          )}
                        </div>
                      )}
                      <h2 className="text-base md:text-lg font-semibold leading-snug">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:underline decoration-2 underline-offset-4"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      {post.excerpt && (
                        <p className="text-xs md:text-sm text-muted-foreground line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-xs font-medium text-primary hover:underline"
                          onClick={() =>
                            trackEvent('read_more_click', {
                              post_slug: post.slug,
                              post_title: post.title,
                            })
                          }
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8 text-xs text-muted-foreground">
                  <div>
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    {hasPrev ? (
                      <Link
                        href={`/blog?page=${currentPage - 1}${
                          activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ''
                        }`}
                        className="px-3 py-1 rounded border hover:bg-accent"
                      >
                        Previous
                      </Link>
                    ) : (
                      <span className="px-3 py-1 rounded border opacity-40 cursor-default">
                        Previous
                      </span>
                    )}
                    {hasNext ? (
                      <Link
                        href={`/blog?page=${currentPage + 1}${
                          activeCategory ? `&category=${encodeURIComponent(activeCategory)}` : ''
                        }`}
                        className="px-3 py-1 rounded border hover:bg-accent"
                      >
                        Next
                      </Link>
                    ) : (
                      <span className="px-3 py-1 rounded border opacity-40 cursor-default">
                        Next
                      </span>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}
