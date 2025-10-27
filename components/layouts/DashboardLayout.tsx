'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Settings,
  LogOut,
  User,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const userRole = session.user.role
  const userSubRole = session.user.subRole

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-100 text-purple-800'
      case 'Admin': return 'bg-red-100 text-red-800'
      case 'Sponsor Admin': return 'bg-blue-100 text-blue-800'
      case 'Supplier Admin': return 'bg-green-100 text-green-800'
      case 'Partner Admin': return 'bg-yellow-100 text-yellow-800'
      case 'Freelancer Admin': return 'bg-indigo-100 text-indigo-800'
      case 'User Admin': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSubRoleColor = (subRole: string) => {
    switch (subRole) {
      case 'NewStar': return 'bg-gray-100 text-gray-800'
      case 'CriticStar': return 'bg-blue-100 text-blue-800'
      case 'CriticMaster': return 'bg-gold-100 text-gold-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-2">
              <Badge className={getRoleColor(userRole)}>
                {userRole}
              </Badge>
              <Badge className={getSubRoleColor(userSubRole)}>
                {userSubRole}
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {session.user.name}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user.image || ''} alt={session.user.name} />
                    <AvatarFallback>
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}
