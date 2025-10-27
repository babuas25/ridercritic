'use client'

import { useState, useEffect, Suspense } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUserDocument, updateLastLogin } from '@/lib/firebase'
import { DEFAULT_ROLE, DEFAULT_SUB_ROLE } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  gender: z.enum(['Male', 'Female'], { message: 'Please select your gender' }),
  dob: z.string().min(1, 'Date of birth is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type LoginFormData = z.infer<typeof loginSchema>
type RegisterFormData = z.infer<typeof registerSchema>

function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState('login')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check for OAuth error in URL and tab parameter
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'OAuthCallback') {
      setError('OAuth authentication failed. Please try again or use email sign in.')
    }

    // Set active tab based on query parameter
    const tab = searchParams.get('tab')
    if (tab === 'login' || tab === 'register') {
      setActiveTab(tab)
    }
  }, [searchParams])

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: undefined,
      dob: '',
    },
  })

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password)
      
      // Update last login timestamp
      await updateLastLogin(userCredential.user.uid)
      
      // Sign in with NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        const session = await getSession()
        if (session) {
          router.push('/dashboard/user')
        }
      }
    } catch (error: any) {
      setError(error.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const user = userCredential.user

      // Create user document in Firestore
      const userData = {
        uid: user.uid,
        email: data.email,
        displayName: data.name,
        gender: data.gender,
        dob: data.dob,
        role: DEFAULT_ROLE,
        subRole: DEFAULT_SUB_ROLE,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      await createUserDocument(user.uid, userData)

      setSuccess('Account created successfully! Redirecting to login...')
      
      // Auto-sign in after registration
      setTimeout(() => {
        signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        }).then(() => {
          router.push('/dashboard/user')
        })
      }, 1500)

    } catch (error: any) {
      setError(error.message || 'Failed to create account')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn('google', { callbackUrl: '/dashboard/user' })
    } catch {
      setError('Failed to sign in with Google')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome to RiderCritic</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 mt-4">
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full"
                  variant="outline"
                >
                  Continue with Google
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      {...loginForm.register('email')}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      {...loginForm.register('password')}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 mt-4">
                {success && (
                  <div className="text-green-600 text-sm text-center">{success}</div>
                )}
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      {...registerForm.register('name')}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      onValueChange={(value) => registerForm.setValue('gender', value as 'Male' | 'Female')}
                      value={registerForm.watch('gender')}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    {registerForm.formState.errors.gender && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.gender.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      {...registerForm.register('dob')}
                    />
                    {registerForm.formState.errors.dob && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.dob.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...registerForm.register('password')}
                    />
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      {...registerForm.register('confirmPassword')}
                    />
                    {registerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}

