"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Link from 'next/link'
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

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

  if (!isDesktop) {
    return null
  }

  return (
    <div className="border-b bg-background">
      <div className="container flex h-14 items-center">
        <NavigationMenu>
          <NavigationMenuList>
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
                    <Link href="/latest-reviews" className="block p-2 hover:bg-accent rounded-md">
                      Latest Reviews
                    </Link>
                    <Link href="/top-rated" className="block p-2 hover:bg-accent rounded-md">
                      Top Rated
                    </Link>
                    <Link href="/compare" className="block p-2 hover:bg-accent rounded-md">
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
                      className="block p-2 hover:bg-accent rounded-md"
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
                      className="block p-2 hover:bg-accent rounded-md"
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
                      className="block p-2 hover:bg-accent rounded-md"
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

            <NavigationMenuItem>
              <NavigationMenuTrigger>More</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[200px] p-4 md:w-[300px]">
                  <div className="grid gap-2">
                    <Link href="/new-critics" className="block p-2 hover:bg-accent rounded-md">
                      New Critics
                    </Link>
                    <Link href="/product" className="block p-2 hover:bg-accent rounded-md">
                      Product
                    </Link>
                    <Link href="/upcoming" className="block p-2 hover:bg-accent rounded-md">
                      Upcoming
                    </Link>
                    <Link href="/legend" className="block p-2 hover:bg-accent rounded-md">
                      Legend
                    </Link>
                    <Link href="/forums" className="block p-2 hover:bg-accent rounded-md">
                      Forums
                    </Link>
                    <Link href="/dealers" className="block p-2 hover:bg-accent rounded-md">
                      Dealers
                    </Link>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}