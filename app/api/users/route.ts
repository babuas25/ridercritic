import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: NextRequest) {
  try {
    console.log('API GET /api/users - Starting request processing');
    
    // Get JWT token from cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    console.log('API GET /api/users - Token received:', token);
    
    if (!token) {
      console.log('API GET /api/users - No token found, returning 401');
      return NextResponse.json({ 
        error: 'Unauthorized - No valid session token',
        details: 'Session token is missing or invalid'
      }, { status: 401 })
    }

    // Check if user is admin or super admin
    const userRole = token.role
    console.log('API GET /api/users - Token role:', userRole);
    const isAdmin = ['Super Admin', 'Admin'].includes(userRole as string)

    if (!isAdmin) {
      console.log('API GET /api/users - User is not admin, returning 403');
      return NextResponse.json({ 
        error: 'Forbidden - Insufficient permissions', 
        details: { 
          role: userRole, 
          required: ['Super Admin', 'Admin'],
          isAdminCheck: isAdmin
        } 
      }, { status: 403 })
    }

    // Check if Admin SDK is configured
    if (!adminDb) {
      console.log('API GET /api/users - Admin SDK not configured, returning 500');
      return NextResponse.json({ 
        error: 'Server configuration error - Admin SDK not configured',
        details: 'Missing Firebase Admin credentials'
      }, { status: 500 })
    }

    console.log('API GET /api/users - Fetching users from Firestore');
    // Fetch all users from Firestore
    const usersSnapshot = await adminDb.collection('users').get()
    
    console.log('API GET /api/users - Users fetched:', usersSnapshot.size);
    
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

    console.log('API GET /api/users - Returning users:', users.length);
    return NextResponse.json({ users })
  } catch (error: unknown) {
    console.error('API GET /api/users - Error fetching users:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        stack: error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined,
        name: error && typeof error === 'object' && 'name' in error ? (error as { name?: string }).name : 'UnknownError'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('API PUT /api/users - Starting request processing');
    
    // Get JWT token from cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    console.log('API PUT /api/users - Token received:', token);
    
    if (!token) {
      console.log('API PUT /api/users - No token found, returning 401');
      return NextResponse.json({ 
        error: 'Unauthorized - No valid session token',
        details: 'Session token is missing or invalid'
      }, { status: 401 })
    }

    // Check if user is admin or super admin
    const userRole = token.role
    console.log('API PUT /api/users - Token role:', userRole);
    const isAdmin = ['Super Admin', 'Admin'].includes(userRole as string)

    if (!isAdmin) {
      console.log('API PUT /api/users - User is not admin, returning 403');
      return NextResponse.json({ 
        error: 'Forbidden - Insufficient permissions', 
        details: { 
          role: userRole, 
          required: ['Super Admin', 'Admin'],
          isAdminCheck: isAdmin
        } 
      }, { status: 403 })
    }

    // Check if Admin SDK is configured
    if (!adminDb) {
      console.log('API PUT /api/users - Admin SDK not configured, returning 500');
      return NextResponse.json({ 
        error: 'Server configuration error - Admin SDK not configured',
        details: 'Missing Firebase Admin credentials'
      }, { status: 500 })
    }

    const body = await request.json()
    console.log('API PUT /api/users - Request body:', body);
    
    const { uid, displayName, role, subRole } = body

    if (!uid) {
      console.log('API PUT /api/users - Missing UID, returning 400');
      return NextResponse.json({ 
        error: 'Bad Request - User ID is required',
        details: 'The uid field is missing from the request body'
      }, { status: 400 })
    }

    // Update user in Firestore
    console.log('API PUT /api/users - Updating user in Firestore:', uid);
    const userRef = adminDb.collection('users').doc(uid)
    await userRef.update({
      displayName,
      role,
      subRole,
      updatedAt: new Date(),
    })
    
    console.log('API PUT /api/users - User updated successfully:', uid);
    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('API PUT /api/users - Error updating user:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update user',
        stack: error instanceof Error && process.env.NODE_ENV === 'development' ? error.stack : undefined,
        name: error && typeof error === 'object' && 'name' in error ? (error as { name?: string }).name : 'UnknownError'
      },
      { status: 500 }
    )
  }
}

