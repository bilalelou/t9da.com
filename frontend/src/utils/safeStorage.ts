import React from 'react';

/**
 * Safe localStorage utilities that handle SSR
 */

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },
};

/**
 * Custom hook for safe client-side only operations
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Safe window utilities
 */
export const safeWindow = {
  location: {
    href: typeof window !== 'undefined' ? window.location.href : '',
    pathname: typeof window !== 'undefined' ? window.location.pathname : '',
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    reload: () => {
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    },
  },
  
  scrollTo: (x: number, y: number) => {
    if (typeof window !== 'undefined') {
      window.scrollTo(x, y);
    }
  },
};