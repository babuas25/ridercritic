# ⚡ Quick Start Pre-Launch Checklist

> **TL;DR**: Run these commands and check these items before launching

## 🚀 Quick Commands

```bash
# Run automated pre-launch checks
npm run pre-launch

# Quick check (skips build and lint)
npm run pre-launch:quick

# Manual checks
npm run build          # Must succeed
npm run lint           # Must pass
npm audit              # Fix high/critical issues
```

## ✅ Critical Items (Must Do)

### 1. Build & Test
- [ ] `npm run build` succeeds without errors
- [ ] `npm run lint` passes
- [ ] `npm audit` - fix high/critical vulnerabilities

### 2. Environment Variables
- [ ] All environment variables set in production (Vercel dashboard)
- [ ] `.env.example` file created (template for team)
- [ ] No secrets committed to git

### 3. Security
- [ ] Firestore security rules tightened for production
- [ ] `NEXTAUTH_SECRET` is strong (32+ random characters)
- [ ] HTTPS enforced in production
- [ ] Run `npm audit` and fix issues

### 4. Firebase
- [ ] Firestore indexes deployed
- [ ] Storage security rules configured
- [ ] Production Firebase project configured (separate from dev)

### 5. Testing
- [ ] Authentication flow tested
- [ ] All user roles tested
- [ ] Mobile responsiveness tested
- [ ] Critical features tested

### 6. Monitoring
- [ ] Error tracking set up (Sentry recommended)
- [ ] Analytics configured (Vercel Analytics)
- [ ] Uptime monitoring configured

### 7. Legal
- [ ] Privacy Policy created and linked
- [ ] Terms of Service created and linked

## 📋 Full Checklist

See `PRE_LAUNCH_CHECKLIST.md` for the complete detailed checklist.

## 🎯 Pre-Launch Script

The automated script (`npm run pre-launch`) checks:
- ✅ File structure
- ✅ Configuration files
- ✅ TypeScript settings
- ✅ Security rules
- ✅ Console.log statements
- ✅ Build success
- ✅ Linting
- ✅ Security vulnerabilities

---

**Remember**: This is a quick reference. Always review the full `PRE_LAUNCH_CHECKLIST.md` before launching!

