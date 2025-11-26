// app/robots.txt/route.ts (Next.js 13+ App Router)
import { NextResponse } from 'next/server'

export async function GET() {
  const content = `User-agent: *
Allow: /

Host: ridercritic.com
Sitemap: https://ridercritic.com/sitemap.xml
`

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
