# Setup Summary

## What Was Fixed

The authentication system was failing because it tried to use the Firebase client SDK (which requires user authentication) in server-side code. This caused "Missing or insufficient permissions" errors.

### Changes Made:

1. ✅ **Installed Firebase Admin SDK** - For server-side operations with full database access
2. ✅ **Created `lib/firebase-admin.ts`** - Admin SDK configuration
3. ✅ **Updated NextAuth route** (`app/api/auth/[...nextauth]/route.ts`) - Now uses Admin SDK for Firestore operations
4. ✅ **Created Firestore security rules** (`firestore.rules`) - Proper security for client-side access
5. ✅ **Created setup guide** (`FIREBASE_SETUP.md`) - Step-by-step instructions

## What You Need To Do

### 1. Get Firebase Service Account Credentials

Go to your Firebase Console and download the service account key:
- Firebase Console → Project Settings → Service Accounts → Generate new private key
- This downloads a JSON file with your credentials

### 2. Create `.env.local` File

Create a `.env.local` file in your project root with these variables:

```env
# Firebase Configuration (Client SDK) - Get from Firebase Console
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_AUTH_DOMAIN=ridercritics-386df.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=ridercritics-386df
NEXT_PUBLIC_STORAGE_BUCKET=ridercritics-386df.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_APP_ID=your_app_id

# Firebase Admin SDK (Server-side) - From downloaded JSON
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ridercritics-386df.iam.gserviceaccount.com

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000

# Super Admin Email
SUPER_ADMIN_EMAIL=your_email@example.com
```

**Important**: Replace `\n` in FIREBASE_PRIVATE_KEY with actual newlines or use the escaped format shown above.

### 3. Restart Your Server

```bash
npm run dev
```

### 4. Test Login

1. Log in with Google OAuth
2. Check Firestore Database in Firebase Console
3. You should see a `users` collection with your user document

## Important Notes

- **Firebase Authentication vs Firestore**: This app uses NextAuth.js, so users are stored in Firestore, NOT in Firebase Authentication console
- **Security**: The Admin SDK bypasses Firestore security rules (server-side only)
- **Private Key**: Make sure the FIREBASE_PRIVATE_KEY includes the BEGIN/END markers

## Troubleshooting

If you still get permission errors:
1. Double-check that `FIREBASE_PRIVATE_KEY` is properly formatted
2. Ensure `FIREBASE_CLIENT_EMAIL` is correct from the JSON file
3. Verify all environment variables are set in `.env.local`
4. Restart your development server

For detailed instructions, see `FIREBASE_SETUP.md`

