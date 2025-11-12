'use client';

import { useEffect } from 'react';

/**
 * LogRocket Provider Component
 * Initializes LogRocket on the client side
 */
export function LogRocketProvider() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const appId = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID;

    if (!appId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('LogRocket: NEXT_PUBLIC_LOGROCKET_APP_ID is not set');
      }
      return;
    }

    // Dynamically import and initialize LogRocket
    import('logrocket')
      .then((LogRocket) => {
        try {
          LogRocket.default.init(appId);
          
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ LogRocket initialized successfully');
            console.log('App ID:', appId);
          }
        } catch (error) {
          console.error('❌ Failed to initialize LogRocket:', error);
        }
      })
      .catch((error) => {
        console.error('❌ Failed to load LogRocket package:', error);
      });
  }, []);

  // This component doesn't render anything
  return null;
}

