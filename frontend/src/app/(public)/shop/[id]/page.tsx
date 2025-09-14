'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { ShoppingCart, LoaderCircle, Star, CheckCircle, Heart, Share2, Minus, Plus, ShieldCheck, Truck, MessageSquare, ChevronDown } from 'lucide-react';

// --- Interfaces ---
interface Product {
    id: number;
    name: string;
    slug: string;
    regular_price: number;
    sale_price?: number;
    image: string;
    images?: string[];
    description: string;
    category: string;
    SKU: string;
    // بيانات وهمية للخيارات
    available_colors?: string[];
    available_sizes?: string[];
}

// --- Toast & Favorites Contexts ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });
    const showToast = useCallback((message, type = 'success') => {
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
const FavoritesProvider = ({ children }) => {
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
const useFavorites = () => useContext(FavoritesContext);


// --- API Helper ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const api = {
    getProductDetails: async (slug: string): Promise<{ product: Product, related: Product[] }> => {
        const response = await fetch(`${API_BASE_URL}/products/${slug}`);
        if (!response.ok) {
            if(response.status === 404) throw new Error('المنتج المطلوب غير موجود.');
            throw new Error('فشل في جلب بيانات المنتج.');
        }
        return response.json();
    }
};

// --- Components ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

const AccordionItem = ({ title, children, defaultOpen = false }) => {
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
const MiniProductCard = ({ product }) => (
    <a href={`/product/${product.slug}`} className="border rounded-lg overflow-hidden group transition-shadow duration-300 hover:shadow-lg bg-white">
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden p-2">
            <img src={product.image} alt={product.name} className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
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
    const { favoriteIds, toggleFavorite } = useFavorites();
    const [mainImage, setMainImage] = useState(product.image);
    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product.available_colors?.[0]);
    const [selectedSize, setSelectedSize] = useState(product.available_sizes?.[0]);
    const isFavorite = favoriteIds.has(product.id);
    
    useEffect(() => {
        setMainImage(product.image);
        setQuantity(1);
    }, [product]);

    const handleAddToCart = () => {
        showToast(`تمت إضافة ${quantity}x "${product.name}" إلى السلة بنجاح!`);
    };
    
    const allImages = [product.image, ...(product.images || [])].filter(Boolean);

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div>
                        <div className="border rounded-xl overflow-hidden mb-4 bg-white shadow-sm">
                            <img src={mainImage} alt={product.name} className="w-full h-auto object-contain transition-all duration-300" style={{aspectRatio: '1/1'}} />
                        </div>
                        <div className="flex gap-2">
                            {allImages.map((img, index) => (
                                <div key={index} onClick={() => setMainImage(img)} className={`w-20 h-20 border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${mainImage === img ? 'border-blue-500' : 'border-transparent hover:border-gray-300'}`}>
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Product Details */}
                    <div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">{product.category}</span>
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 my-3">{product.name}</h1>
                         <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400">{[...Array(5)].map((_,i) => <Star key={i} size={20} fill="currentColor" />)}</div>
                            <span className="text-gray-500 ml-2 text-sm">(12 تقييم)</span>
                        </div>
                        
                        <div className="mb-6">
                             {product.sale_price ? (
                                <div className="flex items-baseline gap-3">
                                    <span className="text-4xl font-bold text-red-600">{formatCurrency(product.sale_price)}</span>
                                    <span className="text-2xl text-gray-400 line-through">{formatCurrency(product.regular_price)}</span>
                                </div>
                            ) : (<span className="text-4xl font-bold text-gray-900">{formatCurrency(product.regular_price)}</span>)}
                        </div>

                         {/* Color Options */}
                         {(product.available_colors && product.available_colors.length > 0) && (
                            <div>
                                <p className="font-semibold mb-2">اللون:</p>
                                <div className="flex items-center gap-2">
                                    {(product.available_colors || []).map(color => (
                                        <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'ring-2 ring-offset-1 ring-blue-500 border-white' : 'border-gray-200'}`} style={{backgroundColor: color}}></button>
                                    ))}
                                </div>
                            </div>
                         )}


                        {/* Size Options */}
                        {(product.available_sizes && product.available_sizes.length > 0) && (
                            <div className="mt-4">
                                <p className="font-semibold mb-2">المقاس:</p>
                                <div className="flex items-center gap-2">
                                    {(product.available_sizes || []).map(size => (
                                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${selectedSize === size ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{size}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-4 my-6">
                            <p className="font-semibold">الكمية:</p>
                            <div className="flex items-center border rounded-lg bg-white">
                                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="px-4 py-3 text-gray-500 hover:text-gray-800"><Minus size={16}/></button>
                                <span className="px-4 font-bold text-lg">{quantity}</span>
                                <button onClick={() => setQuantity(q => q+1)} className="px-4 py-3 text-gray-500 hover:text-gray-800"><Plus size={16}/></button>
                            </div>
                        </div>

                        <div className="flex items-stretch gap-3">
                            <button onClick={handleAddToCart} className="flex-grow bg-blue-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-3">
                                <ShoppingCart size={22} /><span>أضف إلى السلة</span>
                            </button>
                             <button onClick={() => toggleFavorite(product)} className={`p-4 border rounded-lg transition-colors ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
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
                                     <li><span className="font-semibold">التصنيف:</span> {product.category}</li>
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

