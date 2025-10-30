import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Query,
  DocumentData
} from 'firebase/firestore'
import { db } from './firebase'
import { MotorcycleFormData } from '@/types/motorcycle'

const MOTORCYCLES_COLLECTION = 'motorcycles'

/**
 * Create a new motorcycle document
 * @param motorcycleData - Motorcycle form data
 * @param userId - ID of the user creating the motorcycle
 * @returns The created motorcycle ID
 */
export async function createMotorcycle(
  motorcycleData: MotorcycleFormData,
  userId: string
): Promise<string> {
  try {
    const motorcyclesRef = collection(db, MOTORCYCLES_COLLECTION)
    const newDocRef = doc(motorcyclesRef)
    
    const motorcycleWithMetadata = {
      ...motorcycleData,
      id: newDocRef.id,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastUpdatedBy: userId,
      lastUpdatedDate: new Date().toISOString()
    }
    
    await setDoc(newDocRef, motorcycleWithMetadata)
    
    return newDocRef.id
  } catch (error) {
    console.error('Error creating motorcycle:', error)
    throw new Error('Failed to create motorcycle')
  }
}

/**
 * Get a single motorcycle by ID
 * @param motorcycleId - Motorcycle document ID
 * @returns Motorcycle data or null if not found
 */
export async function getMotorcycle(motorcycleId: string): Promise<MotorcycleFormData | null> {
  try {
    const motorcycleRef = doc(db, MOTORCYCLES_COLLECTION, motorcycleId)
    const motorcycleSnap = await getDoc(motorcycleRef)
    
    if (motorcycleSnap.exists()) {
      return motorcycleSnap.data() as MotorcycleFormData
    }
    
    return null
  } catch (error) {
    console.error('Error fetching motorcycle:', error)
    throw new Error('Failed to fetch motorcycle')
  }
}

/**
 * Update an existing motorcycle
 * @param motorcycleId - Motorcycle document ID
 * @param motorcycleData - Updated motorcycle data
 * @param userId - ID of the user updating the motorcycle
 */
export async function updateMotorcycle(
  motorcycleId: string,
  motorcycleData: Partial<MotorcycleFormData>,
  userId: string
): Promise<void> {
  try {
    const motorcycleRef = doc(db, MOTORCYCLES_COLLECTION, motorcycleId)
    
    const updateData = {
      ...motorcycleData,
      updatedAt: serverTimestamp(),
      lastUpdatedBy: userId,
      lastUpdatedDate: new Date().toISOString()
    }
    
    await updateDoc(motorcycleRef, updateData)
  } catch (error) {
    console.error('Error updating motorcycle:', error)
    throw new Error('Failed to update motorcycle')
  }
}

/**
 * Delete a motorcycle
 * @param motorcycleId - Motorcycle document ID
 */
export async function deleteMotorcycle(motorcycleId: string): Promise<void> {
  try {
    const motorcycleRef = doc(db, MOTORCYCLES_COLLECTION, motorcycleId)
    await deleteDoc(motorcycleRef)
  } catch (error) {
    console.error('Error deleting motorcycle:', error)
    throw new Error('Failed to delete motorcycle')
  }
}

/**
 * Get all motorcycles with optional filters
 * @param filters - Optional filters (brand, category, status)
 * @param limitCount - Number of motorcycles to return (default: 50)
 * @returns Array of motorcycles
 */
export async function getAllMotorcycles(
  filters?: {
    brand?: string
    category?: string
    status?: string
  },
  limitCount: number = 50
): Promise<MotorcycleFormData[]> {
  try {
    const motorcyclesRef = collection(db, MOTORCYCLES_COLLECTION)
    let q: Query<DocumentData>
    
    // If filtering by status with other filters or ordering, we need an index
    // For now, use simpler queries until index is built
    if (filters?.status && !filters?.brand && !filters?.category) {
      // Simple status filter with ordering - requires index
      q = query(
        motorcyclesRef,
        where('status', '==', filters.status),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    } else if (filters?.status) {
      // Multiple filters - get all by status first, then filter in memory
      q = query(
        motorcyclesRef,
        where('status', '==', filters.status),
        limit(limitCount * 2) // Get more to account for filtering
      )
    } else {
      // No status filter - simple query
      q = query(motorcyclesRef, orderBy('createdAt', 'desc'), limit(limitCount))
      
      // Apply other filters
      if (filters?.brand) {
        q = query(q, where('brand', '==', filters.brand))
      }
      if (filters?.category) {
        q = query(q, where('category', '==', filters.category))
      }
    }
    
    const querySnapshot = await getDocs(q)
    let motorcycles: MotorcycleFormData[] = []
    
    querySnapshot.forEach((doc) => {
      motorcycles.push(doc.data() as MotorcycleFormData)
    })
    
    // Apply additional filters in memory if needed
    if (filters?.brand && filters?.status) {
      motorcycles = motorcycles.filter(m => m.brand === filters.brand)
    }
    if (filters?.category && filters?.status) {
      motorcycles = motorcycles.filter(m => m.category === filters.category)
    }
    
    // Sort by createdAt if we filtered in memory
    if (filters?.status && (filters?.brand || filters?.category)) {
      motorcycles.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt as string | Date).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt as string | Date).getTime() : 0
        return dateB - dateA
      })
    }
    
    // Limit results
    return motorcycles.slice(0, limitCount)
  } catch (error) {
    console.error('Error fetching motorcycles:', error)
    throw new Error('Failed to fetch motorcycles')
  }
}

/**
 * Get motorcycles by brand
 * @param brand - Brand name
 * @returns Array of motorcycles for the specified brand
 */
export async function getMotorcyclesByBrand(brand: string): Promise<MotorcycleFormData[]> {
  return getAllMotorcycles({ brand })
}

/**
 * Get motorcycles by category
 * @param category - Category name
 * @returns Array of motorcycles in the specified category
 */
export async function getMotorcyclesByCategory(category: string): Promise<MotorcycleFormData[]> {
  return getAllMotorcycles({ category })
}

/**
 * Save draft motorcycle
 * @param draftData - Draft motorcycle data
 * @param userId - User ID
 * @param draftId - Optional draft ID (for updating existing draft)
 * @returns Draft ID
 */
export async function saveDraft(
  draftData: Partial<MotorcycleFormData>,
  userId: string,
  draftId?: string
): Promise<string> {
  try {
    const draftsRef = collection(db, 'motorcycle_drafts')
    const docRef = draftId ? doc(draftsRef, draftId) : doc(draftsRef)
    
    const draftWithMetadata = {
      ...draftData,
      id: docRef.id,
      userId,
      updatedAt: serverTimestamp(),
      lastSaved: new Date().toISOString()
    }
    
    await setDoc(docRef, draftWithMetadata, { merge: true })
    
    return docRef.id
  } catch (error) {
    console.error('Error saving draft:', error)
    throw new Error('Failed to save draft')
  }
}

/**
 * Get user's drafts
 * @param userId - User ID
 * @returns Array of draft motorcycles
 */
export async function getUserDrafts(userId: string): Promise<Partial<MotorcycleFormData>[]> {
  try {
    const draftsRef = collection(db, 'motorcycle_drafts')
    const q = query(draftsRef, where('userId', '==', userId), orderBy('updatedAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const drafts: Partial<MotorcycleFormData>[] = []
    
    querySnapshot.forEach((doc) => {
      drafts.push(doc.data() as Partial<MotorcycleFormData>)
    })
    
    return drafts
  } catch (error) {
    console.error('Error fetching drafts:', error)
    throw new Error('Failed to fetch drafts')
  }
}

/**
 * Delete a draft
 * @param draftId - Draft document ID
 */
export async function deleteDraft(draftId: string): Promise<void> {
  try {
    const draftRef = doc(db, 'motorcycle_drafts', draftId)
    await deleteDoc(draftRef)
  } catch (error) {
    console.error('Error deleting draft:', error)
    throw new Error('Failed to delete draft')
  }
}
