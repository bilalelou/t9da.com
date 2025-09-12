"use client";

import React, { useState, useEffect } from 'react';

// Icons: Using lucide-react as it's already in the project
import { 
    LogOut, 
    Menu,
    X,
    Bell,
    UserCircle,
    ShieldCheck,
    ArrowLeft
} from 'lucide-react';

// --- بيانات التنقل مع أيقونات SVG ---
const navigationItems = [
    { id: 'dashboard', name: 'لوحة التحكم', href: '/admin/dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg> },
    { id: 'products', name: 'المنتجات', href: '/admin/products', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16.5 9.4a4.5 4.5 0 1 1-9 0"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg> },
    { id: 'orders', name: 'الطلبات', href: '/admin/orders', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.16"/></svg>, badge: 5 },
    { id: 'customers', name: 'العملاء', href: '/admin/customers', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'categories', name: 'التصنيفات', href: '/admin/categories', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg> },
    { id: 'inventory', name: 'المخزون', href: '/admin/inventory', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg> },
    { id: 'analytics', name: 'التحليلات', href: '/admin/analytics', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg> },
    { id: 'reports', name: 'التقارير', href: '/admin/reports', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg> },
    { id: 'settings', name: 'الإعدادات', href: '/admin/settings', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> }
];

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pathname, setPathname] = useState('');
    const [user, setUser] = useState({ name: 'Admin User', email: 'admin@example.com' });
    const [error, setError] = useState('');

    // الحصول على المسار الحالي للرابط النشط
    useEffect(() => {
        setPathname(window.location.pathname);
    }, []);

    // التحقق من وجود التوكن عند تحميل الصفحة
    useEffect(() => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('api_token');
        const apiBaseUrl = "http://localhost:8000/api";

        try {
            const response = await fetch(`${apiBaseUrl}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });
            // سواء نجح الطلب أو فشل بسبب انتهاء صلاحية التوكن، قم بتسجيل الخروج من الواجهة الأمامية
        } catch (err) {
            console.error('Logout error, proceeding to clear client-side token.', err);
        } finally {
            localStorage.removeItem('api_token');
            window.location.href = '/'; // توجيه للصفحة الرئيسية بعد الخروج
        }
    };

    const isActiveRoute = (href) => pathname === href;

    return (
        <div className="min-h-screen bg-gray-50 flex" dir="rtl">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                        <a href="/admin" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">T</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">T9ad.com</span>
                        </a>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Admin Badge */}
                    <div className="px-6 py-4 bg-blue-50 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">مدير النظام</p>
                                <p className="text-xs text-gray-600">لوحة التحكم الإدارية</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigationItems.map((item) => (
                            <a key={item.id} href={item.href} className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActiveRoute(item.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`} onClick={() => setSidebarOpen(false)}>
                                <div className="flex items-center gap-3">
                                    <div className={`${isActiveRoute(item.href) ? 'text-blue-600' : 'text-gray-400'}`}>
                                        {item.icon}
                                    </div>
                                    <span>{item.name}</span>
                                </div>
                                {item.badge && (
                                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">{item.badge}</span>
                                )}
                            </a>
                        ))}
                    </nav>

                    {/* Footer - تم استبدال الرابط بزر تسجيل الخروج */}
                    <div className="p-4 border-t border-gray-200">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 p-3 rounded-lg transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden">
                           <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex-1"></div> {/* Spacer */}
                        <div className="flex items-center gap-4">
                            <Bell className="w-6 h-6 text-gray-500" />
                            <div className="flex items-center gap-2">
                                <UserCircle className="w-8 h-8 text-gray-400" />
                                <div>
                                    <p className="text-sm font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

