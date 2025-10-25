"use client"

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Search, Menu, User, LogIn, UserPlus, Home, Star, Bike, ShoppingBag, Package, Settings, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetClose,
} from "@/components/ui/sheet"
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import Link from 'next/link'
import { Logo } from '@/components/ui/logo'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileCollapsed, setIsMobileCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  const toggleMobileSidebar = () => {
    setIsMobileCollapsed(!isMobileCollapsed)
  }

  // Get current theme with fallback
  const currentTheme = theme || 'light'

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 md:h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className={`p-0 transition-all duration-300 ease-in-out ${isMobileCollapsed ? 'w-[60px]' : 'w-[280px]'}`}>
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b px-6 py-4">
                  <VisuallyHidden>
                    <SheetPrimitive.Title>Navigation Menu</SheetPrimitive.Title>
                    <SheetPrimitive.Description>
                      Main navigation menu with links to different sections of the website
                    </SheetPrimitive.Description>
                  </VisuallyHidden>
                  <div className="flex items-center justify-between">
                    {!isMobileCollapsed && <Logo className="text-lg" />}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleMobileSidebar}
                      className="h-8 w-8 shrink-0"
                      aria-label={isMobileCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                      {isMobileCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </SheetHeader>

                <ScrollArea className="flex-1 px-3">
                  <div className="space-y-2 py-4">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                        title={isMobileCollapsed ? "Home" : undefined}
                      >
                        <Home className="h-4 w-4 shrink-0" />
                        {!isMobileCollapsed && <span>Home</span>}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/reviews"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                        title={isMobileCollapsed ? "Reviews" : undefined}
                      >
                        <Star className="h-4 w-4 shrink-0" />
                        {!isMobileCollapsed && <span>Reviews</span>}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/motorcycle"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                        title={isMobileCollapsed ? "Motorcycles" : undefined}
                      >
                        <Bike className="h-4 w-4 shrink-0" />
                        {!isMobileCollapsed && <span>Motorcycles</span>}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/products"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                        title={isMobileCollapsed ? "Products" : undefined}
                      >
                        <ShoppingBag className="h-4 w-4 shrink-0" />
                        {!isMobileCollapsed && <span>Products</span>}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/accessories"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                        title={isMobileCollapsed ? "Accessories" : undefined}
                      >
                        <Package className="h-4 w-4 shrink-0" />
                        {!isMobileCollapsed && <span>Accessories</span>}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/about"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                        title={isMobileCollapsed ? "About" : undefined}
                      >
                        <Settings className="h-4 w-4 shrink-0" />
                        {!isMobileCollapsed && <span>About</span>}
                      </Link>
                    </SheetClose>
                  </div>
                </ScrollArea>

                {/* Bottom section - fixed at bottom */}
                <div className={`border-t px-3 py-2 space-y-1 ${isMobileCollapsed ? 'px-2' : ''}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start gap-3 px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                    onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                    title={isMobileCollapsed ? "Toggle theme" : undefined}
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    {!isMobileCollapsed && mounted && (currentTheme === 'dark' ? 'Lite' : 'Dark')}
                  </Button>

                  <div className={`flex items-center gap-3 px-3 py-2 text-sm font-[600] text-muted-foreground ${isMobileCollapsed ? 'justify-center px-2' : ''}`}
                       title={isMobileCollapsed ? "Sign in" : undefined}>
                    <User className="h-4 w-4" />
                    {!isMobileCollapsed && <span>Sign in</span>}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <Logo className="text-lg md:text-xl" />
          </Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4 ml-auto md:ml-0">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Toggle search</span>
            </Button>
            <div className={`absolute right-0 top-full mt-2 w-[280px] ${isSearchOpen ? 'block' : 'hidden'} md:relative md:block md:mt-0 md:w-auto`}>
              <Input
                type="search"
                placeholder="Search motorcycles..."
                className="w-full md:w-[200px] lg:w-[300px]"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <User className="h-4 w-4" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  Sign in
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/register" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  )
}