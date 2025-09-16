'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Icons
import { PlusCircle, LoaderCircle, Edit, Trash2, Search, ArrowDown, ArrowUp, Ticket } from 'lucide-react';

// --- [تصحيح] تم دمج أنظمة إدارة الحالة هنا لحل مشكلة الاستيراد ---

// 1. نظام التنبيهات (Toast)
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
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
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};

// --- AppProviders Wrapper ---
const AppProviders = ({ children }: { children: React.ReactNode }) => (
    <ToastProvider>
        {children}
    </ToastProvider>
);

// --- Interfaces & API ---
interface Coupon {
    id: number;
    code: string;
    type: 'fixed' | 'percent';
    value: number;
    usage_limit: number;
    times_used: number;
    expires_at: string;
    is_active: boolean;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
interface CouponFilters {
    code?: string;
    sort_by?: string;
    sort_direction?: string;
}

const api = {
    getCoupons: async (token: string, filters: CouponFilters = {}): Promise<Coupon[]> => {
        const params = new URLSearchParams(filters as Record<string, string>).toString();
        const response = await fetch(`${API_BASE_URL}/coupons?${params}`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('فشل في جلب الكوبونات.');
        const data = await response.json();
        return data.data || [];
    },
    deleteCoupon: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) {
             const data = await response.json();
             throw new Error(data.message || 'فشل في حذف الكوبون.');
        }
        return response.json();
    }
};

// --- Main Coupons Page Component ---
function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [filters, setFilters] = useState({ code: '', sort_by: 'created_at', sort_direction: 'desc' });
    const { showToast } = useToast();

    const fetchCoupons = useCallback(async (apiToken: string, currentFilters: CouponFilters) => {
        try {
            setLoading(true);
            const data = await api.getCoupons(apiToken, currentFilters);
            setCoupons(data);
        } catch (err) { 
            const error = err as Error;
            setError(error.message); 
        }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        if (!apiToken) { window.location.href = '/login'; return; }
        setToken(apiToken);
    }, []);
    
    // Re-fetch when token or filters change
    useEffect(() => {
        if(token) {
            const handler = setTimeout(() => {
                fetchCoupons(token, filters);
            }, 300); // Debounce search input
            return () => clearTimeout(handler);
        }
    }, [token, filters, fetchCoupons]);

    const handleDelete = async (id: number) => {
        if (token && window.confirm('هل أنت متأكد من حذف هذا الكوبون؟')) {
            try {
                const result = await api.deleteCoupon(id, token);
                showToast(result.message);
                fetchCoupons(token, filters);
            } catch (err) {
                const error = err as Error;
                showToast(error.message, 'error');
            }
        }
    };

    const handleSort = (key: string) => {
        setFilters(prev => {
            const direction = prev.sort_by === key && prev.sort_direction === 'asc' ? 'desc' : 'asc';
            return { ...prev, sort_by: key, sort_direction: direction };
        });
    };
    
    const SortableHeader = ({ title, sortKey }: { title: string, sortKey: string }) => {
        const isSorted = filters.sort_by === sortKey;
        const Icon = filters.sort_direction === 'asc' ? ArrowUp : ArrowDown;
        return (
            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                <button onClick={() => handleSort(sortKey)} className="flex items-center gap-2">
                    <span>{title}</span>
                    {isSorted ? <Icon size={14} className="text-gray-900"/> : <ArrowUp size={14} className="text-gray-300"/>}
                </button>
            </th>
        );
    };

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('ar-EG', options);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">إدارة الكوبونات</h1>
                <a href="/admin/coupons/add" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700"><PlusCircle size={18}/> إضافة كوبون</a>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-4">
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 w-full md:w-1/3">
                        <Search size={18} className="text-gray-400"/>
                        <input type="text" placeholder="ابحث بالكود..." value={filters.code} onChange={(e) => setFilters(prev => ({...prev, code: e.target.value}))} className="bg-transparent border-0 focus:ring-0 p-2 w-full"/>
                    </div>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <SortableHeader title="الكود" sortKey="code" />
                            <SortableHeader title="النوع" sortKey="type" />
                            <SortableHeader title="القيمة" sortKey="value" />
                            <SortableHeader title="حد الاستخدام" sortKey="usage_limit" />
                            <SortableHeader title="تاريخ الانتهاء" sortKey="expires_at" />
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">الحالة</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-10"><LoaderCircle className="animate-spin mx-auto text-blue-600" /></td></tr>
                        ) : error ? (
                             <tr><td colSpan={7} className="text-center py-10 text-red-500">{error}</td></tr>
                        ) : coupons.length > 0 ? (
                            coupons.map(coupon => (
                                <tr key={coupon.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4"><div className="font-semibold text-gray-800 flex items-center gap-2"><Ticket size={16} className="text-gray-400"/> {coupon.code}</div></td>
                                    <td className="px-6 py-4 text-gray-700">{coupon.type === 'fixed' ? 'مبلغ ثابت' : 'نسبة مئوية'}</td>
                                    <td className="px-6 py-4 text-gray-700 font-mono">{coupon.type === 'percent' ? `${coupon.value}%` : `${coupon.value} د.م.`}</td>
                                    <td className="px-6 py-4 text-gray-700 text-center">{coupon.times_used} / {coupon.usage_limit}</td>
                                    <td className="px-6 py-4 text-gray-700">{formatDate(coupon.expires_at)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {coupon.is_active ? 'نشط' : 'غير نشط'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-left"><div className="flex items-center justify-end gap-3"><a href={`/admin/coupons/edit/${coupon.id}`} className="text-gray-500 hover:text-green-600"><Edit size={18}/></a><button onClick={() => handleDelete(coupon.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={18}/></button></div></td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="text-center py-10 text-gray-500">لا توجد كوبونات لعرضها.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Entry Point ---
export default function CouponsPageLoader() {
    return (
        <AppProviders>
            <CouponsPage />
        </AppProviders>
    );
}
