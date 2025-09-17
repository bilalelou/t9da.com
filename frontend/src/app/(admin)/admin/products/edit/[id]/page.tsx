'use client';'use client';

import { useState, useEffect } from 'react';

import { useParams, useRouter } from 'next/navigation';import React, { useState, useEffect } from 'react';

import { useAuth } from '@/contexts/AuthContext';import { useParams } from 'next/navigation';

import Image from 'next/image';

// Icons

// Iconsimport { 

import {     Package, 

    Package,     DollarSign, 

    DollarSign,     Save, 

    Save,     LoaderCircle, 

    LoaderCircle,     UploadCloud, 

    UploadCloud,     X, 

    X,     FileText, 

    FileText,     Images, 

    Images,     Video, 

    Video,     Youtube,

    Youtube,    Tag,

    Tag,    Hash,

    Hash,    Type,

    Type,    AlignLeft,

    AlignLeft,    ShoppingCart,

    ShoppingCart,    Percent,

    Percent,    Building2,

    Building2,    Star,

    Star,    Camera,

    Camera,    Play,

    Play,    Edit3

    Edit3,} from 'lucide-react';

    ArrowLeft

} from 'lucide-react';// --- Interfaces ---

interface Category {

// Types    id: number;

interface Product {    name: string;

    id: number;}

    name: string;

    description: string;interface Brand {

    short_description: string;    id: number;

    price: number;    name: string;

    sale_price: number;    logo?: string;

    sku: string;}

    stock_quantity: number;

    category_id: number;interface Product {

    brand_id?: number;    name: string;

    featured: boolean;    short_description: string;

    status: string;    description: string;

    image: string;    regular_price: string;

    images?: ProductImage[];    sale_price: string;

    videos?: ProductVideo[];    quantity: string;

}    category_id: string;

    brand_id?: string; // جديد - العلامة التجارية

interface ProductImage {    image: string; // URL of the main image

    id: number;    images: string[]; // Array of URLs for gallery images

    image: string;}

}



interface ProductVideo {// --- API Helper ---

    id: number;const api = {

    video_url: string;    getProduct: async (id: string, token: string): Promise<Product> => {

    title: string;        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    description: string;        // [مؤقت] للاختبار - استخدام endpoint بدون authentication

}        const response = await fetch(`${apiUrl}/test/products/${id}`, {

            headers: { 'Accept': 'application/json' },

interface Category {        });

    id: number;        if (!response.ok) throw new Error('فشل في جلب بيانات المنتج.');

    name: string;        const data = await response.json();

}        return data.data;

    },

interface Brand {    getCategories: async (token: string) => {

    id: number;        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

    name: string;        // [مؤقت] للاختبار - استخدام endpoint بدون authentication

}        const response = await fetch(`${apiUrl}/test/categories`, {

            headers: { 'Accept': 'application/json' },

// API Functions        });

const API_BASE = 'http://localhost:8000/api';        if (!response.ok) throw new Error('فشل في جلب التصنيفات.');

        const data = await response.json();

const api = {        return data.data || [];

    getProduct: async (id: string): Promise<Product> => {    },

        const res = await fetch(`${API_BASE}/products/${id}`);    getBrands: async (token: string) => {

        if (!res.ok) throw new Error('خطأ في تحميل المنتج');        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

        return res.json();        // [مؤقت] للاختبار - استخدام endpoint بدون authentication

    },        const response = await fetch(`${apiUrl}/test/brands`, {

            headers: { 'Accept': 'application/json' },

    getCategories: async () => {        });

        const res = await fetch(`${API_BASE}/categories`);        if (!response.ok) throw new Error('فشل في جلب العلامات التجارية.');

        if (!res.ok) throw new Error('خطأ في تحميل الفئات');        const data = await response.json();

        return res.json();        return data.data || [];

    },    },

    updateProduct: async (id: string, formData: FormData, token: string) => {

    getBrands: async () => {        formData.append('_method', 'PUT'); 

        const res = await fetch(`${API_BASE}/brands`);        

        if (!res.ok) throw new Error('خطأ في تحميل الماركات');        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

        return res.json();        const response = await fetch(`${apiUrl}/products/${id}`, {

    },            method: 'POST',

            headers: {

    updateProduct: async (id: string, productData: FormData, token: string) => {                'Authorization': `Bearer ${token}`,

        const res = await fetch(`${API_BASE}/products/${id}`, {                'Accept': 'application/json',

            method: 'PUT',            },

            headers: {            body: formData,

                'Authorization': `Bearer ${token}`,        });

                'Accept': 'application/json',        const data = await response.json();

            },        if (!response.ok) throw { message: data.message, errors: data.errors };

            body: productData,        return data;

        });    }

        if (!res.ok) {};

            const error = await res.json();

            throw new Error(error.message || 'خطأ في تحديث المنتج');// --- Main Edit Product Page Component ---

        }export default function EditProductPage() {

        return res.json();    const params = useParams();

    },    const productId = params.id as string;

    

    addVideo: async (productId: string, videoData: any, token: string) => {    const [product, setProduct] = useState<Partial<Product>>({});

        const res = await fetch(`${API_BASE}/products/${productId}/videos`, {    const [imagePreview, setImagePreview] = useState<string | null>(null);

            method: 'POST',    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

            headers: {    const [newImage, setNewImage] = useState<File | null>(null);

                'Authorization': `Bearer ${token}`,    const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);

                'Content-Type': 'application/json',    

                'Accept': 'application/json',    // Videos state

            },    const [videos, setVideos] = useState({

            body: JSON.stringify(videoData),        primary: {

        });            type: 'youtube' as 'youtube' | 'vimeo' | 'file',

        if (!res.ok) throw new Error('خطأ في إضافة الفيديو');            url: '',

        return res.json();            title: '',

    },            file: null as File | null

        },

    deleteVideo: async (productId: string, videoId: number, token: string) => {        secondary: {

        const res = await fetch(`${API_BASE}/products/${productId}/videos/${videoId}`, {            type: 'youtube' as 'youtube' | 'vimeo' | 'file',

            method: 'DELETE',            url: '',

            headers: {            title: '',

                'Authorization': `Bearer ${token}`,            file: null as File | null

                'Accept': 'application/json',        }

            },    });

        });    

        if (!res.ok) throw new Error('خطأ في حذف الفيديو');    const [categories, setCategories] = useState<Category[]>([]);

    }    const [brands, setBrands] = useState<Brand[]>([]); // جديد - قائمة العلامات التجارية

};    const [loading, setLoading] = useState(false);

    const [pageLoading, setPageLoading] = useState(true);

export default function EditProductPage() {    const [error, setError] = useState<string | null>(null);

    const { id } = useParams();    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

    const router = useRouter();

    const { token } = useAuth();    useEffect(() => {

        let token = localStorage.getItem('api_token');

    // Product States        

    const [product, setProduct] = useState<Product | null>(null);        // [مؤقت] للاختبار فقط - إضافة token افتراضي

    const [categories, setCategories] = useState<Category[]>([]);        if (!token) {

    const [brands, setBrands] = useState<Brand[]>([]);            token = 'test_token';

    const [loading, setLoading] = useState(true);            localStorage.setItem('api_token', token);

    const [submitting, setSubmitting] = useState(false);        }



    // Form States        if (!token || !productId) {

    const [formData, setFormData] = useState({            console.error('Missing token or productId:', { token: !!token, productId });

        name: '',            setError('يرجى تسجيل الدخول أولاً');

        description: '',            setPageLoading(false);

        short_description: '',            return;

        price: '',        }

        sale_price: '',

        sku: '',        Promise.all([

        stock_quantity: '',            api.getProduct(productId, token),

        category_id: '',            api.getCategories(token),

        brand_id: '',            api.getBrands(token)

        featured: false,        ]).then(([productData, categoryData, brandsData]) => {

        status: 'active'            console.log('Product data loaded:', productData);

    });            setProduct(productData);

            setCategories(categoryData);

    // Image States            setBrands(brandsData);

    const [newImage, setNewImage] = useState<File | null>(null);            if (productData.image) setImagePreview(productData.image);

    const [imagePreview, setImagePreview] = useState<string>('');            if (Array.isArray(productData.images)) setGalleryPreviews(productData.images);

    const [newImages, setNewImages] = useState<File[]>([]);        }).catch((err) => {

    const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);            console.error('Error loading data:', err);

            if (err instanceof TypeError && err.message.includes('fetch')) {

    // Video States                setError('فشل الاتصال بالخادم. هل تأكدت من تشغيل الخادم المحلي (php artisan serve)؟');

    const [videos, setVideos] = useState<ProductVideo[]>([]);            } else {

    const [newVideo, setNewVideo] = useState({                setError(`فشل في تحميل بيانات الصفحة: ${err.message || 'خطأ غير معروف'}`);

        video_url: '',            }

        title: '',        }).finally(() => {

        description: ''            setPageLoading(false);

    });        });

    }, [productId]);

    // Error & Success States    

    const [error, setError] = useState<string>('');    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

    const [success, setSuccess] = useState<string>('');        const { id, value } = e.target;

        setProduct(prev => ({ ...prev, [id]: value }));

    // Load data on mount    };

    useEffect(() => {

        const loadData = async () => {    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {

            try {        const file = e.target.files?.[0];

                setLoading(true);        if (file) {

                const [productData, categoriesData, brandsData] = await Promise.all([            setNewImage(file);

                    api.getProduct(id as string),            setImagePreview(URL.createObjectURL(file));

                    api.getCategories(),        }

                    api.getBrands()    };

                ]);    

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {

                setProduct(productData);        const files = e.target.files;

                setCategories(categoriesData);        if (files) {

                setBrands(brandsData);            const newFiles = Array.from(files);

                setVideos(productData.videos || []);            setNewGalleryImages(prev => [...prev, ...newFiles]);

            const newPreviews = newFiles.map(file => URL.createObjectURL(file));

                // Set form data            setGalleryPreviews(prev => [...prev, ...newPreviews]);

                setFormData({        }

                    name: productData.name || '',    };

                    description: productData.description || '',    

                    short_description: productData.short_description || '',    const removeGalleryImage = (index: number) => {

                    price: productData.price?.toString() || '',        const removedPreview = galleryPreviews[index];

                    sale_price: productData.sale_price?.toString() || '',        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));

                    sku: productData.sku || '',

                    stock_quantity: productData.stock_quantity?.toString() || '',        const newPreviewIndex = newGalleryImages.findIndex(file => URL.createObjectURL(file) === removedPreview);

                    category_id: productData.category_id?.toString() || '',        if (newPreviewIndex > -1) {

                    brand_id: productData.brand_id?.toString() || '',            setNewGalleryImages(prev => prev.filter((_, i) => i !== newPreviewIndex));

                    featured: productData.featured || false,        }

                    status: productData.status || 'active'    };

                });



            } catch (error) {    const handleSubmit = async (e: React.FormEvent) => {

                setError('خطأ في تحميل البيانات');        e.preventDefault();

                console.error('Error loading data:', error);        setLoading(true);

            } finally {        setError(null);

                setLoading(false);        setValidationErrors({});

            }        

        };        const token = localStorage.getItem('api_token');

        const productId = window.location.pathname.split('/').pop();

        if (id && token) {

            loadData();        if (!token || !productId) {

        }            setError('جلسة المستخدم غير صالحة أو المنتج غير محدد.');

    }, [id, token]);            setLoading(false);

            return;

    // Handle form input changes        }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const { name, value, type } = e.target;        const formData = new FormData();

                

        if (type === 'checkbox') {        // [تصحيح] إضافة الحقول النصية فقط وبشكل صريح

            const checked = (e.target as HTMLInputElement).checked;        formData.append('name', product.name || '');

            setFormData(prev => ({ ...prev, [name]: checked }));        formData.append('short_description', product.short_description || '');

        } else {        formData.append('description', product.description || '');

            setFormData(prev => ({ ...prev, [name]: value }));        formData.append('regular_price', product.regular_price || '0');

        }        formData.append('sale_price', product.sale_price || '');

    };        formData.append('quantity', product.quantity || '0');

        formData.append('category_id', product.category_id || '');

    // Handle main image change

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {        // إضافة الصورة الرئيسية الجديدة فقط إن وجدت

        const file = e.target.files?.[0];        if (newImage) {

        if (file) {            formData.append('image', newImage);

            setNewImage(file);        }

            const reader = new FileReader();        

            reader.onload = () => setImagePreview(reader.result as string);        // إضافة صور المعرض الجديدة

            reader.readAsDataURL(file);        newGalleryImages.forEach(file => formData.append('new_images[]', file));

        }        

    };        // إرسال قائمة الصور القديمة المتبقية

        const existingImages = galleryPreviews.filter(p => p.startsWith('http'));

    // Handle additional images        formData.append('existing_images', JSON.stringify(existingImages));

    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const files = Array.from(e.target.files || []);        // Add primary video

        setNewImages(files);        if (videos.primary.url || videos.primary.file) {

                    formData.append('primary_video_type', videos.primary.type);

        const previews = files.map(file => {            formData.append('primary_video_title', videos.primary.title);

            const reader = new FileReader();            if (videos.primary.type === 'file' && videos.primary.file) {

            reader.readAsDataURL(file);                formData.append('primary_video_file', videos.primary.file);

            return new Promise<string>((resolve) => {            } else {

                reader.onload = () => resolve(reader.result as string);                formData.append('primary_video_url', videos.primary.url);

            });            }

        });        }

        

        Promise.all(previews).then(setImagesPreviews);        try {

    };            await api.updateProduct(productId, formData, token);

            window.location.href = '/admin/products';

    // Handle video addition        } catch (err: any) {

    const handleAddVideo = async () => {            if (err.errors) {

        if (!newVideo.video_url.trim()) {                setValidationErrors(err.errors);

            setError('يرجى إدخال رابط الفيديو');                setError('الرجاء مراجعة الأخطاء في النموذج وتصحيحها.');

            return;            } else {

        }                setError(err.message || 'حدث خطأ غير متوقع.');

            }

        try {        } finally {

            const videoData = await api.addVideo(id as string, newVideo, token!);            setLoading(false);

            setVideos(prev => [...prev, videoData]);        }

            setNewVideo({ video_url: '', title: '', description: '' });    };

            setSuccess('تم إضافة الفيديو بنجاح');

        } catch (error) {    if (pageLoading) {

            setError('خطأ في إضافة الفيديو');        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;

        }    }

    };

    if (error && !Object.keys(validationErrors).length) {

    // Handle video deletion        return <div className="text-center text-red-600 bg-red-50 p-6 rounded-lg"><strong>خطأ:</strong> {error}</div>;

    const handleDeleteVideo = async (videoId: number) => {    }

        try {

            await api.deleteVideo(id as string, videoId, token!);

            setVideos(prev => prev.filter(v => v.id !== videoId));    return (

            setSuccess('تم حذف الفيديو بنجاح');        <div className="space-y-8" dir="rtl">

        } catch (error) {            <div>

            setError('خطأ في حذف الفيديو');                <h1 className="text-3xl font-bold text-gray-900">تعديل المنتج: {product.name}</h1>

        }                <p className="text-md text-gray-600 mt-1">قم بتحديث تفاصيل المنتج أدناه.</p>

    };            </div>



    // Handle form submission            <form onSubmit={handleSubmit}>

    const handleSubmit = async (e: React.FormEvent) => {                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        e.preventDefault();                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6">

        setSubmitting(true);                        <div>

        setError('');                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>

        setSuccess('');                            <input type="text" id="name" value={product.name || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />

                            {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}

        try {                        </div>

            const formDataToSend = new FormData();                        <div>

                                         <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">الوصف المختصر</label>

            // Add form fields                             <textarea id="short_description" value={product.short_description || ''} onChange={handleInputChange} rows={3} className="w-full border-gray-300 rounded-lg bg-gray-50"></textarea>

            Object.entries(formData).forEach(([key, value]) => {                             {validationErrors.short_description && <p className="text-red-500 text-xs mt-1">{validationErrors.short_description[0]}</p>}

                if (value !== null && value !== undefined) {                        </div>

                    formDataToSend.append(key, value.toString());                         <div>

                }                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">الوصف الكامل</label>

            });                            <textarea id="description" value={product.description || ''} onChange={handleInputChange} rows={6} className="w-full border-gray-300 rounded-lg bg-gray-50"></textarea>

                        </div>

            // Add main image if selected                        <div>

            if (newImage) {                            <h3 className="text-lg font-semibold text-gray-800 mb-4">صورة المنتج الرئيسية</h3>

                formDataToSend.append('image', newImage);                             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">

            }                                {imagePreview ? (

                                    <div className="relative group mx-auto w-fit"><img src={imagePreview} alt="معاينة" className="h-32 rounded-lg" /><button type="button" onClick={() => { setNewImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"><X size={16} /></button></div>

            // Add additional images                                ) : (

            newImages.forEach((image, index) => {                                    <><UploadCloud size={48} className="mx-auto text-gray-400" /><p className="mt-2 text-sm text-gray-600">اختر صورة جديدة</p><input type="file" onChange={handleImageChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" /></>

                formDataToSend.append(`images[${index}]`, image);                                )}

            });                            </div>

                        </div>

            await api.updateProduct(id as string, formDataToSend, token!);                        <div>

            setSuccess('تم تحديث المنتج بنجاح');                            <h3 className="text-lg font-semibold text-gray-800 mb-4">معرض الصور</h3>

                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">

            // Redirect after success                                <Images size={48} className="mx-auto text-gray-400" />

            setTimeout(() => {                                <p className="mt-2 text-sm text-gray-600">أضف صوراً جديدة للمعرض</p>

                router.push('/admin/products');                                <input type="file" multiple onChange={handleGalleryChange} className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" />

            }, 2000);                            </div>

                            {galleryPreviews.length > 0 && (

        } catch (error: any) {                                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">

            setError(error.message || 'خطأ في تحديث المنتج');                                    {galleryPreviews.map((preview, index) => (

        } finally {                                        <div key={index} className="relative group">

            setSubmitting(false);                                            <img src={preview} className="w-full h-24 object-cover rounded-lg" />

        }                                            <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={16} /></button>

    };                                        </div>

                                    ))}

    if (loading) {                                </div>

        return (                            )}

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">                        </div>

                <div className="text-center space-y-4">                        

                    <LoaderCircle className="w-12 h-12 animate-spin text-blue-600 mx-auto" />                        {/* Videos Section */}

                    <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>                        <div>

                </div>                            <h3 className="text-lg font-semibold text-gray-800 mb-4">فيديوهات المنتج</h3>

            </div>                            

        );                            {/* Primary Video */}

    }                            <div className="space-y-4 p-4 border border-gray-200 rounded-lg mb-4">

                                <h4 className="font-medium text-gray-700 flex items-center gap-2">

    return (                                    <Video className="h-4 w-4" />

        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">                                    الفيديو الرئيسي

            <div className="max-w-5xl mx-auto px-6">                                </h4>

                {/* Header */}                                

                <div className="mb-8">                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="flex items-center gap-4 mb-6">                                    <div>

                        <button                                        <label className="block text-sm font-medium text-gray-600 mb-1">نوع الفيديو</label>

                            onClick={() => router.back()}                                        <select 

                            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-sm"                                            value={videos.primary.type} 

                        >                                            onChange={(e) => setVideos(prev => ({ 

                            <ArrowLeft className="w-4 h-4" />                                                ...prev, 

                            العودة                                                primary: { ...prev.primary, type: e.target.value as 'youtube' | 'vimeo' | 'file' }

                        </button>                                            }))}

                    </div>                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">                                        >

                        <div className="flex items-center gap-4">                                            <option value="youtube">YouTube</option>

                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">                                            <option value="vimeo">Vimeo</option>

                                <Edit3 className="w-8 h-8 text-white" />                                            <option value="file">ملف فيديو</option>

                            </div>                                        </select>

                            <div>                                    </div>

                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">                                    

                                    تعديل المنتج                                    <div>

                                </h1>                                        <label className="block text-sm font-medium text-gray-600 mb-1">عنوان الفيديو</label>

                                <p className="text-gray-600 mt-1">قم بتعديل بيانات المنتج وحفظ التغييرات</p>                                        <input 

                            </div>                                            type="text"

                        </div>                                            value={videos.primary.title}

                    </div>                                            onChange={(e) => setVideos(prev => ({ 

                </div>                                                ...prev, 

                                                primary: { ...prev.primary, title: e.target.value }

                {/* Alerts */}                                            }))}

                {error && (                                            placeholder="عنوان الفيديو"

                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"

                        <X className="w-5 h-5 flex-shrink-0" />                                        />

                        <span>{error}</span>                                    </div>

                    </div>                                </div>

                )}                                

                                                {videos.primary.type !== 'file' ? (

                {success && (                                    <div>

                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">                                        <label className="block text-sm font-medium text-gray-600 mb-1">

                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">                                            {videos.primary.type === 'youtube' ? 'رابط YouTube' : 'رابط Vimeo'}

                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />                                        </label>

                        </svg>                                        <div className="relative">

                        <span>{success}</span>                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">

                    </div>                                                <Youtube className="h-5 w-5 text-gray-400" />

                )}                                            </div>

                                            <input 

                {/* Main Form */}                                                type="url"

                <form onSubmit={handleSubmit} className="space-y-8">                                                value={videos.primary.url}

                    {/* Basic Information Card */}                                                onChange={(e) => setVideos(prev => ({ 

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">                                                    ...prev, 

                        <div className="flex items-center gap-3 mb-6">                                                    primary: { ...prev.primary, url: e.target.value }

                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">                                                }))}

                                <FileText className="w-5 h-5 text-white" />                                                placeholder={videos.primary.type === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://vimeo.com/...'}

                            </div>                                                className="w-full border-gray-300 rounded-lg pr-10 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"

                            <h2 className="text-2xl font-bold text-gray-800">المعلومات الأساسية</h2>                                            />

                        </div>                                        </div>

                                    </div>

                        <div className="grid md:grid-cols-2 gap-6">                                ) : (

                            {/* Product Name */}                                    <div>

                            <div className="space-y-2">                                        <label className="block text-sm font-medium text-gray-600 mb-1">رفع ملف الفيديو</label>

                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">                                        <input 

                                    <Type className="w-4 h-4 text-blue-600" />                                            type="file"

                                    اسم المنتج *                                            accept="video/*"

                                </label>                                            onChange={(e) => setVideos(prev => ({ 

                                <div className="relative">                                                ...prev, 

                                    <input                                                primary: { ...prev.primary, file: e.target.files?.[0] || null }

                                        type="text"                                            }))}

                                        name="name"                                            className="w-full border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"

                                        value={formData.name}                                        />

                                        onChange={handleInputChange}                                        <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 100 ميجا. الصيغ المدعومة: mp4, mov, avi, wmv</p>

                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"                                    </div>

                                        placeholder="أدخل اسم المنتج"                                )}

                                        required                            </div>

                                    />                            

                                </div>                            {/* Action buttons for video management */}

                            </div>                            <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">

                                <p className="text-sm text-blue-700">

                            {/* SKU */}                                    💡 للإدارة المتقدمة للفيديوهات، استخدم صفحة إدارة الفيديوهات المخصصة

                            <div className="space-y-2">                                </p>

                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">                                <button

                                    <Hash className="w-4 h-4 text-blue-600" />                                    type="button"

                                    رمز المنتج (SKU)                                    onClick={() => {

                                </label>                                        const productId = window.location.pathname.split('/')[4]; // Extract product ID from URL

                                <div className="relative">                                        window.open(`/admin/products/${productId}/videos`, '_blank');

                                    <input                                    }}

                                        type="text"                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"

                                        name="sku"                                >

                                        value={formData.sku}                                    إدارة الفيديوهات

                                        onChange={handleInputChange}                                </button>

                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"                            </div>

                                        placeholder="أدخل رمز المنتج"                        </div>

                                    />                    </div>

                                </div>                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 space-y-6 self-start sticky top-24">

                            </div>                        <div>

                            <label htmlFor="regular_price" className="block text-sm font-medium text-gray-700 mb-1">السعر الأصلي (د.م.)</label>

                            {/* Price */}                            <input type="number" id="regular_price" value={product.regular_price || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />

                            <div className="space-y-2">                             {validationErrors.regular_price && <p className="text-red-500 text-xs mt-1">{validationErrors.regular_price[0]}</p>}

                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">                        </div>

                                    <DollarSign className="w-4 h-4 text-green-600" />                        <div>

                                    السعر الأساسي *                            <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">سعر التخفيض (اختياري)</label>

                                </label>                            <input type="number" id="sale_price" value={product.sale_price || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />

                                <div className="relative">                             {validationErrors.sale_price && <p className="text-red-500 text-xs mt-1">{validationErrors.sale_price[0]}</p>}

                                    <input                        </div>

                                        type="number"                         <div>

                                        name="price"                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">الكمية</label>

                                        value={formData.price}                            <input type="number" id="quantity" value={product.quantity || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50" />

                                        onChange={handleInputChange}                             {validationErrors.quantity && <p className="text-red-500 text-xs mt-1">{validationErrors.quantity[0]}</p>}

                                        step="0.01"                        </div>

                                        min="0"                        <div>

                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"                            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>

                                        placeholder="0.00"                            <select id="category_id" value={product.category_id || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50">

                                        required                                <option value="">اختر تصنيفاً</option>

                                    />                                {categories.map(cat => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}

                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">درهم</span>                            </select>

                                </div>                            {validationErrors.category_id && <p className="text-red-500 text-xs mt-1">{validationErrors.category_id[0]}</p>}

                            </div>                        </div>

                        <div>

                            {/* Sale Price */}                            <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">العلامة التجارية (اختياري)</label>

                            <div className="space-y-2">                            <select id="brand_id" value={product.brand_id || ''} onChange={handleInputChange} className="w-full border-gray-300 rounded-lg bg-gray-50">

                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">                                <option value="">بدون علامة تجارية</option>

                                    <Percent className="w-4 h-4 text-orange-600" />                                {brands.map(brand => (<option key={brand.id} value={brand.id}>{brand.name}</option>))}

                                    سعر التخفيض                            </select>

                                </label>                            {validationErrors.brand_id && <p className="text-red-500 text-xs mt-1">{validationErrors.brand_id[0]}</p>}

                                <div className="relative">                        </div>

                                    <input                    </div>

                                        type="number"                </div>

                                        name="sale_price"                {error && <p className="text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg mt-4 text-center">{error}</p>}

                                        value={formData.sale_price}                <div className="mt-8 flex justify-end">

                                        onChange={handleInputChange}                    <button type="submit" disabled={loading} className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition-colors disabled:opacity-50">

                                        step="0.01"                        {loading ? <LoaderCircle className="animate-spin" /> : <Save size={20} />}

                                        min="0"                        <span>{loading ? 'جاري التحديث...' : 'حفظ التغييرات'}</span>

                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"                    </button>

                                        placeholder="0.00 (اختياري)"                </div>

                                    />            </form>

                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">درهم</span>        </div>

                                </div>    );

                            </div>}



                            {/* Stock Quantity */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <ShoppingCart className="w-4 h-4 text-purple-600" />
                                    كمية المخزون *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="stock_quantity"
                                        value={formData.stock_quantity}
                                        onChange={handleInputChange}
                                        min="0"
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Tag className="w-4 h-4 text-blue-600" />
                                    الفئة *
                                </label>
                                <div className="relative">
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                                        required
                                    >
                                        <option value="">اختر الفئة</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Brand */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Building2 className="w-4 h-4 text-indigo-600" />
                                    الماركة (اختياري)
                                </label>
                                <div className="relative">
                                    <select
                                        name="brand_id"
                                        value={formData.brand_id}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                                    >
                                        <option value="">اختر الماركة (اختياري)</option>
                                        {brands.map(brand => (
                                            <option key={brand.id} value={brand.id}>
                                                {brand.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Package className="w-4 h-4 text-green-600" />
                                    حالة المنتج
                                </label>
                                <div className="relative">
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
                                    >
                                        <option value="active">نشط</option>
                                        <option value="inactive">غير نشط</option>
                                    </select>
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            {/* Short Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <AlignLeft className="w-4 h-4 text-blue-600" />
                                    الوصف المختصر
                                </label>
                                <textarea
                                    name="short_description"
                                    value={formData.short_description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                                    placeholder="وصف مختصر للمنتج"
                                />
                            </div>

                            {/* Full Description */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    الوصف الكامل
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                                    placeholder="وصف مفصل للمنتج"
                                />
                            </div>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        name="featured"
                                        checked={formData.featured}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                                        formData.featured 
                                            ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-500 shadow-md' 
                                            : 'bg-white border-gray-300 group-hover:border-yellow-400'
                                    }`}>
                                        {formData.featured && (
                                            <Star className="w-4 h-4 text-white" fill="currentColor" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-yellow-500" />
                                    <span className="text-gray-700 font-medium">منتج مميز</span>
                                    <span className="text-sm text-gray-500">(سيظهر في القسم المميز)</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Images Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                                <Images className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">إدارة الصور</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Main Image */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Camera className="w-4 h-4 text-green-600" />
                                    الصورة الرئيسية
                                </label>
                                
                                {/* Current Image Display */}
                                {product?.image && !imagePreview && (
                                    <div className="relative group mx-auto w-fit">
                                        <Image 
                                            src={product.image} 
                                            alt="الصورة الحالية" 
                                            width={200}
                                            height={128}
                                            className="h-32 rounded-lg object-cover" 
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm">الصورة الحالية</span>
                                        </div>
                                    </div>
                                )}

                                {/* New Image Preview */}
                                {imagePreview && (
                                    <div className="relative group mx-auto w-fit">
                                        <Image 
                                            src={imagePreview} 
                                            alt="معاينة" 
                                            width={200}
                                            height={128}
                                            className="h-32 rounded-lg object-cover" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setNewImage(null);
                                                setImagePreview('');
                                            }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-md"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                                        <UploadCloud className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="text-green-600 font-medium">اختر صورة جديدة</p>
                                        <p className="text-sm text-gray-500 mt-1">أو اسحب الصورة هنا</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Images */}
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Images className="w-4 h-4 text-green-600" />
                                    صور إضافية
                                </label>

                                {/* Current Additional Images */}
                                {product?.images && product.images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {product.images.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <Image 
                                                    src={img.image} 
                                                    alt={`صورة ${index + 1}`}
                                                    width={80}
                                                    height={60}
                                                    className="w-full h-20 object-cover rounded-lg" 
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                                    <span className="text-white text-xs">صورة حالية</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* New Images Preview */}
                                {imagesPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        {imagesPreviews.map((preview, index) => (
                                            <div key={index} className="relative">
                                                <Image 
                                                    src={preview} 
                                                    alt={`معاينة ${index + 1}`}
                                                    width={80}
                                                    height={60}
                                                    className="w-full h-20 object-cover rounded-lg" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImagesChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                                        <Images className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                        <p className="text-green-600 font-medium text-sm">إضافة صور جديدة</p>
                                        <p className="text-xs text-gray-500 mt-1">يمكن اختيار عدة صور</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Videos Section */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                                <Video className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">إدارة الفيديوهات</h2>
                        </div>

                        {/* Current Videos */}
                        {videos.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                    <Play className="w-5 h-5 text-purple-600" />
                                    الفيديوهات الحالية
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {videos.map((video) => (
                                        <div key={video.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <h4 className="font-semibold text-gray-800 mb-1">{video.title || 'فيديو بدون عنوان'}</h4>
                                                    <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                                                    <a 
                                                        href={video.video_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                                                    >
                                                        <Youtube className="w-4 h-4" />
                                                        مشاهدة الفيديو
                                                    </a>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteVideo(video.id)}
                                                    className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-sm"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Video */}
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <Video className="w-5 h-5 text-purple-600" />
                                إضافة فيديو جديد
                            </h3>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Youtube className="w-4 h-4 text-red-600" />
                                        رابط الفيديو *
                                    </label>
                                    <input
                                        type="url"
                                        value={newVideo.video_url}
                                        onChange={(e) => setNewVideo(prev => ({ ...prev, video_url: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <Type className="w-4 h-4 text-purple-600" />
                                        عنوان الفيديو
                                    </label>
                                    <input
                                        type="text"
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="عنوان الفيديو"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <AlignLeft className="w-4 h-4 text-purple-600" />
                                    وصف الفيديو
                                </label>
                                <textarea
                                    value={newVideo.description}
                                    onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                                    placeholder="وصف مختصر للفيديو"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleAddVideo}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                                <Video className="w-4 h-4" />
                                إضافة الفيديو
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex flex-col sm:flex-row gap-4 justify-end">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200"
                            >
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <>
                                        <LoaderCircle className="w-5 h-5 animate-spin" />
                                        جاري التحديث...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        حفظ التغييرات
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}