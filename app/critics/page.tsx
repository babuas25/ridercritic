import { getAllCritics, CriticData } from '@/lib/critics'
export { generateMetadata } from './page.server'
import CriticsPageClient from './page-client'

export default async function CriticsPage() {
  const criticsData = await getAllCritics(20)

  const processedCritics: CriticData[] = criticsData.map((critic) => ({
    ...critic,
    createdAt: critic.createdAt instanceof Date
      ? critic.createdAt
      : critic.createdAt && typeof critic.createdAt === 'object' && 'toDate' in critic.createdAt
        ? (critic.createdAt as unknown as { toDate: () => Date }).toDate()
        : critic.createdAt
          ? new Date(critic.createdAt as string)
          : null,
    updatedAt: critic.updatedAt instanceof Date
      ? critic.updatedAt
      : critic.updatedAt && typeof critic.updatedAt === 'object' && 'toDate' in critic.updatedAt
        ? (critic.updatedAt as unknown as { toDate: () => Date }).toDate()
        : critic.updatedAt
          ? new Date(critic.updatedAt as string)
          : null,
    rating: typeof critic.rating === 'number' ? critic.rating : 0,
  }))

  return <CriticsPageClient initialCritics={processedCritics} />
}