'use client';

import { useEffect, useState, createContext, useContext, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import ProductVariantsManager from '@/components/admin/ProductVariantsManager';

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
  ArrowLeft,
} from 'lucide-react';

interface ProductVideo {
  id: number;
  video_url: string;
  title: string;
  description: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  regular_price: number;
  sale_price: number;
  sku: string;
  quantity: number;
  category_id: number;
  brand_id?: number;
  featured: boolean;
  has_variants?: boolean;
  status: string;
  thumbnail: string | null;
  images?: string[];
  videos?: ProductVideo[];
  variants?: ProductVariant[];
}

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
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

interface VideoData {
  video_url: string;
  title: string;
  description: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/?$/, '') || 'http://127.0.0.1:8000/api';

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('api_token') || undefined : undefined);

const api = {
  getProduct: async (id: string): Promise<Product> => {
    const res = await fetch(`${API_BASE}/test/products/${id}`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('خطأ في تحميل المنتج');
    const data = await res.json();
    const product = (data && data.data) ? data.data : data;
    
    // البيانات تأتي مع variants مباشرة من API
    return product;
  },
  getCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_BASE}/test/categories`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('خطأ في تحميل الفئات');
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : data;
  },
  getBrands: async (): Promise<Brand[]> => {
    const res = await fetch(`${API_BASE}/test/brands`, { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('خطأ في تحميل الماركات');
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : data;
  },
  getProductVariants: async (productId: string, token?: string): Promise<ProductVariant[]> => {
    const res = await fetch(`${API_BASE}/product-variants?product_id=${productId}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error('خطأ في تحميل متغيرات المنتج');
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  },
  updateProduct: async (id: string, productData: FormData, token?: string) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
      },
      body: (() => {
        const fd = new FormData();
        productData.forEach((v, k) => fd.append(k, v));
        fd.append('_method', 'PUT');
        return fd;
      })(),
    });
    if (!res.ok) {
      let message = 'خطأ في تحديث المنتج';
      try {
        const err = await res.json();
        message = err.message || message;
      } catch {}
      throw new Error(message);
    }
    return res.json();
  },
  addVideo: async (productId: string, videoData: VideoData, token?: string) => {
    const res = await fetch(`${API_BASE}/products/${productId}/videos`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(videoData),
    });
    if (!res.ok) throw new Error('خطأ في إضافة الفيديو');
    return res.json();
  },
  deleteVideo: async (productId: string, videoId: number, token?: string) => {
    const res = await fetch(`${API_BASE}/products/${productId}/videos/${videoId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
      },
    });
    if (!res.ok) throw new Error('خطأ في حذف الفيديو');
  },
};

// Local Toast (to avoid cross-layout dependency)
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const useLocalToast = () => useContext(ToastContext);
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' });
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, visible: true, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
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

function EditProductPageInner() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const router = useRouter();
  // const { token } = useAuth();
  const { showToast } = useLocalToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    short_description: '',
    regular_price: '',
    sale_price: '',
    sku: '',
    quantity: '',
    category_id: '',
    brand_id: '',
    featured: false,
    status: 'active',
  });

  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [newVideo, setNewVideo] = useState<VideoData>({ video_url: '', title: '', description: '' });

  // Product variants state
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);

  // toast will show transient messages; no local banners needed

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [p, cats, brs] = await Promise.all([api.getProduct(id), api.getCategories(), api.getBrands()]);
        if (cancelled) return;
        setProduct(p);
        setCategories(cats);
        setBrands(brs);
        setVideos(p.videos || []);
        
        // Load product variants if the product has variants
        if (p.has_variants) {
          try {
            const variants = await api.getProductVariants(id, getToken());
            setProductVariants(variants);
          } catch (error) {
            console.error('Error loading variants:', error);
          }
        }
        
        setFormData({
          name: p.name || '',
          description: p.description || '',
          short_description: p.short_description || '',
          regular_price: p.regular_price != null ? String(p.regular_price) : '',
          sale_price: p.sale_price != null ? String(p.sale_price) : '',
          sku: p.sku || '',
          quantity: p.quantity != null ? String(p.quantity) : '',
          category_id: p.category_id != null ? String(p.category_id) : '',
          brand_id: p.brand_id != null ? String(p.brand_id) : '',
          featured: !!p.featured,
          status: p.status || 'active',
        });
        if (p.thumbnail) {
          setThumbnailPreview(p.thumbnail);
        }
      } catch (e) {
        console.error(e);
        // showToast already called
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, showToast]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewThumbnail(file);
      const reader = new FileReader();
      reader.onload = () => setThumbnailPreview(String(reader.result || ''));
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(files);
    const previews = files.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.readAsDataURL(file);
        })
    );
    Promise.all(previews).then(setImagesPreviews);
  };

  const handleAddVideo = async () => {
    if (!id) return;
    if (!newVideo.video_url.trim()) {
      showToast('يرجى إدخال رابط الفيديو', 'error');
      return;
    }
    try {
      const video = await api.addVideo(id, newVideo, getToken());
      setVideos((prev) => [...prev, video]);
      setNewVideo({ video_url: '', title: '', description: '' });
      showToast('تم إضافة الفيديو بنجاح', 'success');
    } catch (e) {
      console.error(e);
      showToast('خطأ في إضافة الفيديو', 'error');
    }
  };

  const handleDeleteVideo = async (videoId: number) => {
    if (!id) return;
    try {
      await api.deleteVideo(id, videoId, getToken());
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      showToast('تم حذف الفيديو بنجاح', 'success');
    } catch (e) {
      console.error(e);
      showToast('خطأ في حذف الفيديو', 'error');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      if (newThumbnail) fd.append('thumbnail', newThumbnail);
      newImages.forEach((img, i) => fd.append(`new_images[${i}]`, img));

      // Keep existing images
      if (product?.images) {
        const existingImages = product.images.filter(img => !imagesPreviews.includes(img));
        fd.append('existing_images', JSON.stringify(existingImages));
      }
      
      await api.updateProduct(id, fd, getToken());
      showToast('تم تحديث المنتج بنجاح', 'success');
      setTimeout(() => router.push('/admin/products'), 1200);
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : 'خطأ في تحديث المنتج';
      showToast(message, 'error');
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">تعديل المنتج</h1>
                <p className="text-gray-600 mt-1">قم بتعديل بيانات المنتج وحفظ التغييرات</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">المعلومات الأساسية</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Type className="w-4 h-4 text-blue-600" />
                  اسم المنتج *
                </label>
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Hash className="w-4 h-4 text-blue-600" />
                  رمز المنتج (SKU)
                </label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  placeholder="أدخل رمز المنتج"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  السعر الأساسي *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="regular_price"
                    value={formData.regular_price}
                    onChange={handleInputChange}
                    step="0.01"
                    min={0}
                    className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder="0.00"
                    required
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">درهم</span>
                </div>
              </div>

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
                    min={0}
                    className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder="0.00 (اختياري)"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">درهم</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                  كمية المخزون *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                  placeholder="0"
                  required
                />
              </div>

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
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

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
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

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
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
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

              <div className="mt-6 pt-6 border-t border-gray-200 md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} className="sr-only" />
                    <div
                      className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        formData.featured
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 border-yellow-500 shadow-md'
                          : 'bg-white border-gray-300 group-hover:border-yellow-400'
                      }`}
                    >
                      {formData.featured && <Star className="w-4 h-4 text-white" fill="currentColor" />}
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
          </div>

          {/* Product Variants Management */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <ProductVariantsManager 
              onVariantsChange={setProductVariants}
              initialVariants={productVariants}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Images className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">إدارة الصور</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Camera className="w-4 h-4 text-green-600" />الصورة المصغرة
                </label>
                {thumbnailPreview ? (
                  <div className="relative group mx-auto w-fit">
                    <Image src={thumbnailPreview} alt="معاينة" width={200} height={128} className="h-32 rounded-lg object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setNewThumbnail(null);
                        setThumbnailPreview('');
                        // If there was an original product thumbnail, restore it
                        if (product?.thumbnail) {
                          setThumbnailPreview(product.thumbnail);
                        }
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-md"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                   <div className="h-32 w-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">لا توجد صورة مصغرة</p>
                   </div>
                )}
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium">اختر صورة جديدة</p>
                    <p className="text-sm text-gray-500 mt-1">أو اسحب الصورة هنا</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Images className="w-4 h-4 text-green-600" />صور إضافية
                </label>
                {product?.images && product.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.map((imgUrl, index) => (
                      <div key={index} className="relative group">
                        <Image src={imgUrl} alt={`صورة ${index + 1}`} width={80} height={60} className="w-full h-20 object-cover rounded-lg" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                          <span className="text-white text-xs">صورة حالية</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {imagesPreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    {imagesPreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <Image src={preview} alt={`معاينة ${index + 1}`} width={80} height={60} className="w-full h-20 object-cover rounded-lg" />
                      </div>
                    ))}
                  </div>
                )}
                <div className="relative">
                  <input type="file" accept="image/*" multiple onChange={handleImagesChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-400 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                    <Images className="w-6 h-6 text-green-500 mx-auto mb-2" />
                    <p className="text-green-600 font-medium text-sm">إضافة صور جديدة</p>
                    <p className="text-xs text-gray-500 mt-1">يمكن اختيار عدة صور</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <Video className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">إدارة الفيديوهات</h2>
            </div>

            {videos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-600" />الفيديوهات الحالية
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{video.title || 'فيديو بدون عنوان'}</h4>
                          <p className="text-sm text-gray-600 mb-2">{video.description}</p>
                          <a href={video.video_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1">
                            <Youtube className="w-4 h-4" />
                            مشاهدة الفيديو
                          </a>
                        </div>
                        <button type="button" onClick={() => handleDeleteVideo(video.id)} className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors duration-200 shadow-sm">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-600" />إضافة فيديو جديد
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Youtube className="w-4 h-4 text-red-600" />رابط الفيديو *
                  </label>
                  <input
                    type="url"
                    value={newVideo.video_url}
                    onChange={(e) => setNewVideo((prev) => ({ ...prev, video_url: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Type className="w-4 h-4 text-purple-600" />عنوان الفيديو
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    placeholder="عنوان الفيديو"
                  />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <AlignLeft className="w-4 h-4 text-purple-600" />وصف الفيديو
                </label>
                <textarea
                  value={newVideo.description}
                  onChange={(e) => setNewVideo((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                  placeholder="وصف مختصر للفيديو"
                />
              </div>
              <button type="button" onClick={handleAddVideo} className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center gap-2 font-medium shadow-md hover:shadow-lg">
                <Video className="w-4 h-4" />
                إضافة الفيديو
              </button>
            </div>
          </div>

          {/* Product Variants Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <ProductVariantsManager
              initialVariants={product?.variants || []}
              onVariantsChange={(variants) => {
                // يمكن إضافة logic هنا لحفظ الـ variants
                console.log('Variants updated:', variants);
              }}
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button type="button" onClick={() => router.back()} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border border-gray-200">
                إلغاء
              </button>
              <button type="submit" disabled={submitting} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center gap-3 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
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

export default function EditProductPage() {
  return (
    <ToastProvider>
      <EditProductPageInner />
    </ToastProvider>
  );
}