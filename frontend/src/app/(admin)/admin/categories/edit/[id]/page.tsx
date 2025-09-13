'use client';

import React, { useState, useEffect } from 'react';
import { Save, LoaderCircle, Tag, FileText, UploadCloud, X } from 'lucide-react';

// --- Interfaces & API Helper (can be in a shared file) ---
interface Category {
    name: string;
    description: string;
    status: 'active' | 'inactive';
    image: string; // URL of existing image
}
const api = {
    getCategory: async (id: string, token: string) => {
        const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات التصنيف.');
        const data = await response.json();
        return data.data;
    },
    updateCategory: async (id: string, formData: FormData, token: string) => {
        formData.append('_method', 'PUT');
        const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw { message: data.message, errors: data.errors };
        return data;
    },
};

// --- Edit Category Page Component ---
export default function EditCategoryPage() {
    const [category, setCategory] = useState<Partial<Category>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [newImage, setNewImage] = useState<File | null>(null);
    
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    
    useEffect(() => {
        const token = localStorage.getItem('api_token');
        const categoryId = window.location.pathname.split('/').pop();
        if (!token || !categoryId) {
            window.location.href = '/login';
            return;
        }

        api.getCategory(categoryId, token)
            .then(data => {
                setCategory(data);
                if (data.image) setImagePreview(data.image);
            })
            .catch(() => setError('فشل في تحميل بيانات التصنيف.'))
            .finally(() => setPageLoading(false));
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setCategory(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});
        
        const token = localStorage.getItem('api_token');
        const categoryId = window.location.pathname.split('/').pop();
        if (!token || !categoryId) return;

        const formData = new FormData();
        formData.append('name', category.name || '');
        formData.append('description', category.description || '');
        formData.append('status', category.status || 'active');
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            await api.updateCategory(categoryId, formData, token);
            window.location.href = '/admin/categories';
        } catch (err: any) {
             if (err.errors) {
                setValidationErrors(err.errors);
                setError('الرجاء مراجعة الأخطاء في النموذج.');
            } else {
                setError(err.message || 'فشل في حفظ التصنيف.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin" /></div>;
    if (error && !Object.keys(validationErrors).length) return <div className="text-center text-red-600 p-4">{error}</div>;

    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">تعديل التصنيف: {category.name}</h1>
                <p className="text-md text-gray-600 mt-1">قم بتحديث تفاصيل التصنيف أدناه.</p>
            </div>
             <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="space-y-6">
                     <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف</label>
                        <input type="text" id="name" value={category.name || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" required />
                        {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <textarea id="description" value={category.description || ''} onChange={handleInputChange} rows={3} className="w-full border-gray-300 rounded-lg bg-gray-50"></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">صورة التصنيف</label>
                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                            {imagePreview ? (
                                <div className="relative group mx-auto w-fit"><img src={imagePreview} alt="معاينة" className="h-32 rounded-lg" /><button type="button" onClick={() => { setNewImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={16} /></button></div>
                            ) : (
                                <><UploadCloud size={48} className="mx-auto text-gray-400" /><p className="mt-2 text-sm text-gray-600">اختر صورة جديدة</p><input type="file" onChange={handleImageChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" /></>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                        <select id="status" value={category.status || 'active'} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50">
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                    </div>
                </div>
                {error && <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mt-4 text-center">{error}</p>}
                <div className="mt-8 pt-5 border-t flex justify-end">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {loading ? <LoaderCircle className="animate-spin" /> : <Save />}
                        <span>{loading ? 'جاري التحديث...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
