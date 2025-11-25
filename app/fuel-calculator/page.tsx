import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import FuelCalculatorPageClient from './page-client'

export { generateMetadata } from './page.server'

function LoadingFallback() {
  return (
    <div className="container py-8 max-w-2xl mx-auto px-4 flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  )
}

export default function FuelCalculatorPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FuelCalculatorPageClient />
    </Suspense>
  )
}
