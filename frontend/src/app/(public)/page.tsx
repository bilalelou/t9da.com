'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo, useRef } from 'react';
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, ShieldCheck, Truck, PhoneCall, Mail, Quote, Zap, Star, Tag, Clock } from 'lucide-react';

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
        const response = await fetch(`${API_BASE_URL}/api/sliders/active`);
        if (!response.ok) throw new Error('فشل جلب بيانات السلايدر من الخادم');
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) throw new Error('صيغة البيانات المستلمة للسلايدر غير صحيحة');
        return result.data.map((slider: any) => ({ id: slider.id, title: slider.title, subtitle: slider.description, image_url: slider.image_url, link: slider.button_link }));
    },
    getCategories: async (): Promise<Category[]> => {
        const response = await fetch(`${API_BASE_URL}/public/categories`);
        if (!response.ok) throw new Error('فشل جلب التصنيفات من الخادم');
        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) throw new Error('صيغة البيانات المستلمة للتصنيفات غير صحيحة');
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
            { id: 998, name: 'تصنيف احتياطي', slug: '#', image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1964&auto=format&fit=crop' },
            { id: 999, name: 'تأكد من المسار', slug: '#', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop' },
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

// --- ( HOME PAGE COMPONENTS ) ---
const Section = ({ title, subtitle, children, className = '' }: { title: string, subtitle?: string, children: React.ReactNode, className?: string }) => (<section className={`py-16 sm:py-20 ${className}`}><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><div className="text-center mb-12"><h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">{title}</h2>{subtitle && <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">{subtitle}</p>}</div>{children}</div></section>);
const StarRating = ({ rating, review_count }: { rating: number, review_count: number }) => (<div className="flex items-center gap-1.5"><div className="flex items-center">{[...Array(5)].map((_, i) => <Star key={i} size={16} className={i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />)}</div><span className="text-xs text-slate-500 font-medium">({review_count})</span></div>);
const ProductCard = React.memo(({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { showToast } = useContext(ToastContext);
    const isWishlisted = isInWishlist(product.id);
    const hasSale = product.sale_price && product.sale_price < product.regular_price;
    const handleCartClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addToCart({ ...product, price: product.sale_price || product.regular_price }, 1); showToast(`تمت إضافة "${product.name}" إلى السلة!`); };
    const handleWishlistClick = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); if (isWishlisted) { removeFromWishlist(product.id); showToast(`تمت إزالة "${product.name}" من المفضلة.`); } else { addToWishlist(product); showToast(`تمت إضافة "${product.name}" إلى المفضلة!`); } };
    return (<a href={`/shop/${product.slug}`} className="cursor-pointer group relative bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full"><div className="overflow-hidden h-64 bg-slate-100 relative"><img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f1f5f9/94a3b8?text=Error'; }} /><div className="absolute top-3 right-3 flex flex-col gap-2">{hasSale && <div className="bg-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">تخفيض</div>}{product.has_free_shipping && <div className="bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-md">شحن مجاني</div>}</div><button onClick={handleWishlistClick} className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/70 text-slate-700 hover:bg-white hover:text-red-500'}`} title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"} ><Heart size={18} className={isWishlisted ? 'fill-current' : ''} /></button></div><div className="p-4 flex flex-col flex-grow"><h3 className="text-base font-bold text-slate-800 truncate" title={product.name}>{product.name}</h3>{product.rating && product.review_count && <div className="mt-2"><StarRating rating={product.rating} review_count={product.review_count} /></div>}<div className="pt-3 mt-auto flex items-end justify-between"><div>{hasSale ? (<><span className="text-xl font-extrabold text-red-600">{formatCurrency(product.sale_price!)}</span><span className="text-sm text-slate-400 line-through ml-2">{formatCurrency(product.regular_price)}</span></>) : (<span className="text-xl font-extrabold text-slate-900">{formatCurrency(product.regular_price)}</span>)}</div><button onClick={handleCartClick} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transform group-hover:bg-blue-700 transition-all duration-300 hover:scale-110 shadow-lg" title="إضافة للسلة" aria-label={`إضافة ${product.name} إلى السلة`}><ShoppingCart size={20}/></button></div></div></a>);
});
ProductCard.displayName = 'ProductCard';
const HeroSlider = ({ slides }: { slides: Slide[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const next = useCallback(() => setCurrentSlide(curr => (curr === slides.length - 1 ? 0 : curr + 1)), [slides.length]);
    const prev = () => setCurrentSlide(curr => (curr === 0 ? slides.length - 1 : curr - 1));
    useEffect(() => { if (slides.length > 1) { const slideInterval = setInterval(next, 5000); return () => clearInterval(slideInterval); } }, [slides.length, next]);
    if (!slides || slides.length === 0) { return <div className="relative h-[80vh] w-full bg-slate-200 animate-pulse"></div>; }
    return (<section className="relative h-[80vh] w-full overflow-hidden" dir="ltr"><div className="flex transition-transform ease-in-out duration-700 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>{slides.map(slide => (<div key={slide.id} className="w-full h-full flex-shrink-0 relative"><img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50"></div><div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6" dir="rtl"><div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl max-w-3xl animate-fade-in-up"><h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">{slide.title}</h1><p className="mt-4 text-lg md:text-xl text-slate-200 drop-shadow">{slide.subtitle}</p><a href={slide.link} className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg">تسوق الآن</a></div></div></div>))}</div>{slides.length > 1 && (<><button onClick={prev} aria-label="Previous slide" className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full z-10 transition-colors shadow-md"><ChevronLeft size={28} /></button><button onClick={next} aria-label="Next slide" className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full z-10 transition-colors shadow-md"><ChevronRight size={28} /></button></>)}</section>);
};
const ServicesBar = ({ services }: { services: Service[] }) => (<div className="bg-slate-50 border-b border-slate-200"><div className="container mx-auto px-6 max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 py-8">{services.map(service => (<div key={service.id} className="flex items-center gap-4 p-4"><div className="text-blue-600 bg-blue-100 p-3 rounded-full">{service.icon}</div><div><h3 className="font-bold text-base text-slate-900">{service.title}</h3><p className="text-slate-600 text-sm">{service.description}</p></div></div>))}</div></div>);

const CategorySlider = ({ categories }: { categories: Category[] }) => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clonedCategories = useMemo(() => {
        if (categories.length === 0) return [];
        return [categories[categories.length - 1], ...categories, categories[0]];
    }, [categories]);

    const itemWidth = 160 + 24; // w-40 (160px) + gap-6 (24px)
    const transitionDuration = 300;

    const handleNext = () => {
        if (!isTransitioning) return;
        setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (!isTransitioning) return;
        setCurrentIndex(prev => prev - 1);
    };

    useEffect(() => {
        if (currentIndex === categories.length + 1) { // After transitioning to the first clone at the end
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(1);
            }, transitionDuration);
        } else if (currentIndex === 0) { // After transitioning to the last clone at the beginning
            timeoutRef.current = setTimeout(() => {
                setIsTransitioning(false);
                setCurrentIndex(categories.length);
            }, transitionDuration);
        }
    }, [currentIndex, categories.length]);

    useEffect(() => {
        if (!isTransitioning) {
            // A trick to re-enable transitions in the next render cycle after a jump
            requestAnimationFrame(() => setIsTransitioning(true));
        }
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isTransitioning]);
    
    if (categories.length === 0) return null;

    return (
        <Section title="تسوق حسب الفئات" className="bg-white">
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
                            <a href={`/category/${category.slug}`} key={`${category.id}-${index}`} className="group flex-shrink-0 flex flex-col items-center text-center transition-transform hover:-translate-y-1 w-40">
                                <div className="w-40 h-40 rounded-full overflow-hidden shadow-lg border-4 border-white group-hover:border-blue-500 transition-all duration-300">
                                    <img src={category.image} alt={category.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/160x160/f1f5f9/94a3b8?text=Img'; }} />
                                </div>
                                <h3 className="mt-4 text-sm sm:text-base font-bold text-slate-800">{category.name}</h3>
                            </a>
                        ))}
                    </div>
                </div>

                <button onClick={handlePrev} aria-label="الفئة السابقة" className="absolute top-1/2 -translate-y-1/2 -left-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-100 transition-colors z-10">
                    <ChevronLeft className="text-slate-800" />
                </button>
                <button onClick={handleNext} aria-label="الفئة التالية" className="absolute top-1/2 -translate-y-1/2 -right-4 w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-100 transition-colors z-10">
                    <ChevronRight className="text-slate-800" />
                </button>
            </div>
        </Section>
    );
};

const CategorySliderSkeleton = () => (
     <Section title="تسوق حسب الفئات" className="bg-white">
        <div className="relative overflow-hidden">
             <div className="flex gap-6 animate-pulse">
                 {Array.from({ length: 6 }).map((_, i) => (
                     <div key={i} className="flex-shrink-0 flex flex-col items-center w-40">
                         <div className="w-40 h-40 rounded-full bg-slate-200"></div>
                         <div className="mt-4 h-5 w-24 bg-slate-200 rounded-md"></div>
                     </div>
                 ))}
             </div>
        </div>
     </Section>
);

const PromoBanner = ({ banner }: { banner: PromoBannerData }) => (<section className="py-16 sm:py-20 bg-slate-50"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><a href={banner.link} className="group relative block rounded-2xl overflow-hidden shadow-xl"><img src={banner.image_url} alt={banner.title} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" /><div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20"></div><div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-white"><h2 className="text-3xl md:text-4xl font-extrabold max-w-md">{banner.title}</h2><p className="mt-2 text-lg text-slate-200 max-w-md">{banner.subtitle}</p><div className="mt-8"><span className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg group-hover:bg-slate-200 transition-colors">{banner.button_text}</span></div></div></a></div></section>);
const CountdownTimer = ({ endDate }: { endDate: string }) => {
    const { days, hours, minutes, seconds } = useCountdown(endDate);
    const format = (num: number) => num.toString().padStart(2, '0');
    return (<div className="flex items-center gap-2 sm:gap-4" dir="ltr">{[{label: 'أيام', value: days}, {label: 'ساعات', value: hours}, {label: 'دقائق', value: minutes}, {label: 'ثواني', value: seconds}].map(time => (<div key={time.label} className="flex flex-col items-center"><div className="text-2xl sm:text-3xl font-bold bg-white text-red-500 w-16 h-16 rounded-lg flex items-center justify-center shadow-inner">{format(time.value)}</div><span className="text-xs sm:text-sm text-white/80 mt-2">{time.label}</span></div>))}</div>);
};
const FlashSaleSection = ({ flashSale }: { flashSale: FlashSale }) => (<section className="py-16 sm:py-20 bg-gradient-to-r from-red-600 to-orange-500"><div className="container mx-auto px-4 sm:px-6 max-w-7xl"><div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12"><div className="text-white text-center md:text-right"><h2 className="text-3xl sm:text-4xl font-extrabold flex items-center gap-3 justify-center md:justify-start"><Zap size={36} className="text-yellow-300" />عروض الفلاش</h2><p className="mt-2 text-lg text-white/90">تنتهي خلال:</p></div><CountdownTimer endDate={flashSale.endDate} /></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">{flashSale.products.map(product => <ProductCard key={product.id} product={product} />)}</div></div></section>);

// --- ( MAIN HOME PAGE CONTENT ) ---
function HomePageContent() {
    const fetcher = useCallback(() => api.getHomePageData(), []);
    const { data, loading, error } = useFetchData<HomePageData>(fetcher);

    return (
        <div dir="rtl" className="bg-slate-50 text-slate-800">
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
            <section className="py-12 bg-slate-50 border-t border-b border-slate-200"><div className="container mx-auto px-6 max-w-7xl"><div className="flex justify-center gap-8 overflow-x-auto scrollbar-hide">{loading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 w-32 bg-white rounded-xl animate-pulse" />) : data?.brands.map(brand => (<div key={brand.id} className="flex-shrink-0 flex items-center justify-center p-4 bg-white rounded-lg shadow-sm border border-slate-200 min-w-[140px]"><img src={brand.logo} alt={brand.name} className="h-8 w-auto object-contain" loading="lazy" /></div>))}</div></div></section>
            <Section title="ماذا يقول عملاؤنا" subtitle="آراء حقيقية من عملاء سعداء بتجربتهم معنا" className="bg-white"><div className="grid grid-cols-1 md:grid-cols-3 gap-8">{loading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-slate-200 h-64 rounded-2xl animate-pulse" />) : data?.testimonials.map(testimonial => (<article key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col"><Quote className="w-10 h-10 text-blue-500 mb-4" /><p className="text-slate-700 leading-relaxed flex-grow">"{testimonial.quote}"</p><div className="flex items-center mt-6 pt-6 border-t border-slate-200"><img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" /><div className="mr-4 text-right"><p className="font-bold text-slate-900">{testimonial.name}</p><p className="text-sm text-slate-500">{testimonial.title}</p></div></div></article>))}</div></Section>
            <section className="py-20 bg-slate-800 text-white"><div className="container mx-auto px-6 max-w-4xl text-center"><h2 className="text-4xl font-extrabold">انضم إلى قائمتنا البريدية</h2><p className="mt-4 text-lg max-w-xl mx-auto text-slate-300">كن أول من يعرف عن أحدث المنتجات والعروض الحصرية.</p><form className="mt-8 flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto"><div className="relative flex-grow"><input type="email" placeholder="أدخل بريدك الإلكتروني" aria-label="البريد الإلكتروني" className="w-full p-4 pr-12 rounded-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-400 transition" /><Mail className="h-5 w-5 text-slate-400 pointer-events-none absolute inset-y-0 right-4 top-1/2 -translate-y-1/2" /></div><button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg">اشتراك</button></form></div></section>
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
