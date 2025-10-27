/* eslint-disable @typescript-eslint/no-require-imports */
// Script to backfill lastLogin for existing users
// This sets lastLogin to createdAt for users who don't have a lastLogin timestamp

const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin
const serviceAccount = require(path.join(__dirname, '..', 'ridercritics-386df-firebase-adminsdk-fbsvc-eadd2b019f.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function backfillLastLogin() {
  try {
    console.log('Starting lastLogin backfill...');
    
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      console.log('No users found.');
      return;
    }
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    const batch = db.batch();
    
    snapshot.forEach((doc) => {
      const userData = doc.data();
      
      // Only update if lastLogin is missing
      if (!userData.lastLogin) {
        const lastLoginValue = userData.createdAt || new Date();
        
        batch.update(doc.ref, {
          lastLogin: lastLoginValue
        });
        
        console.log(`✓ Will update user: ${userData.email} (${doc.id})`);
        updatedCount++;
      } else {
        console.log(`- Skipped user: ${userData.email} (already has lastLogin)`);
        skippedCount++;
      }
    });
    
    // Commit the batch
    await batch.commit();
    
    console.log('\n=== Backfill Complete ===');
    console.log(`Updated users: ${updatedCount}`);
    console.log(`Skipped users: ${skippedCount}`);
    console.log(`Total users: ${snapshot.size}`);
    
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    // Close the connection
    await admin.app().delete();
  }
}

// Run the backfill
backfillLastLogin();
