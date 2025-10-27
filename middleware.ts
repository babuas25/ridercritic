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
      pathname.startsWith('/reviews') ||
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

    // Check role-based access
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
