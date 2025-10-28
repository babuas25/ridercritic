"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  Home,
  Settings,
  Bike,
  Star,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
  Users,
  Activity,
  PenTool,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Tags,
  Grid,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"

interface SidebarItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()
  const { data: session } = useSession()

  const isDashboard = pathname?.startsWith('/dashboard')
  const userRole = session?.user?.role
  const userSubRole = session?.user?.subRole

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  // Get sidebar items based on context
  const getSidebarItems = (): SidebarItem[] => {
    // If on dashboard pages, show role-specific items
    if (isDashboard && session) {
      const getDashboardUrl = () => {
        if (userRole === 'Super Admin') return '/dashboard/super-admin'
        if (userRole === 'Admin') return '/dashboard/admin'
        if (userRole === 'User Admin') {
          if (userSubRole === 'NewStar') return '/dashboard/user/newstar'
          if (userSubRole === 'CriticStar') return '/dashboard/user/criticstar'
          if (userSubRole === 'CriticMaster') return '/dashboard/user/criticmaster'
        }
        return '/dashboard/user'
      }

      const items: SidebarItem[] = [
        {
          title: "Dashboard",
          icon: Home,
          href: getDashboardUrl(),
        },
      ]

      // Items for Super Admin
      if (userRole === 'Super Admin') {
        items.push(
          { title: "User Management", icon: Users, href: "/dashboard/admin" },
          { title: "Brands", icon: Tags, href: "/dashboard/brands" },
          { title: "Types", icon: Grid, href: "/dashboard/types" }
        )
      }
      // Items for Admin
      else if (userRole === 'Admin') {
        items.push(
          { title: "User Management", icon: Users, href: "/dashboard/admin" },
          { title: "Analytics", icon: Activity, href: "#" },
          { title: "Settings", icon: Settings, href: "#" }
        )
      }
      // Items for User Admin based on subRole
      else if (userRole === 'User Admin') {
        // NewStar - Basic user
        if (userSubRole === 'NewStar') {
          items.push(
            { title: "Browse Reviews", icon: FileText, href: "/reviews" },
            { title: "Motorcycles", icon: Bike, href: "/motorcycle" },
            { title: "Community", icon: MessageSquare, href: "#" },
            { title: "Learn", icon: Star, href: "#" }
          )
        }
        // CriticStar - Can write reviews
        else if (userSubRole === 'CriticStar') {
          items.push(
            { title: "Write Review", icon: PenTool, href: "#" },
            { title: "My Reviews", icon: FileText, href: "#" },
            { title: "Browse", icon: Bike, href: "/motorcycle" },
            { title: "Community", icon: MessageSquare, href: "#" }
          )
        }
        // CriticMaster - Moderation powers
        else if (userSubRole === 'CriticMaster') {
          items.push(
            { title: "Moderation Queue", icon: CheckCircle, href: "#" },
            { title: "Reports", icon: AlertTriangle, href: "#" },
            { title: "Reviews", icon: FileText, href: "/reviews" },
            { title: "Community", icon: MessageSquare, href: "#" }
          )
        }
      }
      // Items for other admin roles
      else {
        items.push(
          { title: "Analytics", icon: Activity, href: "#" },
          { title: "Settings", icon: Settings, href: "#" }
        )
      }

      return items
    }

    // Default items for non-dashboard pages
    return [
      { title: "Home", icon: Home, href: "/" },
      { title: "Reviews", icon: Star, href: "/reviews" },
      { title: "Motorcycles", icon: Bike, href: "/motorcycle" },
      { title: "Products", icon: ShoppingBag, href: "/products" },
      { title: "Accessories", icon: Package, href: "/accessories" },
      { title: "About", icon: Settings, href: "/about" },
    ]
  }

  const sidebarItems = getSidebarItems()

  return (
    <div className={cn(
      "hidden border-r bg-background md:block md:sticky md:top-[7.5rem] md:h-[calc(100vh-7.5rem)] transition-all duration-300 ease-in-out",
      isCollapsed ? "w-[60px]" : "w-[240px]"
    )}>
      <div className="flex h-16 items-center justify-between px-3 border-b">
        {!isCollapsed && (
          <Logo className="text-xl" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 shrink-0 ml-auto hover:bg-accent hover:text-accent-foreground transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors",
                      isCollapsed && "justify-center px-2",
                      isActive && "bg-accent text-accent-foreground"
                    )}
                    title={isCollapsed ? item.title : undefined}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}