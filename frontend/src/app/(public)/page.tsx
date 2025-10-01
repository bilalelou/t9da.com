'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, ShieldCheck, Truck, PhoneCall, Mail, Quote, Zap, Star, Tag, Clock, Menu, X, Smartphone, Home, Tv, Monitor, Gamepad2, Sparkles, Shirt, Dumbbell, Car } from 'lucide-react';

// --- ( MOCK PROVIDERS ) ---
// These are mock providers to make the component self-contained and runnable.
// In a real app, you would import these from your actual context files.

const mockCartContext = createContext({
    addToCart: (product, quantity) => console.log('Added to cart:', product, quantity),
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
        <mockCartContext.Provider value={{ addToCart: (product, quantity) => alert(`تمت إضافة ${product.name} للسلة`) }}>
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
interface HomePageData { slides: Slide[]; featuredProducts: Product[]; categories: Category[]; testimonials: Testimonial[]; todayOffers: Product[]; services: Service[]; brands: Brand[]; flashSale: FlashSale; newArrivals: Product[]; promoBanner: PromoBannerData; }


// --- ( UTILS & CONFIG ) ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const formatCurrency = (price: number): string => {
    if (typeof price !== 'number' || isNaN(price)) return '';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

// --- ( API LAYER ) ---
const api = {
    getActiveSliders: async (): Promise<Slide[]> => {
        const response = await fetch(`${API_BASE_URL}/sliders/active`);
        if (!response.ok) throw new Error('فشل جلب بيانات السلايدر من الخادم');
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) throw new Error('صيغة البيانات المستلمة للسلايدر غير صحيحة');
        return result.data.map((slider: any) => ({ id: slider.id, title: slider.title, subtitle: slider.description, image_url: slider.image_url, link: slider.button_link }));
    },
    getCategories: async (): Promise<Category[]> => {
        const response = await fetch(`${API_BASE_URL}/public/categories`);
        if (!response.ok) throw new Error('فشل جلب التصنيفات من الخادم');
        const result = await response.json();
        
        // ✅ **هذا السطر لم يتغير**
        // هو كان سبب ظهور المشكلة لأن استجابة الخادم لم تكن تحتوي على 'success' و 'data'
        // الآن بعد إصلاح الخادم، سيمر هذا التحقق بنجاح.
        if (!result.success || !Array.isArray(result.data)) {
            throw new Error('صيغة البيانات المستلمة للتصنيفات غير صحيحة');
        }

        return result.data;
    },
    getHomePageData: async (): Promise<HomePageData> => {
        const [slidersResponse, categoriesResponse] = await Promise.allSettled([api.getActiveSliders(), api.getCategories()]);

        const slides = slidersResponse.status === 'fulfilled' ? slidersResponse.value : [
            { id: 998, title: 'بيانات احتياطية للسلايدر', subtitle: 'حدث خطأ أثناء الاتصال بالخادم', image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop', link: '#' },
            { id: 999, title: 'تأكد من تشغيل خادم Laravel', subtitle: 'وتفعيل مسار /api/sliders/active', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', link: '#' },
        ];
        if (slidersResponse.status === 'rejected') console.error("خطأ في جلب السلايدر:", slidersResponse.reason);

        const categories = categoriesResponse.status === 'fulfilled' ? categoriesResponse.value : [
            { id: 1, name: 'الإلكترونيات', slug: 'electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=400&auto=format&fit=crop' },
            { id: 2, name: 'أزياء', slug: 'fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=400&auto=format&fit=crop' },
            { id: 3, name: 'المنزل والمطبخ', slug: 'home-kitchen', image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=400&auto=format&fit=crop' },
            { id: 4, name: 'الرياضة', slug: 'sports', image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop' },
            { id: 5, name: 'الجمال والصحة', slug: 'beauty-health', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=400&auto=format&fit=crop' },
            { id: 6, name: 'السيارات', slug: 'automotive', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=400&auto=format&fit=crop' },
        ];
        if (categoriesResponse.status === 'rejected') console.error("خطأ في جلب التصنيفات:", categoriesResponse.reason);
        
        await new Promise(res => setTimeout(res, 200));
        const flashSaleEndDate = new Date();
        flashSaleEndDate.setHours(flashSaleEndDate.getHours() + 5);

        return {
            slides, categories,
            featuredProducts: [{ id: 1, name: 'ساعة ذكية أنيقة', slug: 'smart-watch', regular_price: 1500, sale_price: 1199, thumbnail: 'https://placehold.co/400x400/333/fff?text=منتج+1', short_description: 'تتبع نشاطك اليومي وأناقتك بكل سهولة.', has_free_shipping: true, rating: 4.5, review_count: 88 }, { id: 2, name: 'حقيبة ظهر عصرية', slug: 'modern-backpack', regular_price: 450, thumbnail: 'https://placehold.co/400x400/555/fff?text=منتج+2', short_description: 'تصميم متين ومساحة واسعة لكل احتياجاتك.', has_free_shipping: false, rating: 4.8, review_count: 120 }],
            testimonials: [{ id: 1, name: 'سارة خالد', title: 'عميلة سعيدة', quote: 'تجربة تسوق رائعة ومنتجات ذات جودة عالية.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' }, { id: 2, name: 'أحمد عبدالله', title: 'مشتري دائم', quote: 'الأسعار منافسة والتوصيل دائماً في الموعد.', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' }],
            todayOffers: [{ id: 101, name: 'هاتف عرض اليوم', slug: 'smartphone-offer', regular_price: 3500, sale_price: 2999, thumbnail: 'https://placehold.co/400x400/8d6e63/fff?text=عرض', short_description: 'هاتف ذكي بمواصفات عالية وسعر خاص.', has_free_shipping: true, rating: 4.6, review_count: 95 }],
            flashSale: { endDate: flashSaleEndDate.toISOString(), products: [{ id: 201, name: 'لابتوب ألعاب', slug: 'gaming-laptop', regular_price: 12500, sale_price: 9999, thumbnail: 'https://placehold.co/400x400/ff6f00/fff?text=Flash', short_description: 'أداء قوي لتجربة ألعاب لا مثيل لها.', has_free_shipping: true, rating: 4.9, review_count: 75 }] },
            newArrivals: [{ id: 301, name: 'نظارات شمسية عصرية', slug: 'modern-sunglasses', regular_price: 650, thumbnail: 'https://placehold.co/400x400/e0e0e0/333?text=جديد', short_description: 'حماية كاملة من أشعة الشمس مع تصميم أنيق.', has_free_shipping: false, rating: 4.7, review_count: 45 }],
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
    return (<a href={`/shop/${product.slug}`} className="cursor-pointer group relative bg-white border-2 border-gray-100 hover:border-yellow-400 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"><div className="overflow-hidden h-64 bg-gray-50 relative"><img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f1f5f9/64748b?text=Error'; }} /><div className="absolute top-3 right-3 flex flex-col gap-2">{hasSale && <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">تخفيض</div>}{product.has_free_shipping && <div className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">شحن مجاني</div>}</div><button onClick={handleWishlistClick} className={`absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'}`} title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"} ><Heart size={18} className={isWishlisted ? 'fill-current' : ''} /></button></div><div className="p-5 flex flex-col flex-grow"><h3 className="text-base font-bold text-gray-800 truncate group-hover:text-yellow-600 transition-colors" title={product.name}>{product.name}</h3>{product.rating && product.review_count && <div className="mt-3"><StarRating rating={product.rating} review_count={product.review_count} /></div>}<div className="pt-4 mt-auto flex items-end justify-between"><div>{hasSale ? (<><span className="text-xl font-extrabold text-red-600">{formatCurrency(product.sale_price!)}</span><span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(product.regular_price)}</span></>) : (<span className="text-xl font-extrabold text-gray-800">{formatCurrency(product.regular_price)}</span>)}</div><button onClick={handleCartClick} className="w-11 h-11 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full flex items-center justify-center transform transition-all duration-300 hover:scale-110 shadow-lg" title="إضافة للسلة" aria-label={`إضافة ${product.name} إلى السلة`}><ShoppingCart size={20}/></button></div></div></a>);
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
                        <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
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
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [activeButton, setActiveButton] = useState<'prev' | 'next' | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clonedCategories = useMemo(() => {
        if (categories.length === 0) return [];
        return [categories[categories.length - 1], ...categories, categories[0]];
    }, [categories]);

    const itemWidth = 200 + 24;
    const transitionDuration = 300;

    const handleNext = () => {
        if (!isTransitioning) return;
        setActiveButton('next');
        setCurrentIndex(prev => prev + 1);
        setTimeout(() => setActiveButton(null), 200);
    };

    const handlePrev = () => {
        if (!isTransitioning) return;
        setActiveButton('prev');
        setCurrentIndex(prev => prev - 1);
        setTimeout(() => setActiveButton(null), 200);
    };

    useEffect(() => {
        if (currentIndex === categories.length + 1) {
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, transitionDuration);
        } else if (currentIndex === 0) {
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(categories.length);
            }, transitionDuration);
        }
    }, [currentIndex, categories.length]);

    useEffect(() => {
        if (!isTransitioning) {
            requestAnimationFrame(() => setIsTransitioning(true));
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isTransitioning]);
    
    if (categories.length === 0) return null;

    return (
        <section className="py-16 sm:py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-4 relative inline-block">
                        تسوق حسب الفئات
                        <div className="absolute bottom-0 right-1/2 transform translate-x-1/2 w-16 h-1 bg-yellow-400 rounded-full"></div>
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">اكتشف مجموعة واسعة من المنتجات المصنفة حسب احتياجاتك</p>
                </div>
                
                <div className="relative">
                    <div className="overflow-hidden">
                        <div
                            className="flex gap-6"
                            style={{
                                transform: `translateX(-${currentIndex * itemWidth}px)`,
                                transition: isTransitioning ? `transform ${transitionDuration}ms ease-in-out` : 'none',
                            }}
                        >
                            {clonedCategories.map((category, index) => (
                                <a href={`/category/${category.slug}`} key={`${category.id}-${index}`} className="group flex-shrink-0 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-2 w-50">
                                    <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100 group-hover:border-yellow-400 group-hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-gray-50 to-white">
                                        <img 
                                            src={category.image} 
                                            alt={category.name} 
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                            onError={(e) => { 
                                                const target = e.currentTarget as HTMLImageElement;
                                                target.src = `https://via.placeholder.com/200x200/f1f5f9/64748b?text=${encodeURIComponent(category.name)}`; 
                                            }} 
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <h3 className="mt-6 text-base sm:text-lg font-bold text-gray-800 group-hover:text-yellow-600 transition-colors duration-300 px-2">{category.name}</h3>
                                </a>
                            ))}
                        </div>
                    </div>

                    <button onClick={handlePrev} aria-label="الفئة السابقة" className={`absolute top-1/2 -translate-y-1/2 -left-4 w-12 h-12 border-2 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 group ${
                        activeButton === 'prev' 
                            ? 'bg-transparent border-yellow-400' 
                            : 'bg-white border-gray-200 hover:border-yellow-400 hover:bg-yellow-50'
                    }`}>
                        <ChevronLeft className={`transition-colors ${
                            activeButton === 'prev'
                                ? 'text-yellow-600'
                                : 'text-gray-600 group-hover:text-yellow-600'
                        }`} />
                    </button>
                    <button onClick={handleNext} aria-label="الفئة التالية" className={`absolute top-1/2 -translate-y-1/2 -right-4 w-12 h-12 border-2 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-10 group ${
                        activeButton === 'next' 
                            ? 'bg-transparent border-yellow-400' 
                            : 'bg-white border-gray-200 hover:border-yellow-400 hover:bg-yellow-50'
                    }`}>
                        <ChevronRight className={`transition-colors ${
                            activeButton === 'next'
                                ? 'text-yellow-600'
                                : 'text-gray-600 group-hover:text-yellow-600'
                        }`} />
                    </button>
                </div>
            </div>
        </section>
    );
};

const CategorySliderSkeleton = () => (
    <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
            <div className="text-center mb-12">
                <div className="h-10 w-48 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
                <div className="h-6 w-96 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
            </div>
            <div className="relative overflow-hidden">
                <div className="flex gap-6 animate-pulse">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex-shrink-0 flex flex-col items-center w-50">
                            <div className="w-48 h-48 rounded-2xl bg-gray-200"></div>
                            <div className="mt-6 h-6 w-32 bg-gray-200 rounded-md"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

const PromoBanner = ({ banner }: { banner: PromoBannerData }) => (<section className="py-16 sm:py-20 bg-slate-50"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><a href={banner.link} className="group relative block rounded-2xl overflow-hidden shadow-xl"><img src={banner.image_url} alt={banner.title} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div><div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white"><h2 className="text-3xl md:text-4xl font-extrabold max-w-md">{banner.title}</h2><p className="mt-2 text-lg text-slate-200 max-w-md">{banner.subtitle}</p><div className="mt-8"><span className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg group-hover:bg-slate-200 transition-colors">{banner.button_text}</span></div></div></a></div></section>);
const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const { days, hours, minutes, seconds } = useCountdown(endDate);
    const format = (num: number) => num.toString().padStart(2, '0');
    return (<div className="flex items-center gap-3 sm:gap-6" dir="ltr">{[{label: 'أيام', value: days, color: 'from-blue-500 to-blue-600'}, {label: 'ساعات', value: hours, color: 'from-green-500 to-green-600'}, {label: 'دقائق', value: minutes, color: 'from-yellow-500 to-yellow-600'}, {label: 'ثواني', value: seconds, color: 'from-red-500 to-red-600'}].map(time => (<div key={time.label} className="flex flex-col items-center group"><div className={`text-3xl sm:text-4xl font-black bg-gradient-to-br ${time.color} text-white w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border-2 border-white/20`}>{format(time.value)}</div><span className="text-sm sm:text-base text-white font-bold mt-3 group-hover:text-yellow-300 transition-colors">{time.label}</span></div>))}</div>);
};
const FlashSaleSection = ({ flashSale }: { flashSale: FlashSale }) => (<section className="py-20 sm:py-24 bg-gradient-to-br from-red-600 via-red-500 to-orange-500 relative overflow-hidden"><div className="absolute inset-0 bg-black/20"></div><div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div></div><div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10"><div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16"><div className="text-white text-center md:text-right"><h2 className="text-5xl sm:text-6xl font-black flex items-center gap-4 justify-center md:justify-start mb-4"><Zap size={50} className="text-yellow-300 animate-bounce" />عروض الفلاش</h2><div className="w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mx-auto md:mx-0 mb-2"></div><div className="w-16 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full mx-auto md:mx-0 mb-6"></div><p className="text-xl text-white/95 font-medium">تنتهي خلال:</p></div><div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"><CountdownTimer endDate={flashSale.endDate} /></div></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-10">{flashSale.products.map(product => <ProductCard key={product.id} product={product} />)}</div></div></section>);



// --- ( MAIN HOME PAGE CONTENT ) ---
function HomePageContent() {
    const fetcher = useCallback(() => api.getHomePageData(), []);
    const { data, loading, error } = useFetchData<HomePageData>(fetcher);

    return (
        <div dir="rtl" className="bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-800 min-h-screen">
            {/* Categories Menu Section */}
            <div className="bg-white border-b border-gray-100 py-4">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex justify-start">
                    <CategoriesMenu />
                </div>
            </div>
            
            <HeroSlider slides={data?.slides || []} />
            <ServicesBar services={data?.services || []} />
            <ErrorDisplay error={error} />
            
            {loading ? (
                <CategorySliderSkeleton />
            ) : (
                data?.categories && <CategorySlider categories={data.categories} />
            )}
            
            {loading ? (<div className="py-16 sm:py-20 bg-gradient-to-r from-red-600 to-orange-500"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><div className="h-40 bg-white/20 rounded-xl animate-pulse"></div></div></div>) : (data?.flashSale && <FlashSaleSection flashSale={data.flashSale} />)}
            <Section title="عروض اليوم" subtitle="اغتنم أفضل التخفيضات والصفقات الحصرية لفترة محدودة" className="bg-slate-100"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.todayOffers.map(product => <ProductCard key={product.id} product={product} />)}</div></Section>
            {loading ? (<div className="py-16 sm:py-20 bg-slate-50"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><div className="h-80 w-full bg-slate-200 rounded-2xl animate-pulse"></div></div></div>) : (data?.promoBanner && <PromoBanner banner={data.promoBanner} />)}
            <Section title="الأكثر مبيعاً" subtitle="اكتشف المنتجات التي يعشقها عملاؤنا ويثقون بها" className="bg-white"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.featuredProducts.map(product => <ProductCard key={product.id} product={product} />)}</div></Section>
            <Section title="وصل حديثاً" subtitle="اكتشف أحدث المنتجات التي أضفناها لمتجرنا" className="bg-slate-100"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{loading ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />) : data?.newArrivals.map(product => <ProductCard key={product.id} product={product} />)}</div></Section>
            <section className="py-20 bg-gradient-to-r from-gray-50 via-white to-gray-50 border-t border-b border-gray-100"><div className="container mx-auto px-6 max-w-7xl"><div className="text-center mb-16"><h2 className="text-4xl font-black text-gray-800 mb-6 relative inline-block">علامات موثوقة<div className="absolute -bottom-2 right-1/2 transform translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div><div className="absolute -bottom-4 right-1/2 transform translate-x-1/2 w-10 h-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div></h2><p className="text-lg text-gray-600 mt-4">شركاء النجاح والثقة</p></div><div className="flex justify-center gap-8 overflow-x-auto scrollbar-hide">{loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-24 w-40 bg-white rounded-3xl animate-pulse border border-gray-100 shadow-lg" />) : data?.brands.map((brand, index) => (<div key={brand.id} className="flex-shrink-0 flex items-center justify-center p-8 bg-white rounded-3xl shadow-lg border border-gray-100 hover:border-yellow-300 hover:shadow-2xl transition-all duration-500 min-w-[180px] group hover:-translate-y-2" style={{animationDelay: `${index * 100}ms`}}><img src={brand.logo} alt={brand.name} className="h-12 w-auto object-contain group-hover:scale-125 transition-transform duration-500 filter group-hover:brightness-110" loading="lazy" /></div>))}</div></div></section>
            <Section title="ماذا يقول عملاؤنا" subtitle="آراء حقيقية من عملاء سعداء بتجربتهم معنا" className="bg-white"><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-gray-200 h-64 rounded-2xl animate-pulse" />) : data?.testimonials.map(testimonial => (<article key={testimonial.id} className="bg-gray-50 hover:bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl border-2 border-gray-100 hover:border-yellow-200 flex flex-col transition-all duration-300 group"><Quote className="w-12 h-12 text-yellow-500 mb-6 group-hover:scale-110 transition-transform" /><p className="text-gray-700 leading-relaxed flex-grow text-lg">"{testimonial.quote}"</p><div className="flex items-center mt-8 pt-6 border-t border-gray-200"><img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-yellow-200" loading="lazy" /><div className="mr-4 text-right"><p className="font-bold text-gray-800 text-lg">{testimonial.name}</p><p className="text-sm text-yellow-600 font-medium">{testimonial.title}</p></div></div></article>))}</div></Section>
            <section className="py-20 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 text-white relative overflow-hidden"><div className="absolute inset-0 opacity-10"><div className="absolute inset-0" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div></div><div className="container mx-auto px-6 max-w-4xl text-center relative z-10"><h2 className="text-4xl font-extrabold mb-4 relative inline-block">انضم إلى قائمتنا البريدية<div className="absolute bottom-0 right-1/2 transform translate-x-1/2 w-20 h-1 bg-yellow-400 rounded-full"></div></h2><p className="mt-6 text-lg max-w-xl mx-auto text-gray-300">كن أول من يعرف عن أحدث المنتجات والعروض الحصرية.</p><form className="mt-10 flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto"><div className="relative flex-grow"><input type="email" placeholder="أدخل بريدك الإلكتروني" aria-label="البريد الإلكتروني" className="w-full p-4 pr-12 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-yellow-400 border-2 border-gray-300 focus:border-yellow-400 transition-all" /><Mail className="h-5 w-5 text-gray-400 pointer-events-none absolute inset-y-0 right-4 top-1/2 -translate-y-1/2" /></div><button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">اشتراك</button></form></div></section>
        </div>
    );
}

// --- ( APP ENTRY POINT ) ---
export default function Page() {
    return (
        <ToastProvider>
            <MockProviders>
                <main className="bg-slate-50 min-h-screen">
                    <HomePageContent />
                </main>
            </MockProviders>
        </ToastProvider>
    );
}