"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { ShoppingCart, LoaderCircle, Star, CheckCircle, Heart, Share2 } from 'lucide-react';

// --- واجهات البيانات (Interfaces) ---
interface Product {
  id: number;
  name: string;
  slug: string;
  regular_price: number;
  sale_price?: number;
  image: string;
  images?: string[];
  short_description: string;
  description?: string;
  category: string; 
  brand: string;
  colors: string[];
  sizes: string[];
  SKU: string;
  tags: string[];
}

// --- نظام التنبيهات (Toast Notification System) ---
const ToastContext = createContext<{ showToast: (message: string) => void }>({ showToast: () => {} });

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => { setToast({ message: '', visible: false }); }, 3000);
    };
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div className="fixed bottom-10 right-10 bg-gray-800 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-50 animate-fade-in-up">
                    <CheckCircle size={22} className="text-green-400" />
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};
const useToast = () => useContext(ToastContext);

// --- Hook مخصص لجلب البيانات ---
const useFetchData = <T,>(fetcher: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const memoizedFetcher = useCallback(fetcher, []);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await memoizedFetcher();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [memoizedFetcher]);

    return { data, loading, error };
};

// --- المكونات ---

const formatCurrency = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) return '';
  return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

// --- بطاقة منتج مصغرة للمنتجات ذات الصلة ---
const MiniProductCard = ({ product }: { product: Product }) => {
    return (
        <div className="border rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-lg">
            <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden p-2">
                <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div className="p-3 bg-white">
                <h4 className="font-semibold text-sm truncate text-gray-800">{product.name}</h4>
                <p className="text-[#1e81b0] text-lg font-bold mt-1">{formatCurrency(product.regular_price)}</p>
            </div>
        </div>
    );
};

// --- صفحة تفاصيل المنتج ---
const ProductDetailPage = ({ product, allProducts }: { product: Product; allProducts: Product[] }) => {
    const { showToast } = useToast();
    const [mainImage, setMainImage] = useState(product.image);
    
    useEffect(() => {
        setMainImage(product.image);
    }, [product]);

    const handleAddToCartClick = () => {
        showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
    };
    
    const allImages = [product.image, ...(product.images || [])].filter(img => img);

    const relatedProducts = useMemo(() => {
        return allProducts
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4); // عرض 4 منتجات ذات صلة
    }, [allProducts, product]);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* معرض الصور */}
                <div>
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <img src={mainImage} alt={product.name} className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105" style={{aspectRatio: '1/1'}} />
                    </div>
                    <div className="flex gap-2">
                        {allImages.map((img, index) => (
                            <div key={index} onClick={() => setMainImage(img)} className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer ${mainImage === img ? 'border-blue-500 border-2' : ''}`}>
                                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
                {/* تفاصيل المنتج */}
                <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
                    <div className="flex items-center mb-6">
                        <div className="flex text-yellow-400">
                            <Star size={20} fill="currentColor" />
                            <Star size={20} fill="currentColor" />
                            <Star size={20} fill="currentColor" />
                            <Star size={20} fill="currentColor" />
                            <Star size={20} className="text-gray-300" fill="currentColor" />
                        </div>
                        <span className="text-gray-500 ml-2">(12 تقييم)</span>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">{product.description || product.short_description}</p>
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="flex items-baseline gap-4 mb-6">
                            {product.sale_price ? (
                                <>
                                    <span className="text-4xl font-bold text-[#eab676]">{formatCurrency(product.sale_price)}</span>
                                    <span className="text-xl text-gray-400 line-through">{formatCurrency(product.regular_price)}</span>
                                </>
                            ) : (
                                <span className="text-4xl font-bold text-[#1e81b0]">{formatCurrency(product.regular_price)}</span>
                            )}
                        </div>
                        <button onClick={handleAddToCartClick} className="w-full bg-[#1e81b0] text-white font-bold py-4 px-8 rounded-lg hover:bg-opacity-90 transition-transform hover:scale-105 flex items-center justify-center gap-3">
                            <ShoppingCart size={22} />
                            <span>أضف إلى السلة</span>
                        </button>
                    </div>
                    {/* قسم المعلومات الإضافية */}
                    <div className="mt-6 border-t pt-6">
                        <button className="flex items-center gap-2 text-gray-600 hover:text-red-500 mb-4">
                            <Heart size={18} />
                            <span>أضف إلى المفضلة</span>
                        </button>
                        <button className="flex items-center gap-2 text-gray-600 hover:text-blue-500 mb-4">
                            <Share2 size={18} />
                            <span>مشاركة</span>
                        </button>
                        <div className="text-sm text-gray-500 space-y-2 mt-4">
                            <p><span className="font-semibold text-gray-700">SKU:</span> {product.SKU}</p>
                            <p><span className="font-semibold text-gray-700">التصنيف:</span> <span className="capitalize">{product.category}</span></p>
                            <p><span className="font-semibold text-gray-700">الماركة:</span> <span className="capitalize">{product.brand}</span></p>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-gray-700">الوسوم:</span>
                                {product.tags.map(tag => (
                                    <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs capitalize">{tag}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* قسم المنتجات ذات الصلة */}
            {relatedProducts.length > 0 && (
                <div className="mt-20 pt-10 border-t">
                    <h2 className="text-3xl font-bold text-center mb-8">منتجات قد تعجبك</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(relatedProduct => (
                            <MiniProductCard key={relatedProduct.id} product={relatedProduct} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- API ---
const API_BASE_URL = 'http://localhost:8000/api';

const handleApiError = (error: any) => {
    console.error('API Error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) throw new Error('خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم المحلي.');
    throw error;
};

const api = {
    productAdapter: (apiProduct: any): Product => ({
        id: apiProduct.id,
        name: apiProduct.name || 'منتج بدون اسم',
        slug: apiProduct.slug || '',
        regular_price: parseFloat(apiProduct.regular_price) || 0,
        sale_price: apiProduct.sale_price != null ? parseFloat(apiProduct.sale_price) : undefined,
        image: apiProduct.image ? `${API_BASE_URL.replace('/api', '')}/storage/uploads/${apiProduct.image}` : 'https://placehold.co/400x400?text=No+Image',
        images: apiProduct.images ? (typeof apiProduct.images === 'string' ? apiProduct.images.split(',') : apiProduct.images).map((img: string) => `${API_BASE_URL.replace('/api', '')}/storage/uploads/${img.trim()}`) : [],
        short_description: apiProduct.short_description || 'وصف غير متوفر',
        description: apiProduct.description || 'وصف كامل ومفصل للمنتج.',
        category: apiProduct.category?.slug || 'uncategorized',
        brand: apiProduct.brand?.name || 'Unknown',
        colors: apiProduct.colors || ['#ffffff', '#000000'],
        sizes: apiProduct.sizes || ['M', 'L'],
        SKU: apiProduct.SKU || 'N/A',
        tags: apiProduct.tags || ['new', 'sale', 'hot'], // بيانات وهمية للوسوم
    }),
    
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch products`);
            const responseData = await response.json();
            const productList = responseData.data || [];
            return Array.isArray(productList) ? productList.map(p => api.productAdapter(p)) : [];
        } catch (error) { handleApiError(error); return []; }
    },
}

// --- المكون الرئيسي للتطبيق ---
function App() {
    const params = useParams<{ id: string }>();
    const { data: allProducts, loading, error } = useFetchData(api.getAllProducts);

    const productToShow = useMemo(() => {
        if (!allProducts || !params?.id) return null;
        // نستخدم الحقل slug لمطابقة المسار الديناميكي
        return allProducts.find(p => p.slug === String(params.id));
    }, [allProducts, params]);

    if (loading) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-gray-400" size={48} /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!allProducts || allProducts.length === 0) {
        return <div className="text-center py-20"><h2 className="text-2xl font-semibold text-gray-700">لا توجد منتجات لعرضها</h2></div>;
    }
    if (!productToShow) {
        return <div className="text-center py-20"><h2 className="text-2xl font-semibold text-gray-700">المنتج غير موجود</h2></div>;
    }

    return (
        <div className="bg-white flex flex-col min-h-screen">
            <main className="flex-grow">
                <ProductDetailPage product={productToShow} allProducts={allProducts} />
            </main>
        </div>
    );
}

// --- نقطة الدخول الرئيسية ---
export default function Page() {
    return (
        <ToastProvider>
            <App />
        </ToastProvider>
    );
}

