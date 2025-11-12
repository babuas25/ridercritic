import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

type BrandUpdatePayload = {
  name?: string
  distributor?: string
  logoUrl?: string
  updatedAt: Date
}

type NewBrandPayload = {
  name: string
  distributor: string
  logoUrl?: string
  createdAt: Date
  updatedAt: Date
}

export async function GET() {
  try {
    // Check if Admin SDK is configured
    if (!adminDb) {
      console.error('Firebase Admin not initialized in GET /api/brands')
      return NextResponse.json(
        { error: 'Admin SDK not configured' },
        { status: 500 }
      )
    }
    
    const brandsSnapshot = await adminDb.collection('brands').get()
    const brands = brandsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }))
    
    return NextResponse.json({ brands })
  } catch (error) {
    console.error('Detailed Brands API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch brands',
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Admin SDK not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { name, distributor, logoUrl } = body

    const updateData: BrandUpdatePayload = { updatedAt: new Date() }
    if (typeof name === 'string') updateData.name = name
    if (typeof distributor === 'string') updateData.distributor = distributor
    if (typeof logoUrl === 'string') updateData.logoUrl = logoUrl

    await adminDb.collection('brands').doc(id).update(updateData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Detailed Brands API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update brand',
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Admin SDK is configured
    if (!adminDb) {
      console.error('Firebase Admin not initialized in POST /api/brands')
      return NextResponse.json(
        { error: 'Admin SDK not configured' },
        { status: 500 }
      )
    }
    
    if (!adminDb) {
      console.error('Firebase Admin not initialized in POST /api/brands')
      return NextResponse.json(
        { error: 'Admin SDK not configured' },
        { status: 500 }
      )
    }
    
    const body = await request.json()
    const { name, distributor, logoUrl } = body
    
    if (!name || !distributor) {
      return NextResponse.json(
        { error: 'Name and distributor are required' },
        { status: 400 }
      )
    }
    
    const newBrand: NewBrandPayload = {
      name,
      distributor,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...(typeof logoUrl === 'string' ? { logoUrl } : {}),
    }
    
    const docRef = await adminDb.collection('brands').add(newBrand)
    
    return NextResponse.json({
      id: docRef.id,
      ...newBrand,
    })
  } catch (error) {
    console.error('Detailed Brands API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create brand',
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 });
    }
    
    // Check if Admin SDK is configured
    if (!adminDb) {
      return NextResponse.json({ error: 'Admin SDK not configured' }, { status: 500 });
    }
    
    await adminDb.collection('brands').doc(id).delete();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Detailed Brands API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete brand',
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
}
