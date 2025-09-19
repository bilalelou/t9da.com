'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { useCart, useWishlist } from '@/contexts/Providers';
import { ShoppingCart, LoaderCircle, Star, CheckCircle, Heart, Minus, Plus, ChevronDown } from 'lucide-react';
import ProductVideoGallery, { VideoPlayer, VideoThumbnail } from '@/components/ProductVideoGalleryNew';

// --- Interfaces ---
interface Color {
    id: number;
    name: string;
    hex_code: string;
}

interface Size {
    id: number;
    name: string;
    display_name: string;
}

interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    stock: number;
    color: Color | null;
    size: Size | null;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface ProductVideo {
  id: number;
  title: string;
  description: string;
  video_url: string;
  video_type?: string;
  thumbnail_url?: string;
  duration?: string;
  sort_order?: number;
  is_featured: boolean;
  is_active: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    regular_price: number;
    sale_price?: number;
    thumbnail: string;
    images?: string[];
    description: string;
    category: Category | string;
    SKU: string;
    stock: number;
    variants?: ProductVariant[];
    available_colors?: Color[];
    available_sizes?: Size[];
}

// --- Toast & Favorites Contexts ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });
    const showToast = useCallback((message: string, type = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: '', visible: false, type: 'success' }), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div className={`fixed bottom-10 right-10 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101] ${toast.type === 'success' ? 'bg-gray-800' : 'bg-red-600'}`}>
                    <CheckCircle size={22} className={toast.type === 'success' ? 'text-green-400' : 'text-white'}/>
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};
const useToast = () => useContext(ToastContext);

const FavoritesContext = createContext<{ favoriteIds: Set<number>; toggleFavorite: (product: Product) => void; }>({ favoriteIds: new Set(), toggleFavorite: () => {} });
const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const { showToast } = useToast();
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const toggleFavorite = useCallback((product: Product) => {
        setFavoriteIds(prev => {
            const newIds = new Set(prev);
            const isFavorite = newIds.has(product.id);
            if (isFavorite) {
                newIds.delete(product.id);
                showToast(`تمت إزالة "${product.name}" من المفضلة`);
            } else {
                newIds.add(product.id);
                showToast(`تمت إضافة "${product.name}" إلى المفضلة`);
            }
            return newIds;
        });
    }, [showToast]);
    const value = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds, toggleFavorite]);
    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};


// --- API Helper ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const api = {
    getProductDetails: async (slug: string): Promise<{ product: Product, related: Product[] }> => {
        const response = await fetch(`${API_BASE_URL}/products/${slug}`);
        if (!response.ok) {
            if(response.status === 404) throw new Error('المنتج المطلوب غير موجود.');
            throw new Error('فشل في جلب بيانات المنتج.');
        }
        const data = await response.json();
        
        // Debug info لفحص البيانات الواردة من API
        console.log('API Response received:', {
            productId: data.product?.id,
            productName: data.product?.name,
            hasVariants: data.product?.has_variants,
            variantsCount: data.product?.variants?.length || 0,
            availableColorsFromAPI: data.product?.available_colors?.length || 0,
            availableSizesFromAPI: data.product?.available_sizes?.length || 0,
            colors: data.product?.available_colors,
            sizes: data.product?.available_sizes
        });
        
        // إذا لم تكن available_colors أو available_sizes موجودة، تأكد من أنها arrays فارغة
        if (!data.product.available_colors) {
            data.product.available_colors = [];
        }
        if (!data.product.available_sizes) {
            data.product.available_sizes = [];
        }
        
        return data;
    }
};

// --- Components ---
const formatCurrency = (price: number) => {
    if (typeof price !== 'number' || isNaN(price) || price === null || price === undefined) {
        return 'غير محدد';
    }
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 font-semibold text-gray-800">
                <span>{title}</span>
                <ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
                <div className="pb-4 text-gray-600 space-y-2">{children}</div>
            </div>
        </div>
    );
};

// [إضافة] مكون لعرض المنتجات ذات الصلة
const MiniProductCard = ({ product }: { product: Product }) => (
    <a href={`/shop/${product.slug}`} className="border rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-lg bg-white">
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden p-2">
            <img src={product.thumbnail} alt={product.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
        </div>
        <div className="p-3">
            <h4 className="font-semibold text-sm truncate text-gray-800">{product.name}</h4>
            <p className="text-blue-600 text-lg font-bold mt-1">{formatCurrency(product.regular_price)}</p>
        </div>
    </a>
);


// --- Product Detail Page ---
const ProductDetailPage = ({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) => {
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const [mainImage, setMainImage] = useState(product.thumbnail);
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedColor, setSelectedColor] = useState<Color | null>(product.available_colors?.[0] || null);
    const [selectedSize, setSelectedSize] = useState<Size | null>(product.available_sizes?.[0] || null);
    const [productVideos, setProductVideos] = useState<ProductVideo[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<ProductVideo | null>(null);
    const [currentMediaType, setCurrentMediaType] = useState<'image' | 'video'>('image'); // لتتبع نوع الوسائط المعروضة
    const isFavorite = isInWishlist(product.id);

    // متغيرات للتحقق من وجود الألوان والأحجام
    const hasColors = product.available_colors && product.available_colors.length > 0;
    const hasSizes = product.available_sizes && product.available_sizes.length > 0;

    // حساب variant المحدد الحالي
    const selectedVariant = useMemo(() => {
        if (!product.variants || product.variants.length === 0) return null;
        
        // إذا لم تكن هناك ألوان أو أحجام، استخدم أول variant
        if (!hasColors && !hasSizes) {
            return product.variants[0] || null;
        }
        
        // إذا كان هناك ألوان وأحجام، يجب أن يكون كلاهما محدد
        if (hasColors && hasSizes) {
            if (!selectedColor || !selectedSize) return null;
            return product.variants.find(variant => 
                variant.color?.id === selectedColor.id && variant.size?.id === selectedSize.id
            ) || null;
        }
        
        // إذا كان هناك ألوان فقط
        if (hasColors && selectedColor) {
            return product.variants.find(variant => 
                variant.color?.id === selectedColor.id
            ) || null;
        }
        
        // إذا كان هناك أحجام فقط
        if (hasSizes && selectedSize) {
            return product.variants.find(variant => 
                variant.size?.id === selectedSize.id
            ) || null;
        }
        
        return null;
    }, [product.variants, selectedColor, selectedSize, hasColors, hasSizes]);

    // حساب السعر الحالي (إما من variant أو من المنتج الأساسي)
    const currentPrice = selectedVariant?.price ?? product.sale_price ?? product.regular_price ?? 0;
    const currentStock = Math.max(0, selectedVariant?.stock ?? product.stock ?? 0);
    
    useEffect(() => {
        setMainImage(product.thumbnail);
        setQuantity(1);
        
        // تحديد الألوان والأحجام الافتراضية
        if (hasColors && (!selectedColor || !product.available_colors?.includes(selectedColor))) {
            setSelectedColor(product.available_colors?.[0] || null);
        } else if (!hasColors) {
            setSelectedColor(null);
        }
        
        if (hasSizes && (!selectedSize || !product.available_sizes?.includes(selectedSize))) {
            setSelectedSize(product.available_sizes?.[0] || null);
        } else if (!hasSizes) {
            setSelectedSize(null);
        }
    }, [product, hasColors, hasSizes, selectedColor, selectedSize]);

    const handleAddToCart = () => {
        const finalQuantity = Math.max(1, quantity || 1);
        const finalPrice = currentPrice || 0;
        const productToAdd = {
            ...product,
            price: finalPrice,
            image: product.thumbnail,
            inStock: currentStock > 0,
            selectedColor,
            selectedSize,
            variantSku: selectedVariant?.sku
        };
        addToCart(productToAdd, finalQuantity);
        showToast(`تمت إضافة ${finalQuantity}x "${product.name}" إلى السلة بنجاح!`);
    };

    const handleToggleFavorite = () => {
        if (isFavorite) {
            removeFromWishlist(product.id);
            showToast('تم إزالة المنتج من المفضلة');
        } else {
            const productForWishlist = {
                ...product,
                price: currentPrice,
                inStock: currentStock > 0
            };
            addToWishlist(productForWishlist);
            showToast('تم إضافة المنتج للمفضلة');
        }
    };
    
    // دالة لمعالجة تحديث الفيديوهات من المكون الفرعي
    const handleVideosLoaded = (videos: ProductVideo[]) => {
        setProductVideos(videos);
    };

    // دالة لاختيار صورة
    const selectImage = (imageUrl: string) => {
        setMainImage(imageUrl);
        setCurrentMediaType('image');
        setSelectedVideo(null);
    };

    // دالة لاختيار فيديو
    const selectVideo = (video: ProductVideo) => {
        setSelectedVideo(video);
        setCurrentMediaType('video');
        setMainImage(''); // مسح الصورة المحددة
    };

    const allImages = [product.thumbnail, ...(product.images || [])].filter(Boolean);

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image & Video Gallery */}
                    <div>
                        <div className="border rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
                            {currentMediaType === 'image' ? (
                                <img src={mainImage} alt={product.name} className="w-full h-auto object-contain transition-all duration-300" style={{aspectRatio: '1/1'}} />
                            ) : selectedVideo ? (
                                <VideoPlayer video={selectedVideo} className="w-full aspect-square" />
                            ) : (
                                <img src={mainImage} alt={product.name} className="w-full h-auto object-contain transition-all duration-300" style={{aspectRatio: '1/1'}} />
                            )}
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {/* الصور المصغرة */}
                            {allImages.map((img, index) => (
                                <div 
                                    key={`image-${index}`} 
                                    onClick={() => selectImage(img)} 
                                    className={`
                                        w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all flex-shrink-0
                                        ${mainImage === img && currentMediaType === 'image' 
                                            ? 'border-blue-500 ring-2 ring-blue-200' 
                                            : 'border-transparent hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            
                            {/* الفيديوهات المصغرة */}
                            {productVideos.map((video) => (
                                <VideoThumbnail
                                    key={`video-${video.id}`}
                                    video={video}
                                    isSelected={selectedVideo?.id === video.id && currentMediaType === 'video'}
                                    onClick={() => selectVideo(video)}
                                />
                            ))}
                        </div>
                        
                        {/* مكون تحميل الفيديوهات (مخفي) */}
                        <ProductVideoGallery 
                            productId={product.id} 
                            onVideosLoaded={handleVideosLoaded}
                        />
                    </div>
                    
                    {/* Product Videos Section */}
                    <ProductVideoGallery 
                        productId={product.id} 
                        className="mt-8"
                    />
                    
                    {/* Product Details */}
                    <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                            {typeof product.category === 'string' ? product.category : product.category?.name || 'غير مصنف'}
                        </span>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 my-3">{product.name}</h1>
                         <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400">{[...Array(5)].map((_,i) => <Star key={i} size={20} fill="currentColor" />)}</div>
                            <span className="text-gray-500 ml-2 text-sm">(12 تقييم)</span>
                        </div>
                        
                        <div className="mb-6">
                             {selectedVariant ? (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-blue-600">{formatCurrency(selectedVariant.price ?? 0)}</span>
                                    {product.sale_price && selectedVariant.price !== product.regular_price && (
                                        <span className="text-2xl text-gray-400 line-through">{formatCurrency(product.regular_price ?? 0)}</span>
                                    )}
                                </div>
                            ) : product.sale_price ? (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-red-600">{formatCurrency(product.sale_price ?? 0)}</span>
                                    <span className="text-2xl text-gray-400 line-through">{formatCurrency(product.regular_price ?? 0)}</span>
                                </div>
                            ) : (<span className="text-4xl font-bold text-gray-900">{formatCurrency(product.regular_price ?? 0)}</span>)}
                        </div>

                        {/* SKU Display */}
                        {selectedVariant?.sku && (
                            <div className="mb-4">
                                <span className="text-sm text-gray-500">رقم المنتج: {selectedVariant.sku}</span>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="mb-4">
                            {currentStock > 0 ? (
                                <span className="text-green-600 text-sm">
                                    <CheckCircle size={16} className="inline mr-1" />
                                    متوفر في المخزون ({currentStock || 0} قطعة)
                                </span>
                            ) : (
                                <span className="text-red-600 text-sm">غير متوفر حالياً</span>
                            )}
                        </div>

                         {/* Color Options */}
                         {hasColors && (
                            <div>
                                <p className="font-semibold mb-2">اللون:</p>
                                <div className="flex items-center gap-2">
                                    {(product.available_colors || []).map(color => (
                                        <button 
                                            key={color.id} 
                                            onClick={() => setSelectedColor(color)} 
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor?.id === color.id ? 'ring-2 ring-offset-1 ring-blue-500 border-white' : 'border-gray-200'}`} 
                                            style={{backgroundColor: color.hex_code}}
                                            title={color.name}
                                        ></button>
                                    ))}
                                </div>
                            </div>
                         )}


                        {/* Size Options */}
                        {hasSizes && (
                            <div className="mt-4">
                                <p className="font-semibold mb-2">المقاس:</p>
                                <div className="flex items-center gap-2">
                                    {(product.available_sizes || []).map(size => (
                                        <button 
                                            key={size.id} 
                                            onClick={() => setSelectedSize(size)} 
                                            className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${selectedSize?.id === size.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                        >
                                            {size.display_name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 my-6">
                            <p className="font-semibold">الكمية:</p>
                            <div className="flex items-center border rounded-lg bg-white">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, (q || 1) - 1))} 
                                    className="px-4 py-3 text-gray-500 hover:text-gray-800"
                                    disabled={currentStock === 0}
                                >
                                    <Minus size={16}/>
                                </button>
                                <span className="px-4 font-bold text-lg">{quantity || 1}</span>
                                <button 
                                    onClick={() => setQuantity(q => Math.min(currentStock, (q || 1) + 1))} 
                                    className="px-4 py-3 text-gray-500 hover:text-gray-800"
                                    disabled={currentStock === 0 || (quantity || 1) >= currentStock}
                                >
                                    <Plus size={16}/>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-stretch gap-3">
                            <button 
                                onClick={handleAddToCart} 
                                disabled={currentStock === 0 || (hasColors && !selectedColor) || (hasSizes && !selectedSize)}
                                className={`flex-grow font-bold py-4 px-8 rounded-lg transition flex items-center justify-center gap-3 ${
                                    currentStock === 0 || (hasColors && !selectedColor) || (hasSizes && !selectedSize)
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                <ShoppingCart size={22} />
                                <span>
                                    {currentStock === 0 
                                        ? 'غير متوفر' 
                                        : (hasColors && !selectedColor)
                                            ? 'اختر اللون'
                                            : (hasSizes && !selectedSize)
                                                ? 'اختر المقاس'
                                                : (hasColors && hasSizes && (!selectedColor || !selectedSize))
                                                    ? 'اختر اللون والمقاس'
                                                    : 'أضف إلى السلة'
                                    }
                                </span>
                            </button>
                             <button onClick={handleToggleFavorite} className={`p-4 border rounded-lg transition-colors ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                <Heart size={22} fill={isFavorite ? 'currentColor' : 'none'}/>
                            </button>
                        </div>
                        
                        <div className="mt-8">
                             <AccordionItem title="الوصف الكامل للمنتج" defaultOpen={true}>
                                 <p className="whitespace-pre-line">{product.description}</p>
                             </AccordionItem>
                             <AccordionItem title="المواصفات">
                                 <ul className="list-disc pr-5">
                                     <li><span className="font-semibold">SKU:</span> {product.SKU}</li>
                                     <li><span className="font-semibold">التصنيف:</span> {typeof product.category === 'string' ? product.category : product.category?.name || 'غير مصنف'}</li>
                                 </ul>
                             </AccordionItem>
                             <AccordionItem title="الشحن والإرجاع">
                                 <p>شحن سريع لجميع مدن المغرب. يمكنك إرجاع المنتج خلال 7 أيام من تاريخ الاستلام.</p>
                             </AccordionItem>
                        </div>
                    </div>
                </div>
                {/* [إضافة] قسم المنتجات ذات الصلة */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div className="mt-20 pt-10 border-t">
                        <h2 className="text-3xl font-bold text-center mb-8">منتجات قد تعجبك أيضا</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map(p => <MiniProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


// --- Entry Point & Data Fetching Wrapper ---
export default function Page() {
    const [slug, setSlug] = useState<string | null>(null);
    const [data, setData] = useState<{ product: Product, related: Product[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const pathParts = window.location.pathname.split('/');
        const currentSlug = pathParts[pathParts.length - 1];
        setSlug(currentSlug);
    }, []);

    useEffect(() => {
        if (slug) {
            setLoading(true);
            api.getProductDetails(slug)
                .then(setData)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        } else if (typeof window !== 'undefined' && window.location.pathname.includes('/product/')) {
             setLoading(false);
             setError("لم يتم العثور على معرّف المنتج في الرابط.");
        }
    }, [slug]);

    const content = () => {
        if (loading) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
        if (error) return <div className="text-center py-20 text-red-600">خطأ: {error}</div>;
        if (!data?.product) return <div className="text-center py-20 text-gray-700">لم يتم العثور على المنتج.</div>;
        return <ProductDetailPage product={data.product} relatedProducts={data.related} />;
    };

    return (
        <ToastProvider>
            <FavoritesProvider>
                <div className="bg-white min-h-screen">
                    <main>{content()}</main>
                </div>
            </FavoritesProvider>
        </ToastProvider>
    );
}

