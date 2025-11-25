import { Facebook, Instagram, Users, Twitter } from "lucide-react"
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center flex-wrap gap-4">
          {/* Social Media Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://www.facebook.com/RiderCritic/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook Page</span>
            </a>
            <a 
              href="https://www.instagram.com/ridercritic/" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </a>
            <a 
              href="https://x.com/ridercritics" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">X (Twitter)</span>
            </a>
            <a 
              href="https://www.facebook.com/groups/ridercritic" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              <span className="sr-only">Facebook Group</span>
            </a>
          </div>

          {/* Explore / Internal Links */}
          <div className="flex items-center gap-3 text-sm overflow-x-auto whitespace-nowrap scrollbar-thin">
            <span className="text-muted-foreground flex-shrink-0">Explore:</span>
            <Link 
              href="/"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Home
            </Link>
            <Link 
              href="/critics/write"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              New Critic
            </Link>
            <Link 
              href="/motorcycle"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Motorcycles
            </Link>
            <Link 
              href="/critics"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Critics
            </Link>
            <Link 
              href="/blog"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Blog
            </Link>
            <Link 
              href="/comparisons"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Comparisons
            </Link>
            <Link 
              href="/brands"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Brands
            </Link>
            <Link 
              href="/about"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              Contact
            </Link>
          </div>

          {/* Policy Links */}
          <div className="flex space-x-4">
            <Link 
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ridercritic. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}