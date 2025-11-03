import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where
} from 'firebase/firestore'
import { db } from './firebase'

const COMMENTS_COLLECTION = 'comments'

export interface CommentData {
  id?: string
  criticId: string
  content: string
  authorName: string
  userId?: string // Optional for logged-in users
  isAnonymous: boolean
  createdAt: Date | string | null
  updatedAt: Date | string | null
}

/**
 * Create a new comment
 * @param commentData - Comment form data
 * @param userId - ID of the user creating the comment (optional)
 * @param userName - Name of the user creating the comment
 * @returns The created comment ID
 */
export async function createComment(
  commentData: Omit<CommentData, 'id' | 'createdAt' | 'updatedAt'>,
  userId: string | null,
  userName: string
): Promise<string> {
  try {
    const commentsRef = collection(db, COMMENTS_COLLECTION)
    const newDocRef = doc(commentsRef)
    
    // Build comment object, only including userId if it exists
    const commentWithMetadata: Record<string, unknown> = {
      ...commentData,
      authorName: userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }
    
    // Only add userId if it's not null
    if (userId) {
      commentWithMetadata.userId = userId
    }
    
    await setDoc(newDocRef, commentWithMetadata)
    
    return newDocRef.id
  } catch (error) {
    console.error('Error creating comment:', error)
    throw new Error('Failed to create comment: ' + (error as Error).message)
  }
}

/**
 * Get comments for a specific critic
 * @param criticId - Critic document ID
 * @returns Array of comments
 */
export async function getCommentsByCritic(criticId: string): Promise<CommentData[]> {
  try {
    const commentsRef = collection(db, COMMENTS_COLLECTION)
    
    // Try the optimized query first (requires composite index)
    try {
      const q = query(
        commentsRef, 
        where('criticId', '==', criticId), 
        orderBy('createdAt', 'asc')
      )
      
      const querySnapshot = await getDocs(q)
      const comments: CommentData[] = []
      
      querySnapshot.forEach((doc) => {
        comments.push({
          ...doc.data(),
          id: doc.id
        } as CommentData)
      })
      
      return comments
    } catch {
      // If the composite index is not available, fall back to client-side filtering
      console.warn('Composite index not available, using fallback query method')
      
      // Get all comments and filter client-side
      const allCommentsSnapshot = await getDocs(commentsRef)
      const allComments: CommentData[] = []
      
      allCommentsSnapshot.forEach((doc) => {
        allComments.push({
          ...doc.data(),
          id: doc.id
        } as CommentData)
      })
      
      // Filter by criticId and sort by createdAt
      const filteredComments = allComments
        .filter(comment => comment.criticId === criticId)
        .sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt as string)
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt as string)
          return dateA.getTime() - dateB.getTime()
        })
      
      return filteredComments
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    throw new Error('Failed to fetch comments')
  }
}

/**
 * Update an existing comment
 * @param commentId - Comment document ID
 * @param commentData - Updated comment data
 */
export async function updateComment(
  commentId: string,
  commentData: Partial<CommentData>
): Promise<void> {
  try {
    const commentRef = doc(db, COMMENTS_COLLECTION, commentId)
    
    const updateData = {
      ...commentData,
      updatedAt: serverTimestamp()
    }
    
    await updateDoc(commentRef, updateData)
  } catch (error) {
    console.error('Error updating comment:', error)
    throw new Error('Failed to update comment')
  }
}

/**
 * Delete a comment
 * @param commentId - Comment document ID
 */
export async function deleteComment(commentId: string): Promise<void> {
  try {
    const commentRef = doc(db, COMMENTS_COLLECTION, commentId)
    await deleteDoc(commentRef)
  } catch (error) {
    console.error('Error deleting comment:', error)
    throw new Error('Failed to delete comment')
  }
}