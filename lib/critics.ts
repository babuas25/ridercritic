import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  where
} from 'firebase/firestore'
import { db } from './firebase'
import { uploadImage } from './storage'

const CRITICS_COLLECTION = 'reviews'

export interface CriticData {
  id?: string
  title: string
  topic: string
  rating: number
  content: string
  images: string[]
  youtubeLink?: string
  userId: string
  authorName: string
  createdAt: Date | string | null
  updatedAt: Date | string | null
  status?: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

/**
 * Create a new critic document
 * @param criticData - Critic form data
 * @param userId - ID of the user creating the critic
 * @param userName - Name of the user creating the critic
 * @returns The created critic ID
 */
export async function createCritic(
  criticData: Omit<CriticData, 'id' | 'userId' | 'authorName' | 'createdAt' | 'updatedAt'>,
  userId: string,
  userName: string
): Promise<string> {
  try {
    console.log('Creating critic with userId:', userId);
    console.log('Critic data:', criticData);
    
    // Remove Firebase authentication check since we're using NextAuth
    // The Firestore rules will handle permissions
    /*
    const currentUser = auth.currentUser;
    console.log('Current Firebase user:', currentUser);
    
    if (!currentUser) {
      throw new Error('User not authenticated with Firebase');
    }
    */
    
    const criticsRef = collection(db, CRITICS_COLLECTION)
    const newDocRef = doc(criticsRef)
    
    const criticWithMetadata = {
      ...criticData,
      userId: userId,
      authorName: userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'pending' // Set default status to pending
    }
    
    console.log('Critic with metadata:', criticWithMetadata);
    
    await setDoc(newDocRef, criticWithMetadata)
    
    console.log('Critic created successfully with ID:', newDocRef.id);
    
    return newDocRef.id
  } catch (error) {
    console.error('Error creating critic:', error)
    throw new Error('Failed to create critic: ' + (error as Error).message)
  }
}

/**
 * Upload critic images and return their URLs
 * @param images - Array of image files
 * @returns Array of image URLs
 */
export async function uploadCriticImages(images: File[]): Promise<string[]> {
  if (images.length === 0) return []
  
  try {
    const timestamp = Date.now()
    const path = `reviews/${timestamp}`
    const urls = await Promise.all(
      images.map(file => uploadImage(file, path))
    )
    return urls
  } catch (error) {
    console.error('Error uploading critic images:', error)
    throw new Error('Failed to upload images')
  }
}

/**
 * Get a single critic by ID
 * @param criticId - Critic document ID
 * @returns Critic data or null if not found
 */
export async function getCritic(criticId: string): Promise<CriticData | null> {
  try {
    const criticRef = doc(db, CRITICS_COLLECTION, criticId)
    const criticSnap = await getDoc(criticRef)
    
    if (criticSnap.exists()) {
      return {
        ...criticSnap.data(),
        id: criticSnap.id
      } as CriticData
    }
    
    return null
  } catch (error) {
    console.error('Error fetching critic:', error)
    throw new Error('Failed to fetch critic')
  }
}

/**
 * Get all critics with optional filters
 * @param limitCount - Number of critics to return (default: 50)
 * @returns Array of critics
 */
export async function getAllCritics(limitCount: number = 50): Promise<CriticData[]> {
  try {
    const criticsRef = collection(db, CRITICS_COLLECTION)
    const q = query(criticsRef, orderBy('createdAt', 'desc'), limit(limitCount))
    
    const querySnapshot = await getDocs(q)
    const critics: CriticData[] = []
    
    querySnapshot.forEach((doc) => {
      critics.push({
        ...doc.data(),
        id: doc.id
      } as CriticData)
    })
    
    return critics
  } catch (error) {
    console.error('Error fetching critics:', error)
    throw new Error('Failed to fetch critics')
  }
}

/**
 * Get critics by author
 * @param authorId - Author ID
 * @returns Array of critics by the author
 */
export async function getCriticsByAuthor(authorId: string): Promise<CriticData[]> {
  try {
    console.log('Fetching critics for author ID:', authorId);
    const criticsRef = collection(db, CRITICS_COLLECTION)
    // Simplified query that doesn't require a composite index
    const q = query(criticsRef, where('userId', '==', authorId))
    
    const querySnapshot = await getDocs(q)
    console.log('Query returned', querySnapshot.size, 'documents');
    const critics: CriticData[] = []
    
    querySnapshot.forEach((doc) => {
      console.log('Processing document:', doc.id, doc.data());
      critics.push({
        ...doc.data(),
        id: doc.id
      } as CriticData)
    })
    
    // Sort critics by createdAt date in descending order (newest first)
    critics.sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as string || 0)
      const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as string || 0)
      return dateB.getTime() - dateA.getTime()
    })
    
    console.log('Returning', critics.length, 'critics');
    return critics
  } catch (error) {
    console.error('Error fetching critics by author:', error)
    throw new Error('Failed to fetch critics by author: ' + (error as Error).message)
  }
}

/**
 * Get critics by topic
 * @param topic - Topic name
 * @returns Array of critics with the topic
 */
export async function getCriticsByTopic(topic: string): Promise<CriticData[]> {
  try {
    const criticsRef = collection(db, CRITICS_COLLECTION)
    const q = query(criticsRef, where('topic', '==', topic), orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const critics: CriticData[] = []
    
    querySnapshot.forEach((doc) => {
      critics.push({
        ...doc.data(),
        id: doc.id
      } as CriticData)
    })
    
    return critics
  } catch (error) {
    console.error('Error fetching critics by topic:', error)
    throw new Error('Failed to fetch critics by topic')
  }
}

/**
 * Update an existing critic
 * @param criticId - Critic document ID
 * @param criticData - Updated critic data
 */
export async function updateCritic(
  criticId: string,
  criticData: Partial<CriticData>
): Promise<void> {
  try {
    const criticRef = doc(db, CRITICS_COLLECTION, criticId)
    
    const updateData = {
      ...criticData,
      updatedAt: serverTimestamp()
    }
    
    await updateDoc(criticRef, updateData)
  } catch (error) {
    console.error('Error updating critic:', error)
    throw new Error('Failed to update critic')
  }
}

/**
 * Delete a critic
 * @param criticId - Critic document ID
 */
export async function deleteCritic(criticId: string): Promise<void> {
  try {
    const criticRef = doc(db, CRITICS_COLLECTION, criticId)
    await deleteDoc(criticRef)
  } catch (error) {
    console.error('Error deleting critic:', error)
    throw new Error('Failed to delete critic')
  }
}