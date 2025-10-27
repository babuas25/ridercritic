import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app)

// Helper functions for Firestore operations
export const createUserDocument = async (userId: string, userData: Record<string, unknown>) => {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)

  if (!userSnap.exists()) {
    await setDoc(userRef, userData)
  }
}

// Update user's last login timestamp
export const updateLastLogin = async (userId: string) => {
  const userRef = doc(db, 'users', userId)
  await setDoc(userRef, {
    lastLogin: new Date(),
  }, { merge: true })
}

export default app
