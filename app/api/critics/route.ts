import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getAllCritics, getCriticsByAuthor } from '@/lib/critics'
import { adminDb } from '@/lib/firebase-admin'
import { CriticData } from '@/lib/critics'

export async function GET(request: NextRequest) {
  try {
    console.log('API GET - Critics request received')
    
    // Get JWT token from cookies
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET 
    })
    
    console.log('API GET - Token:', token ? 'Present' : 'Missing')
    
    if (!token) {
      console.log('API GET - No token found, returning 401')
      return NextResponse.json({ error: 'Unauthorized', details: 'No authentication token found' }, { status: 401 })
    }

    // Check if user is admin or super admin
    const userRole = token.role
    console.log('API GET - Token role:', userRole)
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || 'all'
    const authorId = searchParams.get('authorId')
    
    // If authorId is provided, user must be admin or requesting their own critics
    if (authorId && authorId !== token.sub && !['Super Admin', 'Admin'].includes(userRole as string)) {
      console.log('API GET - User not authorized to view critics for author:', authorId)
      return NextResponse.json({ error: 'Forbidden', details: 'You are not authorized to view critics for this author' }, { status: 403 })
    }
    
    let critics: CriticData[] = []
    
    // If authorId is provided, fetch critics by that author
    if (authorId) {
      console.log('API GET - Fetching critics for author:', authorId)
      try {
        critics = await getCriticsByAuthor(authorId)
        console.log('API GET - Critics fetched for author:', critics.length)
      } catch (error: unknown) {
        console.error('API GET - Error fetching critics for author:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw new Error(`Failed to fetch critics for author: ${errorMessage}`)
      }
    } else {
      // Only admins can fetch all critics
      const isAdmin = ['Super Admin', 'Admin'].includes(userRole as string)
      if (!isAdmin) {
        console.log('API GET - User is not admin, returning 403')
        return NextResponse.json({ error: 'Forbidden', details: `User role '${userRole}' does not have permission` }, { status: 403 })
      }
      
      console.log('API GET - Fetching all critics with limit:', limit)
      try {
        critics = await getAllCritics(limit)
        console.log('API GET - All critics fetched:', critics.length)
      } catch (error: unknown) {
        console.error('API GET - Error fetching all critics:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        throw new Error(`Failed to fetch all critics: ${errorMessage}`)
      }
    }
    
    console.log('API GET - Critics fetched:', critics.length)
    
    // Filter by status if needed
    let filteredCritics = critics
    if (status !== 'all') {
      filteredCritics = critics.filter((critic: CriticData) => critic.status === status)
    }

    return NextResponse.json({ critics: filteredCritics })
  } catch (error: unknown) {
    console.error('Error fetching critics:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to fetch critics', details: errorMessage },
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
    const { criticId, status, rejectionReason } = body

    if (!criticId) {
      return NextResponse.json({ error: 'Critic ID is required' }, { status: 400 })
    }

    // Update the critic in Firestore
    const criticRef = adminDb.collection('reviews').doc(criticId)
    
    // Create update data object with proper typing
    const updateData: { [key: string]: string } = {
      status: status
    }
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }
    
    await criticRef.update(updateData)
    
    return NextResponse.json({ 
      success: true, 
      message: `Critic ${status} successfully` 
    })
  } catch (error: unknown) {
    console.error('Error updating critic:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to update critic', details: errorMessage },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const criticId = searchParams.get('id')

    if (!criticId) {
      return NextResponse.json({ error: 'Critic ID is required' }, { status: 400 })
    }

    // Delete the critic from Firestore
    const criticRef = adminDb.collection('reviews').doc(criticId)
    await criticRef.delete()
    
    return NextResponse.json({ 
      success: true, 
      message: 'Critic deleted successfully' 
    })
  } catch (error: unknown) {
    console.error('Error deleting critic:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to delete critic', details: errorMessage },
      { status: 500 }
    )
  }
}