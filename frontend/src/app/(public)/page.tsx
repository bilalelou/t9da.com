'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';

// Icons
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, LoaderCircle, ShieldCheck, Truck, PhoneCall, Mail, Star, Quote } from 'lucide-react';

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
    image: string;
    short_description: string;
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
                setError(err instanceof Error ? err.message : "An unknown error occurred.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [memoizedFetcher]);

    return { data, loading, error };
};

// --- API ---
const API_BASE_URL = 'http://localhost:8000/api';
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
    getHomePageData: async (): Promise<{ slides: Slide[], featuredProducts: Product[], categories: Category[], testimonials: Testimonial[] }> => {
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
            return data;
        } catch (error) {
            handleApiError(error, endpoint);
            return { slides: [], featuredProducts: [], categories: [], testimonials: [] };
        }
    },
};

// --- Components ---
const formatCurrency = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) return '';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

const ProductCard = React.memo(({ product }) => {
    return (
        <a href={`/product/${product.slug}`} className="cursor-pointer group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
            <div className="overflow-hidden h-72 p-4 bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=No+Image'; }} />
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                <div className="pt-3 mt-auto flex items-end justify-between">
                    {product.sale_price ? (
                        <div>
                            <span className="text-xl font-bold text-red-600">{formatCurrency(product.sale_price)}</span>
                            <span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(product.regular_price)}</span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-gray-800">{formatCurrency(product.regular_price)}</span>
                    )}
                     <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transform group-hover:bg-blue-700 transition-colors">
                        <ShoppingCart size={20}/>
                     </div>
                </div>
            </div>
        </a>
    );
});
ProductCard.displayName = 'ProductCard';

const HeroSlider = ({ slides }: { slides: Slide[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const next = useCallback(() => {
        if (slides) setCurrentSlide((curr) => (curr === slides.length - 1 ? 0 : curr + 1));
    }, [slides]);
    
    const prev = () => {
        if (slides) setCurrentSlide((curr) => (curr === 0 ? slides.length - 1 : curr - 1));
    };

    useEffect(() => {
        if (slides && slides.length > 1) {
            const slideInterval = setInterval(next, 5000);
            return () => clearInterval(slideInterval);
        }
    }, [slides, next]);

    if (!slides || slides.length === 0) {
        return <div className="relative h-screen w-full bg-gray-200 animate-pulse"></div>;
    }
    
    return (
        <section className="relative h-screen w-full overflow-hidden" dir="ltr">
            <div className="flex transition-transform ease-out duration-700 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide) => (
                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                        <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center text-white p-4">
                            <div className="bg-black/40 backdrop-blur-md p-10 rounded-2xl max-w-3xl animate-fade-in-up">
                                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{slide.title}</h1>
                                <p className="mt-4 text-lg md:text-xl text-gray-200">{slide.subtitle}</p>
                                <a href={slide.link} className="mt-8 inline-block bg-blue-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-blue-700 transition-transform hover:scale-105">تسوق الآن</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <button onClick={prev} aria-label="Previous slide" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full z-10 transition-colors"><ChevronLeft size={28} /></button>
                    <button onClick={next} aria-label="Next slide" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full z-10 transition-colors"><ChevronRight size={28} /></button>
                </>
            )}
        </section>
    );
};

const ErrorDisplay = ({ error }) => {
    if (!error) return null;
    return (
        <div className="container mx-auto my-8 p-4 bg-red-50 border-l-4 border-red-400 text-red-800" dir="rtl">
            <h3 className="font-bold mb-2">حدث خطأ في الاتصال</h3>
            <pre className="text-sm whitespace-pre-wrap font-mono">{error}</pre>
        </div>
    );
};

// --- HomePage Content ---
function HomePageContent() {
    const { data, loading, error } = useFetchData(api.getHomePageData);
    
    return (
        <div dir="rtl">
            <HeroSlider slides={data?.slides} />
            
            <ErrorDisplay error={error} />
            
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">الأكثر مبيعاً</h2>
                        <p className="mt-2 text-lg text-gray-600">اكتشف المنتجات التي يعشقها عملاؤنا</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? 
                            Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white h-96 rounded-2xl animate-pulse"></div>) : 
                            data?.featuredProducts?.map((product) => <ProductCard key={product.id} product={product} />)
                        }
                    </div>
                </div>
            </section>
            
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">تسوق حسب التصنيف</h2>
                        <p className="mt-2 text-lg text-gray-600">تصفح مجموعاتنا المتنوعة</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {loading ? 
                             Array.from({ length: 3 }).map((_, i) => <div key={i} className="w-full h-96 bg-gray-100 rounded-2xl animate-pulse"></div>) : 
                             data?.categories?.map((category) => (
                                <a href={`/category/${category.slug}`} key={category.id} className="group relative rounded-2xl overflow-hidden shadow-lg">
                                    <img src={category.image} alt={category.name} className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                                        <h3 className="text-3xl font-bold text-white p-8 transform group-hover:-translate-y-2 transition-transform duration-300">{category.name}</h3>
                                    </div>
                                </a>
                             ))
                         }
                    </div>
                </div>
            </section>
            
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                     <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">ماذا يقول عملاؤنا</h2>
                        <p className="mt-2 text-lg text-gray-600">آراء حقيقية من عملاء سعداء</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {loading ? 
                            Array.from({ length: 3 }).map((_, i) => <div key={i} className="bg-white h-64 rounded-2xl animate-pulse"></div>) :
                            data?.testimonials?.map((testimonial) => (
                                <div key={testimonial.id} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                                    <Quote className="w-10 h-10 text-blue-500" />
                                    <p className="text-gray-700 mt-4 text-lg">{testimonial.quote}</p>
                                    <div className="flex items-center mt-6 pt-6 border-t border-gray-100">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
                                        <div className="mr-4">
                                            <p className="font-bold text-gray-900">{testimonial.name}</p>
                                            <p className="text-sm text-gray-500">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>

             {/* [تعديل] تم نقل قسم المميزات إلى هنا بتصميم جديد */}
             <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">تجربة تسوق لا مثيل لها</h2>
                        <p className="mt-2 text-lg text-gray-600">نحن نهتم بأدق التفاصيل لنقدم لك الأفضل</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto"> <Truck size={32}/> </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">شحن سريع وموثوق</h3>
                            <p className="text-gray-600">توصيل سريع لجميع أنحاء المغرب.</p>
                        </div>
                         <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 mx-auto"> <ShieldCheck size={32}/> </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">دفع آمن 100%</h3>
                            <p className="text-gray-600">نضمن لك حماية كاملة لبياناتك.</p>
                        </div>
                         <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 text-center hover:shadow-lg transition-shadow">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4 mx-auto"> <PhoneCall size={32}/> </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">دعم فني متميز</h3>
                            <p className="text-gray-600">مستعدون لمساعدتك في أي وقت.</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* [تعديل] تم إعادة تصميم قسم النشرة البريدية */}
            <section className="py-24 bg-gray-800 text-white">
                <div className="container mx-auto px-6 text-center">
                     <h2 className="text-4xl font-extrabold tracking-tight">انضم إلى قائمتنا البريدية</h2>
                     <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">كن أول من يعرف عن جديدنا وعروضنا الحصرية التي لا تقاوم!</p>
                     <form className="mt-8 flex flex-col sm:flex-row justify-center max-w-lg mx-auto gap-3">
                         <div className="relative flex-grow">
                             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                                 <Mail className="h-5 w-5 text-gray-400" />
                             </div>
                            <input type="email" placeholder="أدخل بريدك الإلكتروني" className="w-full p-4 pr-12 text-gray-900 border border-transparent rounded-lg focus:ring-2 focus:ring-blue-500" />
                         </div>
                         <button type="submit" className="bg-blue-600 font-bold py-4 px-8 rounded-lg hover:bg-blue-700 transition-colors">
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
        <ToastProvider>
            <FavoritesProvider>
                 <div className="bg-white flex flex-col min-h-screen">
                    <main>
                        <HomePageContent />
                    </main>
                </div>
            </FavoritesProvider>
        </ToastProvider>
    );
}

