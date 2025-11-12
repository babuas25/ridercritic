/**
 * LogRocket Error Tracking & Session Replay
 * 
 * Free tier: 1,000 sessions/month
 * No credit card required
 * Vercel compatible
 * 
 * Setup: See ERROR_TRACKING_LOGROCKET.md
 * 
 * Note: LogRocket is initialized via LogRocketProvider component
 * This file provides helper functions for using LogRocket
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let logRocket: any = null;

// Get LogRocket instance (called after initialization)
function getLogRocketInstance() {
  if (typeof window === 'undefined') return null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!logRocket && (window as any).LogRocket) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logRocket = (window as any).LogRocket;
  }
  
  return logRocket;
}

/**
 * Identify user (optional but recommended)
 * Call this when user logs in
 */
export function identifyUser(
  userId: string,
  userInfo?: {
    name?: string;
    email?: string;
    role?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
) {
  if (typeof window === 'undefined') return;
  
  const lr = getLogRocketInstance();
  if (lr) {
    try {
      lr.identify(userId, userInfo);
    } catch (error) {
      console.error('Failed to identify user in LogRocket:', error);
    }
  }
}

/**
 * Track custom events
 */
export function trackEvent(
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  properties?: Record<string, any>
) {
  if (typeof window === 'undefined') return;
  
  const lr = getLogRocketInstance();
  if (lr) {
    try {
      lr.track(eventName, properties);
    } catch (error) {
      console.error('Failed to track event in LogRocket:', error);
    }
  }
}

/**
 * Get LogRocket instance (for advanced usage)
 */
export function getLogRocket() {
  return getLogRocketInstance();
}

/**
 * Check if LogRocket is initialized
 */
export function isLogRocketReady(): boolean {
  return getLogRocketInstance() !== null;
}

