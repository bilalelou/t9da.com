'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// Icons
import { Tag, PlusCircle, LoaderCircle, ArrowRight, UploadCloud, X } from 'lucide-react';

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

// --- API ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    addBrand: async (formData: FormData, token: string) => {
        const response = await fetch(`${API_BASE_URL}/brands`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            body: formData,
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'فشل في إضافة الماركة.');
        }
        return response.json();
    }
};

// --- Main Add Brand Page Component ---
function AddBrandPage() {
    const [name, setName] = useState('');
    const [logo, setLogo] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const { showToast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        if (!apiToken) { router.push('/login'); return; }
        setToken(apiToken);
    }, [router]);

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
        if (!name || !logo || !token) {
            showToast('الرجاء ملء جميع الحقول.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('logo', logo);

        setLoading(true);
        try {
            const result = await api.addBrand(formData, token);
            showToast(result.message || 'تمت إضافة الماركة بنجاح!');
            router.push('/admin/brands');
        } catch (err) {
            const error = err as Error;
            showToast(error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                 <a href="/admin/brands" className="text-gray-600 hover:text-blue-700">
                    <ArrowRight size={20} />
                </a>
                <h1 className="text-2xl font-bold text-gray-900">إضافة ماركة جديدة</h1>
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
                    <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
                        {loading ? <LoaderCircle className="animate-spin" size={18}/> : <PlusCircle size={18}/>}
                        <span>{loading ? 'جاري الإضافة...' : 'إضافة الماركة'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

// --- Entry Point ---
export default function AddBrandPageLoader() {
    return (
        <AppProviders>
            <AddBrandPage />
        </AppProviders>
    );
}
