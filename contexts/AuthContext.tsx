'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '@/lib/firebase';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function getErrorMessage(error: AuthError): string {
  console.error('Auth error code:', error.code);
  console.error('Auth error message:', error.message);
  
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/operation-not-allowed':
      return 'Operation not allowed.';
    case 'auth/weak-password':
      return 'Password is too weak.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completion.';
    case 'auth/cancelled-popup-request':
      return 'Another popup is already open.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    default:
      return `Authentication error: ${error.message}`;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      console.log('Attempting email sign-in...');
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Email sign-in successful');
    } catch (error) {
      console.error('Email sign-in error:', error);
      const authError = error as AuthError;
      throw new Error(getErrorMessage(authError));
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      console.log('Attempting email sign-up...');
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Email sign-up successful');
    } catch (error) {
      console.error('Email sign-up error:', error);
      const authError = error as AuthError;
      throw new Error(getErrorMessage(authError));
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Attempting Google sign-in...');
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign-in successful:', result.user.email);
    } catch (error) {
      console.error('Google sign-in error:', error);
      const authError = error as AuthError;
      throw new Error(getErrorMessage(authError));
    }
  };

  const signInWithFacebook = async () => {
    try {
      console.log('Attempting Facebook sign-in...');
      const result = await signInWithPopup(auth, facebookProvider);
      console.log('Facebook sign-in successful:', result.user.email);
    } catch (error) {
      console.error('Facebook sign-in error:', error);
      const authError = error as AuthError;
      throw new Error(getErrorMessage(authError));
    }
  };

  const logout = async () => {
    try {
      console.log('Attempting logout...');
      await signOut(auth);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw new Error('Failed to logout. Please try again.');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log('Attempting password reset...');
      await sendPasswordResetEmail(auth, email);
      console.log('Password reset email sent');
    } catch (error) {
      console.error('Password reset error:', error);
      const authError = error as AuthError;
      throw new Error(getErrorMessage(authError));
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithFacebook,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 