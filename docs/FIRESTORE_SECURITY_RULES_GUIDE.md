# 🔒 Firestore Security Rules - Production Guide

## ⚠️ Current Status

**Current Rules**: Permissive (development mode)
- `allow read, write: if true` - **UNSAFE for production!**
- Anyone can read/write all data
- No authentication checks
- No role-based access control

**Risk**: Production data could be exposed or modified by unauthorized users

---

## 🎯 Production Security Rules

### Current Issues

1. **Too Permissive**: `allow read, write: if true` allows anyone
2. **No Authentication**: No checks for logged-in users
3. **No Role-Based Access**: All users have same permissions
4. **Public Data**: Some collections should be public, but writes should be restricted

---

## ✅ Recommended Production Rules

### 1. Users Collection

```javascript
match /users/{userId} {
  // Users can read their own data
  allow read: if isAuthenticated() && request.auth.uid == userId;
  
  // Users can update their own profile (except role/subRole)
  allow update: if isAuthenticated() && request.auth.uid == userId 
                && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['role', 'subRole']);
  
  // Only Super Admin can create users or modify roles
  allow create: if isSuperAdmin();
  allow update: if isSuperAdmin();
  allow delete: if isSuperAdmin();
  
  // Admins can read all users
  allow read: if isAdmin();
}
```

### 2. Motorcycles Collection

```javascript
match /motorcycles/{motorcycleId} {
  // Public read access for published motorcycles
  allow read: if resource.data.published == true || isAuthenticated();
  
  // Only authenticated users can create
  allow create: if isAuthenticated();
  
  // Only owner or admin can update
  allow update: if isAuthenticated() && (
    resource.data.createdBy == request.auth.uid || 
    isAdmin()
  );
  
  // Only admin can delete
  allow delete: if isAdmin();
}
```

### 3. Reviews/Critics Collection

```javascript
match /reviews/{reviewId} {
  // Public read for published reviews
  allow read: if resource.data.published == true || isAuthenticated();
  
  // Only authenticated users with CriticStar or CriticMaster can create
  allow create: if isAuthenticated() && (
    getUserSubRole() == 'CriticStar' || 
    getUserSubRole() == 'CriticMaster'
  );
  
  // Only owner or CriticMaster can update
  allow update: if isAuthenticated() && (
    resource.data.authorId == request.auth.uid || 
    getUserSubRole() == 'CriticMaster'
  );
  
  // Only owner or admin can delete
  allow delete: if isAuthenticated() && (
    resource.data.authorId == request.auth.uid || 
    isAdmin()
  );
}
```

### 4. Comments Collection

```javascript
match /comments/{commentId} {
  // Public read
  allow read: if true;
  
  // Only authenticated users can create
  allow create: if isAuthenticated();
  
  // Only owner can update/delete
  allow update, delete: if isAuthenticated() && 
    resource.data.userId == request.auth.uid;
}
```

### 5. Brands/Types Collections

```javascript
match /brands/{brandId} {
  // Public read
  allow read: if true;
  
  // Only admin can write
  allow write: if isAdmin();
}

match /types/{typeId} {
  // Public read
  allow read: if true;
  
  // Only admin can write
  allow write: if isAdmin();
}
```

---

## 🔧 Helper Functions

Add these helper functions to your rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    
    function getUserSubRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.subRole;
    }
    
    function isAdmin() {
      return isAuthenticated() && (
        getUserRole() == 'Super Admin' || 
        getUserRole() == 'Admin'
      );
    }
    
    function isSuperAdmin() {
      return isAuthenticated() && getUserRole() == 'Super Admin';
    }
    
    function canWriteReviews() {
      return isAuthenticated() && (
        getUserSubRole() == 'CriticStar' || 
        getUserSubRole() == 'CriticMaster'
      );
    }
    
    function canModerate() {
      return isAuthenticated() && getUserSubRole() == 'CriticMaster';
    }
    
    // Your collection rules here...
  }
}
```

---

## 📝 Step-by-Step Migration

### Step 1: Test Rules Locally

1. **Use Firebase Emulator**:
   ```bash
   npm install -g firebase-tools
   firebase init emulators
   firebase emulators:start
   ```

2. **Test your rules** with the emulator

### Step 2: Create Staging Rules

1. Create `firestore.rules.staging` with production rules
2. Test thoroughly in staging environment
3. Verify all user roles work correctly

### Step 3: Deploy to Production

1. **Backup current rules**:
   ```bash
   firebase firestore:rules:get > firestore.rules.backup
   ```

2. **Deploy new rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Monitor** for any permission errors

---

## ⚠️ Important Notes

1. **Test Thoroughly**: Test all user roles and operations
2. **Backup First**: Always backup current rules
3. **Gradual Rollout**: Consider deploying to staging first
4. **Monitor Errors**: Watch for permission denied errors
5. **User Data**: Ensure users can still access their own data

---

## 🚨 Common Issues

### Issue: "Permission denied" errors

**Solution**: 
- Check if user is authenticated
- Verify user role in Firestore
- Check helper functions are working

### Issue: Users can't read their own data

**Solution**:
- Verify `request.auth.uid` matches document ID
- Check authentication is working

### Issue: Admin can't access admin routes

**Solution**:
- Verify role is set correctly in user document
- Check `isAdmin()` helper function

---

## ✅ Checklist

- [ ] Backup current rules
- [ ] Create production rules
- [ ] Test in Firebase Emulator
- [ ] Test with all user roles
- [ ] Deploy to staging (if available)
- [ ] Deploy to production
- [ ] Monitor for errors
- [ ] Document any exceptions

---

## 📚 Resources

- [Firestore Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)
- [Security Rules Testing](https://firebase.google.com/docs/firestore/security/test-rules)

---

**Status**: ⚠️ Needs immediate attention before production launch

