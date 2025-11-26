import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import MotorcyclesPageClient from './page-client'

export { generateMetadata } from './page.server'

function LoadingFallback() {
  return (
    <div className="container py-8 max-w-6xl mx-auto px-4 flex flex-col gap-4 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Motorcycle Reviews
      </h1>
      <div className="flex items-center justify-center flex-1">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    </div>
  )
}

export default function MotorcyclesPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Motorcycle Reviews
      </h1>
      <Suspense fallback={<LoadingFallback />}>
        <MotorcyclesPageClient />
      </Suspense>
    </div>
  )
}