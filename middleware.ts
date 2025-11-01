import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to public routes and OAuth callbacks
  if (pathname.startsWith('/auth') ||
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/api/auth/callback') ||
      pathname === '/' ||
      pathname.startsWith('/about') ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/accessories') ||
      pathname.startsWith('/motorcycle') ||
      pathname.startsWith('/products') ||
      pathname.startsWith('/reviews') && !pathname.startsWith('/dashboard/reviews/write') ||
      pathname.startsWith('/login') ||
      pathname.startsWith('/register')) {
    return NextResponse.next()
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const token = await getToken({ req: request })

    if (!token) {
      const url = new URL('/auth', request.url)
      return NextResponse.redirect(url)
    }

    const role = token.role as string
    // subRole is not used in this middleware

    // Allow User Admin with any subrole to access review writing page
    if (pathname.startsWith('/dashboard/reviews/write') && role === 'User Admin') {
      return NextResponse.next()
    }

    // Check role-based access for specific admin paths
    if (pathname.startsWith('/dashboard/super-admin') && role !== 'Super Admin') {
      const url = new URL('/dashboard/user', request.url)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/dashboard/admin') && !['Admin', 'Super Admin'].includes(role)) {
      const url = new URL('/dashboard/user', request.url)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/dashboard/sponsor') && !['Sponsor Admin', 'Admin', 'Super Admin'].includes(role)) {
      const url = new URL('/dashboard/user', request.url)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/dashboard/supplier') && !['Supplier Admin', 'Admin', 'Super Admin'].includes(role)) {
      const url = new URL('/dashboard/user', request.url)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/dashboard/partner') && !['Partner Admin', 'Admin', 'Super Admin'].includes(role)) {
      const url = new URL('/dashboard/user', request.url)
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/dashboard/freelancer') && !['Freelancer Admin', 'Admin', 'Super Admin'].includes(role)) {
      const url = new URL('/dashboard/user', request.url)
      return NextResponse.redirect(url)
    }
    
    // Allow general dashboard access for all authenticated users
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      // Redirect to appropriate dashboard based on role
      if (role === 'Super Admin') {
        const url = new URL('/dashboard/super-admin', request.url)
        return NextResponse.redirect(url)
      } else if (role === 'Admin') {
        const url = new URL('/dashboard/admin', request.url)
        return NextResponse.redirect(url)
      } else {
        // For User Admin and other roles, go to user dashboard
        const url = new URL('/dashboard/user', request.url)
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth',
    '/api/auth/:path*'
  ]
}