import { NextResponse } from 'next/server'
import { getAllMotorcycles } from '@/lib/motorcycles'
import { getAllBrands, Brand } from '@/lib/brands-types'
import { getAllCritics, CriticData } from '@/lib/critics'
import { MotorcycleFormData } from '@/types/motorcycle'

interface SuggestionItem {
  id: string
  title: string
  subtitle?: string
  image?: string
  href: string
  type: 'motorcycle' | 'brand' | 'review'
  score: number
}

function scoreTextMatch(text: string, q: string): number {
  const t = text.toLowerCase()
  const s = q.toLowerCase().trim()
  if (!s) return 0
  let score = 0
  if (t === s) score += 200
  if (t.startsWith(s)) score += 120
  if (t.includes(s)) score += 60
  // word boundary priority
  const wordBoundary = new RegExp(`(^|\\s|[-_])${s}`)
  if (wordBoundary.test(t)) score += 40
  return score
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = (searchParams.get('q') || '').trim()
  if (!q) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const [motorcycles, brands, reviews]: [
      MotorcycleFormData[],
      Brand[],
      CriticData[]
    ] = await Promise.all([
      getAllMotorcycles(undefined, 200),
      getAllBrands(),
      getAllCritics(100)
    ])

    const suggestions: SuggestionItem[] = []

    motorcycles.forEach((m: MotorcycleFormData) => {
      const parts = [m.modelName || '', m.brand || '', m.variantName || '']
      const s = Math.max(
        scoreTextMatch(m.modelName || '', q),
        scoreTextMatch(m.brand || '', q),
        scoreTextMatch(`${m.brand || ''} ${m.modelName || ''}`, q)
      )
      if (s > 0 && m.id) {
        suggestions.push({
          id: m.id,
          title: `${m.brand || ''} ${m.modelName || ''}`.trim(),
          subtitle: parts.filter(Boolean).join(' • '),
          image: m.coverImage || (Array.isArray(m.galleryImages) ? m.galleryImages[0] : undefined),
          href: `/motorcycle/${m.id}`,
          type: 'motorcycle',
          score: s + 10 // light boost for motorcycles
        })
      }
    })

    brands.forEach((b: Brand) => {
      const s = scoreTextMatch(b.name || '', q)
      if (s > 0) {
        suggestions.push({
          id: b.id,
          title: b.name,
          subtitle: b.distributor,
          image: b.logoUrl,
          href: `/brands/${b.id}`,
          type: 'brand',
          score: s + 5
        })
      }
    })

    reviews.forEach((r: CriticData) => {
      const s = Math.max(
        scoreTextMatch(r.title || '', q),
        scoreTextMatch(r.topic || '', q),
      )
      if (s > 0 && r.id) {
        suggestions.push({
          id: r.id,
          title: r.title,
          subtitle: r.topic,
          image: Array.isArray(r.images) ? r.images[0] : undefined,
          href: `/critics/${r.id}`,
          type: 'review',
          score: s
        })
      }
    })

    // De-duplicate by href keeping highest score
    const dedup = new Map<string, SuggestionItem>()
    for (const item of suggestions) {
      const existing = dedup.get(item.href)
      if (!existing || item.score > existing.score) dedup.set(item.href, item)
    }

    const ranked = Array.from(dedup.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)

    return NextResponse.json({ suggestions: ranked })
  } catch (e) {
    console.error('Suggest API error', e)
    return NextResponse.json({ suggestions: [], error: 'failed' }, { status: 200 })
  }
}
