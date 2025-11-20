'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { setUserId, trackEvent } from '@/lib/ga4';

interface TrackedUser {
  id?: string | null;
  role?: string | null;
  subRole?: string | null;
}

// Syncs logged-in NextAuth user to GA4 user_id
export function GA4UserTracker() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session || !session.user) return;

    const user = session.user as TrackedUser;
    const userId = user.id ?? undefined;
    if (!userId) return;

    setUserId(userId);

    trackEvent('user_identified', {
      user_id: userId,
      role: user.role ?? undefined,
      sub_role: user.subRole ?? undefined,
    });
  }, [session]);

  return null;
}
