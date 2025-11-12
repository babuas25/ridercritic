# 🚀 Quick Setup: Error Tracking with Rollbar (Free)

## Why Rollbar?

- ✅ **100% Free**: 5,000 events/month (perfect for launch)
- ✅ **5-Minute Setup**: Easy Next.js integration
- ✅ **Production Ready**: Used by thousands of companies
- ✅ **Already Integrated**: Code is ready, just add tokens!

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Install Rollbar

```bash
npm install rollbar
```

### Step 2: Get Your Tokens

1. Go to [https://rollbar.com](https://rollbar.com) and sign up (free)
2. Create a new project: `RiderCritic`
3. Go to **Settings** → **Project Access Tokens**
4. Copy:
   - **Client-side token** (starts with `post_`)
   - **Server-side token** (starts with `post_`)

### Step 3: Add to Environment Variables

Add to `.env.local`:

```env
# Rollbar Error Tracking (Optional - Free tier: 5K events/month)
NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN=your_client_token_here
ROLLBAR_SERVER_TOKEN=your_server_token_here
```

**Note**: If you don't add these, error tracking won't work but the app will still function normally.

### Step 4: Test It

The code is already integrated! Just use the logger:

```typescript
import { logger } from '@/lib/logger';

try {
  // Your code
} catch (error) {
  logger.error('Something went wrong', error);
  // This will automatically report to Rollbar in production!
}
```

### Step 5: Deploy

Add the same environment variables to Vercel:
- Vercel Dashboard → Your Project → Settings → Environment Variables

---

## ✅ That's It!

Errors will now automatically be tracked in Rollbar when:
- ✅ You use `logger.error()` anywhere in your code
- ✅ Uncaught errors occur (automatic)
- ✅ Unhandled promise rejections occur (automatic)

---

## 📊 View Errors

1. Go to [https://rollbar.com](https://rollbar.com)
2. Click on your project
3. See all errors in real-time!

---

## 🎯 Usage Examples

### In API Routes

```typescript
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    // Your code
  } catch (error) {
    logger.error('API error', error, { endpoint: '/api/users' });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### In Components

```typescript
'use client';

import { logger } from '@/lib/logger';

function MyComponent() {
  const handleClick = async () => {
    try {
      // Your code
    } catch (error) {
      logger.error('Component error', error, { action: 'buttonClick' });
    }
  };
}
```

---

## 🔧 Optional: Add Error Boundary

Wrap your app in `app/layout.tsx`:

```typescript
import { ErrorBoundary } from '@/components/error-boundary';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
```

---

## 💡 Free Tier Limits

- **5,000 events/month** - Perfect for launch
- **Unlimited projects**
- **Email alerts**
- **Source maps**

**Upgrade**: If you exceed limits, plans start at $10/month

---

## 🆘 Troubleshooting

**Errors not showing?**
- Check tokens are set correctly
- Verify `NODE_ENV=production` in production
- Check Rollbar dashboard for any setup issues

**Want to disable?**
- Just remove the environment variables
- The app will work normally without Rollbar

---

## 📚 More Options

See `ERROR_TRACKING_OPTIONS.md` for:
- LogRocket (session replay)
- GlitchTip (self-hosted)
- Other alternatives

---

**Setup Time**: 5 minutes  
**Cost**: Free (5K events/month)  
**Difficulty**: Easy

