'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { trackEvent } from '@/lib/ga4';

// Fires once per mount to record the resolved theme for this session/page
export function ThemeAnalytics() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!resolvedTheme) return;

    trackEvent('theme_resolved', {
      theme: resolvedTheme,
      location: 'app_root',
    });
  }, [resolvedTheme]);

  return null;
}
