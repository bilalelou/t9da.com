'use client';

import React, { useState, useEffect } from 'react';

// Icons
import { Package, DollarSign, Save, LoaderCircle, UploadCloud, X, FileText, Images } from 'lucide-react';

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
}

interface Product {
    name: string;
    short_description: string;
    description: string;
    regular_price: string;
    sale_price: string;
    quantity: string;
    category_id: string;
    image: string; // URL of the main image
    images: string[]; // Array of URLs for gallery images
}


// --- API Helper ---
const api = {
    getProduct: async (id: string, token: string): Promise<Product> => {
        const response = await fetch(`http://localhost:8000/api/products/${id}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات المنتج.');
        const data = await response.json();
        return data.data;
    },
    getCategories: async (token: string) => {
        const response = await fetch('http://localhost:8000/api/categories', {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب التصنيفات.');
        const data = await response.json();
        return data.data || [];
    },
    updateProduct: async (id: string, formData: FormData, token: string) => {
        formData.append('_method', 'PUT'); 
        
        const response = await fetch(`http://localhost:8000/api/products/${id}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) throw { message: data.message, errors: data.errors };
        return data;
    }
};

// --- Main Edit Product Page Component ---
export default function EditProductPage() {
    const [product, setProduct] = useState<Partial<Product>>({});
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [newImage, setNewImage] = useState<File | null>(null);
    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const token = localStorage.getItem('api_token');
        const productId = window.location.pathname.split('/').pop();

        if (!token || !productId) {
            window.location.href = '/login';
            return;
        }

        Promise.all([
            api.getProduct(productId, token),
            api.getCategories(token)
        ]).then(([productData, categoryData]) => {
            setProduct(productData);
            setCategories(categoryData);
            if (productData.image) setImagePreview(productData.image);
            if (Array.isArray(productData.images)) setGalleryPreviews(productData.images);
        }).catch((err) => {
            if (err instanceof TypeError && err.message.includes('fetch')) {
                setError('فشل الاتصال بالخادم. هل تأكدت من تشغيل الخادم المحلي (php artisan serve)؟');
            } else {
                setError('فشل في تحميل بيانات الصفحة.');
            }
        }).finally(() => {
            setPageLoading(false);
        });
    }, []);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setProduct(prev => ({ ...prev, [id]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setNewGalleryImages(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };
    
    const removeGalleryImage = (index: number) => {
        const removedPreview = galleryPreviews[index];
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));

        const newPreviewIndex = newGalleryImages.findIndex(file => URL.createObjectURL(file) === removedPreview);
        if (newPreviewIndex > -1) {
            setNewGalleryImages(prev => prev.filter((_, i) => i !== newPreviewIndex));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});
        
        const token = localStorage.getItem('api_token');
        const productId = window.location.pathname.split('/').pop();

        if (!token || !productId) {
            setError('جلسة المستخدم غير صالحة أو المنتج غير محدد.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        
        // [تصحيح] إضافة الحقول النصية فقط وبشكل صريح
        formData.append('name', product.name || '');
        formData.append('short_description', product.short_description || '');
        formData.append('description', product.description || '');
        formData.append('regular_price', product.regular_price || '0');
        formData.append('sale_price', product.sale_price || '');
        formData.append('quantity', product.quantity || '0');
        formData.append('category_id', product.category_id || '');

        // إضافة الصورة الرئيسية الجديدة فقط إن وجدت
        if (newImage) {
            formData.append('image', newImage);
        }
        
        // إضافة صور المعرض الجديدة
        newGalleryImages.forEach(file => formData.append('new_images[]', file));
        
        // إرسال قائمة الصور القديمة المتبقية
        const existingImages = galleryPreviews.filter(p => p.startsWith('http'));
        formData.append('existing_images', JSON.stringify(existingImages));


        try {
            await api.updateProduct(productId, formData, token);
            window.location.href = '/admin/products';
        } catch (err: any) {
            if (err.errors) {
                setValidationErrors(err.errors);
                setError('الرجاء مراجعة الأخطاء في النموذج وتصحيحها.');
            } else {
                setError(err.message || 'حدث خطأ غير متوقع.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (error && !Object.keys(validationErrors).length) {
        return <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg"><strong>خطأ:</strong> {error}</div>;
    }


    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">تعديل المنتج: {product.name}</h1>
                <p className="text-md text-gray-600 mt-1">قم بتحديث تفاصيل المنتج أدناه.</p>
            </div>

            <form onSubmit={handleSubmit}>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                            <input type="text" id="name" value={product.name || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />
                            {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                        </div>
                        <div>
                             <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">الوصف المختصر</label>
                             <textarea id="short_description" value={product.short_description || ''} onChange={handleInputChange} rows={3} className="w-full border-gray-300 rounded-lg bg-gray-50"></textarea>
                             {validationErrors.short_description && <p className="text-red-500 text-xs mt-1">{validationErrors.short_description[0]}</p>}
                        </div>
                         <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف الكامل</label>
                            <textarea id="description" value={product.description || ''} onChange={handleInputChange} rows={6} className="w-full border-gray-300 rounded-lg bg-gray-50"></textarea>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">صورة المنتج الرئيسية</h3>
                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                                {imagePreview ? (
                                    <div className="relative group mx-auto w-fit"><img src={imagePreview} alt="معاينة" className="h-32 rounded-lg" /><button type="button" onClick={() => { setNewImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={16} /></button></div>
                                ) : (
                                    <><UploadCloud size={48} className="mx-auto text-gray-400" /><p className="mt-2 text-sm text-gray-600">اختر صورة جديدة</p><input type="file" onChange={handleImageChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" /></>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">معرض الصور</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                                <Images size={48} className="mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">أضف صوراً جديدة للمعرض</p>
                                <input type="file" multiple onChange={handleGalleryChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                            </div>
                            {galleryPreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img src={preview} className="w-full h-24 object-cover rounded-lg" />
                                            <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6 self-start sticky top-24">
                        <div>
                            <label htmlFor="regular_price" className="block text-sm font-medium text-gray-700 mb-1">السعر الأصلي (د.م.)</label>
                            <input type="number" id="regular_price" value={product.regular_price || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />
                             {validationErrors.regular_price && <p className="text-red-500 text-xs mt-1">{validationErrors.regular_price[0]}</p>}
                        </div>
                        <div>
                            <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">سعر التخفيض (اختياري)</label>
                            <input type="number" id="sale_price" value={product.sale_price || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />
                             {validationErrors.sale_price && <p className="text-red-500 text-xs mt-1">{validationErrors.sale_price[0]}</p>}
                        </div>
                         <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>
                            <input type="number" id="quantity" value={product.quantity || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />
                             {validationErrors.quantity && <p className="text-red-500 text-xs mt-1">{validationErrors.quantity[0]}</p>}
                        </div>
                        <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                            <select id="category_id" value={product.category_id || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50">
                                <option value="">اختر تصنيفاً</option>
                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                            {validationErrors.category_id && <p className="text-red-500 text-xs mt-1">{validationErrors.category_id[0]}</p>}
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mt-4 text-center">{error}</p>}
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors disabled:opacity-50">
                        {loading ? <LoaderCircle className="animate-spin" /> : <Save size={20} />}
                        <span>{loading ? 'جاري التحديث...' : 'حفظ التغييرات'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

