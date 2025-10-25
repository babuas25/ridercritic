import { Facebook, Instagram, Users } from "lucide-react"
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
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
              href="https://www.facebook.com/groups/ridercritic" 
              target="_blank" 
              rel="noreferrer" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              <span className="sr-only">Facebook Group</span>
            </a>
          </div>

          {/* Policy Links */}
          <div className="flex space-x-4">
            <Link 
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms & Conditions
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