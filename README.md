# RiderCritic - Multi-Role Authentication System

A comprehensive Next.js application with role-based access control, featuring 7 admin roles and 3 user subroles. Built with Next.js 16, NextAuth.js, Firebase, Tailwind CSS, and Shadcn UI.

## 🚨 **IMPORTANT: Dependency Fix Required**

**Current Issue**: NextAuth compatibility with Next.js 16

**Quick Fix**: Run this command to resolve the issue:
```bash
npm uninstall next-auth
npm install next-auth@4.24.11 --legacy-peer-deps
```

Or downgrade to Next.js 15:
```bash
npm install next@15.0.0
```

See `FIX_NEXAUTH.md` for detailed instructions.

## 🚀 Features

### Authentication & Authorization
- **NextAuth.js Integration**: Email and Google OAuth authentication
- **Role-Based Access Control**: 7 admin roles with hierarchical permissions
- **User Subroles**: 3-tier progression system (NewStar → CriticStar → CriticMaster)
- **JWT Session Management**: Secure token-based authentication

### User Roles & Permissions

#### Admin Roles (7 total)
1. **Super Admin** - Full system access, can manage all users and roles
2. **Admin** - User management, cannot modify Super Admin role
3. **Sponsor Admin** - Manages sponsorships and campaigns
4. **Supplier Admin** - Manages suppliers and inventory
5. **Partner Admin** - Manages partnerships and affiliates
6. **Freelancer Admin** - Manages freelancers and contracts
7. **User Admin** - Base role for all new users

#### User Subroles (3 levels)
1. **NewStar** - Basic access, can browse and read reviews
2. **CriticStar** - Can write reviews and rate content
3. **CriticMaster** - Can moderate and approve/reject reviews

### Dashboard System
- **Role-specific dashboards** with appropriate features and permissions
- **Real-time role updates** via Firestore integration
- **Modern UI** with Shadcn components and Tailwind CSS
- **Responsive design** for all device types

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 18, TypeScript
- **Authentication**: NextAuth.js v4, Google OAuth
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS, Shadcn UI, Lucide React icons
- **Forms**: React Hook Form, Zod validation
- **State Management**: React hooks, NextAuth session

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Google OAuth credentials

### 1. Fix Dependencies (REQUIRED)
```bash
npm install next-auth@4.24.11 --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_API_KEY=your_firebase_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### 3. Set up Firebase & Google OAuth

1. **Firebase**: Create project, enable Auth + Firestore
2. **Google OAuth**: Set up credentials in Google Cloud Console
3. **Update environment variables** with your credentials

### 4. Run the Application
```bash
npm run dev
```

Visit `http://localhost:3000` to see your application!

## 🔐 Authentication Flow

1. **Registration/Login**: Users can sign up via Google OAuth or email
2. **Default Assignment**: New users automatically get "User Admin" role and "NewStar" subrole
3. **Role Management**: Super Admin and Admin can modify user roles through the admin panel
4. **Session Management**: JWT tokens include role and subrole claims
5. **Route Protection**: Middleware validates permissions for each route

## 🎯 Implemented Features

### ✅ Complete Authentication System
- NextAuth.js v4 integration with Google OAuth
- Custom login/register pages with form validation
- Session management with role-based access
- Protected routes with middleware

### ✅ Role-Based Dashboard System
- 7 admin roles with hierarchical permissions
- 3 user subroles with progression system
- Role-specific navigation and features
- Real-time permission checking

### ✅ Modern UI/UX
- Shadcn UI components throughout
- Responsive design for all devices
- Professional dashboard layouts
- Toast notifications and loading states

### ✅ Admin Management Panel
- User management interface
- Role assignment capabilities
- Bulk operations support
- Activity monitoring

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel:**
   - Import your GitHub repository to Vercel
   - Vercel will auto-detect Next.js configuration

2. **Environment Variables:**
   Set all environment variables in Vercel dashboard

3. **Deploy:**
   - Push to main branch or create deployment
   - Vercel will build and deploy automatically

## 📁 Project Structure

```
ridercritic/
├── app/                          # Next.js App Router pages
│   ├── api/auth/[...nextauth]/   # NextAuth API routes
│   ├── login/                    # Authentication pages
│   ├── register/
│   ├── dashboard/                # Protected dashboard routes
│   │   ├── super-admin/          # Super admin dashboard
│   │   ├── admin/                # Admin management panel
│   │   ├── sponsor/              # Sponsor management
│   │   ├── supplier/             # Supplier management
│   │   ├── partner/              # Partner management
│   │   ├── freelancer/           # Freelancer management
│   │   └── user/                 # User dashboards
│   │       ├── newstar/          # NewStar subrole dashboard
│   │       ├── criticstar/       # CriticStar subrole dashboard
│   │       └── criticmaster/     # CriticMaster subrole dashboard
│   └── ...other pages
├── components/                   # Reusable React components
│   ├── ui/                       # Shadcn UI components
│   ├── layouts/                  # Layout components
│   └── providers.tsx             # NextAuth provider
├── lib/                         # Utility functions and configs
│   ├── auth.ts                   # Role permissions and types
│   ├── firebase.ts               # Firebase configuration
│   └── nextauth.ts               # NextAuth configuration
├── middleware.ts                 # Route protection middleware
├── types/                        # TypeScript type definitions
└── ...config files
```

## 🆘 Troubleshooting

### Common Issues

1. **NextAuth Import Errors**:
   ```bash
   npm install next-auth@4.24.11 --legacy-peer-deps
   ```

2. **TypeScript Errors**:
   ```bash
   npm run build
   ```

3. **Environment Variables**:
   - Ensure all required variables are set in `.env.local`
   - Restart development server after adding variables

### Getting Help

- Check `FIX_NEXAUTH.md` for detailed dependency resolution
- Review Firebase and NextAuth documentation
- Check the browser console for runtime errors

---

**Built with ❤️ for the motorcycle community**

## 📝 Current Status

✅ **Complete Implementation**
- All authentication features implemented
- Role-based access control system
- Modern UI with Shadcn components
- Firebase integration ready

🔧 **Requires Dependency Fix**
- Run the NextAuth installation command above
- Set up Firebase and Google OAuth credentials
- Deploy to Vercel when ready

The system is production-ready once the dependency issue is resolved!