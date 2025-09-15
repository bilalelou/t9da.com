'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Icons
import { LoaderCircle, CheckCircle, Package, MoreVertical, ChevronLeft, ChevronRight, Clock, Truck, XCircle } from 'lucide-react';

// --- Interfaces ---
interface Order {
    id: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    items_count: number;
}
interface PaginationInfo {
    current_page: number;
    last_page: number;
    total: number;
}

// --- [تصحيح] تم دمج أنظمة إدارة الحالة هنا لحل مشكلة الاستيراد ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const useToast = () => useContext(ToastContext);

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

const AppProviders = ({ children }) => (
    <ToastProvider>
        {children}
    </ToastProvider>
);


// --- API Helper ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getOrders: async (token: string, page: number = 1): Promise<{ orders: Order[], pagination: PaginationInfo }> => {
        const response = await fetch(`${API_BASE_URL}/user/dashboard?page=${page}`, { 
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } 
        });
        if (!response.ok) {
            if (response.status === 401) window.location.href = '/login';
            throw new Error('فشل في جلب الطلبات.');
        }
        const data = await response.json();
        return {
            orders: data.orders.data,
            pagination: data.orders.pagination
        };
    },
};

// --- Helper Functions ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
const getStatusInfo = (status: Order['status']) => {
    switch (status) {
        case 'pending': return { text: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14}/> };
        case 'processing': return { text: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800', icon: <LoaderCircle size={14} className="animate-spin"/> };
        case 'shipped': return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: <Truck size={14}/> };
        case 'delivered': return { text: 'مكتمل', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14}/> };
        case 'cancelled': return { text: 'ملغي', color: 'bg-red-100 text-red-800', icon: <XCircle size={14}/> };
        default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
};

// --- Main My Orders Page Component ---
function MyOrdersPage() {
    const [ordersData, setOrdersData] = useState<{ orders: Order[], pagination: PaginationInfo } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        if (!apiToken) {
            window.location.href = '/login';
            return;
        }
        setToken(apiToken);
    }, []);

    useEffect(() => {
        if (token) {
            setLoading(true);
            api.getOrders(token, currentPage)
                .then(setOrdersData)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [token, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= (ordersData?.pagination.last_page || 1)) {
            setCurrentPage(newPage);
        }
    };

    if (loading && !ordersData) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    if (error) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;
    if (!ordersData || ordersData.orders.length === 0) {
        return (
            <div className="text-center py-20">
                <Package size={64} className="mx-auto text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">لا توجد لديك طلبات بعد</h2>
                <a href="/shop" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">ابدأ التسوق الآن</a>
            </div>
        );
    }

    const { orders, pagination } = ordersData;

    return (
        <div className="space-y-6">
            {orders.map((order) => {
                const status = getStatusInfo(order.status);
                return (
                    <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 pb-4 border-b">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">طلب رقم #{order.id}</h3>
                                <p className="text-sm text-gray-600">تاريخ الطلب: {formatDate(order.created_at)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${status.color}`}>
                                {status.icon} {status.text}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center sm:text-right">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">عدد المنتجات</p>
                                <p className="text-lg font-semibold text-gray-900">{order.items_count} منتج</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">إجمالي المبلغ</p>
                                <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">عرض التفاصيل</button>
                        </div>
                    </div>
                );
            })}
             <div className="flex items-center justify-between mt-8">
                 <p className="text-sm text-gray-600">عرض {orders.length} من {pagination.total} طلب</p>
                 <div className="flex items-center gap-2">
                     <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight size={18}/></button>
                     <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeft size={18}/></button>
                 </div>
             </div>
        </div>
    );
}

// --- Entry Point ---
export default function MyOrdersPageLoader() {
    return (
        <AppProviders>
             <div className="bg-gray-50 min-h-screen">
                 <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">طلباتي</h1>
                        <p className="text-md text-gray-600 mt-1">تتبع وإدارة جميع طلباتك السابقة.</p>
                    </div>
                    <MyOrdersPage />
                </div>
            </div>
        </AppProviders>
    );
}

