# Console.log Migration Guide

This document tracks the migration from `console.log` to the production-safe logger utility.

## Logger Utility

A new logger utility has been created at `lib/logger.ts` that:
- ✅ Automatically disables logs in production
- ✅ Can be enabled in production via `ENABLE_LOGGING=true` environment variable
- ✅ Always logs errors (even in production)
- ✅ Provides structured logging with context

## Usage

```typescript
// Import the logger
import { logger } from '@/lib/logger';

// Replace console.log
logger.debug('Debug message', data);
logger.info('Info message', data);
logger.warn('Warning message', data);
logger.error('Error message', error);
```

## Files to Update

### High Priority (Server-side / API Routes)
These files may log sensitive information and should be updated first:

1. **`lib/firebase-admin.ts`** (5 instances)
   - Lines: 11, 20, 41, 50
   - Contains: Firebase initialization logs
   - Action: Replace with `logger.debug()` or `logger.info()`

2. **`app/api/users/route.ts`** (15 instances)
   - Contains: User data, authentication tokens
   - Action: Replace with `logger.info()` for flow, `logger.error()` for errors

3. **`app/api/critics/route.ts`** (9 instances)
   - Contains: API request/response data
   - Action: Replace with `logger.info()` for flow, `logger.error()` for errors

4. **`app/api/auth/[...nextauth]/route.ts`** (2 instances)
   - Contains: Authentication flow
   - Action: Replace with `logger.info()` or `logger.error()`

### Medium Priority (Library Functions)
5. **`lib/storage.ts`** (6 instances)
   - Contains: File upload paths and URLs
   - Action: Replace with `logger.debug()` (file operations)

6. **`lib/motorcycles.ts`** (7 instances)
   - Contains: Data operations
   - Action: Replace with `logger.debug()` or `logger.info()`

7. **`lib/critics.ts`** (8 instances)
   - Contains: Data operations
   - Action: Replace with `logger.debug()` or `logger.info()`

### Lower Priority (Client Components)
8. **`components/ui/image-uploader.tsx`** (4 instances)
9. **`components/motorcycle-form/BasicInformationStep.tsx`** (2 instances)
10. **`app/motorcycle/[id]/page-client.tsx`** (6 instances)
11. **`app/dashboard/user/critics/page.tsx`** (9 instances)
12. **`app/dashboard/motorcycles/edit/[id]/page.tsx`** (1 instance)
13. **`app/dashboard/motorcycles/add/page.tsx`** (1 instance)
14. **`app/dashboard/critics/page.tsx`** (9 instances)
15. **`app/dashboard/brands/page.tsx`** (2 instances)
16. **`app/dashboard/admin/page.tsx`** (3 instances)

## Migration Steps

1. **Start with server-side code** (API routes, lib functions)
2. **Replace console.log with appropriate logger method**:
   - Debug info → `logger.debug()`
   - General info → `logger.info()`
   - Warnings → `logger.warn()`
   - Errors → `logger.error()`
3. **Remove console.log statements** from client components (or replace with logger if needed for debugging)
4. **Test in development** to ensure logs still work
5. **Verify in production** that logs are disabled

## Example Migration

### Before:
```typescript
console.log('API GET /api/users - Starting request processing');
console.log('API GET /api/users - Token received:', token);
console.error('API GET /api/users - No token found, returning 401');
```

### After:
```typescript
import { logger } from '@/lib/logger';

logger.info('API GET /api/users - Starting request processing');
logger.debug('API GET /api/users - Token received', { hasToken: !!token });
logger.error('API GET /api/users - No token found, returning 401');
```

## Status

- [ ] `lib/firebase-admin.ts`
- [ ] `app/api/users/route.ts`
- [ ] `app/api/critics/route.ts`
- [ ] `app/api/auth/[...nextauth]/route.ts`
- [ ] `lib/storage.ts`
- [ ] `lib/motorcycles.ts`
- [ ] `lib/critics.ts`
- [ ] Client components (16 files)

**Total**: ~97 console.log statements across 16 files

---

**Note**: This migration can be done incrementally. Priority should be given to server-side code that may log sensitive information.

