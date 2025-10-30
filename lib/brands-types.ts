import { db } from './firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'

export interface Brand {
  id: string
  name: string
  distributor?: string
  createdAt?: Date | null
  updatedAt?: Date | null
}

export interface MotorcycleType {
  id: string
  name: string
  description?: string
  createdAt?: Date | null
  updatedAt?: Date | null
}

/**
 * Fetch all brands from Firestore
 */
export async function getAllBrands(): Promise<Brand[]> {
  try {
    const brandsRef = collection(db, 'brands')
    const q = query(brandsRef, orderBy('name', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const brands: Brand[] = []
    querySnapshot.forEach((doc) => {
      brands.push({
        id: doc.id,
        ...doc.data()
      } as Brand)
    })
    
    return brands
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

/**
 * Fetch all motorcycle types from Firestore
 */
export async function getAllTypes(): Promise<MotorcycleType[]> {
  try {
    const typesRef = collection(db, 'types')
    const q = query(typesRef, orderBy('name', 'asc'))
    const querySnapshot = await getDocs(q)
    
    const types: MotorcycleType[] = []
    querySnapshot.forEach((doc) => {
      types.push({
        id: doc.id,
        ...doc.data()
      } as MotorcycleType)
    })
    
    return types
  } catch (error) {
    console.error('Error fetching types:', error)
    return []
  }
}
