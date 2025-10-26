import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function MainNav() {
  return (
    <nav className="sticky top-[4rem] z-40 border-b bg-background hidden md:block">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              "text-primary"
            )}
          >
            Home
          </Link>
          <Link
            href="/reviews"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Reviews
          </Link>
          <Link
            href="/motorcycle"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Motorcycles
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}