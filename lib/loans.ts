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
import { LoanOffer } from '@/types/loan'

const LOANS_COLLECTION = 'loanOffers'

/**
 * Create a new loan offer
 * @param loanData - Loan offer data
 * @param userId - ID of the user creating the loan offer
 * @returns The created loan offer ID
 */
export async function createLoanOffer(
  loanData: LoanOffer,
  userId: string
): Promise<string> {
  try {
    const loansRef = collection(db, LOANS_COLLECTION)
    const newDocRef = doc(loansRef)
    
    const loanWithMetadata = {
      ...loanData,
      id: newDocRef.id,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastUpdatedBy: userId,
      lastUpdatedDate: new Date().toISOString()
    }
    
    await setDoc(newDocRef, loanWithMetadata)
    
    return newDocRef.id
  } catch (error) {
    console.error('Error creating loan offer:', error)
    throw new Error('Failed to create loan offer')
  }
}

/**
 * Get a single loan offer by ID
 * @param loanId - Loan offer document ID
 * @returns Loan offer data or null if not found
 */
export async function getLoanOffer(loanId: string): Promise<LoanOffer | null> {
  try {
    const loanRef = doc(db, LOANS_COLLECTION, loanId)
    const loanSnap = await getDoc(loanRef)
    
    if (loanSnap.exists()) {
      return loanSnap.data() as LoanOffer
    }
    
    return null
  } catch (error) {
    console.error('Error fetching loan offer:', error)
    throw new Error('Failed to fetch loan offer')
  }
}

/**
 * Update an existing loan offer
 * @param loanId - Loan offer document ID
 * @param loanData - Updated loan offer data
 * @param userId - ID of the user updating the loan offer
 */
export async function updateLoanOffer(
  loanId: string,
  loanData: Partial<LoanOffer>,
  userId: string
): Promise<void> {
  try {
    const loanRef = doc(db, LOANS_COLLECTION, loanId)
    
    const updateData = {
      ...loanData,
      updatedAt: serverTimestamp(),
      lastUpdatedBy: userId,
      lastUpdatedDate: new Date().toISOString()
    }
    
    await updateDoc(loanRef, updateData)
  } catch (error) {
    console.error('Error updating loan offer:', error)
    throw new Error('Failed to update loan offer')
  }
}

/**
 * Delete a loan offer
 * @param loanId - Loan offer document ID
 */
export async function deleteLoanOffer(loanId: string): Promise<void> {
  try {
    const loanRef = doc(db, LOANS_COLLECTION, loanId)
    await deleteDoc(loanRef)
  } catch (error) {
    console.error('Error deleting loan offer:', error)
    throw new Error('Failed to delete loan offer')
  }
}

/**
 * Get all loan offers with optional filters
 * @param filters - Optional filters (loanType, status)
 * @param limitCount - Number of loan offers to return (default: 50)
 * @returns Array of loan offers
 */
export async function getAllLoanOffers(
  filters?: {
    loanType?: 'Official' | 'Unofficial' | 'Bank'
    status?: 'Active' | 'Inactive'
  },
  limitCount: number = 50
): Promise<LoanOffer[]> {
  try {
    const loansRef = collection(db, LOANS_COLLECTION)
    let q: Query<DocumentData> = query(loansRef, orderBy('createdAt', 'desc'), limit(limitCount))
    
    // Apply filters if provided
    if (filters?.loanType) {
      q = query(q, where('loanType', '==', filters.loanType))
    }
    
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status))
    }
    
    const querySnapshot = await getDocs(q)
    const loans: LoanOffer[] = []
    
    querySnapshot.forEach((doc) => {
      loans.push(doc.data() as LoanOffer)
    })
    
    return loans
  } catch (error) {
    console.error('Error fetching loan offers:', error)
    throw new Error('Failed to fetch loan offers')
  }
}
