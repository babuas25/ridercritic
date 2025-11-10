/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require('firebase-admin');

// Get the private key from environment variables
const privateKey = process.env.FIREBASE_PRIVATE_KEY;

console.log('Private key length:', privateKey?.length);
console.log('Private key starts with:', privateKey?.substring(0, 50));

// Process the private key
let processedKey = privateKey;
if (processedKey.startsWith('"') && processedKey.endsWith('"')) {
  processedKey = processedKey.slice(1, -1);
}
processedKey = processedKey.replace(/\\n/g, '\n');

console.log('Processed key length:', processedKey.length);
console.log('Processed key starts with:', processedKey.substring(0, 50));

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
      privateKey: processedKey,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase Admin SDK:', error.message);
}