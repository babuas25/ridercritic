import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

// Check if required environment variables are set
const hasAdminCredentials = 
  !!process.env.NEXT_PUBLIC_PROJECT_ID && 
  !!process.env.FIREBASE_PRIVATE_KEY && 
  !!process.env.FIREBASE_CLIENT_EMAIL

console.log('Firebase Admin initialization check:', {
  hasAdminCredentials,
  projectId: !!process.env.NEXT_PUBLIC_PROJECT_ID,
  privateKey: !!process.env.FIREBASE_PRIVATE_KEY,
  clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL
})

// Initialize Firebase Admin SDK
if (!getApps().length && hasAdminCredentials) {
  console.log('Initializing Firebase Admin with credentials:', {
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? '***' : 'MISSING'
  });
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      }),
    })
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
  }
}

// Get Firestore instance (only if Admin SDK is initialized)
export const adminDb = hasAdminCredentials ? getFirestore() : null

// Get Auth instance (only if Admin SDK is initialized)
export const adminAuth = hasAdminCredentials ? getAuth() : null
