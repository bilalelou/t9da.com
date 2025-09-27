'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // تسجيل الخطأ في Console للمطورين
    console.error('Global Error:', error);
  }, [error]);

  return (
    <html dir="rtl">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-red-500 text-6xl mb-6">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                عذراً، حدث خطأ!
              </h2>
              <p className="text-gray-600 mb-6">
                حدث خطأ تقني غير متوقع. نعمل على إصلاح المشكلة.
              </p>
              
              {process.env.NODE_ENV === 'development' && (
                <div className="bg-red-50 p-4 rounded-lg mb-6 text-left">
                  <p className="text-sm text-red-800 font-mono">
                    {error.message}
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  onClick={() => reset()}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  إعادة المحاولة
                </button>
                
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}