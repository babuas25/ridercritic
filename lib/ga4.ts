// Google Analytics 4 helper
// Uses NEXT_PUBLIC_GA_MEASUREMENT_ID from environment

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
  }
}

// Small guard so we never access window on the server
function getGtag(): ((...args: unknown[]) => void) | null {
  if (typeof window === 'undefined') return null;
  return typeof window.gtag === 'function' ? window.gtag : null;
}

export function trackPageView(path: string) {
  const gtag = getGtag();
  const measurementId = process.env.NEXT_PUBLIC_MEASUREMENT_ID;
  if (!gtag || !measurementId) return;

  gtag('config', measurementId, {
    page_path: path,
  });
}

// Associate GA4 user_id with a logged-in user
export function setUserId(userId: string) {
  const gtag = getGtag();
  const measurementId = process.env.NEXT_PUBLIC_MEASUREMENT_ID;
  if (!gtag || !measurementId || !userId) return;

  gtag('config', measurementId, {
    user_id: userId,
  });
}

export type GAEventParams = {
  // required name, everything else optional + flexible
  category?: string;
  label?: string;
  value?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export function trackEvent(eventName: string, params: GAEventParams = {}) {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('event', eventName, params);
}
