# ⚡ Quick Reference: Vercel Environment Variables

## 🎯 Quick Checklist

Copy these values from your `.env.local` to Vercel:

### Firebase Client SDK (7)
```
NEXT_PUBLIC_API_KEY
NEXT_PUBLIC_AUTH_DOMAIN
NEXT_PUBLIC_PROJECT_ID
NEXT_PUBLIC_STORAGE_BUCKET
NEXT_PUBLIC_MESSAGING_SENDER_ID
NEXT_PUBLIC_APP_ID
NEXT_PUBLIC_MEASUREMENT_ID
```

### Firebase Admin SDK (2)
```
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
```

### Google OAuth (2)
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
```

### NextAuth (2)
```
NEXTAUTH_SECRET
NEXTAUTH_URL (use your Vercel URL, not localhost!)
```

### LogRocket (1)
```
NEXT_PUBLIC_LOGROCKET_APP_ID=hbhibn/ridercritic
```

### Super Admin (1)
```
SUPER_ADMIN_EMAIL=babuas25@gmail.com
```

---

## 🚀 Steps

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable above
3. Set to **Production** (and Preview)
4. Redeploy
5. Test!

---

**See**: `VERCEL_ENV_VARIABLES_GUIDE.md` for detailed instructions

