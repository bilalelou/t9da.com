'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

// Icons
import { 
    Package, 
    DollarSign, 
    Save, 
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
    Play,
    Edit3,
    ArrowLeft
} from 'lucide-react';

// Types
interface Product {
    id: number;
    name: string;
    description: string;
    short_description: string;
    price: number;
    sale_price: number;
    sku: string;
    stock_quantity: number;
    category_id: number;
    brand_id?: number;
    featured: boolean;
    status: string;
    image: string;
    images?: ProductImage[];
    videos?: ProductVideo[];
}

interface ProductImage {
    id: number;
    image: string;
}

interface ProductVideo {
    id: number;
    video_url: string;
    title: string;
    description: string;
}

interface Category {
    id: number;
    name: string;
}

interface Brand {
    id: number;
    name: string;
}

// API Functions
const API_BASE = 'http://localhost:8000/api';

const api = {
    getProduct: async (id: string): Promise<Product> => {
        const res = await fetch(`${API_BASE}/products/${id}`);
        if (!res.ok) throw new Error('خطأ في تحميل المنتج');
        return res.json();
    },

    getCategories: async () => {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('خطأ في تحميل الفئات');
        return res.json();
    },

    getBrands: async () => {
        const res = await fetch(`${API_BASE}/brands`);
        if (!res.ok) throw new Error('خطأ في تحميل الماركات');
        return res.json();
    },

    updateProduct: async (id: string, productData: FormData, token: string) => {
        const res = await fetch(`${API_BASE}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: productData,
        });
        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'خطأ في تحديث المنتج');
        }
        return res.json();
    },

    addVideo: async (productId: string, videoData: any, token: string) => {
        const res = await fetch(`${API_BASE}/products/${productId}/videos`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(videoData),
        });
        if (!res.ok) throw new Error('خطأ في إضافة الفيديو');
        return res.json();
    },

    deleteVideo: async (productId: string, videoId: number, token: string) => {
        const res = await fetch(`${API_BASE}/products/${productId}/videos/${videoId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });
        if (!res.ok) throw new Error('خطأ في حذف الفيديو');
    }
};

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();

    // Product States
    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form States
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        short_description: '',
        price: '',
        sale_price: '',
        sku: '',
        stock_quantity: '',
        category_id: '',
        brand_id: '',
        featured: false,
        status: 'active'
    });

    // Image States
    const [newImage, setNewImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [newImages, setNewImages] = useState<File[]>([]);
    const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

    // Video States
    const [videos, setVideos] = useState<ProductVideo[]>([]);
    const [newVideo, setNewVideo] = useState({
        video_url: '',
        title: '',
        description: ''
    });

    // Error & Success States
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [productData, categoriesData, brandsData] = await Promise.all([
                    api.getProduct(id as string),
                    api.getCategories(),
                    api.getBrands()
                ]);

                setProduct(productData);
                setCategories(categoriesData);
                setBrands(brandsData);
                setVideos(productData.videos || []);

                // Set form data
                setFormData({
                    name: productData.name || '',
                    description: productData.description || '',
                    short_description: productData.short_description || '',
                    price: productData.price?.toString() || '',
                    sale_price: productData.sale_price?.toString() || '',
                    sku: productData.sku || '',
                    stock_quantity: productData.stock_quantity?.toString() || '',
                    category_id: productData.category_id?.toString() || '',
                    brand_id: productData.brand_id?.toString() || '',
                    featured: productData.featured || false,
                    status: productData.status || 'active'
                });

            } catch (error) {
                setError('خطأ في تحميل البيانات');
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id && token) {
            loadData();
        }
    }, [id, token]);

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Handle main image change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewImage(file);
            const reader = new FileReader();
            reader.onload = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Handle additional images
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setNewImages(files);
        
        const previews = files.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise<string>((resolve) => {
                reader.onload = () => resolve(reader.result as string);
            });
        });
        
        Promise.all(previews).then(setImagesPreviews);
    };

    // Handle video addition
    const handleAddVideo = async () => {
        if (!newVideo.video_url.trim()) {
            setError('يرجى إدخال رابط الفيديو');
            return;
        }

        try {
            const videoData = await api.addVideo(id as string, newVideo, token!);
            setVideos(prev => [...prev, videoData]);
            setNewVideo({ video_url: '', title: '', description: '' });
            setSuccess('تم إضافة الفيديو بنجاح');
        } catch (error) {
            setError('خطأ في إضافة الفيديو');
        }
    };

    // Handle video deletion
    const handleDeleteVideo = async (videoId: number) => {
        try {
            await api.deleteVideo(id as string, videoId, token!);
            setVideos(prev => prev.filter(v => v.id !== videoId));
            setSuccess('تم حذف الفيديو بنجاح');
        } catch (error) {
            setError('خطأ في حذف الفيديو');
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const formDataToSend = new FormData();
            
            // Add form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value.toString());
                }
            });

            // Add main image if selected
            if (newImage) {
                formDataToSend.append('image', newImage);
            }

            // Add additional images
            newImages.forEach((image, index) => {
                formDataToSend.append(`images[${index}]`, image);
            });

            await api.updateProduct(id as string, formDataToSend, token!);
            setSuccess('تم تحديث المنتج بنجاح');
            
            // Redirect after success
            setTimeout(() => {
                router.push('/admin/products');
            }, 2000);

        } catch (error: any) {
            setError(error.message || 'خطأ في تحديث المنتج');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <LoaderCircle className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium">جاري تحميل البيانات...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
            <div className="max-w-5xl mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/90 transition-all duration-200 text-gray-700 hover:text-gray-900 shadow-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            العودة
                        </button>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Edit3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                    تعديل المنتج
                                </h1>
                                <p className="text-gray-600 mt-1">قم بتعديل بيانات المنتج وحفظ التغييرات</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                        <X className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-3">
                        <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}

                {/* Main Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">المعلومات الأساسية</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Product Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Type className="w-4 h-4 text-blue-600" />
                                    اسم المنتج *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="أدخل اسم المنتج"
                                        required
                                    />
                                </div>
                            </div>

                            {/* SKU */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Hash className="w-4 h-4 text-blue-600" />
                                    رمز المنتج (SKU)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="sku"
                                        value={formData.sku}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="أدخل رمز المنتج"
                                    />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    السعر الأساسي *
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="0.00"
                                        required
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">درهم</span>
                                </div>
                            </div>

                            {/* Sale Price */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                    <Percent className="w-4 h-4 text-orange-600" />
                                    سعر التخفيض
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="sale_price"
                                        value={formData.sale_price}
                                        onChange={handleInputChange}
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                                        placeholder="0.00 (اختياري)"
                                    />
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">درهم</span>
                                </div>
                            </div>

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