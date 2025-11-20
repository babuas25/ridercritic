# How to Assign Super Admin

## Quick Method (For Existing User)

Since you've already logged in once, you have two options:

### Option A: Delete and Re-login (Easiest)

1. **Go to Firebase Console** → Firestore Database → Data tab
2. Find the `users` collection
3. Open your user document (the one with your email: `strimsilva@gmail.com`)
4. **Delete the document** (click the trash icon)
5. In your `.env.local` file, make sure you have:
   ```env
   SUPER_ADMIN_EMAIL=strimsilva@gmail.com
   ```
6. **Log out** of the app
7. **Log in again** with Google OAuth
8. You will now be created as "Super Admin"

### Option B: Manually Update Firestore

1. **Go to Firebase Console** → Firestore Database → Data tab
2. Find your user document in the `users` collection
3. **Click the document** to edit
4. Change the `role` field from:
   - From: `"User Admin"`
   - To: `"Super Admin"`
5. Click "Update"
6. **Refresh your app** - you should now be a Super Admin

## Verify Super Admin Status

After assigning yourself as Super Admin, you should be able to:
- Access `/dashboard/super-admin` route
- Manage all users and roles
- Have full admin privileges

## Environment Variable

Make sure your `.env.local` includes:

```env
SUPER_ADMIN_EMAIL=strimsilva@gmail.com
```

This email will automatically receive "Super Admin" role on first login.

## Note

The Super Admin role is determined by comparing the login email with the `SUPER_ADMIN_EMAIL` environment variable. Multiple super admins can be set by separating emails with commas (you'd need to update the code to support this).

