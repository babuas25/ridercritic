# ridercritic

A modern web application for motorcycle enthusiasts to share and review their riding experiences.

## Features

- User Authentication (Email/Password, Google, Facebook)
- Protected Dashboard
- Modern UI with Tailwind CSS
- Real-time Updates
- Responsive Design
- Secure Environment Configuration

## Tech Stack

- Next.js 14
- Firebase Authentication
- Tailwind CSS
- Shadcn/ui Components
- Vercel Deployment
- GitHub Actions CI/CD

## Development

To run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

The application is automatically deployed to Vercel through GitHub Actions CI/CD pipeline.

## Environment Variables

Required environment variables are securely managed through GitHub Secrets and automatically deployed to Vercel.

### Firebase Auth Domain Setup

- For **local development**, set in your `.env.local`:
  ```env
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=localhost
  ```
- For **production** (GitHub/Vercel secrets):
  ```env
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ridercritic.com
  ```

### Google Sign-In Troubleshooting
- If Google sign-in redirects to your home page or a 404, ensure the correct `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` is set for your environment.
- The `/__/auth/handler` route is handled by Firebase Hosting or the Firebase Emulator Suite. It will not work on localhost unless you use the emulator.
- For local testing of Google sign-in, use the Firebase Emulator Suite, or test on your deployed production site.

# RiderCritic Admin Dashboard

## Local Development Notes

- When running the frontend on `localhost:3000` and the API on a different domain (e.g., `api.ridercritic.com`), you may encounter CORS errors. This is a browser security feature.
- To resolve CORS issues in local development, ensure your backend API sends the correct CORS headers:
  - `Access-Control-Allow-Origin: http://localhost:3000`
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type, Authorization`
- Alternatively, use a proxy in your frontend dev server to forward API requests to your backend.

## Deployment Notes

- When deployed, ensure your frontend and backend use the correct production domains (e.g., `https://ridercritic.com` and `https://api.ridercritic.com`).
- The backend API must allow CORS from your production frontend domain (e.g., `Access-Control-Allow-Origin: https://ridercritic.com`).
- All API URLs in the frontend should use the correct protocol (`https://`) and domain.

## Authentication

- The admin dashboard and all protected admin pages require a valid `admin_token` in localStorage. If not present, users will be redirected to `/admin`.
- All API calls that require authentication send the `Authorization: Bearer <admin_token>` header.

## Features

- Admin dashboard with stats
- Brands and Types management (with Authorization header)
- Add Motorcycle page with dropdowns for Brands and Types (requires valid token)

## Troubleshooting

- If you see "Failed to load brands/types" or dropdowns are empty, check:
  - The API is reachable and returns data
  - The correct token is present in localStorage
  - No CORS errors in the browser console

---

For any issues, check the browser console and network tab for errors, and ensure your backend CORS settings are correct for your environment. 