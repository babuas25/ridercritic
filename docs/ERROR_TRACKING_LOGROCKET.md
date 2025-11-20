# 🎥 LogRocket Error Tracking Setup Guide

## ✅ Perfect for Your Needs!

- ✅ **100% Free**: 1,000 sessions/month forever
- ✅ **No Credit Card Required**: Truly free
- ✅ **Vercel Compatible**: Works perfectly with Vercel free plan
- ✅ **Session Replay**: See exactly what users did (amazing for debugging!)
- ✅ **Error Tracking**: Full error monitoring
- ✅ **Performance Monitoring**: Track performance issues

---

## 🎯 Why LogRocket?

**Unique Feature**: **Session Replay** - See exactly what users did before errors occurred!

This is incredibly valuable because:
- See user clicks, scrolls, and interactions
- Watch the exact sequence of events
- Debug issues that are hard to reproduce
- Understand user behavior

---

## 🚀 Quick Setup (10 Minutes)

### Step 1: Create LogRocket Account

1. Go to [https://logrocket.com](https://logrocket.com)
2. Click "Start Free" (no credit card required!)
3. Sign up with email
4. Create a new project:
   - Name: `RiderCritic`
   - Framework: `Next.js`

### Step 2: Install LogRocket

```bash
npm install logrocket
```

### Step 3: Get Your App ID

After creating the project, LogRocket will show you an **App ID** (looks like: `abc123/def456`)

### Step 4: Configure LogRocket

Create `lib/logrocket.ts`:

```typescript
/**
 * LogRocket Error Tracking & Session Replay
 * 
 * Free tier: 1,000 sessions/month
 * No credit card required
 */

let logRocket: any = null;

// Initialize LogRocket (client-side only)
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
  import('logrocket').then((LogRocket) => {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID!);
    logRocket = LogRocket.default;
  });
}

export { logRocket };

/**
 * Identify user (optional but recommended)
 */
export function identifyUser(userId: string, userInfo?: {
  name?: string;
  email?: string;
  role?: string;
  [key: string]: any;
}) {
  if (logRocket && typeof window !== 'undefined') {
    logRocket.identify(userId, userInfo);
  }
}

/**
 * Track custom events
 */
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (logRocket && typeof window !== 'undefined') {
    logRocket.track(eventName, properties);
  }
}
```

### Step 5: Add Environment Variable

Add to `.env.local`:

```env
# LogRocket (Free: 1,000 sessions/month, no credit card required)
NEXT_PUBLIC_LOGROCKET_APP_ID=your_app_id_here
```

**Where to find App ID**: LogRocket dashboard → Settings → Project Settings

### Step 6: Initialize in Your App

Update `app/layout.tsx`:

```typescript
import { useEffect } from 'react';
import { logRocket } from '@/lib/logrocket';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // LogRocket initializes automatically via lib/logrocket.ts
    // This ensures it only loads on client-side
  }, []);

  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Step 7: Identify Users (Optional but Recommended)

When users log in, identify them:

```typescript
// In your login/authentication code
import { identifyUser } from '@/lib/logrocket';
import { useSession } from 'next-auth/react';

function useLogRocketUser() {
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      identifyUser(session.user.id, {
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      });
    }
  }, [session]);
}
```

---

## 🎯 Usage Examples

### Automatic Error Tracking

LogRocket automatically captures:
- ✅ JavaScript errors
- ✅ Unhandled promise rejections
- ✅ Network errors
- ✅ Console errors

**No code needed!** It just works.

### Track Custom Events

```typescript
import { trackEvent } from '@/lib/logrocket';

// Track user actions
trackEvent('Button Clicked', {
  buttonName: 'Submit Form',
  page: 'dashboard',
});

trackEvent('Form Submitted', {
  formType: 'motorcycle-review',
  success: true,
});
```

### Identify Users

```typescript
import { identifyUser } from '@/lib/logrocket';

// When user logs in
identifyUser('user123', {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'CriticMaster',
});
```

---

## 🔍 Viewing Sessions

1. Go to [https://app.logrocket.com](https://app.logrocket.com)
2. Click on your project
3. See all sessions in real-time
4. Click any session to watch the replay!

**Features**:
- Watch user's screen
- See console logs
- View network requests
- See Redux/state changes
- Track errors

---

## 🎥 Session Replay Features

- **Full Session Recording**: See everything the user did
- **Error Highlighting**: Errors are automatically highlighted
- **Performance Metrics**: See slow pages/actions
- **Network Monitoring**: View all API calls
- **State Inspection**: See Redux/Context state changes

---

## 📊 Free Tier Details

**What You Get**:
- ✅ 1,000 sessions/month
- ✅ 30-day data retention
- ✅ Session replay
- ✅ Error tracking
- ✅ Performance monitoring
- ✅ Network monitoring
- ✅ No credit card required
- ✅ Free forever

**Limitations**:
- 1,000 sessions/month (plenty for launch!)
- 30-day retention (upgrade for longer)

**Upgrade**: If you need more, plans start at $99/month

---

## 🚀 Production Deployment

1. **Add to Vercel Environment Variables**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `NEXT_PUBLIC_LOGROCKET_APP_ID=your_app_id`

2. **Deploy**:
   ```bash
   git push origin main
   ```

3. **Verify**:
   - Visit your production site
   - Check LogRocket dashboard
   - You should see sessions appearing!

---

## ✅ Checklist

- [ ] LogRocket account created (no credit card)
- [ ] Project created in LogRocket
- [ ] App ID copied
- [ ] `npm install logrocket` completed
- [ ] `lib/logrocket.ts` created
- [ ] Environment variable added to `.env.local`
- [ ] LogRocket initialized in layout
- [ ] User identification added (optional)
- [ ] Production environment variable set in Vercel
- [ ] Test session recorded successfully

---

## 🆘 Troubleshooting

**Sessions not appearing?**
- Check `NEXT_PUBLIC_LOGROCKET_APP_ID` is set correctly
- Verify it's a client-side variable (NEXT_PUBLIC_ prefix)
- Check browser console for errors
- Ensure LogRocket is initialized after page load

**Want to disable in development?**
- Only initialize in production:
  ```typescript
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Initialize LogRocket
  }
  ```

**Privacy concerns?**
- LogRocket respects user privacy
- You can mask sensitive data
- Check LogRocket settings for privacy options

---

## 💡 Pro Tips

1. **Identify Users**: Makes debugging much easier
2. **Track Key Events**: Add custom events for important actions
3. **Use Filters**: Filter sessions by errors, performance, etc.
4. **Set Alerts**: Get notified of errors (in paid plans)

---

## 🎯 Comparison with Other Options

| Feature | LogRocket | Rollbar | Better Stack |
|---------|----------|---------|--------------|
| **Free Tier** | 1K sessions | 5K events | 1M events |
| **Credit Card** | ❌ No | ⚠️ After 14 days | ❌ No |
| **Session Replay** | ✅ Yes | ❌ No | ❌ No |
| **Vercel Compatible** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Setup Time** | 10 min | 5 min | 10 min |

---

**Setup Time**: ~10 minutes  
**Cost**: 100% Free (1,000 sessions/month)  
**Credit Card**: Not required  
**Vercel Compatible**: ✅ Yes

