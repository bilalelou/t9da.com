'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Icons
import { Tag, PlusCircle, LoaderCircle, Edit, Trash2, X, Search, Image as ImageIcon, CheckCircle, ArrowDown, ArrowUp } from 'lucide-react';

// --- [تصحيح] تم دمج أنظمة إدارة الحالة هنا لحل مشكلة الاستيراد ---

// 1. نظام التنبيهات (Toast)
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

// --- AppProviders Wrapper ---
const AppProviders = ({ children }) => (
    <ToastProvider>
        {children}
    </ToastProvider>
);


// --- Interfaces & API ---
interface Brand {
    id: number;
    name: string;
    logo: string;
    products_count: number;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getBrands: async (token: string, filters: { name?: string, sort_by?: string, sort_direction?: string } = {}): Promise<Brand[]> => {
        const params = new URLSearchParams(filters as any).toString();
        const response = await fetch(`${API_BASE_URL}/brands?${params}`, { headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('فشل في جلب الماركات.');
        const data = await response.json();
        return data.data || [];
    },
    deleteBrand: async (id: number, token: string) => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) {
             const data = await response.json();
             throw new Error(data.message || 'فشل في حذف الماركة.');
        }
        return response.json();
    }
};

// --- Main Brands Page Component ---
function BrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [filters, setFilters] = useState({ name: '', sort_by: 'name', sort_direction: 'asc' });
    const { showToast } = useToast();

    const fetchBrands = useCallback(async (apiToken: string, currentFilters) => {
        try {
            setLoading(true);
            const data = await api.getBrands(apiToken, currentFilters);
            setBrands(data);
        } catch (err: any) { setError(err.message); }
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
                fetchBrands(token, filters);
            }, 300); // Debounce search input
            return () => clearTimeout(handler);
        }
    }, [token, filters, fetchBrands]);

    const handleDelete = async (id: number) => {
        if (token && window.confirm('هل أنت متأكد من حذف هذه الماركة؟')) {
            try {
                const result = await api.deleteBrand(id, token);
                showToast(result.message);
                fetchBrands(token, filters);
            } catch (err: any) {
                showToast(err.message, 'error');
            }
        }
    };

    const handleSort = (key: string) => {
        setFilters(prev => {
            const direction = prev.sort_by === key && prev.sort_direction === 'asc' ? 'desc' : 'asc';
            return { ...prev, sort_by: key, sort_direction: direction };
        });
    };
    
    const SortableHeader = ({ title, sortKey }) => {
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">إدارة الماركات</h1>
                <a href="/admin/brands/add" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700"><PlusCircle size={18}/> إضافة ماركة</a>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                             <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase w-1/2">
                                <div className="flex items-center gap-2">
                                    <Search size={16}/>
                                    <input type="text" placeholder="ابحث بالاسم..." value={filters.name} onChange={(e) => setFilters(prev => ({...prev, name: e.target.value}))} className="bg-transparent border-0 focus:ring-0 p-0"/>
                                </div>
                            </th>
                            <SortableHeader title="الماركة" sortKey="name" />
                            <SortableHeader title="عدد المنتجات" sortKey="products_count" />
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-10"><LoaderCircle className="animate-spin mx-auto text-blue-600" /></td></tr>
                        ) : (
                            brands.map(brand => (
                                <tr key={brand.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4" colSpan={2}><div className="flex items-center gap-4"><img src={brand.logo} alt={brand.name} className="w-12 h-12 object-contain"/><span className="font-semibold text-gray-800">{brand.name}</span></div></td>
                                    <td className="px-6 py-4 text-center text-gray-700">{brand.products_count}</td>
                                    <td className="px-6 py-4 text-left"><div className="flex items-center justify-end gap-3"><a href={`/admin/brands/edit/${brand.id}`} className="text-gray-500 hover:text-green-600"><Edit size={18}/></a><button onClick={() => handleDelete(brand.id)} className="text-gray-500 hover:text-red-600"><Trash2 size={18}/></button></div></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// --- Entry Point ---
export default function BrandsPageLoader() {
    return (
        <AppProviders>
            <BrandsPage />
        </AppProviders>
    );
}

