import { redirect } from 'next/navigation'

export { generateMetadata } from './page.server'

export default function EMICalculatorRedirectPage() {
  redirect('/loan-calculator')
}