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

const officialBrands = [
  "Honda", "Yamaha", "Suzuki", "Hero", "TVS", "Bajaj", "Runner", "Roadmaster",
  "Lifan", "Haojue", "Speeder", "Dayang", "Zontes", "Benelli", "Aprilia",
  "Keeway", "Vespa", "KTM", "Mahindra", "GPX"
]

const unofficialBrands = [
  "Kawasaki", "Royal Enfield", "CFMoto", "Loncin", "Motocross / XCross",
  "SYM", "Zongshen", "Rieju", "Lexmoto", "BMW", "Ducati", "Harley-Davidson"
]

export default function MainNav() {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [isMounted, setIsMounted] = useState(false)
  const [openSections, setOpenSections] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
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
        
        <Collapsible open={openSections.includes('motorcycle')} onOpenChange={() => toggleSection('motorcycle')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            Motorcycle
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('motorcycle') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid gap-2">
              <Link href="/latest-reviews" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Latest Reviews
              </Link>
              <Link href="/top-rated" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Top Rated
              </Link>
              <Link href="/compare" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Compare Models
              </Link>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.includes('types')} onOpenChange={() => toggleSection('types')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            Types
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('types') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {types.map((type) => (
                <Link
                  key={type}
                  href={`/types/${type.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-[600] text-muted-foreground hover:text-primary"
                >
                  {type}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.includes('official-brands')} onOpenChange={() => toggleSection('official-brands')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            Official Brands
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('official-brands') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {officialBrands.map((brand) => (
                <Link
                  key={brand}
                  href={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-[600] text-muted-foreground hover:text-primary"
                >
                  {brand}
                </Link>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={openSections.includes('unofficial-brands')} onOpenChange={() => toggleSection('unofficial-brands')}>
          <CollapsibleTrigger className="flex w-full items-center justify-between text-sm font-[600] hover:text-primary">
            Unofficial Brands
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform duration-200",
              openSections.includes('unofficial-brands') ? "rotate-180" : ""
            )} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-4 pt-2">
            <div className="grid grid-cols-2 gap-2">
              {unofficialBrands.map((brand) => (
                <Link
                  key={brand}
                  href={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-[600] text-muted-foreground hover:text-primary"
                >
                  {brand}
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
              <Link href="/product" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Product
              </Link>
              <Link href="/upcoming" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Upcoming
              </Link>
              <Link href="/legend" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Legend
              </Link>
              <Link href="/forums" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Forums
              </Link>
              <Link href="/dealers" className="text-sm font-[600] text-muted-foreground hover:text-primary">
                Dealers
              </Link>
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
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  New Critics
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Motorcycle</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[400px] p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium leading-none mb-2">Featured</h4>
                    <p className="text-sm text-muted-foreground">
                      Explore the latest motorcycles and reviews
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Link href="/latest-reviews" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Latest Reviews
                    </Link>
                    <Link href="/top-rated" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Top Rated
                    </Link>
                    <Link href="/compare" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Compare Models
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Types</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[600px] grid-cols-2 p-4 md:grid-cols-3 gap-3">
                  {types.map((type) => (
                    <Link
                      key={type}
                      href={`/types/${type.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-2 hover:bg-accent rounded-md font-[600]"
                    >
                      {type}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Official Brands</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[500px] grid-cols-2 p-4 md:grid-cols-3 gap-3">
                  {officialBrands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-2 hover:bg-accent rounded-md font-[600]"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Unofficial Brands</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[500px] grid-cols-2 p-4 md:grid-cols-3 gap-3">
                  {unofficialBrands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/brands/${brand.toLowerCase().replace(/\s+/g, '-')}`}
                      className="block p-2 hover:bg-accent rounded-md font-[600]"
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/safety" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Safety
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/specification" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  Specification
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden lg:flex relative">
              <NavigationMenuTrigger>More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px] p-4">
                  <div className="grid gap-2">
                    <Link href="/product" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Product
                    </Link>
                    <Link href="/upcoming" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Upcoming
                    </Link>
                    <Link href="/legend" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Legend
                    </Link>
                    <Link href="/forums" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Forums
                    </Link>
                    <Link href="/dealers" className="block p-2 hover:bg-accent rounded-md font-[600]">
                      Dealers
                    </Link>
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