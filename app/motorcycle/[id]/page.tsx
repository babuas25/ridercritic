import { getMotorcycle } from '@/lib/motorcycles'
import { MotorcycleFormData } from '@/types/motorcycle'
import MotorcycleDetailPage from './page-client'

export { generateMetadata } from './page.server'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const motorcycle = (await getMotorcycle(id)) as MotorcycleFormData | null

  // Ensure we pass only plain JSON-serializable objects to the client component
  const plainMotorcycle = motorcycle
    ? (JSON.parse(JSON.stringify(motorcycle)) as MotorcycleFormData)
    : null

  return <MotorcycleDetailPage motorcycle={plainMotorcycle} />
}
