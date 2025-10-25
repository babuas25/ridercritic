"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import {
  Home,
  Settings,
  Bike,
  Star,
  ShoppingBag,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"

const sidebarItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Reviews",
    icon: Star,
    href: "/reviews",
  },
  {
    title: "Motorcycles",
    icon: Bike,
    href: "/motorcycle",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    href: "/products",
  },
  {
    title: "Accessories",
    icon: Package,
    href: "/accessories",
  },
  {
    title: "About",
    icon: Settings,
    href: "/about",
  },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className={cn(
      "hidden border-r bg-background md:block transition-all duration-300 ease-in-out",
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
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-[600] hover:bg-accent hover:text-accent-foreground transition-colors",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}