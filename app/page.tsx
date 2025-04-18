"use client"

import MainNav from "@/components/main-nav"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useState, useEffect } from "react"

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      {isMounted && (
        <div className="hidden md:block">
          <MainNav />
        </div>
      )}
      <div className="container mx-auto mt-6">
        <h1 className="text-4xl font-bold mb-6">Welcome to ridercritic</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your ultimate guide to motorcycles and riding culture.
        </p>
        {isMounted && (
          <div className="block md:hidden">
            <MainNav />
          </div>
        )}
      </div>
    </>
  )
}