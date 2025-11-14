"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { getRecentComparisons, SavedComparison } from "@/lib/comparisons"

export default function ComparisonsPageClient() {
  const [comparisons, setComparisons] = useState<SavedComparison[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        const data = await getRecentComparisons(50)
        setComparisons(data)
      } catch (error) {
        console.error("Error loading comparisons", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComparisons()
  }, [])

  if (loading) {
    return (
      <div className="container py-16 max-w-6xl mx-auto px-4 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container py-16 max-w-6xl mx-auto px-4">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Motorcycle Comparisons</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Saved comparisons created by our admins. Browse popular matchups between motorcycles.
        </p>
      </div>

      {comparisons.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No comparisons have been saved yet.</p>
          <Link href="/motorcycle?compare=true">
            <Button variant="outline">Go to compare page</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((comp) => {
            const [a, b] = comp.motorcycles
            return (
              <Card key={comp.id} className="border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[a, b].map((moto, index) => (
                      <div key={moto?.id || index} className="text-center">
                        <div className="w-full h-24 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-2 overflow-hidden">
                          {moto?.coverImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={moto.coverImage}
                              alt={`${moto.brand} ${moto.modelName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {moto?.brand} {moto?.modelName}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white capitalize line-clamp-2">
                          {moto?.brand} {moto?.modelName}
                        </div>
                        {moto?.modelYear && (
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                            {moto.modelYear}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {comp.createdAt && !Number.isNaN(new Date(comp.createdAt).getTime()) && (
                        <span>
                          Saved {new Date(comp.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {a?.id && (
                        <Link href={`/motorcycle/${encodeURIComponent(a.id)}`}>
                          <Button size="sm" variant="outline" className="text-xs px-2">
                            {a.brand} {a.modelName}
                          </Button>
                        </Link>
                      )}
                      {b?.id && (
                        <Link href={`/motorcycle/${encodeURIComponent(b.id)}`}>
                          <Button size="sm" variant="outline" className="text-xs px-2">
                            {b.brand} {b.modelName}
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
