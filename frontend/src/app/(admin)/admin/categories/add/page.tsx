'use client';

import React, { useState } from 'react';
import { PlusCircle, LoaderCircle, Tag, FileText, UploadCloud, X, Image as ImageIcon } from 'lucide-react';

// --- API Helper ---
const api = {
    addCategory: async (formData: FormData, token: string) => {
        const response = await fetch('http://localhost:8000/api/categories', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw { message: data.message, errors: data.errors };
        return data;
    },
};

// --- Add Category Page Component ---
export default function AddCategoryPage() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});
        
        const token = localStorage.getItem('api_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('status', status);
        if (image) {
            formData.append('image', image);
        }

        try {
            await api.addCategory(formData, token);
            alert('تمت إضافة التصنيف بنجاح!');
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

    return (
        <div className="space-y-8" dir="rtl">
             <div>
                <h1 className="text-3xl font-bold text-gray-900">إضافة تصنيف جديد</h1>
                <p className="text-md text-gray-600 mt-1">املأ النموذج أدناه لإضافة تصنيف جديد لمتجرك.</p>
            </div>
             <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم التصنيف</label>
                        <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Tag className="h-5 w-5 text-gray-400" /></div><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50" required /></div>
                        {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف</label>
                        <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-2.5"><FileText className="h-5 w-5 text-gray-400" /></div><textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50"></textarea></div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">صورة التصنيف</label>
                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                            {imagePreview ? (
                                <div className="relative group mx-auto w-fit"><img src={imagePreview} alt="معاينة" className="h-32 rounded-lg" /><button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={16} /></button></div>
                            ) : (
                                <><UploadCloud size={48} className="mx-auto text-gray-400" /><p className="mt-2 text-sm text-gray-600">اسحب وأفلت الصورة هنا، أو انقر للاختيار</p><input type="file" onChange={handleImageChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" /></>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">الحالة</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value as any)} className="w-full border-gray-300 rounded-lg bg-gray-50">
                            <option value="active">نشط</option>
                            <option value="inactive">غير نشط</option>
                        </select>
                    </div>
                </div>
                 {error && <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mt-4 text-center">{error}</p>}
                <div className="mt-8 pt-5 border-t flex justify-end">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                        {loading ? <LoaderCircle className="animate-spin" /> : <PlusCircle />}
                        <span>{loading ? 'جاري الحفظ...' : 'إضافة التصنيف'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}
