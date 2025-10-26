import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow access to public routes
  if (pathname.startsWith('/login') ||
      pathname.startsWith('/register') ||
      pathname.startsWith('/api/auth') ||
      pathname === '/' ||
      pathname.startsWith('/about') ||
      pathname.startsWith('/contact') ||
      pathname.startsWith('/accessories') ||
      pathname.startsWith('/motorcycle') ||
      pathname.startsWith('/products') ||
      pathname.startsWith('/reviews')) {
    return NextResponse.next()
  }

  // For testing: temporarily allow all dashboard access
  // TODO: Add proper NextAuth session checking
  if (pathname.startsWith('/dashboard')) {
    console.log('Dashboard access - temporarily allowed for testing')
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/api/auth/:path*'
  ]
}
