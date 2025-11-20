'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackPageView, trackEvent } from '@/lib/ga4';

// Tracks page views on route changes and basic engagement (time on page)
export function GA4Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const search = typeof window !== 'undefined' ? window.location.search : '';
    const path = search ? `${pathname}${search}` : pathname;

    trackPageView(path);

    // Basic engagement: time spent on this page
    const start = performance.now();

    const handleBeforeUnload = () => {
      const durationMs = performance.now() - start;
      trackEvent('page_engagement', {
        page_path: path,
        engagement_time_msec: Math.round(durationMs),
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  // Scroll depth tracking (25, 50, 75, 90%)
  useEffect(() => {
    const thresholds = [25, 50, 75, 90];
    const fired = new Set<number>();

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = (scrollTop / docHeight) * 100;

      thresholds.forEach((t) => {
        if (!fired.has(t) && percent >= t) {
          fired.add(t);
          trackEvent('scroll_depth', {
            percent: t,
            page_path: window.location.pathname,
          });
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
