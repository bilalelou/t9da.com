'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';

// Icons
import { LayoutDashboard, Package, MapPin, User, LogOut, LoaderCircle, CheckCircle, Star, Home, Briefcase, Plus, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Interfaces ---
interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatar: string;
}
interface Order {
    id: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    date: string;
    items_count: number;
}
interface Address {
    id: string;
    type: 'home' | 'work' | 'other';
    name: string;
    street: string;
    city: string;
    isDefault: boolean;
}
interface PaginationInfo {
    current_page: number;
    last_page: number;
    total: number;
}
interface DashboardData {
    user: UserProfile;
    stats: { total_orders: number; total_spent: number; loyalty_points: number; };
    orders: { data: Order[], pagination: PaginationInfo };
    addresses: Address[];
}


// --- Providers & API ---
const ToastContext = createContext<{ showToast: (message: string) => void }>({ showToast: () => {} });
const AppProviders = ({ children }) => (<ToastProvider>{children}</ToastProvider>);
const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false });
    const showToast = useCallback((message) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div dir="rtl" className={`fixed bottom-10 right-10 bg-gray-800 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101]`}>
                    <CheckCircle size={22} className='text-green-400'/>
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getDashboardData: async (token: string, page: number = 1): Promise<DashboardData> => {
        const response = await fetch(`${API_BASE_URL}/user/dashboard?page=${page}`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
        if (!response.ok) { if (response.status === 401) window.location.href = '/login'; throw new Error('فشل في جلب بيانات لوحة التحكم.'); }
        const data = await response.json();
        data.addresses = [
            { id: '1', type: 'home', name: 'المنزل', street: 'شارع الملك فهد، حي العليا', city: 'الرياض', isDefault: true },
            { id: '2', type: 'work', name: 'العمل', street: 'طريق الملك عبدالعزيز', city: 'الرياض', isDefault: false }
        ];
        return data;
    },
    logout: async (token: string) => {
        await fetch(`${API_BASE_URL}/logout`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
        localStorage.removeItem('api_token');
        window.location.href = '/login';
    }
};

// --- Helper Functions ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
const getStatusInfo = (status: Order['status']) => {
    switch (status) {
        case 'pending': return { text: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800' };
        case 'processing': return { text: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800' };
        case 'shipped': return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800' };
        case 'delivered': return { text: 'مكتمل', color: 'bg-green-100 text-green-800' };
        case 'cancelled': return { text: 'ملغي', color: 'bg-red-100 text-red-800' };
        default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
};

// --- Sub-components for each tab ---
const DashboardView = ({ stats, recentOrders, onTabChange }) => (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-lg p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p><p className="text-3xl font-bold text-gray-900">{stats.total_orders}</p></div><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Package size={24} className="text-blue-600"/></div></div></div>
            <div className="bg-white rounded-2xl shadow-lg p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">إجمالي المشتريات</p><p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.total_spent)}</p></div><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><User size={24} className="text-green-600"/></div></div></div>
            <div className="bg-white rounded-2xl shadow-lg p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">نقاط الولاء</p><p className="text-3xl font-bold text-gray-900">{stats.loyalty_points}</p></div><div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center"><Star size={24} className="text-yellow-600"/></div></div></div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">الطلبات الأخيرة</h2>
                <button onClick={() => onTabChange('orders')} className="text-blue-600 hover:text-blue-700 text-sm font-medium">عرض الكل</button>
            </div>
            <div className="space-y-4">
                {recentOrders.slice(0, 3).map((order) => {
                    const status = getStatusInfo(order.status);
                    return (
                        <div key={order.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div><p className="font-medium text-gray-900">طلب رقم #{order.id}</p><p className="text-sm text-gray-600">{formatDate(order.date)} • {order.items_count} منتجات</p></div>
                            <div className="flex items-center gap-4 mt-2 sm:mt-0"><span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.text}</span><p className="font-medium text-gray-900">{formatCurrency(order.total)}</p></div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);

const OrdersView = ({ orders, pagination, onPageChange }) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">كل طلباتي</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">الطلب</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">التاريخ</th><th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">الحالة</th><th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase">المبلغ</th><th className="px-4 py-3"></th></tr></thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => {
                        const status = getStatusInfo(order.status);
                        return (
                            <tr key={order.id}>
                                <td className="px-4 py-3 font-mono text-sm text-gray-700">#{order.id}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.date)}</td>
                                <td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.color}`}>{status.text}</span></td>
                                <td className="px-4 py-3 font-semibold">{formatCurrency(order.total)}</td>
                                <td className="px-4 py-3"><a href="#" className="text-blue-600 hover:underline"><MoreVertical size={18}/></a></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4">
             <button onClick={() => onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={18}/></button>
             <span className="text-sm text-gray-700">صفحة {pagination.current_page} من {pagination.last_page}</span>
             <button onClick={() => onPageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={18}/></button>
        </div>
    </div>
);
// ... (AddressesView and ProfileView remain the same)


// --- Main Dashboard Component ---
function UserDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const handlePageChange = (newPage) => {
        if (token && newPage > 0 && newPage <= data?.orders?.pagination?.last_page) {
            setLoading(true);
            api.getDashboardData(token, newPage)
                .then(setData)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    };
    
    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        if (!apiToken) { window.location.href = '/login'; return; }
        setToken(apiToken);
        api.getDashboardData(apiToken, 1)
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => { if (token) api.logout(token); };
    
    if (loading) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    if (error) return <div className="text-center text-red-600 p-4">{error}</div>;
    if (!data) return null;

    const navItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
        { id: 'orders', label: 'طلباتي', icon: Package },
        { id: 'addresses', label: 'العناوين', icon: MapPin },
        { id: 'profile', label: 'ملفي الشخصي', icon: User },
    ];

    const renderContent = () => {
        // [تصحيح] التأكد من وجود البيانات قبل عرض المكونات
        switch (activeTab) {
            case 'orders': 
                return <OrdersView orders={data?.orders?.data ?? []} pagination={data?.orders?.pagination ?? {}} onPageChange={handlePageChange} />;
            // case 'addresses': return <AddressesView addresses={data?.addresses ?? []} />;
            // case 'profile': return <ProfileView user={data?.user} />;
            case 'dashboard':
            default:
                return <DashboardView stats={data?.stats ?? {}} recentOrders={data?.orders?.data ?? []} onTabChange={setActiveTab} />;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen" dir="rtl">
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-2 border border-gray-100 mb-8">
                    <nav className="flex items-center justify-center md:justify-start -mb-px space-x-6 space-x-reverse">
                         {navItems.map(item => (
                            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 transition-all ${activeTab === item.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-gray-300'}`}>
                                <item.icon size={18} />
                                <span>{item.label}</span>
                            </button>
                        ))}
                         <button onClick={handleLogout} className="py-3 px-4 font-semibold text-sm flex items-center gap-2 border-b-2 border-transparent text-red-600 hover:border-red-500 transition-colors mr-auto">
                            <LogOut size={18} />
                            <span>تسجيل الخروج</span>
                        </button>
                    </nav>
                </div>
                <main>{renderContent()}</main>
            </div>
        </div>
    );
}

// --- Entry Point ---
export default function UserDashboardLoader() {
    return (
        <AppProviders>
            <UserDashboard />
        </AppProviders>
    );
}

