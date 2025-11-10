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
    // Process the private key to ensure proper formatting
    let privateKey = process.env.FIREBASE_PRIVATE_KEY!
    
    // Remove surrounding quotes if present
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
      privateKey = privateKey.slice(1, -1)
    }
    
    // Replace escaped newlines with actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n')
    
    // Additional processing to ensure proper format
    privateKey = privateKey.trim()
    
    console.log('Processed private key length:', privateKey.length)
    
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      }),
    })
    console.log('Firebase Admin SDK initialized successfully')
  } catch (error: unknown) {
    console.error('Failed to initialize Firebase Admin SDK:', error)
    const err = error as { name?: string; message?: string; stack?: string }
    console.error('Error name:', err?.name || 'Unknown')
    console.error('Error message:', err?.message || 'No message')
    console.error('Error stack:', err?.stack || 'No stack trace')
  }
}

// Get Firestore instance (only if Admin SDK is initialized)
export const adminDb = hasAdminCredentials ? getFirestore() : null

// Get Auth instance (only if Admin SDK is initialized)
export const adminAuth = hasAdminCredentials ? getAuth() : null