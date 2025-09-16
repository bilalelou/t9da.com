'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';

// Icons
import { Save, LoaderCircle, ArrowRight, Ticket, Percent, Hash, Calendar } from 'lucide-react';

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
    expires_at: string;
    is_active: boolean;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getCoupon: async (id: string, token: string): Promise<Coupon> => {
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات الكوبون.');
        const data = await response.json();
        return data.data;
    },
    updateCoupon: async (id: string, formData: FormData, token: string) => {
        formData.append('_method', 'PUT');
        const response = await fetch(`${API_BASE_URL}/coupons/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            body: formData,
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'فشل في تحديث الكوبون.');
        }
        return response.json();
    }
};

// --- Main Edit Coupon Page Component ---
function EditCouponPage() {
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [code, setCode] = useState('');
    const [type, setType] = useState<'fixed' | 'percent'>('percent');
    const [value, setValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    const { showToast } = useToast();
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        if (!apiToken) { router.push('/login'); return; }
        setToken(apiToken);
    }, [router]);

    useEffect(() => {
        if (token && id) {
            setPageLoading(true);
            api.getCoupon(id, token)
                .then(data => {
                    setCoupon(data);
                    setCode(data.code);
                    setType(data.type);
                    setValue(String(data.value));
                    setUsageLimit(String(data.usage_limit));
                    setIsActive(data.is_active);
                    // Format date for input type="date" which requires YYYY-MM-DD
                    setExpiresAt(new Date(data.expires_at).toISOString().split('T')[0]);
                })
                .catch(() => {
                    showToast('لا يمكن العثور على الكوبون.', 'error');
                    router.push('/admin/coupons');
                })
                .finally(() => setPageLoading(false));
        }
    }, [token, id, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code || !value || !usageLimit || !expiresAt || !token) {
            showToast('الرجاء ملء جميع الحقول.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('code', code);
        formData.append('type', type);
        formData.append('value', value);
        formData.append('usage_limit', usageLimit);
        formData.append('expires_at', expiresAt);
        formData.append('is_active', isActive ? '1' : '0');

        setLoading(true);
        try {
            const result = await api.updateCoupon(id, formData, token);
            showToast(result.message || 'تم تحديث الكوبون بنجاح!');
            router.push('/admin/coupons');
        } catch (err) {
            const error = err as Error;
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="flex justify-center items-center h-64"><LoaderCircle className="animate-spin text-blue-600" size={32} /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <a href="/admin/coupons" className="text-gray-600 hover:text-blue-700">
                    <ArrowRight size={20} />
                </a>
                <h1 className="text-2xl font-bold text-gray-900">تعديل الكوبون: <span className="text-blue-600">{coupon?.code}</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Coupon Code */}
                    <div className="space-y-2">
                        <label htmlFor="code" className="text-sm font-semibold text-gray-700">كود الكوبون</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            <Ticket className="text-gray-400" size={18}/>
                            <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="مثال: RAMADAN25" className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>

                    {/* Coupon Type */}
                    <div className="space-y-2">
                        <label htmlFor="type" className="text-sm font-semibold text-gray-700">نوع الخصم</label>
                        <select id="type" value={type} onChange={(e) => setType(e.target.value as 'fixed' | 'percent')} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                            <option value="percent">نسبة مئوية (%)</option>
                            <option value="fixed">مبلغ ثابت (د.م.)</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Value */}
                    <div className="space-y-2">
                        <label htmlFor="value" className="text-sm font-semibold text-gray-700">قيمة الخصم</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            {type === 'percent' ? <Percent className="text-gray-400" size={18}/> : <span className="text-gray-500 font-semibold">د.م.</span>}
                            <input type="number" id="value" value={value} onChange={(e) => setValue(e.target.value)} placeholder={type === 'percent' ? 'مثال: 10' : 'مثال: 50'} className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>

                    {/* Usage Limit */}
                    <div className="space-y-2">
                        <label htmlFor="usage_limit" className="text-sm font-semibold text-gray-700">حد الاستخدام (لكل مستخدم)</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3">
                            <Hash className="text-gray-400" size={18}/>
                            <input type="number" id="usage_limit" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} placeholder="مثال: 1" className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                        </div>
                    </div>
                </div>

                {/* Expiration Date */}
                <div className="space-y-2">
                    <label htmlFor="expires_at" className="text-sm font-semibold text-gray-700">تاريخ انتهاء الصلاحية</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3">
                        <Calendar className="text-gray-400" size={18}/>
                        <input type="date" id="expires_at" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className="w-full p-2.5 bg-transparent border-0 focus:ring-0"/>
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label htmlFor="is_active" className="text-sm font-semibold text-gray-700">حالة الكوبون</label>
                    <select 
                        id="is_active" 
                        value={isActive ? '1' : '0'} 
                        onChange={(e) => setIsActive(e.target.value === '1')} 
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="1">نشط</option>
                        <option value="0">غير نشط</option>
                    </select>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed">
                        {loading ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18}/>}
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- Entry Point ---
export default function EditCouponPageLoader() {
    return (
        <AppProviders>
            <EditCouponPage />
        </AppProviders>
    );
}
