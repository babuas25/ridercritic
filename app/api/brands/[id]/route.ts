import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    if (!id) {
      return NextResponse.json({ error: 'Brand ID is required' }, { status: 400 })
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Admin SDK not configured' }, { status: 500 })
    }

    const doc = await adminDb.collection('brands').doc(id).get()
    if (!doc.exists) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const data = doc.data() || {}
    return NextResponse.json({
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() ?? null,
      updatedAt: data.updatedAt?.toDate?.() ?? null,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch brand',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
