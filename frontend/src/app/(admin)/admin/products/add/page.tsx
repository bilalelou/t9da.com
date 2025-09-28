'use client';

import React, { useState, useEffect } from 'react';
import ProductVariantsManager from '@/components/admin/ProductVariantsManager';
import '@/styles/product-form.css';

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

interface ProductVariant {
    id?: number;
    color_id: number | null;
    size_id: number | null;
    sku: string;
    price: number;
    compare_price?: number;
    quantity: number;
    image?: string;
    is_active: boolean;
}

// --- API Helper ---
const api = {
    getCategories: async (token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/public/categories`, {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب التصنيفات.');
        const data = await response.json();
        return data.data || [];
    },
    getBrands: async (token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/public/brands`, {
            headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب العلامات التجارية.');
        const data = await response.json();
        return data.data || [];
    },
    addProduct: async (formData: FormData, token: string) => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/products`, {
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
    
    // Free shipping fields
    const [hasFreeShipping, setHasFreeShipping] = useState(false);
    const [freeShippingNote, setFreeShippingNote] = useState('');
    
    // Product variants
    const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
    
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
        
        // التأكد من أن حقول النص تعمل بشكل صحيح
        const ensureTextInputsWork = () => {
            const textInputs = [
                'product_name',
                'product_short_description', 
                'product_description'
            ];
            
            textInputs.forEach(inputId => {
                const input = document.getElementById(inputId);
                if (input) {
                    // التأكد من أن الحقل يمكن التركيز عليه
                    input.style.pointerEvents = 'auto';
                    input.style.cursor = 'text';
                    input.style.zIndex = '100';
                    input.style.position = 'relative';
                    
                    if (input.tagName.toLowerCase() === 'input') {
                        input.setAttribute('type', 'text');
                    }
                    
                    // منع أي تداخل مع drag and drop
                    input.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    
                    input.addEventListener('drop', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    });
                    
                    // منع فتح نافذة اختيار الملفات عند النقر على حقول النص
                    input.addEventListener('click', (e) => {
                        e.stopPropagation();
                        console.log(`تم النقر على حقل النص: ${inputId}`);
                    });
                }
            });
            
            // البحث عن أي حقول ملفات قد تتداخل
            const fileInputs = document.querySelectorAll('input[type="file"]');
            fileInputs.forEach((fileInput, index) => {
                const computedStyle = window.getComputedStyle(fileInput);
                if (computedStyle.position === 'absolute' && 
                    (computedStyle.top === '0px' || computedStyle.inset === '0px')) {
                    console.warn(`حقل ملف قد يتداخل مع الصفحة (${index}):`, fileInput);
                    // تعطيل الحقل مؤقتاً إذا كان يغطي الصفحة
                    fileInput.style.pointerEvents = 'none';
                }
            });
        };
        
        // تشغيل الفحص بعد تحميل الصفحة
        setTimeout(ensureTextInputsWork, 100);
        
        // إضافة مراقب للتأكد من استمرار عمل الحقول
        const interval = setInterval(ensureTextInputsWork, 1000);
        
        return () => clearInterval(interval);
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

    const handleVideoChange = (
        videoType: 'primary' | 'secondary',
        field: 'type' | 'url' | 'title' | 'file',
        value: any
    ) => {
        if (videoType === 'primary') {
            setPrimaryVideo(prev => ({ ...prev, [field]: value }));
        } else {
            setSecondaryVideo(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleVideoFileChange = (videoType: 'primary' | 'secondary', file: File | null) => {
        if (videoType === 'primary') {
            setPrimaryVideo(prev => ({ ...prev, file }));
        } else {
            setSecondaryVideo(prev => ({ ...prev, file }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setValidationErrors({});

        console.log('🚀 بدء عملية إضافة المنتج...');
        console.log('📝 بيانات المنتج:', {
            name: name,
            shortDescription,
            hasMainImage: !!image,
            galleryImagesCount: galleryImages.length,
            hasVariants: productVariants.length > 0
        });

        const token = localStorage.getItem('api_token') || 'test_token';

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

        // إضافة بيانات الشحن المجاني
        formData.append('has_free_shipping', hasFreeShipping ? 'true' : 'false');
        if (hasFreeShipping && freeShippingNote) {
            formData.append('free_shipping_note', freeShippingNote);
        }

        // Add has_variants flag
        formData.append('has_variants', productVariants.length > 0 ? 'true' : 'false');
        
        // إضافة الصورة الرئيسية مع logging
        if (image) {
            formData.append('image', image);
            console.log('✅ تم إضافة الصورة الرئيسية:', {
                name: image.name,
                size: image.size,
                type: image.type
            });
        } else {
            console.warn('⚠️ لم يتم اختيار صورة رئيسية');
        }
        
        // إضافة صور المعرض
        galleryImages.forEach((file) => {
            formData.append('images[]', file); // إرسال الصور كـ array
        });
        console.log('📸 عدد صور المعرض:', galleryImages.length);

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
            console.log('📤 إرسال البيانات إلى الخادم...');
            const result = await api.addProduct(formData, token);
            
            console.log('✅ استجابة الخادم:', result);
            console.log('🏷️ معرف المنتج الجديد:', result.data?.id);
            
            // إضافة المتغيرات إذا كانت موجودة
            if (productVariants.length > 0 && result.data?.id) {
                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                    const variantsResponse = await fetch(`${apiUrl}/product-variants/bulk`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            product_id: result.data.id,
                            variants: productVariants
                        }),
                    });

                    if (!variantsResponse.ok) {
                        console.error('فشل في إضافة متغيرات المنتج');
                    }
                } catch (variantError) {
                    console.error('خطأ في إضافة المتغيرات:', variantError);
                }
            }
            
            if (primaryVideo.url || primaryVideo.file || secondaryVideo.url || secondaryVideo.file) {
                const confirmManage = confirm('تم حفظ المنتج مع الفيديوهات. هل تريد إدارة المزيد من الفيديوهات؟');
                if (confirmManage && result.data?.id) {
                    window.location.href = `/admin/products/${result.data.id}/videos`;
                    return;
                }
            }
            
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
                                        <label htmlFor="product_name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Package className="w-4 h-4 text-blue-500" />
                                            اسم المنتج *
                                        </label>
                                        <input 
                                            type="text" 
                                            id="product_name"
                                            name="product_name"
                                            value={name} 
                                            onChange={e => setName(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 text-lg placeholder-gray-400"
                                            placeholder="أدخل اسم المنتج هنا..."
                                            required
                                            autoComplete="off"
                                            data-testid="product-name-input"
                                            accept=""
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
                                        <label htmlFor="product_short_description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <Hash className="w-4 h-4 text-green-500" />
                                            الوصف المختصر *
                                        </label>
                                        <textarea 
                                            id="product_short_description"
                                            name="product_short_description"
                                            rows={3}
                                            value={shortDescription} 
                                            onChange={e => setShortDescription(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg placeholder-gray-400 resize-none"
                                            placeholder="وصف مختصر وجذاب للمنتج..."
                                            required
                                            autoComplete="off"
                                            data-testid="product-short-description-textarea"
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
                                        <label htmlFor="product_description" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                            <AlignLeft className="w-4 h-4 text-purple-500" />
                                            الوصف المفصل *
                                        </label>
                                        <textarea 
                                            id="product_description"
                                            name="product_description"
                                            rows={6}
                                            value={description} 
                                            onChange={e => setDescription(e.target.value)} 
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 text-lg placeholder-gray-400 resize-none"
                                            placeholder="اكتب وصفاً تفصيلياً للمنتج، المواصفات، الاستخدامات..."
                                            required
                                            autoComplete="off"
                                            data-testid="product-description-textarea"
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

                            {/* إعدادات الشحن */}
                            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">إعدادات الشحن</h2>
                                </div>
                                
                                <div className="space-y-6">
                                    {/* الشحن المجاني */}
                                    <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
                                        <input
                                            type="checkbox"
                                            id="has_free_shipping"
                                            checked={hasFreeShipping}
                                            onChange={(e) => setHasFreeShipping(e.target.checked)}
                                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                                        />
                                        <div className="flex-1">
                                            <label htmlFor="has_free_shipping" className="flex items-center gap-2 text-lg font-medium text-gray-800 cursor-pointer">
                                                <Package className="w-5 h-5 text-green-600" />
                                                تفعيل الشحن المجاني لهذا المنتج
                                            </label>
                                            <p className="text-gray-600 mt-1">
                                                عند تفعيل هذا الخيار، لن يتم تطبيق رسوم الشحن على هذا المنتج
                                            </p>
                                        </div>
                                    </div>

                                    {/* ملاحظة الشحن المجاني */}
                                    {hasFreeShipping && (
                                        <div className="relative">
                                            <label htmlFor="free_shipping_note" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                                <FileText className="w-4 h-4 text-green-500" />
                                                ملاحظة الشحن المجاني (اختياري)
                                            </label>
                                            <textarea
                                                id="free_shipping_note"
                                                value={freeShippingNote}
                                                onChange={(e) => setFreeShippingNote(e.target.value)}
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200 text-lg placeholder-gray-400"
                                                placeholder="مثال: شحن مجاني لجميع أنحاء المغرب"
                                                rows={3}
                                            />
                                            <p className="text-gray-500 text-sm mt-2">
                                                هذه الملاحظة ستظهر للعملاء مع المنتج
                                            </p>
                                        </div>
                                    )}
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

                            {/* Product Variants Manager */}
                            <ProductVariantsManager 
                                onVariantsChange={setProductVariants}
                                initialVariants={productVariants}
                            />
                        </div>

                        {/* الشريط الجانبي - الوسائط */}
                        <div className="space-y-6">
                            {/* الصور */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <Camera className="w-5 h-5 text-pink-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">الصور</h2>
                                </div>
                                
                                {/* الصورة الرئيسية */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        الصورة الرئيسية
                                    </label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-pink-300 transition-colors">
                                        {imagePreview ? (
                                            <div className="p-6">
                                                <div className="relative group">
                                                    <img src={imagePreview} alt="معاينة" className="w-full h-32 object-cover rounded-lg" />
                                                    <button 
                                                        type="button" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setImage(null); 
                                                            setImagePreview(null);
                                                        }} 
                                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <label className="block p-6 text-center cursor-pointer">
                                                <UploadCloud className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                <p className="text-gray-500 text-sm">اضغط هنا لاختيار صورة رئيسية</p>
                                                <input 
                                                    type="file" 
                                                    onChange={handleImageChange} 
                                                    accept="image/*" 
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* معرض الصور */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                        <Images className="w-4 h-4 text-blue-500" />
                                        معرض الصور
                                    </label>
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors">
                                        <label className="block p-4 text-center cursor-pointer">
                                            <UploadCloud className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                            <p className="text-gray-500 text-sm">اضغط هنا لإضافة صور إضافية</p>
                                            <input 
                                                type="file" 
                                                multiple 
                                                onChange={handleGalleryChange} 
                                                accept="image/*" 
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                    {galleryPreviews.length > 0 && (
                                        <div className="grid grid-cols-2 gap-2 mt-4">
                                            {galleryPreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img src={preview} alt="" className="w-full h-20 object-cover rounded-lg" />
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeGalleryImage(index)} 
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* الفيديوهات */}
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <Play className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">الفيديوهات</h2>
                                </div>
                                
                                {/* فيديو أساسي */}
                                <div className="space-y-4">
                                    <h3 className="font-medium text-gray-700">فيديو أساسي (اختياري)</h3>
                                    <select 
                                        value={primaryVideo.type} 
                                        onChange={e => handleVideoChange('primary', 'type', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    >
                                        <option value="youtube">YouTube</option>
                                        <option value="vimeo">Vimeo</option>
                                        <option value="file">ملف فيديو</option>
                                    </select>
                                    
                                    {primaryVideo.type === 'file' ? (
                                        <input 
                                            type="file" 
                                            accept="video/*" 
                                            onChange={e => handleVideoFileChange('primary', e.target.files?.[0] || null)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                    ) : (
                                        <input 
                                            type="url" 
                                            placeholder={`رابط ${primaryVideo.type === 'youtube' ? 'YouTube' : 'Vimeo'}`}
                                            value={primaryVideo.url}
                                            onChange={e => handleVideoChange('primary', 'url', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                        />
                                    )}
                                    
                                    <input 
                                        type="text" 
                                        placeholder="عنوان الفيديو"
                                        value={primaryVideo.title}
                                        onChange={e => handleVideoChange('primary', 'title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-red-500 focus:ring-1 focus:ring-red-200"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* رسائل الخطأ والإرسال */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                            <p className="text-red-600 font-medium">{error}</p>
                        </div>
                    )}
                    
                    <div className="flex justify-center">
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg text-lg font-semibold"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle className="animate-spin w-6 h-6" />
                                    <span>جاري الحفظ...</span>
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="w-6 h-6" />
                                    <span>حفظ المنتج</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}