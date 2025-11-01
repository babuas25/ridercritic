import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit') || '20'
    const limitCount = parseInt(limitParam, 10)
    
    const motorcyclesRef = collection(db, 'motorcycles')
    const q = query(motorcyclesRef, orderBy('createdAt', 'desc'), limit(limitCount))
    const querySnapshot = await getDocs(q)
    
    const motorcycles = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        name: `${data.brand} ${data.modelName} ${data.modelYear || ''}`.trim(),
        brand: data.brand || '',
        modelName: data.modelName || '',
        modelYear: data.modelYear || '',
        displacement: data.displacement || '',
        coverImage: data.coverImage || ''
      }
    })
    
    return NextResponse.json(motorcycles)
  } catch (error) {
    console.error('Error fetching motorcycles:', error)
    return NextResponse.json({ error: 'Failed to fetch motorcycles' }, { status: 500 })
  }
}