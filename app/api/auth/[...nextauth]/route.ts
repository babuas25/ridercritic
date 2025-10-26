import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DEFAULT_ROLE, DEFAULT_SUB_ROLE } from '@/lib/auth'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize() {
        // This would typically connect to your Firebase Auth
        // For now, we'll handle this in the login page
        return null
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }: {
      token: any,
      user: any
    }) {
      if (user) {
        token.role = user.role || DEFAULT_ROLE
        token.subRole = user.subRole || DEFAULT_SUB_ROLE
      }
      return token
    },
    async session({ session, token }: {
      session: any,
      token: any
    }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.subRole = token.subRole as string
      }
      return session
    },
    async signIn({ user, account }: {
      user: any,
      account: any
    }) {
      if (account?.provider === 'google') {
        // Temporarily disable Firestore creation for testing
        // TODO: Re-enable once Firestore API is enabled
        console.log('Google sign-in successful for user:', user.email)
        return true

        // Original Firestore code (commented out for testing):
        /*
        try {
          await createUserDocument(user.id, {
            uid: user.id,
            email: user.email,
            displayName: user.name,
            gender: '',
            dob: '',
            role: DEFAULT_ROLE,
            subRole: DEFAULT_SUB_ROLE,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
        } catch (error) {
          console.error('Error creating user document:', error)
          return false
        }
        */
      }
      return true
    }
  },
  pages: {
    signIn: '/login',
  },
})

export { handler as GET, handler as POST }
