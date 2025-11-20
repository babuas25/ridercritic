# 🚀 Deploy Firestore Security Rules

## ⚠️ Important: Before Deploying

1. **Test thoroughly** in development first
2. **Backup current rules** before deploying
3. **Have a rollback plan** ready

---

## 📋 Step-by-Step Deployment

### Step 1: Backup Current Rules

```bash
# If you have Firebase CLI installed
firebase firestore:rules:get > firestore.rules.backup

# Or manually copy firestore.rules to firestore.rules.backup
```

### Step 2: Review Production Rules

Review `firestore.rules.production` to ensure:
- ✅ All collections are covered
- ✅ Helper functions match your user structure
- ✅ Role names match your app (`Super Admin`, `Admin`, etc.)
- ✅ SubRole names match (`CriticStar`, `CriticMaster`, etc.)

### Step 3: Test Locally (Recommended)

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Start emulator
firebase emulators:start --only firestore

# Test your rules with the emulator
```

### Step 4: Deploy to Production

**Option A: Using Firebase CLI (Recommended)**

```bash
# Replace firestore.rules with production rules
cp firestore.rules.production firestore.rules

# Deploy
firebase deploy --only firestore:rules
```

**Option B: Using Firebase Console**

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Copy contents of `firestore.rules.production`
5. Paste into the rules editor
6. Click **Publish**

---

## ✅ Verification Checklist

After deploying, verify:

- [ ] Users can read their own data
- [ ] Users can update their own profile
- [ ] Public data (motorcycles, reviews) is readable
- [ ] Only authenticated users can create content
- [ ] Only admins can modify brands/types
- [ ] Only owners can update their own content
- [ ] Super Admin can manage users

---

## 🚨 If Something Goes Wrong

### Rollback Plan

```bash
# Restore backup
cp firestore.rules.backup firestore.rules

# Deploy backup
firebase deploy --only firestore:rules
```

Or via Firebase Console:
1. Go to Rules tab
2. Click **Version History**
3. Restore previous version

---

## 📝 Notes

- **Server-side operations** (using Admin SDK) bypass security rules
- **Client-side operations** are protected by these rules
- Test with different user roles before deploying
- Monitor for "Permission denied" errors after deployment

---

**Status**: Ready to deploy (after testing)

