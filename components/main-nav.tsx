"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import Link from 'next/link'
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

const types = [
  "Commuter", "Naked", "Cruiser", "Chopper", "Sport Bike", "Touring Motorcycle",
  "Sport Touring Motorcycle", "Adventure (ADV) / Dual-Sport", "Dirt Bike / Motocross",
  "Enduro", "Supermoto / Supermotard", "Cafe Racer", "Scrambler", "Bobber",
  "Mini Bike", "Scooter", "Moped", "Electric Motorcycle", "Trike",
  "Pocket Bike / Mini Moto", "Power Cruiser"
]

interface Brand {
  id: number;
  name: string;
}

export default function MainNav() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isMounted, setIsMounted] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])

  // Brand state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);
  const [brandError, setBrandError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true)
    // Fetch brands from API
    fetch("https://babuas25-ridercritic-api.onrender.com/api/brands/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch brands");
        return res.json();
      })
      .then(data => {
        setBrands(data);
        setLoadingBrands(false);
      })
      .catch(err => {
        setBrandError("Could not load brands");
        setLoadingBrands(false);
      });
  }, [])

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  // Don't render anything during SSR or before hydration
  if (!isMounted) {
    return null
  }

  if (!isDesktop) {
    return (
      <div className="grid gap-4">
        <Link href="/new-critics" className="text-sm font-[600] hover:text-primary">
          New Critics
        </Link>
        
        <Collapsible open={openSections.includes('types')} onOpenChange={() => toggleSection('types')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            Types
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('types') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid gap-2">
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.includes('brands')} onOpenChange={() => toggleSection('brands')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            Brand
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('brands') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {loadingBrands && <span className="text-xs text-muted-foreground">Loading...</span>}
              {brandError && <span className="text-xs text-destructive">{brandError}</span>}
              {!loadingBrands && !brandError && brands.length === 0 && (
                <span className="text-xs text-muted-foreground">No brands found</span>
              )}
              {!loadingBrands && !brandError && brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.id}`}
                  className="text-sm font-[600] text-muted-foreground hover:text-primary"
                >
                  {brand.name}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Link href="/safety" className="text-sm font-[600] hover:text-primary">
          Safety
        </Link>

        <Link href="/specification" className="text-sm font-[600] hover:text-primary">
          Specification
        </Link>

        <Link href="/motorcycle" className="text-sm font-[600] hover:text-primary">
          Motorcycle
        </Link>

        <Collapsible open={openSections.includes('more')} onOpenChange={() => toggleSection('more')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            More
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('more') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid gap-2">
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    )
  }

  return (
    <div className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Link href="/new-critics" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-normal")}>
                  New Critics
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-normal">Types</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-4 md:grid-cols-3 gap-3">
                  {types.map((type) => (
                    <Link
                      key={type}
                      href={`/types/${type.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-2 hover:bg-accent rounded-md font-normal"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-normal">Brand</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[500px] grid-cols-2 p-4 md:grid-cols-3 gap-3">
                  {loadingBrands && <span className="text-xs text-muted-foreground">Loading...</span>}
                  {brandError && <span className="text-xs text-destructive">{brandError}</span>}
                  {!loadingBrands && !brandError && brands.length === 0 && (
                    <span className="text-xs text-muted-foreground">No brands found</span>
                  )}
                  {!loadingBrands && !brandError && brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/brands/${brand.id}`}
                      className="block p-2 hover:bg-accent rounded-md font-normal"
                    >
                      {brand.name}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/safety" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-normal")}>
                  Safety
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/specification" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-normal")}>
                  Specification
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/motorcycle" legacyBehavior passHref>
                <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "font-normal")}>
                  Motorcycle
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden lg:flex relative">
              <NavigationMenuTrigger className="font-normal">More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium leading-none mb-2">Featured</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore the latest motorcycles and reviews
                    </p>
                  </div>
                  <div className="grid gap-2">
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport className="origin-top-right" />
        </NavigationMenu>
      </div>
    </div>
  )
}