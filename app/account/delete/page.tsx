'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function DeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!user) {
      toast.error('You must be logged in to delete your account');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      
      // Delete user data from Firestore (if you have any)
      // await deleteUserData(user.uid);

      // Delete the user account
      await user.delete();
      
      toast.success('Your account has been successfully deleted');
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Delete Account</h1>
      
      <div className="bg-destructive/10 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Warning</h2>
        <p className="mb-4">
          Deleting your account will:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Permanently remove all your data</li>
          <li>Delete all your reviews and comments</li>
          <li>Remove your profile information</li>
          <li>Cancel any active subscriptions</li>
        </ul>
        <p className="text-sm text-muted-foreground mb-4">
          This action cannot be undone. Please be certain.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <Button
          variant="destructive"
          onClick={handleDeleteAccount}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting Account...' : 'Delete My Account'}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.back()}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
} 