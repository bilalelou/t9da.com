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
  has_free_shipping?: boolean;
  free_shipping_note?: string;
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
  sort_order?: number;
  is_featured?: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/?$/, '') || 'http://127.0.0.1:8000/api';

const getToken = () => {
  if (typeof window === 'undefined') {
    console.log('🔑 getToken: window غير متاح (Server-side)');
    return undefined;
  }
  
  const token = localStorage.getItem('api_token');
  console.log('🔑 getToken: Token موجود:', token ? 'نعم' : 'لا');
  console.log('🔑 getToken: Token value:', token ? `${token.substring(0, 20)}...` : 'غير موجود');
  console.log('🔑 getToken: localStorage keys:', Object.keys(localStorage));
  console.log('🔑 getToken: localStorage api_token:', localStorage.getItem('api_token'));
  
  // تحقق من صحة الـ token
  if (token) {
    try {
      const tokenParts = token.split('.');
      console.log('🔑 getToken: Token parts count:', tokenParts.length);
      if (tokenParts.length === 3) {
        console.log('🔑 getToken: Token format صحيح (JWT)');
      } else {
        console.log('🔑 getToken: Token format غير صحيح');
      }
    } catch (e) {
      console.log('🔑 getToken: خطأ في تحليل Token:', e);
    }
  }
  
  return token || undefined;
};

// Debug API configuration
console.log('🌐 إعدادات API:');
console.log('  - NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('  - API_BASE:', API_BASE);

const api = {
  getProduct: async (id: string): Promise<Product> => {
    const token = getToken();
    const url = `${API_BASE}/public/products/${id}`;
    
    console.log('🔍 جلب المنتج - معلومات الطلب:');
    console.log('  - Product ID:', id);
    console.log('  - URL:', url);
    console.log('  - Token موجود:', token ? 'نعم' : 'لا');
    console.log('  - Token:', token ? `${token.substring(0, 20)}...` : 'غير موجود');
    console.log('  - استخدام Public Endpoint: نعم');
    
    const res = await fetch(url, { 
      headers: { 
        Accept: 'application/json',
        // لا نحتاج token للـ public endpoint
      } 
    });
    
    console.log('📡 استجابة API:');
    console.log('  - Status:', res.status);
    console.log('  - Status Text:', res.statusText);
    console.log('  - Headers:', Object.fromEntries(res.headers.entries()));
    
    if (!res.ok) {
      let errorMessage = 'خطأ في تحميل المنتج';
      try {
        const errorData = await res.json();
        console.log('❌ تفاصيل الخطأ:', errorData);
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        console.log('❌ لا يمكن قراءة تفاصيل الخطأ:', e);
      }
      throw new Error(`${errorMessage} (Status: ${res.status})`);
    }
    
    const data = await res.json();
    console.log('✅ بيانات المنتج المستلمة:', data);
    
    const product = (data && data.data) ? data.data : data;
    console.log('📦 المنتج المعالج:', product);
    
    // البيانات تأتي مع variants مباشرة من API
    return product;
  },
  getCategories: async (): Promise<Category[]> => {
    const url = `${API_BASE}/public/categories`;
    console.log('📂 جلب الفئات - URL:', url);
    
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    console.log('📂 استجابة الفئات - Status:', res.status);
    
    if (!res.ok) {
      console.error('❌ خطأ في جلب الفئات:', res.status, res.statusText);
      throw new Error('خطأ في تحميل الفئات');
    }
    
    const data = await res.json();
    console.log('📂 بيانات الفئات:', data);
    return Array.isArray(data?.data) ? data.data : data;
  },
  getBrands: async (): Promise<Brand[]> => {
    const url = `${API_BASE}/public/brands`;
    console.log('🏷️ جلب الماركات - URL:', url);
    
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    console.log('🏷️ استجابة الماركات - Status:', res.status);
    
    if (!res.ok) {
      console.error('❌ خطأ في جلب الماركات:', res.status, res.statusText);
      throw new Error('خطأ في تحميل الماركات');
    }
    
    const data = await res.json();
    console.log('🏷️ بيانات الماركات:', data);
    return Array.isArray(data?.data) ? data.data : data;
  },
  getProductVariants: async (productId: string, token?: string): Promise<ProductVariant[]> => {
    const url = `${API_BASE}/product-variants?product_id=${productId}`;
    console.log('🔄 جلب متغيرات المنتج:');
    console.log('  - Product ID:', productId);
    console.log('  - URL:', url);
    console.log('  - Token موجود:', token ? 'نعم' : 'لا');
    
    const res = await fetch(url, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: 'application/json',
      },
    });
    
    console.log('🔄 استجابة متغيرات المنتج - Status:', res.status);
    
    if (!res.ok) {
      console.error('❌ خطأ في جلب متغيرات المنتج:', res.status, res.statusText);
      throw new Error('خطأ في تحميل متغيرات المنتج');
    }
    
    const data = await res.json();
    console.log('🔄 بيانات متغيرات المنتج:', data);
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
    has_free_shipping: false,
    free_shipping_note: '',
  });

  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);

  const [videos, setVideos] = useState<ProductVideo[]>([]);
  const [newVideo, setNewVideo] = useState<VideoData>({ 
    video_url: '', 
    title: '', 
    description: '', 
    sort_order: 0, 
    is_featured: false 
  });
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Product variants state
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);

  // toast will show transient messages; no local banners needed

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      console.log('🚀 بدء تحميل بيانات المنتج...');
      console.log('  - Product ID:', id);
      console.log('  - API Base:', API_BASE);
      console.log('  - Window location:', typeof window !== 'undefined' ? window.location.href : 'غير متاح');
      console.log('  - Current URL:', typeof window !== 'undefined' ? window.location.pathname : 'غير متاح');
      
      // تحقق من الـ token قبل البدء
      const token = getToken();
      console.log('🔑 Token قبل البدء:', token ? 'موجود' : 'غير موجود');
      
      if (!id) {
        console.log('❌ لا يوجد Product ID');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('📥 جلب البيانات...');
        
        const [p, cats, brs] = await Promise.all([api.getProduct(id), api.getCategories(), api.getBrands()]);
        
        if (cancelled) {
          console.log('⚠️ تم إلغاء العملية');
          return;
        }
        
        console.log('✅ تم جلب البيانات بنجاح:');
        console.log('  - Product:', p);
        console.log('  - Categories:', cats);
        console.log('  - Brands:', brs);
        
        setProduct(p);
        setCategories(cats);
        setBrands(brs);
        setVideos(p.videos || []);
        
        // Load product variants if the product has variants
        if (p.has_variants) {
          console.log('🔄 جلب متغيرات المنتج...');
          try {
            const variants = await api.getProductVariants(id, getToken());
            console.log('✅ متغيرات المنتج:', variants);
            setProductVariants(variants);
          } catch (error) {
            console.error('❌ خطأ في جلب متغيرات المنتج:', error);
          }
        } else {
          console.log('ℹ️ المنتج لا يحتوي على متغيرات');
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
          has_free_shipping: !!p.has_free_shipping,
          free_shipping_note: p.free_shipping_note || '',
        });
        if (p.thumbnail) {
          setThumbnailPreview(p.thumbnail);
        }
      } catch (e) {
        console.error('❌ خطأ في تحميل بيانات المنتج:', e);
        console.error('  - Error type:', typeof e);
        console.error('  - Error message:', e instanceof Error ? e.message : 'Unknown error');
        console.error('  - Error stack:', e instanceof Error ? e.stack : 'No stack trace');
        
        // showToast already called
        showToast('خطأ في تحميل بيانات المنتج', 'error');
      } finally {
        if (!cancelled) {
          console.log('🏁 انتهاء تحميل البيانات');
          setLoading(false);
        }
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

  // Clean up video preview URL on unmount
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const handleVideoFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      // Auto-fill title with filename
      if (!newVideo.title) {
        setNewVideo(prev => ({ 
          ...prev, 
          title: file.name.replace(/\.[^/.]+$/, '') // Remove extension
        }));
      }
    }
  };

  const handleAddVideo = async () => {
    if (!id) return;
    
    // تحقق من وجود ملف فيديو أو رابط
    if (!selectedVideoFile && !newVideo.video_url.trim()) {
      showToast('يرجى اختيار ملف فيديو أو إدخال رابط', 'error');
      return;
    }
    
    // تحقق من وجود عنوان
    if (!newVideo.title.trim()) {
      showToast('يرجى إدخال عنوان للفيديو', 'error');
      return;
    }
    
    setUploadingVideo(true);
    
    console.log('بدء رفع الفيديو...', {
      hasFile: !!selectedVideoFile,
      fileName: selectedVideoFile?.name,
      title: newVideo.title,
      apiEndpoint: `${API_BASE}/products/${id}/videos/upload`
    });
    
    try {
      // إذا كان هناك ملف محلي، رفعه أولاً
      if (selectedVideoFile) {
        const formData = new FormData();
        formData.append('video_file', selectedVideoFile);
        formData.append('title', newVideo.title);
        formData.append('description', newVideo.description);
        formData.append('sort_order', String(newVideo.sort_order || 0));
        formData.append('is_featured', newVideo.is_featured ? '1' : '0'); // تصحيح: إرسال 1 أو 0 بدلاً من true/false
        
        console.log('إرسال البيانات...', {
          fileSize: selectedVideoFile.size,
          fileType: selectedVideoFile.type,
          is_featured: newVideo.is_featured ? '1' : '0'
        });
        
        // Call API to upload video file
        const response = await fetch(`${API_BASE}/products/${id}/videos/upload`, {
          method: 'POST',
          headers: {
            ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
            Accept: 'application/json',
          },
          body: formData,
        });
        
        console.log('استجابة الخادم:', response.status, response.statusText);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('خطأ من الخادم:', errorText);
          throw new Error(`خطأ في رفع الفيديو: ${response.status} - ${errorText}`);
        }
        
        const uploadedVideo = await response.json();
        console.log('تم رفع الفيديو بنجاح - استجابة الخادم:', uploadedVideo);
        console.log('بيانات الفيديو:', uploadedVideo.data);
        
        // Validate video response structure
        if (uploadedVideo && uploadedVideo.success && uploadedVideo.data) {
          const videoData = uploadedVideo.data;
          if (videoData.id && videoData.video_url) {
            setVideos((prev) => [...prev, videoData]);
          } else {
            console.error('Invalid video data structure:', videoData);
            throw new Error('بيانات الفيديو غير مكتملة');
          }
        } else {
          console.error('Invalid video response:', uploadedVideo);
          throw new Error('استجابة غير صحيحة من الخادم');
        }
      } else {
        // استخدام رابط مباشر
        console.log('استخدام رابط مباشر...');
        const video = await api.addVideo(id, newVideo, getToken());
        console.log('استجابة إضافة فيديو URL:', video);
        console.log('بيانات الفيديو:', video.data);
        
        // Validate video response structure
        if (video && video.success && video.data) {
          const videoData = video.data;
          if (videoData.id) {
            setVideos((prev) => [...prev, videoData]);
          } else {
            console.error('Invalid video data structure:', videoData);
            throw new Error('بيانات الفيديو غير مكتملة');
          }
        } else {
          console.error('Invalid video response:', video);
          throw new Error('استجابة غير صحيحة من الخادم');
        }
      }
      
      // Reset form
      setNewVideo({ 
        video_url: '', 
        title: '', 
        description: '', 
        sort_order: 0, 
        is_featured: false 
      });
      setSelectedVideoFile(null);
      setVideoPreview('');
      showToast('تم إضافة الفيديو بنجاح', 'success');
    } catch (e) {
      console.error('خطأ في إضافة الفيديو:', e);
      showToast(`خطأ في إضافة الفيديو: ${e instanceof Error ? e.message : 'خطأ غير معروف'}`, 'error');
    } finally {
      setUploadingVideo(false);
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
      // إرسال الصور الجديدة كـ array
      newImages.forEach((img) => fd.append('new_images[]', img));

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

          {/* Free Shipping Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">إعدادات الشحن</h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <input
                  type="checkbox"
                  name="has_free_shipping"
                  checked={formData.has_free_shipping}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mt-1"
                />
                <div className="flex-1">
                  <label className="flex items-center gap-2 text-lg font-semibold text-gray-800 cursor-pointer">
                    <Package className="w-5 h-5 text-green-600" />
                    تفعيل الشحن المجاني لهذا المنتج
                  </label>
                  <p className="text-gray-600 mt-2">
                    عند تفعيل هذا الخيار، لن يتم تطبيق رسوم الشحن على هذا المنتج
                  </p>
                </div>
              </div>

              {formData.has_free_shipping && (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <FileText className="w-4 h-4 text-green-600" />
                    ملاحظة الشحن المجاني (اختياري)
                  </label>
                  <textarea
                    name="free_shipping_note"
                    value={formData.free_shipping_note}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
                    placeholder="مثال: شحن مجاني لجميع أنحاء المغرب"
                  />
                  <p className="text-gray-500 text-sm flex items-center gap-1">
                    <span>هذه الملاحظة ستظهر للعملاء مع المنتج</span>
                  </p>
                </div>
              )}
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
              <h2 className="text-2xl font-bold text-gray-800">إدارة الفيديوهات المحلية</h2>
            </div>

            {videos.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-purple-600" />الفيديوهات المحفوظة
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {videos.filter(video => video && video.id).map((video) => (
                    <div key={video.id} className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">{video.title || 'فيديو بدون عنوان'}</h4>
                          <p className="text-sm text-gray-600 mb-2">{video.description || 'لا يوجد وصف'}</p>
                          <div className="bg-gray-800 rounded-lg p-2 mb-2">
                            {video.video_url ? (
                              <video 
                                src={video.video_url} 
                                controls 
                                className="w-full h-32 object-cover rounded"
                                preload="metadata"
                              >
                                متصفحك لا يدعم تشغيل الفيديو
                              </video>
                            ) : (
                              <div className="w-full h-32 bg-gray-600 rounded flex items-center justify-center text-gray-300 text-sm">
                                فيديو غير متوفر
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">الملف: {video.video_url ? video.video_url.split('/').pop() : 'ملف غير محدد'}</p>
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
                <Video className="w-5 h-5 text-purple-600" />رفع فيديو محلي جديد
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Camera className="w-4 h-4 text-purple-600" />اختيار ملف الفيديو *
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="border-2 border-dashed border-purple-300 rounded-xl p-6 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-200 cursor-pointer">
                      <Video className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                      <p className="text-purple-600 font-medium">
                        {selectedVideoFile ? `تم اختيار: ${selectedVideoFile.name}` : 'اختر ملف فيديو'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">MP4, AVI, MOV, WebM (حد أقصى 100MB)</p>
                    </div>
                  </div>
                  
                  {/* Video Preview */}
                  {videoPreview && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">معاينة الفيديو:</p>
                      <video 
                        src={videoPreview} 
                        controls 
                        className="w-full max-w-md h-48 rounded-lg border-2 border-purple-200"
                      />
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Type className="w-4 h-4 text-purple-600" />عنوان الفيديو *
                    </label>
                    <input
                      type="text"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo((prev) => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                      placeholder="عنوان الفيديو"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Hash className="w-4 h-4 text-purple-600" />ترتيب العرض
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newVideo.sort_order || 0}
                      onChange={(e) => setNewVideo(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-200 text-gray-800 placeholder-gray-400"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
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

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={newVideo.is_featured || false}
                        onChange={(e) => setNewVideo(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="sr-only" 
                      />
                      <div className={`w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
                        newVideo.is_featured 
                          ? 'bg-purple-500 border-purple-500' 
                          : 'bg-white border-gray-300 group-hover:border-purple-400'
                      }`}>
                        {newVideo.is_featured && (
                          <Star className="w-4 h-4 text-white fill-current" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-purple-500" />
                      <span className="text-gray-700 font-medium">فيديو مميز</span>
                      <span className="text-sm text-gray-500">(سيظهر أولاً في المعرض)</span>
                    </div>
                  </label>
                </div>

                <button 
                  type="button" 
                  onClick={handleAddVideo} 
                  disabled={uploadingVideo}
                  className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingVideo ? (
                    <>
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      جاري رفع الفيديو...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" />
                      رفع وحفظ الفيديو
                    </>
                  )}
                </button>
              </div>
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
