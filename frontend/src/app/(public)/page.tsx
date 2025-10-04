'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import StructuredData from '@/components/SEO/StructuredData';
import { Metadata } from 'next';
import Image from 'next/image';

// export const metadata: Metadata = {
//   title: 'T9da.com - الصفحة الرئيسية | متجر إلكتروني متكامل في المغرب',
//   description: 'اكتشف أفضل المنتجات في متجر T9da.com الإلكتروني. إلكترونيات، ملابس، منزل ومطبخ، جمال وصحة بأسعار منافسة مع توصيل سريع لجميع المدن المغربية',
//   keywords: 'متجر إلكتروني المغرب, تسوق أونلاين, عروض اليوم, منتجات جديدة, أسعار منافسة, توصيل مجاني',
//   openGraph: {
//     title: 'T9da.com - متجر إلكتروني متكامل في المغرب',
//     description: 'اكتشف أفضل المنتجات بأسعار منافسة مع توصيل سريع',
//     images: ['/images/home-og.jpg'],
//   },
// };
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, ShieldCheck, Truck, PhoneCall, Mail, Quote, Zap, Star, Tag, Clock, Menu, X, Smartphone, Home, Tv, Monitor, Gamepad2, Sparkles, Shirt, Dumbbell, Car } from 'lucide-react';

// --- ( MOCK PROVIDERS ) ---
// These are mock providers to make the component self-contained and runnable.
// In a real app, you would import these from your actual context files.

const mockCartContext = createContext({
    addToCart: (product: Product, quantity: number) => {},
});
const useCart = () => useContext(mockCartContext);

const mockWishlistContext = createContext({
    addToWishlist: (product) => console.log('Added to wishlist:', product),
    removeFromWishlist: (productId) => console.log('Removed from wishlist:', productId),
    isInWishlist: (productId) => false,
});
const useWishlist = () => useContext(mockWishlistContext);

const MockProviders = ({ children }) => {
    const [wishlist, setWishlist] = useState(new Set());
    const { showToast } = useContext(ToastContext); // Get showToast from the context
    const addToWishlist = (product) => setWishlist(prev => new Set(prev).add(product.id));
    const removeFromWishlist = (productId) => {
        setWishlist(prev => {
            const newSet = new Set(prev);
            newSet.delete(productId);
            return newSet;
        });
    };
    const isInWishlist = (productId) => wishlist.has(productId);

    return (
        <mockCartContext.Provider value={{ addToCart: (product, quantity) => showToast(`تمت إضافة ${product.name} للسلة`) }}>
            <mockWishlistContext.Provider value={{ addToWishlist, removeFromWishlist, isInWishlist }}>
                {children}
            </mockWishlistContext.Provider>
        </mockCartContext.Provider>
    );
};


// --- ( TYPE DEFINITIONS ) ---
interface Slide { id: number; title: string; subtitle: string; image_url: string; link: string; }
interface Product { id: number; name: string; slug: string; regular_price: number; sale_price?: number; thumbnail: string; short_description: string; has_free_shipping?: boolean; rating?: number; review_count?: number; }
interface Category { id: number; name: string; slug: string; image: string; }
interface Testimonial { id: number; name: string; title: string; quote: string; avatar: string; }
interface Service { id: number; icon: React.ReactNode; title: string; description: string; }
interface Brand { id: number; name: string; logo: string; }
interface FlashSale { products: Product[]; endDate: string; }
interface PromoBannerData { id: number; title: string; subtitle: string; image_url: string; link: string; button_text: string; }
interface HomePageData { slides: Slide[]; featuredProducts: Product[]; categories: Category[]; testimonials: Testimonial[]; todayOffers: Product[]; services: Service[]; brands: Brand[]; flashSale: FlashSale; newArrivals: Product[]; promoBanner: PromoBannerData; petitsPrix: Product[]; trendingProducts: Product[]; electronicsProducts: Product[]; }


// --- ( UTILS & CONFIG ) ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' && window.location.origin.includes('localhost') ? 'http://localhost:8000' : 'https://your-domain.com');

const formatCurrency = (price: number): string => {
    if (typeof price !== 'number' || isNaN(price)) return '';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

const DEFAULT_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=400&h=400&auto=format&fit=crop&ixlib=rb-4.0.3';

// --- ( API LAYER ) ---
const api = {
    getActiveSliders: async (): Promise<Slide[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/sliders/active`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) return [];
            const result = await response.json();
            if (!result.success || !Array.isArray(result.data)) return [];
            return result.data.map((slider: any) => ({ id: slider.id, title: slider.title, subtitle: slider.description, image_url: slider.image_url, link: slider.button_link }));
        } catch (error) {
            console.error('Error fetching sliders:', error);
            return [];
        }
    },
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/public/categories`, {
                headers: { 'Accept': 'application/json' }
            });
            if (!response.ok) return [];
            const result = await response.json();
            if (!result.success || !Array.isArray(result.data)) return [];
            return result.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },
    getProducts: async (type: string): Promise<Product[]> => {
        try {
            const url = `${API_BASE_URL}/public/products/${type}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                console.error(`HTTP Error ${response.status} for ${type}`);
                return [];
            }
            
            const result = await response.json();
            
            if (!result.success || !Array.isArray(result.data)) {
                console.error(`Invalid data format for ${type}:`, result);
                return [];
            }
            
            return result.data.map((product: any) => ({
                id: product.id,
                name: product.name,
                slug: product.slug,
                regular_price: parseFloat(product.regular_price) || 0,
                sale_price: product.sale_price ? parseFloat(product.sale_price) : undefined,
                thumbnail: product.thumbnail || DEFAULT_PRODUCT_IMAGE,
                short_description: product.short_description || '',
                has_free_shipping: product.has_free_shipping || false,
                rating: product.rating ? parseFloat(product.rating) : undefined,
                review_count: product.review_count || 0
            }));
        } catch (error) {
            console.error(`Error fetching ${type} products:`, error);
            return [];
        }
    },
    getHomePageData: async (): Promise<HomePageData> => {
        const [
            slidersResponse, 
            categoriesResponse, 
            featuredProductsResponse,
            todayOffersResponse,
            newArrivalsResponse,
            petitsPrixResponse,
            trendingProductsResponse,
            electronicsProductsResponse
        ] = await Promise.allSettled([
            api.getActiveSliders(), 
            api.getCategories(),
            api.getProducts('featured'),
            api.getProducts('today-offers'),
            api.getProducts('new-arrivals'),
            api.getProducts('petits-prix'),
            api.getProducts('trending'),
            api.getProducts('electronics')
        ]);

        const slides = slidersResponse.status === 'fulfilled' ? slidersResponse.value : [
            { id: 998, title: 'بيانات احتياطية للسلايدر', subtitle: 'حدث خطأ أثناء الاتصال بالخادم', image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop', link: '#' },
        ];
        if (slidersResponse.status === 'rejected') console.error("خطأ في جلب السلايدر:", slidersResponse.reason);

        const categories = categoriesResponse.status === 'fulfilled' ? categoriesResponse.value : [
            { id: 1, name: 'الإلكترونيات', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop' },
        ];
        if (categoriesResponse.status === 'rejected') console.error("خطأ في جلب التصنيفات:", categoriesResponse.reason);
        
        const featuredProducts = featuredProductsResponse.status === 'fulfilled' ? featuredProductsResponse.value : [];
        const todayOffers = todayOffersResponse.status === 'fulfilled' ? todayOffersResponse.value : [];
        const newArrivals = newArrivalsResponse.status === 'fulfilled' ? newArrivalsResponse.value : [];
        const petitsPrix = petitsPrixResponse.status === 'fulfilled' ? petitsPrixResponse.value : [];
        const trendingProducts = trendingProductsResponse.status === 'fulfilled' ? trendingProductsResponse.value : [];
        const electronicsProducts = electronicsProductsResponse.status === 'fulfilled' ? electronicsProductsResponse.value : [];
        
        const flashSaleEndDate = new Date();
        flashSaleEndDate.setHours(flashSaleEndDate.getHours() + 5);

        return {
            slides, 
            categories,
            featuredProducts,
            todayOffers,
            newArrivals,
            petitsPrix,
            trendingProducts,
            electronicsProducts,
            testimonials: [{ id: 1, name: 'سارة خالد', title: 'عميلة سعيدة', quote: 'تجربة تسوق رائعة ومنتجات ذات جودة عالية.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, { id: 2, name: 'أحمد عبدالله', title: 'مشتري دائم', quote: 'الأسعار منافسة والتوصيل دائماً في الموعد.', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' }],
            flashSale: { endDate: flashSaleEndDate.toISOString(), products: [] },
            promoBanner: { id: 1, title: 'تخفيضات الإلكترونيات الكبرى', subtitle: 'خصم يصل إلى 40% على الهواتف الذكية واللابتوبات', image_url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?q=80&w=2069&auto=format&fit=crop', link: '/category/electronics-sale', button_text: 'تسوق العروض' },
            services: [{ id: 1, icon: <Truck size={28} />, title: "توصيل سريع", description: "لكافة المدن المغربية." }, { id: 2, icon: <ShieldCheck size={28} />, title: "دفع آمن", description: "نضمن حماية معاملاتك." }, { id: 3, icon: <PhoneCall size={28} />, title: "دعم فني", description: "متواجدون لمساعدتك." }],
            brands: [{ id: 1, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" }, { id: 2, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" }],
        };
    }
};

// --- ( CUSTOM HOOKS ) ---
const useFetchData = <T,>(fetcher: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const loadData = async () => {
            try { setLoading(true); setError(null); const result = await fetcher(); setData(result); } catch (err) { const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."; setError(errorMessage); console.error("Fetch Error:", errorMessage); } finally { setLoading(false); }
        };
        loadData();
    }, [fetcher]);
    return { data, loading, error };
};
const useCountdown = (endDate: string) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const distance = end - now;
            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            } else {
                setTimeLeft({ days: Math.floor(distance / (1000 * 60 * 60 * 24)), hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)), seconds: Math.floor((distance % (1000 * 60)) / 1000) });
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [endDate]);
    return timeLeft;
};

// --- ( GLOBAL UI COMPONENTS ) ---
const ToastContext = createContext<{ showToast: (message: string) => void }>({ showToast: () => {} });
const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false });
    const showToast = useCallback((message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (<div className="fixed bottom-10 right-10 bg-gray-900 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101] animate-fade-in-up"><CheckCircle size={22} className="text-green-400" /><span>{toast.message}</span></div>)}
        </ToastContext.Provider>
    );
};
const ErrorDisplay = ({ error }: { error?: string | null }) => {
    if (!error) return null;
    return (<div className="container mx-auto my-10 p-6 bg-red-100 border-l-8 border-red-500 text-red-900 rounded-lg shadow-md" dir="rtl" role="alert"><h3 className="font-bold mb-3 text-lg">حدث خطأ</h3><pre className="text-sm whitespace-pre-wrap font-mono">{error}</pre></div>);
};
const ProductCardSkeleton = () => (<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-pulse"><div className="bg-slate-200 h-64 w-full"></div><div className="p-4"><div className="bg-slate-200 h-5 w-3/4 rounded-md"></div><div className="bg-slate-200 h-4 w-1/2 mt-4 rounded-md"></div><div className="flex justify-between items-center mt-4"><div className="bg-slate-200 h-7 w-1/3 rounded-md"></div><div className="bg-slate-200 h-10 w-10 rounded-full"></div></div></div></div>);

// Categories Menu Component
const CategoriesMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const categories = [
        { name: 'الأجهزة الإلكترونية', icon: <Smartphone size={18} className="text-blue-500" /> },
        { name: 'المنزل والمطبخ', icon: <Home size={18} className="text-green-500" /> },
        { name: 'الهواتف', icon: <Smartphone size={18} className="text-purple-500" /> },
        { name: 'تلفزيون وصوت', icon: <Tv size={18} className="text-red-500" /> },
        { name: 'الحاسوب والألعاب', icon: <Monitor size={18} className="text-indigo-500" /> },
        { name: 'الجمال والصحة', icon: <Sparkles size={18} className="text-pink-500" /> },
        { name: 'ملابس وإكسسوارات', icon: <Shirt size={18} className="text-orange-500" /> },
        { name: 'الرياضة والألعاب', icon: <Gamepad2 size={18} className="text-cyan-500" /> },
        { name: 'رياضة', icon: <Dumbbell size={18} className="text-emerald-500" /> },
        { name: 'السيارات', icon: <Car size={18} className="text-gray-600" /> }
    ];

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors shadow-lg"
            >
                <Menu size={20} />
                <span className="font-medium">جميع الفئات</span>
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="bg-slate-700 text-white p-4 flex items-center justify-between">
                            <span className="font-bold text-lg">جميع الفئات</span>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-slate-600 rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {categories.map((category, index) => (
                                <a 
                                    key={index}
                                    href={`/category/${category.name}`}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        {category.icon}
                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{category.name}</span>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// --- ( HOME PAGE COMPONENTS ) ---
const Section = ({ title, subtitle, children, className = '' }: { title: string, subtitle?: string, children: React.ReactNode, className?: string }) => (<section className={`py-16 sm:py-20 ${className}`}><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 relative inline-block">{title}<div className="absolute bottom-0 right-1/2 transform translate-x-1/2 w-16 h-1 bg-yellow-400 rounded-full"></div></h2>{subtitle && <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}</div>{children}</div></section>);
const StarRating = ({ rating, review_count }: { rating: number, review_count: number }) => (<div className="flex items-center gap-1.5"><div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />)}</div><span className="text-xs text-slate-500 font-medium">({review_count})</span></div>);
const ProductCard = React.memo(({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { showToast } = useContext(ToastContext);
    const isWishlisted = isInWishlist(product.id);
    const hasSale = product.sale_price && product.sale_price < product.regular_price;
    const handleCartClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addToCart({ ...product, price: product.sale_price || product.regular_price }, 1); showToast(`تمت إضافة "${product.name}" إلى السلة!`); };
    const handleWishlistClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (isWishlisted) { removeFromWishlist(product.id); showToast(`تمت إزالة "${product.name}" من المفضلة.`); } else { addToWishlist(product); showToast(`تمت إضافة "${product.name}" إلى المفضلة!`); } };
    return (<a href={`/shop/${product.slug}`} className="cursor-pointer group relative bg-white border-2 border-gray-100 hover:border-yellow-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"><div className="overflow-hidden h-64 bg-gray-50 relative"><Image src={product.thumbnail || DEFAULT_PRODUCT_IMAGE} alt={product.name} width={400} height={400} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = DEFAULT_PRODUCT_IMAGE; }} /><div className="absolute top-3 right-3 flex flex-col gap-2">{hasSale && <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">تخفيض</div>}{product.has_free_shipping && <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">شحن مجاني</div>}</div><button onClick={handleWishlistClick} className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'}`} title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"} ><Heart size={18} className={isWishlisted ? 'fill-current' : ''} /></button></div><div className="p-5 flex flex-col flex-grow"><h3 className="text-base font-bold text-gray-800 truncate group-hover:text-yellow-600 transition-colors" title={product.name}>{product.name}</h3>{product.short_description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.short_description}</p>}{product.rating && product.review_count && <div className="mt-3"><StarRating rating={product.rating} review_count={product.review_count} /></div>}<div className="pt-4 mt-auto flex items-end justify-between"><div className="flex flex-col">{hasSale ? (<><span className="text-xl font-extrabold text-red-600">{formatCurrency(product.sale_price!)}</span><span className="text-sm text-gray-400 line-through">{formatCurrency(product.regular_price)}</span></>) : (<span className="text-xl font-extrabold text-gray-800">{formatCurrency(product.regular_price)}</span>)}</div><button onClick={handleCartClick} className="w-11 h-11 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-lg" title="إضافة للسلة" aria-label={`إضافة ${product.name} إلى السلة`}><ShoppingCart size={20}/></button></div></div></a>);
});
ProductCard.displayName = 'ProductCard';
const HeroSlider = ({ slides }: { slides: Slide[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const next = useCallback(() => setCurrentSlide(curr => (curr === slides.length - 1 ? 0 : curr + 1)), [slides.length]);
    const prev = () => setCurrentSlide(curr => (curr === 0 ? slides.length - 1 : curr - 1));
    useEffect(() => { if (slides.length > 1) { const slideInterval = setInterval(next, 6000); return () => clearInterval(slideInterval); } }, [slides.length, next]);
    if (!slides || slides.length === 0) { return <div className="relative h-[85vh] w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>; }
    return (
        <section className="relative h-[85vh] w-full overflow-hidden shadow-2xl" dir="ltr">
            <div className="flex transition-transform ease-out duration-1000 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide) => (
                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                        <Image src={slide.image_url} alt={slide.title} width={1920} height={1080} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6" dir="rtl">
                            <div className="max-w-4xl space-y-6 animate-fade-in-up">
                                <div className="inline-block px-6 py-2 bg-yellow-500/90 backdrop-blur-sm rounded-full text-sm font-bold text-gray-900 mb-4">
                                    عرض خاص ⚡
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-2xl leading-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                                    {slide.title}
                                </h1>
                                <p className="mt-6 text-xl md:text-2xl text-gray-100 drop-shadow-lg font-medium max-w-3xl mx-auto">
                                    {slide.subtitle}
                                </p>
                                <div className="flex gap-4 justify-center mt-10">
                                    <a 
                                        href={slide.link} 
                                        className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-110 shadow-2xl hover:shadow-yellow-500/50"
                                    >
                                        تسوق الآن
                                        <ChevronLeft size={20} className="rotate-180" />
                                    </a>
                                    <a 
                                        href="#featured" 
                                        className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-bold py-4 px-10 rounded-full border-2 border-white/30 hover:border-white/50 transition-all duration-300 shadow-xl"
                                    >
                                        اكتشف المزيد
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* Slide indicators */}
                        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentSlide(idx)}
                                    className={`transition-all duration-300 rounded-full ${
                                        idx === currentSlide 
                                            ? 'w-12 h-3 bg-yellow-500' 
                                            : 'w-3 h-3 bg-white/50 hover:bg-white/75'
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {slides.length > 1 && (
                <>
                    <button 
                        onClick={prev} 
                        aria-label="Previous slide" 
                        className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full z-10 transition-all duration-300 shadow-xl hover:scale-110 group"
                    >
                        <ChevronLeft size={28} className="text-gray-800 group-hover:text-yellow-600" />
                    </button>
                    <button 
                        onClick={next} 
                        aria-label="Next slide" 
                        className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-white/90 hover:bg-white p-4 rounded-full z-10 transition-all duration-300 shadow-xl hover:scale-110 group"
                    >
                        <ChevronRight size={28} className="text-gray-800 group-hover:text-yellow-600" />
                    </button>
                </>
            )}
        </section>
    );
};
const ServicesBar = ({ services }: { services: Service[] }) => (
    <div className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-y border-gray-200 shadow-sm">
        <div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
            {services.map((service, index) => (
                <div 
                    key={service.id} 
                    className="flex flex-col items-center text-center gap-4 p-8 bg-white hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50 rounded-3xl border-2 border-gray-100 hover:border-yellow-300 transition-all duration-500 group hover:shadow-2xl hover:-translate-y-3"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="text-yellow-600 bg-gradient-to-br from-yellow-100 to-orange-100 group-hover:from-yellow-200 group-hover:to-orange-200 p-6 rounded-full transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                        {service.icon}
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-gray-800 group-hover:text-yellow-600 transition-colors mb-2">
                            {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const CategorySlider = ({ categories }: { categories: Category[] }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    
    const handlePageChange = (newPage: number) => {
        if (isAnimating || newPage === currentPage) return;
        setIsAnimating(true);
        setCurrentPage(newPage);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const handleNext = () => handlePageChange((currentPage + 1) % totalPages);
    const handlePrev = () => handlePageChange((currentPage - 1 + totalPages) % totalPages);
    
    if (categories.length === 0) return null;

    const currentCategories = categories.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    return (
        <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 relative inline-block">
                        تسوق حسب الفئات
                        <div className="absolute -bottom-2 right-1/2 transform translate-x-1/2 w-20 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                        <div className="absolute -bottom-4 right-1/2 transform translate-x-1/2 w-10 h-1 bg-blue-500 rounded-full"></div>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mt-6">اكتشف مجموعة واسعة من المنتجات المصنفة حسب احتياجاتك</p>
                </div>
                
                <div className="relative">
                    <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 transition-all duration-300 ${isAnimating ? 'opacity-75 scale-95' : 'opacity-100 scale-100'}`}>
                        {currentCategories.map((category, index) => (
                            <a 
                                href={`/category/${category.slug}`} 
                                key={category.id} 
                                className="group flex flex-col items-center text-center transition-all duration-500 hover:-translate-y-3 hover:scale-105"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-gray-100 group-hover:border-yellow-400 group-hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white via-gray-50 to-gray-100 relative">
                                    <Image 
                                        src={category.image} 
                                        alt={category.name} 
                                        width={200} 
                                        height={200} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                                        onError={(e) => { 
                                            const target = e.currentTarget as HTMLImageElement;
                                            target.src = `https://via.placeholder.com/200x200/f1f5f9/64748b?text=${encodeURIComponent(category.name)}`; 
                                        }} 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                </div>
                                <h3 className="mt-5 text-sm sm:text-base font-bold text-gray-800 group-hover:text-yellow-600 transition-all duration-300 text-center leading-tight px-2">
                                    {category.name}
                                </h3>
                            </a>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <>
                            <button 
                                onClick={handlePrev} 
                                disabled={isAnimating}
                                aria-label="الصفحة السابقة" 
                                className="absolute top-1/2 -translate-y-1/2 -left-6 w-14 h-14 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 z-10 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="text-gray-600 group-hover:text-yellow-600 transition-colors" size={24} />
                            </button>
                            <button 
                                onClick={handleNext} 
                                disabled={isAnimating}
                                aria-label="الصفحة التالية" 
                                className="absolute top-1/2 -translate-y-1/2 -right-6 w-14 h-14 bg-white/90 backdrop-blur-sm border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 z-10 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="text-gray-600 group-hover:text-yellow-600 transition-colors" size={24} />
                            </button>
                            
                            <div className="flex justify-center mt-12 gap-3">
                                {Array.from({ length: totalPages }).map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handlePageChange(index)}
                                        disabled={isAnimating}
                                        className={`transition-all duration-300 rounded-full disabled:cursor-not-allowed ${
                                            index === currentPage 
                                                ? 'w-8 h-3 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg' 
                                                : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-125'
                                        }`}
                                        aria-label={`الصفحة ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

const CategorySliderSkeleton = () => (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-16">
                <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-6 animate-pulse"></div>
                <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse shadow-lg"></div>
                        <div className="mt-5 h-5 w-24 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-12 gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                ))}
            </div>
        </div>
    </section>
);

const PromoBanner = ({ banner }: { banner: PromoBannerData }) => (<section className="py-16 sm:py-20 bg-slate-50"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><a href={banner.link} className="group relative block rounded-2xl overflow-hidden shadow-xl"><Image src={banner.image_url} alt={banner.title} width={800} height={450} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div><div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white"><h2 className="text-3xl md:text-4xl font-extrabold max-w-md">{banner.title}</h2><p className="mt-2 text-lg text-slate-200 max-w-md">{banner.subtitle}</p><div className="mt-8"><span className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg group-hover:bg-slate-200 transition-colors">{banner.button_text}</span></div></div></a></div></section>);
// --- ( MAIN HOME PAGE CONTENT ) ---
function HomePageContent() {
    const fetcher = useCallback(() => api.getHomePageData(), []);
    const { data, loading, error } = useFetchData<HomePageData>(fetcher);
    
    // إضافة Schema Markup للصفحة الرئيسية
    useEffect(() => {
        // إضافة structured data للموقع والمنظمة
    }, []);

    return (
        <div dir="rtl" className="bg-white text-gray-900 min-h-screen">
            {/* Schema Markup للموقع والمنظمة */}
            <StructuredData type="website" />
            <StructuredData type="organization" />
            {/* Categories Menu Section */}
            <div className="bg-white border-b border-yellow-200 py-6">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex justify-start">
                    <CategoriesMenu />
                </div>
            </div>
            
            <HeroSlider slides={data?.slides || []} />
            <ErrorDisplay error={error} />
            
            {loading ? (
                <CategorySliderSkeleton />
            ) : (
                data?.categories && <CategorySlider categories={data.categories} />
            )}
            

            <Section title="عروض اليوم" subtitle="اغتنم أفضل التخفيضات والصفقات الحصرية لفترة محدودة" className="bg-white"><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.todayOffers.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="text-center mt-12"><a href="/category/today-offers" className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">مزيد من العروض <ChevronLeft size={20} className="rotate-180" /></a></div></Section>
            {loading ? (<div className="py-20 bg-white"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><div className="h-80 w-full bg-gray-100 rounded-2xl animate-pulse border border-gray-200"></div></div></div>) : (data?.promoBanner && <PromoBanner banner={data.promoBanner} />)}
            <Section title="الأكثر مبيعاً" subtitle="اكتشف المنتجات التي يعشقها عملاؤنا ويثقون بها" className="bg-white"><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.featuredProducts.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="text-center mt-12"><a href="/category/featured" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">مزيد من المنتجات <ChevronLeft size={20} className="rotate-180" /></a></div></Section>
            <Section title="وصل حديثاً" subtitle="اكتشف أحدث المنتجات التي أضفناها لمتجرنا" className="bg-white"><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.newArrivals.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="text-center mt-12"><a href="/category/new-arrivals" className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">مزيد من الجديد <ChevronLeft size={20} className="rotate-180" /></a></div></Section>
            <Section title="أسعار صغيرة" subtitle="منتجات بأسعار منافسة وجودة عالية" className="bg-white"><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.petitsPrix.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="text-center mt-12"><a href="/category/petits-prix" className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">مزيد من العروض <ChevronLeft size={20} className="rotate-180" /></a></div></Section>
            <Section title="المنتجات الرائجة" subtitle="اكتشف المنتجات الأكثر طلباً وشعبية" className="bg-white"><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.trendingProducts.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="text-center mt-12"><a href="/category/trending" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">مزيد من الرائج <ChevronLeft size={20} className="rotate-180" /></a></div></Section>
            <Section title="الإلكترونيات" subtitle="أحدث الأجهزة والتقنيات الذكية" className="bg-white"><div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.electronicsProducts.slice(0, 8).map(product => <ProductCard key={product.id} product={product} />)}</div><div className="text-center mt-12"><a href="/category/electronics" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">مزيد من الإلكترونيات <ChevronLeft size={20} className="rotate-180" /></a></div></Section>
            <ServicesBar services={data?.services || []} />
            <section className="py-24 bg-white border-t border-b border-yellow-200"><div className="container mx-auto px-6 max-w-7xl"><div className="text-center mb-20"><h2 className="text-4xl font-black text-black mb-6 relative inline-block">علامات موثوقة<div className="absolute -bottom-2 right-1/2 transform translate-x-1/2 w-16 h-1.5 bg-yellow-400 rounded-full"></div><div className="absolute -bottom-4 right-1/2 transform translate-x-1/2 w-10 h-1 bg-blue-500 rounded-full"></div></h2><p className="text-lg text-gray-700 mt-6">شركاء النجاح والثقة</p></div><div className="flex justify-center gap-10 overflow-x-auto scrollbar-hide">{loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 w-44 bg-gray-50 rounded-2xl animate-pulse border border-yellow-200 shadow-md" />) : data?.brands.map((brand, index) => (<div key={brand.id} className="flex-shrink-0 flex items-center justify-center p-10 bg-white rounded-2xl shadow-md border-2 border-yellow-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 min-w-[200px] group hover:-translate-y-1" style={{animationDelay: `${index * 100}ms`}}><img src={brand.logo} alt={brand.name} className="h-14 w-auto object-contain group-hover:scale-110 transition-transform duration-300" loading="lazy" /></div>))}</div></div></section>
            <Section title="ماذا يقول عملاؤنا" subtitle="آراء حقيقية من عملاء سعداء بتجربتهم معنا" className="bg-white"><div className="grid grid-cols-1 md:grid-cols-3 gap-10">{loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-gray-100 h-72 rounded-2xl animate-pulse border border-gray-200" />) : data?.testimonials.map(testimonial => (<article key={testimonial.id} className="bg-gray-50 hover:bg-yellow-50 p-10 rounded-2xl shadow-md hover:shadow-xl border-2 border-yellow-200 hover:border-blue-400 flex flex-col transition-all duration-300 group"><Quote className="w-14 h-14 text-yellow-500 mb-8 group-hover:scale-110 transition-transform" /><p className="text-gray-800 leading-relaxed flex-grow text-lg font-medium">"{testimonial.quote}"</p><div className="flex items-center mt-10 pt-8 border-t border-yellow-200"><img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-full object-cover border-3 border-yellow-400" loading="lazy" /><div className="mr-5 text-right"><p className="font-bold text-black text-lg">{testimonial.name}</p><p className="text-sm text-blue-600 font-semibold">{testimonial.title}</p></div></div></article>))}</div></Section>
            <section className="py-24 bg-black text-white relative overflow-hidden"><div className="absolute inset-0 opacity-5"><div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffff00' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div></div><div className="container mx-auto px-6 max-w-4xl text-center relative z-10"><h2 className="text-5xl font-black mb-6 relative inline-block text-white">انضم إلى قائمتنا البريدية<div className="absolute -bottom-2 right-1/2 transform translate-x-1/2 w-24 h-1.5 bg-yellow-400 rounded-full"></div><div className="absolute -bottom-4 right-1/2 transform translate-x-1/2 w-16 h-1 bg-blue-500 rounded-full"></div></h2><p className="mt-8 text-xl max-w-2xl mx-auto text-gray-200 font-medium">كن أول من يعرف عن أحدث المنتجات والعروض الحصرية</p><form className="mt-12 flex flex-col sm:flex-row justify-center gap-6 max-w-2xl mx-auto"><div className="relative flex-grow"><input type="email" placeholder="أدخل بريدك الإلكتروني" aria-label="البريد الإلكتروني" className="w-full p-5 pr-14 rounded-xl text-black focus:outline-none focus:ring-4 focus:ring-yellow-400 border-3 border-yellow-400 focus:border-blue-500 transition-all text-lg font-medium" /><Mail className="h-6 w-6 text-gray-500 pointer-events-none absolute inset-y-0 right-5 top-1/2 -translate-y-1/2" /></div><button type="submit" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 px-10 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg">اشتراك</button></form></div></section>
        </div>
    );
}

// --- ( APP ENTRY POINT ) ---
export default function Page() {
    return (
        <ToastProvider>
            <MockProviders>
                <main className="bg-white min-h-screen">
                    <HomePageContent />
                </main>
            </MockProviders>
        </ToastProvider>
    );
}
