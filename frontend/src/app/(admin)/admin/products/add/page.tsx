'use client';

import React, { useState, useEffect } from 'react';

// Icons
import { Package, DollarSign, PlusCircle, LoaderCircle, UploadCloud, X, FileText, Images } from 'lucide-react';

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
}

// --- API Helper ---
const api = {
    getCategories: async (token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب التصنيفات.');
        const data = await response.json();
        return data.data || [];
    },
    addProduct: async (formData: FormData, token: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            throw { message: data.message, errors: data.errors };
        }
        return data;
    }
};

// --- Main Add Product Page Component ---
export default function AddProductPage() {
    // حالة لحفظ بيانات النموذج
    const [name, setName] = useState('');
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [regularPrice, setRegularPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [categoryId, setCategoryId] = useState('');
    
    // Main image
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Gallery images
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    
    // Other states
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        api.getCategories(token)
            .then(setCategories)
            .catch(() => setError('فشل في تحميل التصنيفات.'));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newFiles = Array.from(files);
            setGalleryImages(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(file => URL.createObjectURL(file));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        const token = localStorage.getItem('api_token');
        if (!token) {
            setError('جلسة المستخدم غير صالحة. الرجاء تسجيل الدخول مرة أخرى.');
            setLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('short_description', shortDescription);
        formData.append('description', description);
        formData.append('regular_price', regularPrice);
        formData.append('sale_price', salePrice);
        formData.append('quantity', quantity);
        formData.append('category_id', categoryId);
        if (image) {
            formData.append('image', image);
        }
        galleryImages.forEach((file) => {
            formData.append('images[]', file); // إرسال الصور كـ array
        });

        try {
            await api.addProduct(formData, token);
            alert('تمت إضافة المنتج بنجاح!');
            window.location.href = '/admin/products';
        } catch (err: any) {
            setError(err.message || 'حدث خطأ غير متوقع.');
            if (err.errors) {
                setValidationErrors(err.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">إضافة منتج جديد</h1>
                <p className="text-md text-gray-600 mt-1">املأ النموذج أدناه لإضافة منتج جديد إلى متجرك.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                            <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Package className="h-5 w-5 text-gray-400" /></div><input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" /></div>
                            {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                        </div>

                        <div>
                            <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">الوصف المختصر</label>
                            <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 pt-2.5"><FileText className="h-5 w-5 text-gray-400" /></div><textarea id="short_description" value={shortDescription} onChange={e => setShortDescription(e.target.value)} rows={3} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"></textarea></div>
                            {validationErrors.short_description && <p className="text-red-500 text-xs mt-1">{validationErrors.short_description[0]}</p>}
                        </div>
                        
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف الكامل</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"></textarea>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">صورة المنتج الرئيسية</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                                {imagePreview ? (
                                    <div className="relative group mx-auto w-fit"><img src={imagePreview} alt="معاينة" className="h-32 rounded-lg" /><button type="button" onClick={() => { setImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button></div>
                                ) : (
                                    <><UploadCloud size={48} className="mx-auto text-gray-400" /><p className="mt-2 text-sm text-gray-600">اسحب وأفلت الصورة هنا، أو انقر للاختيار</p><input type="file" onChange={handleImageChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" /></>
                                )}
                            </div>
                            {validationErrors.image && <p className="text-red-500 text-xs mt-1">{validationErrors.image[0]}</p>}
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">معرض الصور (اختياري)</h3>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                                <Images size={48} className="mx-auto text-gray-400" />
                                <p className="mt-2 text-sm text-gray-600">اختر صوراً إضافية للمنتج</p>
                                <input type="file" multiple onChange={handleGalleryChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />
                            </div>
                            {galleryPreviews.length > 0 && (
                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                                    {galleryPreviews.map((preview, index) => (
                                        <div key={index} className="relative group"><img src={preview} className="w-full h-24 object-cover rounded-lg" /><button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button></div>
                                    ))}
                                </div>
                            )}
                            {validationErrors.images && <p className="text-red-500 text-xs mt-1">{validationErrors.images[0]}</p>}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6 self-start sticky top-24">
                        <div>
                            <label htmlFor="regular_price" className="block text-sm font-medium text-gray-700 mb-1">السعر الأصلي (د.م.)</label>
                            <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><DollarSign className="h-5 w-5 text-gray-400" /></div><input type="number" id="regular_price" value={regularPrice} onChange={e => setRegularPrice(e.target.value)} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" /></div>
                            {validationErrors.regular_price && <p className="text-red-500 text-xs mt-1">{validationErrors.regular_price[0]}</p>}
                        </div>
                         <div>
                            <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">سعر التخفيض (اختياري)</label>
                             <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><DollarSign className="h-5 w-5 text-gray-400" /></div><input type="number" id="sale_price" value={salePrice} onChange={e => setSalePrice(e.target.value)} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" /></div>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">الكمية المتاحة</label>
                            <div className="relative"><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Package className="h-5 w-5 text-gray-400" /></div><input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" /></div>
                            {validationErrors.quantity && <p className="text-red-500 text-xs mt-1">{validationErrors.quantity[0]}</p>}
                        </div>
                         <div>
                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                            <select id="category_id" value={categoryId} onChange={e => setCategoryId(e.target.value)} className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">اختر تصنيفاً</option>
                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                            </select>
                            {validationErrors.category_id && <p className="text-red-500 text-xs mt-1">{validationErrors.category_id[0]}</p>}
                        </div>
                    </div>
                </div>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
                <div className="mt-8 flex justify-end">
                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition-colors disabled:opacity-50">
                        {loading ? <LoaderCircle className="animate-spin" /> : <PlusCircle size={20} />}
                        <span>{loading ? 'جاري الحفظ...' : 'حفظ المنتج'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
}

