"use client"

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Search, Menu, Home, Star, Bike, Settings, ChevronLeft, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription
} from "@/components/ui/sheet"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/ui/logo'
import { getDashboardUrl } from '@/components/sidebar'
import { trackEvent } from '@/lib/ga4'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileCollapsed] = useState(false)
  const pathname = usePathname()

  const userRole = session?.user?.role
  const userSubRole = session?.user?.subRole
  const dashboardUrl = session ? getDashboardUrl(userRole, userSubRole) : '/dashboard'

  const isDashboard = pathname?.startsWith('/dashboard')
  const isHome = pathname === '/'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2 md:gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 md:hidden"
                title={isMobileCollapsed ? "Open menu" : undefined}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <SheetDescription className="sr-only">Main navigation menu with links to different sections of the website</SheetDescription>
              <SheetHeader className="p-4 border-b">
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 ml-auto">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div className="p-4">
                <nav className="flex flex-col gap-1">
                  {session && (isDashboard || isHome) ? (
                    <>
                      {/* Role-specific mobile items, mirroring Sidebar */}
                      <Link href={dashboardUrl} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Home className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>

                      {userRole === 'Super Admin' && (
                        <>
                          <Link href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <User className="h-4 w-4" />
                            <span>User Management</span>
                          </Link>
                          <Link href="/dashboard/critics" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Star className="h-4 w-4" />
                            <span>Critic Management</span>
                          </Link>
                          <Link href="/dashboard/motorcycles" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Bike className="h-4 w-4" />
                            <span>Motorcycles</span>
                          </Link>
                          <Link href="/dashboard/loans" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Loan Offers</span>
                          </Link>
                          <Link href="/dashboard/comparisons" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Comparisons</span>
                          </Link>
                          <Link href="/dashboard/brands" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Brands</span>
                          </Link>
                          <Link href="/dashboard/types" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Types</span>
                          </Link>
                          <Link href="/dashboard/blog" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Blog Management</span>
                          </Link>
                        </>
                      )}

                      {userRole === 'Admin' && (
                        <>
                          <Link href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <User className="h-4 w-4" />
                            <span>User Management</span>
                          </Link>
                          <Link href="/dashboard/critics" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Star className="h-4 w-4" />
                            <span>Critic Management</span>
                          </Link>
                          <Link href="/dashboard/motorcycles" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Bike className="h-4 w-4" />
                            <span>Motorcycles</span>
                          </Link>
                          <Link href="/dashboard/loans" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Loan Offers</span>
                          </Link>
                          <Link href="/dashboard/comparisons" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                            <Settings className="h-4 w-4" />
                            <span>Comparisons</span>
                          </Link>
                        </>
                      )}

                      {userRole === 'Freelancer Admin' && (
                        <Link href="/dashboard/blog" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                          <Settings className="h-4 w-4" />
                          <span>Blog Management</span>
                        </Link>
                      )}

                      {userRole === 'User Admin' && userSubRole === 'CriticMaster' && (
                        <Link href="/dashboard/blog" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                          <Settings className="h-4 w-4" />
                          <span>Blog Management</span>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Public/simple mobile menu */}
                      <Link href={session ? dashboardUrl : "/critics/write"} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Home className="h-4 w-4" />
                        <span>New Critic</span>
                      </Link>

                      <Link href="/motorcycle" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Bike className="h-4 w-4" />
                        <span>Motorcycles</span>
                      </Link>
                      <Link href="/critics" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Star className="h-4 w-4" />
                        <span>Critics</span>
                      </Link>
                      <Link href="/tips" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Settings className="h-4 w-4" />
                        <span>Tips &amp; guides</span>
                      </Link>
                      <Link href="/news" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Settings className="h-4 w-4" />
                        <span>News</span>
                      </Link>
                      <Link href="/upcoming" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Settings className="h-4 w-4" />
                        <span>Upcoming</span>
                      </Link>
                      <Link href="/blog" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted">
                        <Settings className="h-4 w-4" />
                        <span>Blog</span>
                      </Link>
                    </>
                  )}
                </nav>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
                <div className="flex items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => {
                      const nextTheme = theme === 'dark' ? 'light' : 'dark'
                      setTheme(nextTheme)
                      trackEvent('theme_changed', {
                        theme: nextTheme,
                        location: 'header_mobile',
                      })
                    }}
                    title="Toggle theme"
                  >
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>

                  {session ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-full"
                          aria-label="Open user menu"
                          title="Open user menu"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end" forceMount>
                        <div className="flex items-center justify-start gap-2 p-2">
                          <div className="flex flex-col space-y-1 leading-none">
                            {session.user.name && <p className="font-medium text-sm">{session.user.name}</p>}
                            {session.user.email && <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>}
                          </div>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={dashboardUrl} className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <Button variant="ghost" size="sm" asChild className="h-8">
                      <Link href="/auth">Sign in</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center">
            <Logo className="text-lg md:text-xl" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <div className="relative flex items-center">
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
              <label htmlFor="header-search" className="sr-only">
                Search motorcycles
              </label>
              <Input
                type="search"
                id="header-search"
                name="headerSearch"
                placeholder="Search motorcycles..."
                className="w-full md:w-[200px] lg:w-[300px]"
              />
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Mobile theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:hidden"
            onClick={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark'
              setTheme(nextTheme)
              trackEvent('theme_changed', {
                theme: nextTheme,
                location: 'header_mobile',
              })
            }}
            title="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile user icon */}
          <div className="md:hidden">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    aria-label="Open user menu"
                    title="Open user menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && <p className="font-medium text-sm">{session.user.name}</p>}
                      {session.user.email && <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={dashboardUrl} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="h-8">
                <Link href="/auth">Sign in</Link>
              </Button>
            )}
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'light' : 'dark'
                setTheme(nextTheme)
                trackEvent('theme_changed', {
                  theme: nextTheme,
                  location: 'header_desktop',
                })
              }}
              title="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                    aria-label="Open user menu"
                    title="Open user menu"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user.name && <p className="font-medium text-sm">{session.user.name}</p>}
                      {session.user.email && <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="h-8">
                <Link href="/auth">Sign in</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}