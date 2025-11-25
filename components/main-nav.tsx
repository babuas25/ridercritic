import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function MainNav() {
  return (
    <nav className="sticky top-[4rem] z-40 border-b bg-background hidden md:block">
      <div className="container flex h-14 items-center">
        <div className="flex gap-6">
          <Link
            href="/critics/write"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              "text-primary"
            )}
          >
            New Critic
          </Link>
          <Link
            href="/motorcycle"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Motorcycles
          </Link>
          <Link
            href="/critics"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Critics / Reviews
          </Link>
          <Link
            href="/blog"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Blog
          </Link>
          <Link
            href="/loan-calculator"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Loan Calculator
          </Link>
          <Link
            href="/fuel-calculator"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Fuel Calculator
          </Link>
          <Link
            href="/comparisons"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Comparisons
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