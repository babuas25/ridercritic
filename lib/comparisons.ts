import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore'
import { db } from './firebase'
import type { MotorcycleFormData } from '@/types/motorcycle'

export interface SavedComparisonMotorcycle {
  id: string
  brand: string
  modelName: string
  modelYear?: string | number | null
  category?: string | null
  coverImage?: string | null
}

export interface SavedComparison {
  id: string
  motorcycles: SavedComparisonMotorcycle[]
  createdAt: Date
  createdByRole?: string
  createdByEmail?: string
}

interface SaveComparisonOptions {
  motorcycles: MotorcycleFormData[]
  createdByRole?: string
  createdByEmail?: string | null
}

export const saveComparison = async ({ motorcycles, createdByRole, createdByEmail }: SaveComparisonOptions) => {
  if (!motorcycles || motorcycles.length < 2) {
    throw new Error('At least two motorcycles are required to save a comparison')
  }

  const trimmed: SavedComparisonMotorcycle[] = motorcycles.slice(0, 2).map((moto) => ({
    id: moto.id || '',
    brand: moto.brand || '',
    modelName: moto.modelName || '',
    modelYear: moto.modelYear ?? null,
    category: moto.category ?? null,
    coverImage: moto.coverImage ?? null,
  }))

  const docRef = await addDoc(collection(db, 'comparisons'), {
    motorcycles: trimmed,
    createdAt: serverTimestamp(),
    createdByRole: createdByRole || null,
    createdByEmail: createdByEmail || null,
  })

  return docRef.id
}

export const getRecentComparisons = async (max: number = 6): Promise<SavedComparison[]> => {
  const q = query(collection(db, 'comparisons'), orderBy('createdAt', 'desc'), limit(max))
  const snapshot = await getDocs(q)

  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as {
      motorcycles?: SavedComparisonMotorcycle[]
      createdAt?: Date | { toDate: () => Date } | null
      createdByRole?: string | null
      createdByEmail?: string | null
    }

    let createdAt: Date
    if (data.createdAt instanceof Date) {
      createdAt = data.createdAt
    } else if (data.createdAt && typeof data.createdAt === 'object' && 'toDate' in data.createdAt) {
      createdAt = data.createdAt.toDate()
    } else {
      createdAt = new Date()
    }

    return {
      id: docSnap.id,
      motorcycles: (data.motorcycles || []) as SavedComparisonMotorcycle[],
      createdAt,
      createdByRole: data.createdByRole || undefined,
      createdByEmail: data.createdByEmail || undefined,
    }
  })
}
