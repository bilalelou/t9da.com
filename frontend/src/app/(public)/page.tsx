'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import Head from 'next/head';
import { useCart, useWishlist } from '@/contexts/Providers';

// Icons
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, ShieldCheck, Truck, PhoneCall, Mail, Quote } from 'lucide-react';

// --- Interfaces ---
interface Slide {
    id: number;
    title: string;
    subtitle: string;
    image_url: string;
    link: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    regular_price: number;
    sale_price?: number;
    thumbnail: string;
    short_description: string;
    has_free_shipping?: boolean;
    free_shipping_note?: string;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

// [جديد] واجهة لآراء العملاء
interface Testimonial {
    id: number;
    name: string;
    title: string;
    quote: string;
    avatar: string;
}

// --- Toast & Favorites (No changes) ---
const ToastContext = createContext<{ showToast: (message: string) => void }>({ showToast: () => {} });
const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false });
    const showToast = useCallback((message) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div className="fixed bottom-10 right-10 bg-gray-900 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101]">
                    <CheckCircle size={22} className="text-green-400" />
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};
const useFavoritesContext = createContext<{ favoriteIds: Set<number>; toggleFavorite: (id: number) => void; }>({ favoriteIds: new Set(), toggleFavorite: () => {} });
const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const toggleFavorite = useCallback((productId: number) => {
        setFavoriteIds(prev => {
            const newIds = new Set(prev);
            if (newIds.has(productId)) newIds.delete(productId);
            else newIds.add(productId);
            return newIds;
        });
    }, []);
    const value = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds, toggleFavorite]);
    return <useFavoritesContext.Provider value={value}>{children}</useFavoritesContext.Provider>;
};

// --- Custom Fetch Hook ---
const useFetchData = <T,>(fetcher: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const memoizedFetcher = useCallback(fetcher, [fetcher]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await memoizedFetcher();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : "حدث خطأ غير معروف.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [memoizedFetcher]);

    return { data, loading, error };
};

// --- API ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const handleApiError = (error: any, endpoint: string) => {
    console.error(`API Error at ${endpoint}:`, error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        const fullUrl = `${API_BASE_URL}${endpoint}`;
        const errorMessage = `فشل الاتصال بالخادم. الرجاء التأكد من:\n1. أن خادم Laravel يعمل (php artisan serve).\n2. أن الرابط ${fullUrl} يعمل مباشرة في المتصفح.\n3. عدم وجود أخطاء CORS في تبويب Console بأدوات المطور (F12).`;
        throw new Error(errorMessage);
    }
    throw error;
};
const api = {
    getHomePageData: async (): Promise<{ slides: Slide[], featuredProducts: Product[], categories: Category[], testimonials: Testimonial[], todayOffers: Product[] }> => {
        const endpoint = '/home';
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error(`فشل جلب بيانات الصفحة الرئيسية (Status: ${response.status})`);
            const data = await response.json();
            // إضافة بيانات وهمية لآراء العملاء
            data.testimonials = [
                { id: 1, name: 'سارة خالد', title: 'عميلة سعيدة', quote: 'تجربة تسوق رائعة ومنتجات ذات جودة عالية. خدمة العملاء كانت ممتازة وسريعة في الرد. أنصح به بشدة!', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
                { id: 2, name: 'أحمد عبدالله', title: 'مشتري دائم', quote: 'من أفضل المتاجر التي تعاملت معها. الأسعار منافسة والتوصيل دائماً في الموعد المحدد. شكراً لكم.', avatar: 'https://randomuser.me/api/portraits/men/46.jpg' },
                { id: 3, name: 'فاطمة علي', title: 'مصممة ديكور', quote: 'وجدت كل ما أحتاجه لمشروعي الأخير بجودة لم أتوقعها. التفاصيل في المنتجات مذهلة.', avatar: 'https://randomuser.me/api/portraits/women/47.jpg' }
            ];
            // بيانات وهمية لعروض اليوم إذا لم تتوفر من الـ API
            if (!data.todayOffers) {
                data.todayOffers = [
                    {
                        id: 101,
                        name: 'هاتف ذكي عرض اليوم',
                        slug: 'smartphone-today-offer',
                        regular_price: 3500,
                        sale_price: 2999,
                        thumbnail: 'https://placehold.co/400x400/ffe066/333333?text=عرض+اليوم',
                        short_description: 'هاتف ذكي بمواصفات عالية وسعر خاص اليوم فقط.',
                        has_free_shipping: true
                    },
                    {
                        id: 102,
                        name: 'سماعات لاسلكية عرض اليوم',
                        slug: 'wireless-headphones-today-offer',
                        regular_price: 800,
                        sale_price: 650,
                        thumbnail: 'https://placehold.co/400x400/ffe066/333333?text=عرض+اليوم',
                        short_description: 'سماعات لاسلكية بجودة صوت ممتازة.',
                        has_free_shipping: false
                    }
                ];
            }
            return data;
        } catch (error) {
            handleApiError(error, endpoint);
            return { slides: [], featuredProducts: [], categories: [], testimonials: [], todayOffers: [] };
        }
    },
};

// --- Components ---
const formatCurrency = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) return '';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

const ProductCard = React.memo(({ product }: { product: Product }) => {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    
    const isWishlisted = isInWishlist(product.id);
    
    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const productToAdd = {
            ...product,
            price: product.sale_price || product.regular_price,
            inStock: true,
            stock: 10 // افتراض توفر المنتج
        };
        addToCart(productToAdd, 1);
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            const wishlistItem = {
                ...product,
                price: product.sale_price || product.regular_price,
                originalPrice: product.sale_price ? product.regular_price : undefined,
                inStock: true,
                stock: 10, // افتراض توفر المنتج
                addedAt: Date.now(),
                category: 'منتج',
                brand: 'ماركة'
            };
            addToWishlist(wishlistItem);
        }
    };

    return (
        <a href={`/shop/${product.slug}`} className="cursor-pointer group relative bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            <div className="overflow-hidden h-72 bg-gray-100 relative rounded-t-3xl">
                <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform rounded-t-3xl" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=No+Image'; }} />
                
                {product.has_free_shipping && (
                    <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-lg">
                        <Truck size={12} />
                        <span>شحن مجاني</span>
                    </div>
                )}
                
                <button
                    onClick={handleWishlistClick}
                    className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors duration-300 ${
                        isWishlisted 
                            ? 'bg-red-600 text-white hover:bg-red-700' 
                            : 'bg-white text-gray-600 hover:bg-red-100 hover:text-red-600'
                    }`}
                    title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                    <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
                </button>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 truncate" title={product.name}>{product.name}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{product.short_description}</p>
                <div className="pt-4 mt-auto flex items-center justify-between">
                    {product.sale_price ? (
                        <div>
                            <span className="text-xl font-extrabold text-red-600">{formatCurrency(product.sale_price)}</span>
                            <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(product.regular_price)}</span>
                        </div>
                    ) : (
                        <span className="text-xl font-extrabold text-gray-900">{formatCurrency(product.regular_price)}</span>
                    )}
                    <button
                        onClick={handleCartClick}
                        className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transform group-hover:bg-blue-700 transition-colors hover:scale-110 shadow"
                        title="إضافة للسلة"
                        aria-label={`إضافة ${product.name} إلى السلة`}
                    >
                        <ShoppingCart size={20}/>
                    </button>
                </div>
            </div>
        </a>
    );
});
ProductCard.displayName = 'ProductCard';

const HeroSlider = ({ slides = [] }: { slides?: Slide[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const next = useCallback(() => {
        if (slides) setCurrentSlide((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
    }, [slides]);
    
    const prev = () => {
        if (slides) setCurrentSlide((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    };

    useEffect(() => {
        if (slides && slides.length > 1) {
            const slideInterval = setInterval(next, 6000);
            return () => clearInterval(slideInterval);
        }
    }, [slides, next]);

    if (!slides || slides.length === 0) {
        return <div className="relative h-screen w-full bg-gray-200 animate-pulse"></div>;
    }
    
    return (
        <section className="relative h-[90vh] w-full overflow-hidden rounded-b-3xl shadow-lg" dir="ltr">
            <div className="flex transition-transform ease-out duration-800 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide) => (
                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative rounded-b-3xl overflow-hidden">
                        <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center text-white p-6">
                            <div className="bg-black/50 backdrop-blur-sm p-8 rounded-3xl max-w-3xl animate-fade-in-up">
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">{slide.title}</h1>
                                <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow">{slide.subtitle}</p>
                                <a href={slide.link} className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-14 rounded-xl hover:bg-blue-700 transition-transform hover:scale-110 shadow-lg shadow-blue-300/50">
                                    تسوق الآن
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <button 
                      onClick={prev} 
                      aria-label="Previous slide" 
                      className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white/80 hover:bg-white p-4 rounded-full z-10 transition-colors shadow-md"
                    >
                        <ChevronLeft size={32} />
                    </button>
                    <button 
                      onClick={next} 
                      aria-label="Next slide" 
                      className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white/80 hover:bg-white p-4 rounded-full z-10 transition-colors shadow-md"
                    >
                        <ChevronRight size={32} />
                    </button>
                </>
            )}
        </section>
    );
};

const ErrorDisplay = ({ error }: { error?: string | null }) => {
    if (!error) return null;
    return (
        <div className="container mx-auto my-10 p-6 bg-red-100 border-l-8 border-red-500 text-red-900 rounded-lg shadow-md" dir="rtl" role="alert" aria-live="assertive">
            <h3 className="font-bold mb-3 text-lg">حدث خطأ في الاتصال</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono">{error}</pre>
        </div>
    );
};

// --- HomePage Content ---
function HomePageContent() {
    const { data, loading, error } = useFetchData(api.getHomePageData);
    
    // بيانات وهمية للأقسام المميزة
    const featuredSections = [
        { id: 1, name: "إلكترونيات", image: "https://placehold.co/400x200/007bff/fff?text=إلكترونيات", link: "/category/electronics" },
        { id: 2, name: "أزياء", image: "https://placehold.co/400x200/ff4081/fff?text=أزياء", link: "/category/fashion" },
        { id: 3, name: "سوبرماركت", image: "https://placehold.co/400x200/4caf50/fff?text=سوبرماركت", link: "/category/supermarket" },
        { id: 4, name: "منزل وحديقة", image: "https://placehold.co/400x200/ff9800/fff?text=منزل+وحديقة", link: "/category/home-garden" }
    ];
    // بيانات وهمية للماركات
    const brands = [
        { id: 1, name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
        { id: 2, name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
        { id: 3, name: "Adidas", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg" },
        { id: 4, name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/LG_logo_%282015%29.svg" }
    ];
    // بيانات وهمية لعروض الفلاش
    const flashOffers = [
        {
            id: 201,
            name: "ساعة ذكية فلاش",
            slug: "smart-watch-flash",
            regular_price: 1200,
            sale_price: 899,
            thumbnail: "https://placehold.co/400x400/ffeb3b/333333?text=فلاش+ديال+اليوم",
            short_description: "ساعة ذكية بتخفيض كبير لفترة محدودة.",
            has_free_shipping: true
        }
    ];
    // بيانات وهمية للمنتجات المقترحة
    const suggestedProducts = [
        {
            id: 301,
            name: "حقيبة ظهر عصرية",
            slug: "modern-backpack",
            regular_price: 350,
            thumbnail: "https://placehold.co/400x400/607d8b/fff?text=منتج+مقترح",
            short_description: "حقيبة ظهر مناسبة للمدرسة والسفر.",
            has_free_shipping: false
        },
        {
            id: 302,
            name: "سماعات بلوتوث",
            slug: "bluetooth-headphones",
            regular_price: 450,
            thumbnail: "https://placehold.co/400x400/ff4081/fff?text=منتج+مقترح",
            short_description: "سماعات بلوتوث بجودة صوت عالية.",
            has_free_shipping: true
        }
    ];
    // بيانات وهمية لشريط الخدمات
    const services = [
        { id: 1, icon: <ShieldCheck size={28} className="text-blue-600" />, title: "الدفع عند الاستلام", desc: "ادفع عند استلام طلبك بسهولة وأمان." },
        { id: 2, icon: <Truck size={28} className="text-green-600" />, title: "توصيل سريع", desc: "توصيل سريع وموثوق لكافة المدن." },
        { id: 3, icon: <PhoneCall size={28} className="text-purple-600" />, title: "دعم فني 24/7", desc: "فريق دعم متوفر على مدار الساعة." }
    ];

    return (
        <div dir="rtl" className="bg-gray-50 text-gray-800 min-h-screen">
            {/* شريط إعلان أعلى الصفحة */}
            <div className="w-full bg-blue-700 text-white py-3 px-6 text-center font-extrabold text-lg tracking-wide shadow-sm">
                وفر حتى 50% على منتجات مختارة! اكتشف العروض الآن.
            </div>

            {/* شريط الخدمات بتصميم هادئ ومتناسق */}
            <div className="w-full py-10 border-b border-gray-200 flex justify-center gap-10 bg-white shadow-sm">
                {services.map(service => (
                    <div key={service.id} className="flex flex-col items-center rounded-xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 bg-gray-50 max-w-xs text-center">
                        <div className="mb-2">{service.icon}</div>
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">{service.title}</h3>
                        <p className="text-gray-600 text-sm">{service.desc}</p>
                    </div>
                ))}
            </div>

            {/* سلايدر رئيسي بهيئة لطيفة وموحدة */}
            <HeroSlider slides={data?.slides} />

            <ErrorDisplay error={error} />

            {/* أقسام مميزة */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">الأقسام المميزة</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {featuredSections.map(section => (
                            <a key={section.id} href={section.link} className="group relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                <img src={section.image} alt={section.name} className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                    <h3 className="text-xl font-bold text-white p-4">{section.name}</h3>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* شريط ماركات ببساطة متناسقة */}
            <section className="py-10 bg-gray-100 border-t border-b border-gray-200">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex gap-10 overflow-x-auto scrollbar-hide">
                        {brands.map(brand => (
                            <div key={brand.id} className="flex-shrink-0 flex flex-col items-center min-w-[120px] bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                                <img src={brand.logo} alt={brand.name} className="h-10 w-auto object-contain mb-2" loading="lazy" />
                                <span className="font-semibold text-gray-700">{brand.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* عروض فلاش */}
            <section className="py-16 bg-gradient-to-r from-pink-50 to-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-3xl font-extrabold text-pink-600 mb-10 text-center">عروض فلاش</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {flashOffers.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
            </section>

            {/* عروض اليوم */}
            <section className="py-20 bg-yellow-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-4xl font-extrabold text-yellow-800 mb-3 text-center">عروض اليوم</h2>
                    <p className="text-center text-yellow-700 mb-12">اغتنم أفضل التخفيضات لفترة محدودة</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ?
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white h-96 rounded-3xl animate-pulse shadow-sm" />
                            ))
                        : (data?.todayOffers?.length
                            ? data.todayOffers.map((product) => <ProductCard key={product.id} product={product} />)
                            : <div className="col-span-4 text-center text-yellow-800 font-semibold">لا توجد عروض اليوم حالياً</div>
                        )}
                    </div>
                </div>
            </section>

            {/* منتجات مقترحة */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-10 text-center">منتجات مقترحة لك</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {suggestedProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </div>
            </section>

            {/* الأكثر مبيعاً */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">الأكثر مبيعاً</h2>
                    <p className="text-center text-gray-700 mb-14">اكتشف المنتجات التي يعشقها عملاؤنا</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? 
                            Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white h-96 rounded-3xl animate-pulse shadow-sm" />) : 
                            data?.featuredProducts?.map((product) => <ProductCard key={product.id} product={product} />)
                        }
                    </div>
                </div>
            </section>

            {/* تسوق حسب التصنيف */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-3 text-center">تسوق حسب التصنيف</h2>
                    <p className="text-center text-gray-700 mb-12">تصفح مجموعاتنا المتنوعة</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {loading ? 
                             Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="w-full h-96 bg-gray-100 rounded-3xl animate-pulse shadow-sm" />
                             )) : 
                             data?.categories?.map(category => (
                                <a href={`/category/${category.slug}`} key={category.id} className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-400">
                                    <img src={category.image} alt={category.name} className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 rounded-3xl" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent flex items-end rounded-3xl">
                                        <h3 className="text-3xl font-extrabold text-white p-8 transform group-hover:-translate-y-2 transition-transform duration-300">{category.name}</h3>
                                    </div>
                                </a>
                             ))
                         }
                    </div>
                </div>
            </section>

            {/* كلام العملاء */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">ماذا يقول عملاؤنا</h2>
                    <p className="text-center text-gray-700 mb-12">آراء حقيقية من عملاء سعداء</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ?
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white h-64 rounded-3xl animate-pulse shadow-sm" />
                            )) :
                            data?.testimonials?.map(testimonial => (
                                <article key={testimonial.id} className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200">
                                    <Quote className="w-10 h-10 text-blue-600 mb-4" />
                                    <p className="text-gray-700 mt-2 text-lg leading-relaxed">{testimonial.quote}</p>
                                    <div className="flex items-center mt-6 pt-6 border-t border-gray-200">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                                        <div className="mr-4 text-right">
                                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </article>
                            ))
                        }
                    </div>
                </div>
            </section>

            {/* مميزات التسوق */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 max-w-7xl">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">تجربة تسوق لا مثيل لها</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Truck size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">شحن سريع وموثوق</h3>
                            <p className="text-gray-600">توصيل سريع وآمن لجميع أنحاء المغرب.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">دفع آمن 100%</h3>
                            <p className="text-gray-600">حماية كاملة لبياناتك وحسابك.</p>
                        </div>
                        <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200 text-center hover:shadow-lg transition-shadow duration-300">
                            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <PhoneCall size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">دعم فني متميز</h3>
                            <p className="text-gray-600">خدمة عملاء متوفرة على مدار الساعة لمساعدتك.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* النشرة البريدية */}
            <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-t-3xl">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-4xl font-extrabold tracking-tight leading-tight">انضم إلى قائمتنا البريدية</h2>
                    <p className="mt-4 text-lg max-w-xl mx-auto text-blue-200">كن أول من يعرف عن أحدث المنتجات والعروض الحصرية.</p>
                    <form className="mt-8 flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                        <div className="relative flex-grow">
                            <input 
                              type="email" 
                              placeholder="أدخل بريدك الإلكتروني" 
                              aria-label="البريد الإلكتروني"
                              className="w-full p-4 pr-12 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400" 
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors shadow-lg"
                          aria-label="اشتراك في النشرة البريدية"
                        >
                          اشتراك الآن
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

// --- Entry Point ---
export default function Page() {
    return (
        <>
            <Head>
                <title>تقدا | أفضل متجر إلكتروني في المغرب</title>
                <meta name="description" content="تقدا - تسوق إلكتروني في المغرب، عروض حصرية، شحن سريع، دفع آمن، منتجات أصلية، آراء العملاء، أقسام متنوعة." />
                <meta name="keywords" content="تقدا, متجر إلكتروني, المغرب, تسوق, عروض, شحن مجاني, دفع عند الاستلام, منتجات أصلية" />
                <meta property="og:title" content="تقدا | أفضل متجر إلكتروني في المغرب" />
                <meta property="og:description" content="تقدا - تسوق إلكتروني في المغرب، عروض حصرية، شحن سريع، دفع آمن، منتجات أصلية." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://t9da.com/" />
                <meta property="og:image" content="https://t9da.com/logo.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="تقدا | أفضل متجر إلكتروني في المغرب" />
                <meta name="twitter:description" content="تقدا - تسوق إلكتروني في المغرب، عروض حصرية، شحن سريع، دفع آمن، منتجات أصلية." />
                <meta name="twitter:image" content="https://t9da.com/logo.png" />
                <link rel="canonical" href="https://t9da.com/" />
                <script type="application/ld+json">
                {`
                {
                  "@context": "https://schema.org",
                  "@type": "Store",
                  "name": "تقدا",
                  "url": "https://t9da.com/",
                  "logo": "https://t9da.com/logo.png",
                  "description": "تقدا - أفضل متجر إلكتروني في المغرب، عروض حصرية، شحن سريع، دفع آمن، منتجات أصلية.",
                  "address": {
                    "@type": "PostalAddress",
                    "addressCountry": "MA"
                  }
                }
                `}
                </script>
            </Head>
            <ToastProvider>
                <FavoritesProvider>
                    <main className="bg-gray-50 min-h-screen flex flex-col">
                        <HomePageContent />
                    </main>
                </FavoritesProvider>
            </ToastProvider>
        </>
    );
}
