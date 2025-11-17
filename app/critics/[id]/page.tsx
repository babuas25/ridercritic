import { notFound } from 'next/navigation'
import { getCritic, type CriticData } from '@/lib/critics'
import { getCommentsByCritic, type CommentData } from '@/lib/comments'
import CriticDetailClient from './page-client'

interface CriticDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CriticDetailPage({ params }: CriticDetailPageProps) {
  const { id } = await params

  if (!id) {
    notFound()
  }

  const criticData = await getCritic(id)

  if (!criticData) {
    notFound()
  }

  const commentsData = await getCommentsByCritic(id)

  const processedCritic: CriticData = {
    ...criticData,
    createdAt:
      criticData.createdAt instanceof Date
        ? criticData.createdAt
        : criticData.createdAt &&
          typeof criticData.createdAt === 'object' &&
          'toDate' in criticData.createdAt
          ? (criticData.createdAt as unknown as { toDate: () => Date }).toDate()
          : criticData.createdAt
          ? new Date(criticData.createdAt as string)
          : null,
    updatedAt:
      criticData.updatedAt instanceof Date
        ? criticData.updatedAt
        : criticData.updatedAt &&
          typeof criticData.updatedAt === 'object' &&
          'toDate' in criticData.updatedAt
          ? (criticData.updatedAt as unknown as { toDate: () => Date }).toDate()
          : criticData.updatedAt
          ? new Date(criticData.updatedAt as string)
          : null,
    rating: typeof criticData.rating === 'number' ? criticData.rating : 0,
  }

  const processedComments: CommentData[] = commentsData.map((comment) => ({
    ...comment,
    createdAt:
      comment.createdAt instanceof Date
        ? comment.createdAt
        : comment.createdAt && typeof comment.createdAt === 'object' && 'toDate' in comment.createdAt
          ? (comment.createdAt as unknown as { toDate: () => Date }).toDate()
          : comment.createdAt
          ? new Date(comment.createdAt as string)
          : null,
    updatedAt:
      comment.updatedAt instanceof Date
        ? comment.updatedAt
        : comment.updatedAt && typeof comment.updatedAt === 'object' && 'toDate' in comment.updatedAt
          ? (comment.updatedAt as unknown as { toDate: () => Date }).toDate()
          : comment.updatedAt
          ? new Date(comment.updatedAt as string)
          : null,
  }))

  return (
    <CriticDetailClient critic={processedCritic} initialComments={processedComments} />
  )
}