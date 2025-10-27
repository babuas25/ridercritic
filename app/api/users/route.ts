import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or super admin
    const userRole = token.role
    console.log('API GET - Token role:', userRole, 'Token data:', token)
    const isAdmin = ['Super Admin', 'Admin'].includes(userRole as string)

    if (!isAdmin) {
      console.log('API GET - User is not admin')
      return NextResponse.json({ error: 'Forbidden', details: { role: userRole } }, { status: 403 })
    }

    // Check if Admin SDK is configured
    if (!adminDb) {
      return NextResponse.json({ error: 'Admin SDK not configured' }, { status: 500 })
    }

    // Fetch all users from Firestore
    const usersSnapshot = await adminDb.collection('users').get()
    
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        uid: doc.id,
        email: data.email || '',
        displayName: data.displayName || '',
        role: data.role || 'User Admin',
        subRole: data.subRole || 'NewStar',
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
        lastLogin: data.lastLogin?.toDate ? data.lastLogin.toDate() : data.lastLogin,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
      }
    })

    return NextResponse.json({ users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get JWT token from cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin or super admin
    const userRole = token.role
    const isAdmin = ['Super Admin', 'Admin'].includes(userRole as string)

    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Check if Admin SDK is configured
    if (!adminDb) {
      return NextResponse.json({ error: 'Admin SDK not configured' }, { status: 500 })
    }

    const body = await request.json()
    const { uid, displayName, role, subRole } = body

    if (!uid) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Update user in Firestore
    const userRef = adminDb.collection('users').doc(uid)
    await userRef.update({
      displayName,
      role,
      subRole,
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user' },
      { status: 500 }
    )
  }
}

