'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';

// Icons
import { Tag, Save, LoaderCircle, ArrowRight, UploadCloud, X } from 'lucide-react';

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
interface Brand {
    id: number;
    name: string;
    logo: string;
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getBrand: async (id: string, token: string): Promise<Brand> => {
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات الماركة.');
        const data = await response.json();
        return data.data;
    },
    updateBrand: async (id: string, formData: FormData, token: string) => {
        // Note: Laravel needs this to handle POST for updates
        formData.append('_method', 'PUT'); 
        const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            body: formData,
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'فشل في تحديث الماركة.');
        }
        return response.json();
    }
};

// --- Main Edit Brand Page Component ---
function EditBrandPage() {
    const [brand, setBrand] = useState<Brand | null>(null);
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
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
            api.getBrand(id, token)
                .then(data => {
                    setBrand(data);
                    setName(data.name);
                    setPreview(data.logo);
                })
                .catch(err => {
                    showToast('لا يمكن العثور على الماركة.', 'error');
                    router.push('/admin/brands');
                })
                .finally(() => setPageLoading(false));
        }
    }, [token, id, router, showToast]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !token) {
            showToast('اسم الماركة مطلوب.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        if (logo) {
            formData.append('logo', logo);
        }

        setLoading(true);
        try {
            const result = await api.updateBrand(id, formData, token);
            showToast(result.message || 'تم تحديث الماركة بنجاح!');
            router.push('/admin/brands');
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
                 <a href="/admin/brands" className="text-gray-600 hover:text-blue-700">
                    <ArrowRight size={20} />
                </a>
                <h1 className="text-2xl font-bold text-gray-900">تعديل الماركة: <span className="text-blue-600">{brand?.name}</span></h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 space-y-6">
                {/* Brand Name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-700">اسم الماركة</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3">
                        <Tag className="text-gray-400" size={18}/>
                        <input 
                            type="text" 
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: Apple" 
                            className="w-full p-2.5 bg-transparent border-0 focus:ring-0"
                        />
                    </div>
                </div>

                {/* Logo Upload */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">شعار الماركة</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                        <input type="file" id="logo" onChange={handleFileChange} className="hidden" accept="image/*" />
                        {preview ? (
                            <div className="relative group">
                                <Image src={preview} alt="معاينة الشعار" width={96} height={96} className="mx-auto h-24 w-auto object-contain rounded-md" />
                                <button type="button" onClick={() => { setPreview(null); setLogo(null); }} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100">
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <label htmlFor="logo" className="cursor-pointer flex flex-col items-center gap-2 text-gray-500">
                                <UploadCloud size={40} />
                                <span className="font-semibold">انقر للرفع</span>
                                <span className="text-xs">PNG, JPG, WEBP (بحد أقصى 800x400px)</span>
                            </label>
                        )}
                    </div>
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
export default function EditBrandPageLoader() {
    return (
        <AppProviders>
            <EditBrandPage />
        </AppProviders>
    );
}
