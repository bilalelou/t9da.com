'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// يمكن استبدال هذا بمكون تحميل أكثر تعقيدًا (Spinner)
const LoadingScreen = () => (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
        <div className="text-lg font-semibold text-gray-700">جاري التحقق من الدخول...</div>
    </div>
);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthChecked, setIsAuthChecked] = useState(false);

    useEffect(() => {
        // هذا التأثير يعمل فقط على العميل
        const token = localStorage.getItem('api_token');
        
        if (!token) {
            // إذا لم يكن هناك token، قم بإعادة التوجيه باستخدام Next.js router
            router.replace('/login');
        } else {
            // إذا كان هناك token، اضبط الحالة للسماح بعرض المحتوى
            setIsAuthChecked(true);
        }
    }, [pathname, router]);

    // أثناء التحقق من المصادقة، أو إذا لم تتم المصادقة بعد، أظهر شاشة تحميل
    if (!isAuthChecked) {
        return <LoadingScreen />;
    }

    // إذا تمت المصادقة بنجاح، اعرض المحتوى المحمي
    return <>{children}</>;
}
