import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
admin.initializeApp();

// Types for user profile
interface UserProfile {
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: admin.firestore.Timestamp;
  lastLoginAt?: admin.firestore.Timestamp;
  role: 'user' | 'admin';
}

// Handle user creation
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const userProfile: UserProfile = {
    email: user.email || null,
    displayName: user.displayName || null,
    photoURL: user.photoURL || null,
    createdAt: admin.firestore.Timestamp.now(),
    role: 'user', // Default role
  };

  try {
    await admin.firestore().collection('users').doc(user.uid).set(userProfile);
    console.log(`User profile created for ${user.uid}`);
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user profile');
  }
});

// Handle user deletion
export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  try {
    await admin.firestore().collection('users').doc(user.uid).delete();
    console.log(`User profile deleted for ${user.uid}`);
  } catch (error) {
    console.error('Error deleting user profile:', error);
    throw new functions.https.HttpsError('internal', 'Failed to delete user profile');
  }
});

// Update user last login
export const updateLastLogin = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    await admin.firestore().collection('users').doc(context.auth.uid).update({
      lastLoginAt: admin.firestore.Timestamp.now(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating last login:', error);
    throw new functions.https.HttpsError('internal', 'Failed to update last login time');
  }
});

// Get user role
export const getUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User profile not found');
    }

    const userData = userDoc.data() as UserProfile;
    return { role: userData.role };
  } catch (error) {
    console.error('Error getting user role:', error);
    throw new functions.https.HttpsError('internal', 'Failed to get user role');
  }
}); 