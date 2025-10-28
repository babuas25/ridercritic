import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized in GET /api/types')
      return NextResponse.json(
        { error: 'Admin SDK not configured' },
        { status: 500 }
      )
    }
    const typesSnapshot = await adminDb.collection('types').get()
    const types = typesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate(),
    }))
    
    return NextResponse.json({ types })
  } catch (error) {
    console.error('Error fetching types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch types' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Admin SDK is configured
    if (!adminDb) {
      console.error('Firebase Admin not initialized in POST /api/types')
      return NextResponse.json(
        { error: 'Admin SDK not configured' },
        { status: 500 }
      )
    }
    if (adminDb === null) {
      console.error('Firebase Admin is null in POST /api/types')
      return NextResponse.json(
        { error: 'Admin SDK is null' },
        { status: 500 }
      )
    }
    const body = await request.json()
    const { name, description } = body
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }
    
    const newType = {
      name,
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    
    const docRef = await adminDb.collection('types').add(newType)
    
    return NextResponse.json({
      id: docRef.id,
      ...newType,
    })
  } catch (error) {
    console.error('Error creating type:', error)
    return NextResponse.json(
      { error: 'Failed to create type' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Type ID is required' }, { status: 400 })
    }
    
    if (!adminDb) {
      return NextResponse.json({ error: 'Admin SDK not configured' }, { status: 500 })
    }
    
    await adminDb.collection('types').doc(id).delete()
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting type:', error)
    return NextResponse.json(
      { error: 'Failed to delete type' },
      { status: 500 }
    )
  }
}
