'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log hydration errors but don't crash the app
    if (error.message?.includes('hydration') || error.message?.includes('Hydration')) {
      console.warn('Hydration error caught:', error.message);
      return;
    }
    
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a hydration error
      if (this.state.error?.message?.includes('hydration') || 
          this.state.error?.message?.includes('Hydration')) {
        // For hydration errors, just render children normally
        return this.props.children;
      }

      // For other errors, show fallback
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2 className="text-lg font-semibold mb-2">حدث خطأ غير متوقع</h2>
          <p className="text-gray-600">نعتذر عن الإزعاج. يرجى تحديث الصفحة.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}