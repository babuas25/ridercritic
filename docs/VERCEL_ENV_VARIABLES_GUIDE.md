# 🚀 Vercel Environment Variables Setup Guide

## 📋 Complete Checklist

Use this guide to add all required environment variables to Vercel for production deployment.

---

## 🎯 Step-by-Step Instructions

### Step 1: Access Vercel Dashboard

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Log in to your account
3. Select your **ridercritic** project
   - If project doesn't exist, create it first by connecting your GitHub repo

### Step 2: Navigate to Environment Variables

1. Click on your project
2. Go to **Settings** tab (top navigation)
3. Click **Environment Variables** (left sidebar)

### Step 3: Add Variables

For each variable below:
1. Click **Add New**
2. Enter the **Key** (variable name)
3. Enter the **Value** (from your `.env.local`)
4. Select **Environment(s)**:
   - ✅ **Production** (required)
   - ✅ **Preview** (optional, recommended)
   - ❌ **Development** (not needed, use `.env.local`)
5. Click **Save**

---

## 📝 Variables to Add (15 Total)

### 1. Firebase Client SDK (7 variables)

#### Variable 1: `NEXT_PUBLIC_API_KEY`
- **Key**: `NEXT_PUBLIC_API_KEY`
- **Value**: `AIzaSyCzhZY1GSP96kDw0x6mHDbyyv-H0BSKuhQ`
- **Environment**: Production, Preview

#### Variable 2: `NEXT_PUBLIC_AUTH_DOMAIN`
- **Key**: `NEXT_PUBLIC_AUTH_DOMAIN`
- **Value**: `ridercritics-386df.firebaseapp.com`
- **Environment**: Production, Preview

#### Variable 3: `NEXT_PUBLIC_PROJECT_ID`
- **Key**: `NEXT_PUBLIC_PROJECT_ID`
- **Value**: `ridercritics-386df`
- **Environment**: Production, Preview

#### Variable 4: `NEXT_PUBLIC_STORAGE_BUCKET`
- **Key**: `NEXT_PUBLIC_STORAGE_BUCKET`
- **Value**: `ridercritics-386df.firebasestorage.app`
- **Environment**: Production, Preview

#### Variable 5: `NEXT_PUBLIC_MESSAGING_SENDER_ID`
- **Key**: `NEXT_PUBLIC_MESSAGING_SENDER_ID`
- **Value**: `27916928944`
- **Environment**: Production, Preview

#### Variable 6: `NEXT_PUBLIC_APP_ID`
- **Key**: `NEXT_PUBLIC_APP_ID`
- **Value**: `1:27916928944:web:27425528c1d62934537875`
- **Environment**: Production, Preview

#### Variable 7: `NEXT_PUBLIC_MEASUREMENT_ID`
- **Key**: `NEXT_PUBLIC_MEASUREMENT_ID`
- **Value**: `G-6TRNQY6SG9`
- **Environment**: Production, Preview

---

### 2. Firebase Admin SDK (2 variables)

#### Variable 8: `FIREBASE_PRIVATE_KEY`
- **Key**: `FIREBASE_PRIVATE_KEY`
- **Value**: Copy from your `.env.local` (the entire private key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
- **Important**: 
  - Keep the quotes if they're in your `.env.local`
  - Keep the `\n` characters (they'll be processed correctly)
  - Example format: `"-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDOpHKH6DUL8zHe\n...\n-----END PRIVATE KEY-----\n"`
- **Environment**: Production, Preview

#### Variable 9: `FIREBASE_CLIENT_EMAIL`
- **Key**: `FIREBASE_CLIENT_EMAIL`
- **Value**: `firebase-adminsdk-fbsvc@ridercritics-386df.iam.gserviceaccount.com`
- **Environment**: Production, Preview

---

### 3. Google OAuth (2 variables)

#### Variable 10: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Key**: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- **Value**: `27916928944-cqddifgkt979ugh4k1g3pt1fcv7sjn7c.apps.googleusercontent.com`
- **Environment**: Production, Preview

#### Variable 11: `GOOGLE_CLIENT_SECRET`
- **Key**: `GOOGLE_CLIENT_SECRET`
- **Value**: `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`
- **Environment**: Production, Preview

---

### 4. NextAuth (2 variables)

#### Variable 12: `NEXTAUTH_SECRET`
- **Key**: `NEXTAUTH_SECRET`
- **Value**: `6IvHM9tnp01xpdY+4HK8WREPcYwKb4UPhUqbEJE+McY=`
- **Environment**: Production, Preview

#### Variable 13: `NEXTAUTH_URL`
- **Key**: `NEXTAUTH_URL`
- **Value**: 
  - **For Vercel deployment**: `https://your-project-name.vercel.app` (replace with your actual Vercel URL)
  - **For custom domain**: `https://yourdomain.com`
  - **Important**: Do NOT use `http://localhost:3000` for production!
- **Environment**: Production, Preview

**How to find your Vercel URL**:
- After first deployment, Vercel will show your URL
- Format: `https://ridercritic-xxxxx.vercel.app` or your custom domain
- You can update this later if needed

---

### 5. LogRocket (1 variable)

#### Variable 14: `NEXT_PUBLIC_LOGROCKET_APP_ID`
- **Key**: `NEXT_PUBLIC_LOGROCKET_APP_ID`
- **Value**: `hbhibn/ridercritic`
- **Environment**: Production, Preview

---

### 6. Super Admin (1 variable)

#### Variable 15: `SUPER_ADMIN_EMAIL`
- **Key**: `SUPER_ADMIN_EMAIL`
- **Value**: `babuas25@gmail.com`
- **Environment**: Production, Preview

---

## ✅ Verification Checklist

After adding all variables, verify:

- [ ] All 15 variables added
- [ ] All set to **Production** environment
- [ ] All set to **Preview** environment (optional but recommended)
- [ ] `NEXTAUTH_URL` uses production URL (not localhost)
- [ ] `FIREBASE_PRIVATE_KEY` includes full key with BEGIN/END markers
- [ ] No typos in variable names
- [ ] All values copied correctly from `.env.local`

---

## 🚀 After Adding Variables

### Step 1: Redeploy

After adding environment variables, you need to redeploy:

**Option A: Via Vercel Dashboard**
1. Go to **Deployments** tab
2. Click **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

**Option B: Via Git**
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy with new env vars"
git push origin main
```

### Step 2: Verify Deployment

1. Wait for deployment to complete
2. Visit your production URL
3. Check browser console for errors
4. Test authentication
5. Verify LogRocket is working

---

## 🔍 Troubleshooting

### Issue: Variables not working after deployment

**Solution**:
- Ensure variables are set to **Production** environment
- Redeploy after adding variables (they don't apply to existing deployments)
- Check variable names match exactly (case-sensitive)
- Verify no extra spaces in values

### Issue: Authentication not working

**Solution**:
- Check `NEXTAUTH_URL` is correct (production URL, not localhost)
- Verify `NEXTAUTH_SECRET` is set
- Check Google OAuth redirect URI includes production URL
- Verify Firebase credentials are correct

### Issue: Firebase errors

**Solution**:
- Verify all Firebase variables are set
- Check `FIREBASE_PRIVATE_KEY` format (keep `\n` characters)
- Ensure `FIREBASE_CLIENT_EMAIL` is correct
- Verify project ID matches

### Issue: LogRocket not working

**Solution**:
- Check `NEXT_PUBLIC_LOGROCKET_APP_ID` is set
- Verify App ID format: `hbhibn/ridercritic`
- Check browser console for errors
- Ensure variable has `NEXT_PUBLIC_` prefix

---

## 📋 Quick Reference

### Variable Count by Category:
- Firebase Client: 7 variables
- Firebase Admin: 2 variables
- Google OAuth: 2 variables
- NextAuth: 2 variables
- LogRocket: 1 variable
- Super Admin: 1 variable
- **Total: 15 variables**

### Environment Settings:
- ✅ **Production**: All variables
- ✅ **Preview**: All variables (recommended)
- ❌ **Development**: Not needed (use `.env.local`)

---

## 🎯 Next Steps After Setup

1. ✅ Add all environment variables
2. ✅ Redeploy application
3. ✅ Test production site
4. ✅ Verify authentication works
5. ✅ Check LogRocket is recording
6. ✅ Test all features

---

## 💡 Pro Tips

1. **Copy from `.env.local`**: Copy values directly from your `.env.local` file to avoid typos
2. **Double-check `NEXTAUTH_URL`**: This is the most common mistake - use production URL!
3. **Test after deployment**: Always test authentication and key features after adding variables
4. **Keep `.env.local` updated**: Keep your local file in sync with production
5. **Use Preview environment**: Test changes in preview before production

---

## 📝 Notes

- Environment variables are **case-sensitive**
- Variables with `NEXT_PUBLIC_` prefix are exposed to the browser
- Variables without `NEXT_PUBLIC_` are server-side only
- Changes to environment variables require a redeploy
- You can update variables anytime and redeploy

---

**Time Required**: ~15-20 minutes  
**Difficulty**: Easy  
**Status**: Ready to set up!

