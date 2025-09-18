'use client';

import React, { useState, useEffect } from 'react';

// Icons
import { 
    Package, 
    DollarSign, 
    PlusCircle, 
    LoaderCircle, 
    UploadCloud, 
    X, 
    FileText, 
    Images, 
    Video, 
    Youtube,
    Tag,
    Hash,
    Type,
    AlignLeft,
    ShoppingCart,
    Percent,
    Building2,
    Star,
    Camera,
    Play
} from 'lucide-react';

// --- Interfaces ---
interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
    logo?: string;
}

// --- API Helper ---
const api = {
    getCategories: async (token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/test/categories`, {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب التصنيفات.');
        const data = await response.json();
        return data.data || [];
    },
    getBrands: async (token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/test/brands`, {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب العلامات التجارية.');
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
    const [brandId, setBrandId] = useState(''); // جديد - العلامة التجارية (اختياري)
    
    // Main image
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Gallery images
    const [galleryImages, setGalleryImages] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    
    // Videos
    const [primaryVideo, setPrimaryVideo] = useState({
        type: 'youtube' as 'youtube' | 'vimeo' | 'file',
        url: '',
        title: '',
        file: null as File | null
    });
    const [secondaryVideo, setSecondaryVideo] = useState({
        type: 'youtube' as 'youtube' | 'vimeo' | 'file',
        url: '',
        title: '',
        file: null as File | null
    });
    
    // Other states
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]); // جديد - قائمة العلامات التجارية
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    useEffect(() => {
        const token = localStorage.getItem('api_token') || 'test_token';
        
        Promise.all([
            api.getCategories(token),
            api.getBrands(token)
        ]).then(([categoriesData, brandsData]) => {
            setCategories(categoriesData);
            setBrands(brandsData);
        }).catch(() => {
            setError('فشل في تحميل البيانات المطلوبة.');
        });
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
        
        // إضافة العلامة التجارية إذا تم اختيارها
        if (brandId) {
            formData.append('brand_id', brandId);
        }
        
        if (image) {
            formData.append('image', image);
        }
        galleryImages.forEach((file) => {
            formData.append('images[]', file); // إرسال الصور كـ array
        });

        // Add primary video
        if (primaryVideo.url || primaryVideo.file) {
            formData.append('primary_video_type', primaryVideo.type);
            formData.append('primary_video_title', primaryVideo.title);
            if (primaryVideo.type === 'file' && primaryVideo.file) {
                formData.append('primary_video_file', primaryVideo.file);
            } else {
                formData.append('primary_video_url', primaryVideo.url);
            }
        }

        // Add secondary video
        if (secondaryVideo.url || secondaryVideo.file) {
            formData.append('secondary_video_type', secondaryVideo.type);
            formData.append('secondary_video_title', secondaryVideo.title);
            if (secondaryVideo.type === 'file' && secondaryVideo.file) {
                formData.append('secondary_video_file', secondaryVideo.file);
            } else {
                formData.append('secondary_video_url', secondaryVideo.url);
            }
        }

        try {
            const result = await api.addProduct(formData, token);
            alert('تمت إضافة المنتج بنجاح!');
            
            // Redirect to product videos management if videos were added
            if ((primaryVideo.url || primaryVideo.file) || (secondaryVideo.url || secondaryVideo.file)) {
                const confirmManage = confirm('تم حفظ المنتج مع الفيديوهات. هل تريد إدارة المزيد من الفيديوهات؟');
                if (confirmManage && result.data?.id) {
                    window.location.href = `/admin/products/${result.data.id}/videos`;
                    return;
                }
            }
            
            window.location.href = '/admin/products';
        } catch (err: unknown) {
            setError(err.message || 'حدث خطأ غير متوقع.');
            if (err.errors) {
                setValidationErrors(err.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6" dir="rtl">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                            <PlusCircle className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            إضافة منتج جديد
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600">أنشئ منتجاً جديداً مع جميع التفاصيل والوسائط المطلوبة</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* الجزء الأساسي - معلومات المنتج */}
                        <div className="xl:col-span-2 space-y-6">
                            {/* معلومات أساسية */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Type className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">المعلومات الأساسية</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    {/* اسم المنتج */}
                                    <div className="relative">
                                        <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Package className="w-4 h-4 text-blue-500" />
                                            اسم المنتج
                                        </label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            value={name} 
                                            onChange={e => setName(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg placeholder-gray-400"
                                            placeholder="أدخل اسم المنتج هنا..."
                                        />
                                        {validationErrors.name && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.name[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* الوصف المختصر */}
                                    <div className="relative">
                                        <label htmlFor="short_description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Hash className="w-4 h-4 text-green-500" />
                                            الوصف المختصر
                                        </label>
                                        <textarea 
                                            id="short_description" 
                                            rows={3}
                                            value={shortDescription} 
                                            onChange={e => setShortDescription(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg placeholder-gray-400 resize-none"
                                            placeholder="وصف مختصر وجذاب للمنتج..."
                                        />
                                        {validationErrors.short_description && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.short_description[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* الوصف المفصل */}
                                    <div className="relative">
                                        <label htmlFor="description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <AlignLeft className="w-4 h-4 text-purple-500" />
                                            الوصف المفصل
                                        </label>
                                        <textarea 
                                            id="description" 
                                            rows={6}
                                            value={description} 
                                            onChange={e => setDescription(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg placeholder-gray-400 resize-none"
                                            placeholder="اكتب وصفاً تفصيلياً للمنتج، المواصفات، الاستخدامات..."
                                        />
                                        {validationErrors.description && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.description[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* الأسعار والكمية */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">التسعير والكمية</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* السعر العادي */}
                                    <div className="relative">
                                        <label htmlFor="regular_price" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <DollarSign className="w-4 h-4 text-green-500" />
                                            السعر العادي
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                id="regular_price" 
                                                value={regularPrice} 
                                                onChange={e => setRegularPrice(e.target.value)} 
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg placeholder-gray-400"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                                                دج
                                            </span>
                                        </div>
                                        {validationErrors.regular_price && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.regular_price[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* سعر التخفيض */}
                                    <div className="relative">
                                        <label htmlFor="sale_price" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Percent className="w-4 h-4 text-orange-500" />
                                            سعر التخفيض (اختياري)
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                id="sale_price" 
                                                value={salePrice} 
                                                onChange={e => setSalePrice(e.target.value)} 
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 text-lg placeholder-gray-400"
                                                placeholder="0.00"
                                            />
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">
                                                دج
                                            </span>
                                        </div>
                                        {validationErrors.sale_price && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.sale_price[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* الكمية */}
                                    <div className="relative">
                                        <label htmlFor="quantity" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <ShoppingCart className="w-4 h-4 text-blue-500" />
                                            الكمية المتاحة
                                        </label>
                                        <input 
                                            type="number" 
                                            id="quantity" 
                                            value={quantity} 
                                            onChange={e => setQuantity(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg placeholder-gray-400"
                                            placeholder="0"
                                        />
                                        {validationErrors.quantity && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.quantity[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* التصنيف والعلامة التجارية */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <Tag className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">التصنيف والعلامة التجارية</h2>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* التصنيف */}
                                    <div className="relative">
                                        <label htmlFor="category_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Tag className="w-4 h-4 text-purple-500" />
                                            التصنيف
                                        </label>
                                        <select 
                                            id="category_id" 
                                            value={categoryId} 
                                            onChange={e => setCategoryId(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg"
                                        >
                                            <option value="">اختر تصنيفاً</option>
                                            {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                                        </select>
                                        {validationErrors.category_id && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.category_id[0]}
                                            </p>
                                        )}
                                    </div>

                                    {/* العلامة التجارية */}
                                    <div className="relative">
                                        <label htmlFor="brand_id" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Building2 className="w-4 h-4 text-indigo-500" />
                                            العلامة التجارية (اختياري)
                                        </label>
                                        <select 
                                            id="brand_id" 
                                            value={brandId} 
                                            onChange={e => setBrandId(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-lg"
                                        >
                                            <option value="">بدون علامة تجارية</option>
                                            {brands.map(brand => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
                                        </select>
                                        {validationErrors.brand_id && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                                <X className="w-4 h-4" />
                                                {validationErrors.brand_id[0]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* الشريط الجانبي - الوسائط */}
                        <div className="space-y-6">
                            {/* الصور */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <Camera className="w-6 h-6 text-pink-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">الصور</h2>
                                </div>
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

                        {/* Videos Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">فيديوهات المنتج (اختياري)</h3>
                            
                            {/* Primary Video */}
                            <div className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    الفيديو الرئيسي
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">نوع الفيديو</label>
                                        <select 
                                            value={primaryVideo.type} 
                                            onChange={(e) => setPrimaryVideo(prev => ({ ...prev, type: e.target.value as 'youtube' | 'vimeo' | 'file' }))}
                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="vimeo">Vimeo</option>
                                            <option value="file">ملف فيديو</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">عنوان الفيديو</label>
                                        <input 
                                            type="text"
                                            value={primaryVideo.title}
                                            onChange={(e) => setPrimaryVideo(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="عنوان الفيديو"
                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                {primaryVideo.type !== 'file' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {primaryVideo.type === 'youtube' ? 'رابط YouTube' : 'رابط Vimeo'}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <Youtube className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input 
                                                type="url"
                                                value={primaryVideo.url}
                                                onChange={(e) => setPrimaryVideo(prev => ({ ...prev, url: e.target.value }))}
                                                placeholder={primaryVideo.type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://vimeo.com/...'}
                                                className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">رفع ملف الفيديو</label>
                                        <input 
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setPrimaryVideo(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 100 ميجا. الصيغ المدعومة: mp4, mov, avi, wmv</p>
                                    </div>
                                )}
                            </div>
                            
                            {/* Secondary Video */}
                            <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                                <h4 className="font-medium text-gray-700 flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    فيديو ثانوي (اختياري)
                                </h4>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">نوع الفيديو</label>
                                        <select 
                                            value={secondaryVideo.type} 
                                            onChange={(e) => setSecondaryVideo(prev => ({ ...prev, type: e.target.value as 'youtube' | 'vimeo' | 'file' }))}
                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="youtube">YouTube</option>
                                            <option value="vimeo">Vimeo</option>
                                            <option value="file">ملف فيديو</option>
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">عنوان الفيديو</label>
                                        <input 
                                            type="text"
                                            value={secondaryVideo.title}
                                            onChange={(e) => setSecondaryVideo(prev => ({ ...prev, title: e.target.value }))}
                                            placeholder="عنوان الفيديو"
                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                {secondaryVideo.type !== 'file' ? (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">
                                            {secondaryVideo.type === 'youtube' ? 'رابط YouTube' : 'رابط Vimeo'}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                <Youtube className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input 
                                                type="url"
                                                value={secondaryVideo.url}
                                                onChange={(e) => setSecondaryVideo(prev => ({ ...prev, url: e.target.value }))}
                                                placeholder={secondaryVideo.type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://vimeo.com/...'}
                                                className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">رفع ملف الفيديو</label>
                                        <input 
                                            type="file"
                                            accept="video/*"
                                            onChange={(e) => setSecondaryVideo(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 100 ميجا. الصيغ المدعومة: mp4, mov, avi, wmv</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-700">
                                    💡 <strong>نصيحة:</strong> يمكنك إضافة المزيد من الفيديوهات وإدارتها بشكل متقدم من صفحة &quot;إدارة فيديوهات المنتج&quot; بعد حفظ المنتج.
                                </p>
                            </div>
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
                        <div>
                            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">العلامة التجارية (اختياري)</label>
                            <select id="brand_id" value={brandId} onChange={e => setBrandId(e.target.value)} className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500">
                                <option value="">بدون علامة تجارية</option>
                                {brands.map(brand => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}
                            </select>
                            {validationErrors.brand_id && <p className="text-red-500 text-xs mt-1">{validationErrors.brand_id[0]}</p>}
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

export default AddProductPage;

