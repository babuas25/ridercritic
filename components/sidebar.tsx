"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { 
  Home, 
  Settings, 
  Users, 
  BarChart2, 
  FileText,
  ChevronDown,
  ChevronRight,
  Menu,
  LayoutDashboard
} from "lucide-react"
import { useState } from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useAuth } from '@/contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { Logo } from "@/components/ui/logo"

interface SidebarItem {
  title: string
  icon: any
  href: string
  submenu?: SidebarItem[]
}

const sidebarNavItems: SidebarItem[] = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Analytics",
    icon: BarChart2,
    href: "/analytics",
    submenu: [
      {
        title: "Dashboard",
        icon: BarChart2,
        href: "/analytics/dashboard",
      },
      {
        title: "Reports",
        icon: FileText,
        href: "/analytics/reports",
      },
    ],
  },
  {
    title: "Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    title: "Users",
    icon: Users,
    href: "/users",
    submenu: [
      {
        title: "All Users",
        icon: Users,
        href: "/users/all",
      },
      {
        title: "Add User",
        icon: Users,
        href: "/users/add",
      },
    ],
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([])
  const pathname = usePathname()
  const { user } = useAuth()

  const toggleSubmenu = (title: string) => {
    setOpenSubmenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  const renderNavItem = (item: SidebarItem) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isSubmenuOpen = openSubmenus.includes(item.title)
    const isActive = pathname === item.href

    if (hasSubmenu) {
      return (
        <Collapsible
          key={item.title}
          open={isSubmenuOpen}
          onOpenChange={() => toggleSubmenu(item.title)}
        >
          <CollapsibleTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-accent text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          </CollapsibleTrigger>
          {!isCollapsed && item.submenu && (
            <CollapsibleContent className="space-y-1">
              {item.submenu.map((subitem) => (
                <Link
                  key={subitem.title}
                  href={subitem.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground",
                    pathname === subitem.href && "bg-accent text-accent-foreground"
                  )}
                >
                  <subitem.icon className="h-4 w-4" />
                  {subitem.title}
                </Link>
              ))}
            </CollapsibleContent>
          )}
        </Collapsible>
      )
    }

    return (
      <Link
        key={item.title}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground"
        )}
      >
        <item.icon className="h-4 w-4" />
        {!isCollapsed && item.title}
      </Link>
    )
  }

  return (
    <div className={cn(
      "hidden border-r bg-background md:block",
      isCollapsed ? "w-[60px]" : "w-[240px]",
      "transition-all duration-300"
    )}>
      <div className="flex h-16 items-center justify-between px-3 border-b">
        {!isCollapsed && (
          <Logo className="text-xl" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {sidebarNavItems.map((item) => {
                if (item.href === "/dashboard" && !user) {
                  return null
                }
                return renderNavItem(item)
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}