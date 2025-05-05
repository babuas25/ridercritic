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