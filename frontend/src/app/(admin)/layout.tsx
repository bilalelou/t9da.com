'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Icons
import { 
    LogOut, Menu, X, Bell, ShieldCheck, Tag, Ticket, BellDot, CheckCircle,
    LayoutGrid, Package, ShoppingCart, Users, Folder, BarChart4, FileText, Settings
} from 'lucide-react';

// --- نظام التنبيهات (يمكن نقله إلى ملف contexts/Providers.tsx) ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);
const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' });
    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div dir="rtl" className={`fixed bottom-10 right-10 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101] ${toast.type === 'success' ? 'bg-gray-800' : 'bg-red-600'}`}>
                    <CheckCircle size={22} className={toast.type === 'success' ? 'text-green-400' : 'text-white'}/>
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};
const AdminProviders = ({ children }) => (<ToastProvider>{children}</ToastProvider>);


// --- بيانات التنقل مع الأيقونات المحدثة ---
const navigationItems = [
    { id: 'dashboard', name: 'لوحة التحكم', href: '/admin/dashboard', icon: <LayoutGrid size={20}/> },
    { id: 'products', name: 'المنتجات', href: '/admin/products', icon: <Package size={20}/> },
    { id: 'orders', name: 'الطلبات', href: '/admin/orders', icon: <ShoppingCart size={20}/>, badge: 5 },
    { id: 'customers', name: 'العملاء', href: '/admin/customers', icon: <Users size={20}/> },
    { id: 'categories', name: 'التصنيفات', href: '/admin/categories', icon: <Folder size={20}/> },
    { id: 'brands', name: 'الماركات', href: '/admin/brands', icon: <Tag size={20}/> },
    { id: 'coupons', name: 'الكوبونات', href: '/admin/coupons', icon: <Ticket size={20}/> },
    { id: 'analytics', name: 'التحليلات', href: '/admin/analytics', icon: <BarChart4 size={20}/> },
    { id: 'notifications', name: 'الإشعارات', href: '/admin/notifications', icon: <BellDot size={20}/> },
    { id: 'settings', name: 'الإعدادات', href: '/admin/settings', icon: <Settings size={20}/> }
];

export default function AdminLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [pathname, setPathname] = useState('');

    useEffect(() => {
        setPathname(window.location.pathname);
        const token = localStorage.getItem('api_token');
        if (!token) window.location.href = '/login';
    }, []);

    const handleLogout = async () => {
        const token = localStorage.getItem('api_token');
        const apiBaseUrl = "http://localhost:8000/api";
        try {
            await fetch(`${apiBaseUrl}/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' }
            });
        } catch (err) {
            console.error('Logout error, proceeding to clear client-side token.', err);
        } finally {
            localStorage.removeItem('api_token');
            window.location.href = '/';
        }
    };

    const isActiveRoute = (href) => pathname === href;

    return (
        <AdminProviders>
            <div className="min-h-screen bg-gray-50 flex" dir="rtl">
                {sidebarOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
                
                <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full">
                        <div className="flex items-center justify-between h-16 px-6 border-b">
                            <a href="/admin" className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"><span className="text-white font-bold text-lg">T</span></div><span className="text-xl font-bold text-gray-900">T9ad.com</span></a>
                            <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 rounded-md"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="px-6 py-4 bg-blue-50 border-b"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm font-medium text-gray-900">مدير النظام</p><p className="text-xs text-gray-600">لوحة التحكم</p></div></div></div>
                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {navigationItems.map((item) => (
                                <a key={item.id} href={item.href} className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActiveRoute(item.href) ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`} onClick={() => setSidebarOpen(false)}>
                                    <div className="flex items-center gap-3"><div className={isActiveRoute(item.href) ? 'text-blue-600' : 'text-gray-400'}>{item.icon}</div><span>{item.name}</span></div>
                                    {item.badge && (<span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">{item.badge}</span>)}
                                </a>
                            ))}
                        </nav>
                        <div className="p-4 border-t"><button onClick={handleLogout} className="w-full flex items-center gap-3 text-sm text-red-600 hover:bg-red-50 p-3 rounded-lg transition-colors"><LogOut className="w-5 h-5" /><span>تسجيل الخروج</span></button></div>
                    </div>
                </aside>
                
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="bg-white shadow-sm border-b">
                        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                            <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md lg:hidden"><Menu className="w-6 h-6" /></button>
                            <div className="flex-1"></div>
                            <div className="flex items-center gap-4"><Bell className="w-6 h-6 text-gray-500" /></div>
                        </div>
                    </header>
                    <main className="flex-1 overflow-auto p-6">{children}</main>
                </div>
            </div>
        </AdminProviders>
    );
}

