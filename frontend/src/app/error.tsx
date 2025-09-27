'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" dir="rtl">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <div className="text-orange-500 text-5xl mb-4">🚧</div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            مشكلة مؤقتة في تحميل الصفحة
          </h2>
          <p className="text-gray-600 mb-6">
            نواجه صعوبة في تحميل هذه الصفحة. يرجى المحاولة مرة أخرى.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => reset()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700"
            >
              إعادة تحميل الصفحة
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600"
            >
              الذهاب للرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}