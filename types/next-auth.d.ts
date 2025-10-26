import { UserRole, UserSubRole } from '@/lib/auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
      role: UserRole
      subRole: UserSubRole
    }
  }

  interface User {
    role: UserRole
    subRole: UserSubRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    subRole: UserSubRole
  }
}
