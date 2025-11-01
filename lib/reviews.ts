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

const REVIEWS_COLLECTION = 'reviews'

export interface ReviewData {
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
}

/**
 * Create a new review document
 * @param reviewData - Review form data
 * @param userId - ID of the user creating the review
 * @param userName - Name of the user creating the review
 * @returns The created review ID
 */
export async function createReview(
  reviewData: Omit<ReviewData, 'id' | 'userId' | 'authorName' | 'createdAt' | 'updatedAt'>,
  userId: string,
  userName: string
): Promise<string> {
  try {
    console.log('Creating review with userId:', userId);
    console.log('Review data:', reviewData);
    
    // Remove Firebase authentication check since we're using NextAuth
    // The Firestore rules will handle permissions
    /*
    const currentUser = auth.currentUser;
    console.log('Current Firebase user:', currentUser);
    
    if (!currentUser) {
      throw new Error('User not authenticated with Firebase');
    }
    */
    
    const reviewsRef = collection(db, REVIEWS_COLLECTION)
    const newDocRef = doc(reviewsRef)
    
    const reviewWithMetadata = {
      ...reviewData,
      userId: userId,
      authorName: userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    console.log('Review with metadata:', reviewWithMetadata);
    
    await setDoc(newDocRef, reviewWithMetadata)
    
    console.log('Review created successfully with ID:', newDocRef.id);
    
    return newDocRef.id
  } catch (error) {
    console.error('Error creating review:', error)
    throw new Error('Failed to create review: ' + (error as Error).message)
  }
}

/**
 * Upload review images and return their URLs
 * @param images - Array of image files
 * @returns Array of image URLs
 */
export async function uploadReviewImages(images: File[]): Promise<string[]> {
  if (images.length === 0) return []
  
  try {
    const timestamp = Date.now()
    const path = `reviews/${timestamp}`
    const urls = await Promise.all(
      images.map(file => uploadImage(file, path))
    )
    return urls
  } catch (error) {
    console.error('Error uploading review images:', error)
    throw new Error('Failed to upload images')
  }
}

/**
 * Get a single review by ID
 * @param reviewId - Review document ID
 * @returns Review data or null if not found
 */
export async function getReview(reviewId: string): Promise<ReviewData | null> {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId)
    const reviewSnap = await getDoc(reviewRef)
    
    if (reviewSnap.exists()) {
      return {
        ...reviewSnap.data(),
        id: reviewSnap.id
      } as ReviewData
    }
    
    return null
  } catch (error) {
    console.error('Error fetching review:', error)
    throw new Error('Failed to fetch review')
  }
}

/**
 * Get all reviews with optional filters
 * @param limitCount - Number of reviews to return (default: 50)
 * @returns Array of reviews
 */
export async function getAllReviews(limitCount: number = 50): Promise<ReviewData[]> {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION)
    const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(limitCount))
    
    const querySnapshot = await getDocs(q)
    const reviews: ReviewData[] = []
    
    querySnapshot.forEach((doc) => {
      reviews.push({
        ...doc.data(),
        id: doc.id
      } as ReviewData)
    })
    
    return reviews
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw new Error('Failed to fetch reviews')
  }
}

/**
 * Get reviews by author
 * @param authorId - Author ID
 * @returns Array of reviews by the author
 */
export async function getReviewsByAuthor(authorId: string): Promise<ReviewData[]> {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION)
    const q = query(reviewsRef, where('userId', '==', authorId), orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const reviews: ReviewData[] = []
    
    querySnapshot.forEach((doc) => {
      reviews.push({
        ...doc.data(),
        id: doc.id
      } as ReviewData)
    })
    
    return reviews
  } catch (error) {
    console.error('Error fetching reviews by author:', error)
    throw new Error('Failed to fetch reviews by author')
  }
}

/**
 * Get reviews by topic
 * @param topic - Topic name
 * @returns Array of reviews with the topic
 */
export async function getReviewsByTopic(topic: string): Promise<ReviewData[]> {
  try {
    const reviewsRef = collection(db, REVIEWS_COLLECTION)
    const q = query(reviewsRef, where('topic', '==', topic), orderBy('createdAt', 'desc'))
    
    const querySnapshot = await getDocs(q)
    const reviews: ReviewData[] = []
    
    querySnapshot.forEach((doc) => {
      reviews.push({
        ...doc.data(),
        id: doc.id
      } as ReviewData)
    })
    
    return reviews
  } catch (error) {
    console.error('Error fetching reviews by topic:', error)
    throw new Error('Failed to fetch reviews by topic')
  }
}

/**
 * Update an existing review
 * @param reviewId - Review document ID
 * @param reviewData - Updated review data
 */
export async function updateReview(
  reviewId: string,
  reviewData: Partial<ReviewData>
): Promise<void> {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId)
    
    const updateData = {
      ...reviewData,
      updatedAt: serverTimestamp()
    }
    
    await updateDoc(reviewRef, updateData)
  } catch (error) {
    console.error('Error updating review:', error)
    throw new Error('Failed to update review')
  }
}

/**
 * Delete a review
 * @param reviewId - Review document ID
 */
export async function deleteReview(reviewId: string): Promise<void> {
  try {
    const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId)
    await deleteDoc(reviewRef)
  } catch (error) {
    console.error('Error deleting review:', error)
    throw new Error('Failed to delete review')
  }
}