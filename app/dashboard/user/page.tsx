'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UserDashboard() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      const role = session.user.role
      const subRole = session.user.subRole
      
      // Redirect based on role first, then subRole
      if (role === 'Super Admin') {
        router.push('/dashboard/super-admin')
      } else if (role === 'Admin') {
        router.push('/dashboard/admin')
      } else if (subRole === 'NewStar') {
        router.push('/dashboard/user/newstar')
      } else if (subRole === 'CriticStar') {
        router.push('/dashboard/user/criticstar')
      } else if (subRole === 'CriticMaster') {
        router.push('/dashboard/user/criticmaster')
      }
    }
  }, [session, router])

  if (!session) {
    return null
  }

  return null
}
