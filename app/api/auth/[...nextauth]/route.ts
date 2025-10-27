import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { DEFAULT_ROLE, DEFAULT_SUB_ROLE } from '@/lib/auth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { adminDb } from '@/lib/firebase-admin'

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  cookies: {
    state: {
      name: `next-auth.state-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 900, // 15 minutes
      },
    },
  },
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          // Sign in with Firebase Auth
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
          
          const firebaseUser = userCredential.user

          // Check if Admin SDK is configured
          if (!adminDb) {
            console.error('Firebase Admin SDK is not initialized. Please configure FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env.local')
            throw new Error('Server configuration error. Please contact support.')
          }

          // Check if user document exists in Firestore
          const userRef = adminDb.collection('users').doc(firebaseUser.uid)
          const userSnap = await userRef.get()

          let userData: any = {}

          if (userSnap.exists) {
            // Get user data from Firestore
            const data = userSnap.data()
            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: data?.displayName || firebaseUser.displayName || 'User',
              role: data?.role || DEFAULT_ROLE,
              subRole: data?.subRole || DEFAULT_SUB_ROLE,
              image: firebaseUser.photoURL,
            }
          } else {
            // Create new user document
            const userDataToSave = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || 'User',
              gender: '',
              dob: '',
              role: DEFAULT_ROLE,
              subRole: DEFAULT_SUB_ROLE,
              createdAt: new Date(),
              updatedAt: new Date(),
            }

            await userRef.set(userDataToSave)

            userData = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              role: DEFAULT_ROLE,
              subRole: DEFAULT_SUB_ROLE,
              image: firebaseUser.photoURL,
            }
          }

          return userData
        } catch (error: any) {
          throw new Error(error.message || 'Authentication failed')
        }
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
      // Only update if we have a new user login
      if (user) {
        // Check if this user is the Super Admin
        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
        const isSuperAdmin = user.email === superAdminEmail
        
        token.role = isSuperAdmin ? 'Super Admin' : (user.role || DEFAULT_ROLE)
        token.subRole = user.subRole || DEFAULT_SUB_ROLE
      }
      
      // Always return token with role (either new or existing)
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
        try {
          // Check if Admin SDK is configured
          if (!adminDb) {
            console.error('Firebase Admin SDK is not initialized. Please configure FIREBASE_PRIVATE_KEY and FIREBASE_CLIENT_EMAIL in .env.local')
            // Still allow sign-in but with default role
            user.role = DEFAULT_ROLE
            user.subRole = DEFAULT_SUB_ROLE
            return true
          }

          // Check if user document exists using Admin SDK
          const userRef = adminDb.collection('users').doc(user.id)
          
          try {
            const userSnap = await userRef.get()
            
            if (!userSnap.exists) {
              // Create user document in Firestore
              const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
              const isSuperAdmin = user.email === superAdminEmail

              await userRef.set({
                uid: user.id,
                email: user.email,
                displayName: user.name,
                gender: '',
                dob: '',
                role: isSuperAdmin ? 'Super Admin' : DEFAULT_ROLE,
                subRole: DEFAULT_SUB_ROLE,
                createdAt: new Date(),
                updatedAt: new Date(),
              })

              // Update user object with role
              user.role = isSuperAdmin ? 'Super Admin' : DEFAULT_ROLE
              user.subRole = DEFAULT_SUB_ROLE
            } else {
              // Get existing role from Firestore
              const data = userSnap.data()
              user.role = data?.role || DEFAULT_ROLE
              user.subRole = data?.subRole || DEFAULT_SUB_ROLE
            }
          } catch (error: any) {
            // If read fails, try to create the document anyway
            console.log('Could not read user document, creating new one:', error.message)
            const superAdminEmail = process.env.SUPER_ADMIN_EMAIL
            const isSuperAdmin = user.email === superAdminEmail

            try {
              await userRef.set({
                uid: user.id,
                email: user.email,
                displayName: user.name,
                gender: '',
                dob: '',
                role: isSuperAdmin ? 'Super Admin' : DEFAULT_ROLE,
                subRole: DEFAULT_SUB_ROLE,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
              
              user.role = isSuperAdmin ? 'Super Admin' : DEFAULT_ROLE
              user.subRole = DEFAULT_SUB_ROLE
            } catch (createError) {
              console.error('Could not create user document:', createError)
              // Still allow sign-in but with default role
              user.role = DEFAULT_ROLE
              user.subRole = DEFAULT_SUB_ROLE
            }
          }

          console.log('Google sign-in successful for user:', user.email)
          return true
        } catch (error) {
          console.error('Error handling Google sign-in:', error)
          // Still allow sign-in
          user.role = DEFAULT_ROLE
          user.subRole = DEFAULT_SUB_ROLE
          return true
        }
      }
      return true
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
})

export { handler as GET, handler as POST }
