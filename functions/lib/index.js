"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRole = exports.updateLastLogin = exports.onUserDeleted = exports.onUserCreated = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
// Handle user creation
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
    const userProfile = {
        email: user.email || null,
        displayName: user.displayName || null,
        photoURL: user.photoURL || null,
        createdAt: admin.firestore.Timestamp.now(),
        role: 'user', // Default role
    };
    try {
        await admin.firestore().collection('users').doc(user.uid).set(userProfile);
        console.log(`User profile created for ${user.uid}`);
    }
    catch (error) {
        console.error('Error creating user profile:', error);
        throw new functions.https.HttpsError('internal', 'Failed to create user profile');
    }
});
// Handle user deletion
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
    try {
        await admin.firestore().collection('users').doc(user.uid).delete();
        console.log(`User profile deleted for ${user.uid}`);
    }
    catch (error) {
        console.error('Error deleting user profile:', error);
        throw new functions.https.HttpsError('internal', 'Failed to delete user profile');
    }
});
// Update user last login
exports.updateLastLogin = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    try {
        await admin.firestore().collection('users').doc(context.auth.uid).update({
            lastLoginAt: admin.firestore.Timestamp.now(),
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error updating last login:', error);
        throw new functions.https.HttpsError('internal', 'Failed to update last login time');
    }
});
// Get user role
exports.getUserRole = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }
    try {
        const userDoc = await admin.firestore().collection('users').doc(context.auth.uid).get();
        if (!userDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'User profile not found');
        }
        const userData = userDoc.data();
        return { role: userData.role };
    }
    catch (error) {
        console.error('Error getting user role:', error);
        throw new functions.https.HttpsError('internal', 'Failed to get user role');
    }
});
//# sourceMappingURL=index.js.map