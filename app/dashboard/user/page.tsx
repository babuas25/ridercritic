'use client'

import { useSession } from 'next-auth/react'

export default function UserDashboard() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return null
}
