# Firebase Setup Instructions

## Issue
After logging in, users are not appearing in Firebase Authentication and user documents are not being created in Firestore due to permission errors.

## Solution
We've installed Firebase Admin SDK to handle server-side operations with proper permissions. You need to configure the Firebase service account credentials.

**Important**: This application uses NextAuth.js for authentication, not Firebase Authentication. Users are stored only in Firestore, not in Firebase Authentication console. This is by design.

## Steps to Get Firebase Service Account Credentials

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com](https://console.firebase.google.com)
   - Select your project (`ridercritics`)

2. **Navigate to Service Accounts**
   - Click on the gear icon (⚙️) next to "Project Overview"
   - Select "Project settings"
   - Click on the "Service accounts" tab

3. **Generate New Private Key**
   - Click "Generate new private key"
   - Confirm by clicking "Generate key"
   - A JSON file will be downloaded (e.g., `ridercritics-386df-firebase-adminsdk-xxxxx.json`)

4. **Extract the Required Values**
   Open the downloaded JSON file and extract:
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`

## Create `.env.local` File

Create a file named `.env.local` in the root of your project with the following content:

```env
# Firebase Configuration (Client SDK)
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_PROJECT_ID=ridercritics-386df
NEXT_PUBLIC_STORAGE_BUCKET=ridercritics-386df.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_app_id

# Firebase Admin SDK (Server-side)
# Get these from the downloaded service account JSON
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@ridercritics-386df.iam.gserviceaccount.com

# Google OAuth (NextAuth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_SECRET=generate_a_random_secret
NEXTAUTH_URL=http://localhost:3000

# Super Admin
SUPER_ADMIN_EMAIL=your_email@example.com
```

## Important Notes

1. **Private Key Format**: When copying the `FIREBASE_PRIVATE_KEY`, make sure to include the entire key including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers, and replace all actual newlines with `\n`

2. **Get Firebase Client Credentials**: 
   - In Firebase Console, go to Project Settings
   - In the "General" tab, find "Your apps" section
   - Click on the Web app (or add a new one)
   - Copy the config values to your `.env.local`

3. **Get Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to "APIs & Services" > "Credentials"
   - Find your OAuth 2.0 Client ID
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

4. **Generate NEXTAUTH_SECRET**:
   You can generate a random secret using:
   ```bash
   openssl rand -base64 32
   ```
   Or visit: https://generate-secret.vercel.app/32

## After Configuration

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try logging in again with Google
3. Check Firebase Console - Firestore Database:
   - User documents should be created in Firestore under the `users` collection

## Verify in Firebase Console

1. **Firestore**: Check the "Data" tab - you should see a `users` collection with your user document
   - Go to Firestore Database > Data tab
   - Look for the `users` collection
   - Your user document should be there with your email, role, etc.

**Note**: Since this app uses NextAuth (not Firebase Auth), users won't appear in Firebase Authentication console. All user data is stored in Firestore under the `users` collection.

