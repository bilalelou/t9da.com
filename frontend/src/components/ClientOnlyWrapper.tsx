'use client';

import dynamic from 'next/dynamic';
import { ComponentType, ReactNode } from 'react';

interface ClientOnlyWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnlyWrapper = ({ children, fallback = null }: ClientOnlyWrapperProps) => {
  return <>{children}</>;
};

/**
 * Higher-order component that ensures a component only renders on the client
 * Use this for components that use localStorage, window, document, or other browser-only APIs
 */
export function withClientOnly<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  const ClientOnlyComponent = dynamic(
    () => Promise.resolve(Component),
    {
      ssr: false,
      loading: () => <>{fallback || null}</>,
    }
  );

  return ClientOnlyComponent;
}

/**
 * Wrapper component for client-only content
 */
export const ClientOnly = dynamic(() => Promise.resolve(ClientOnlyWrapper), {
  ssr: false,
});

export default ClientOnly;