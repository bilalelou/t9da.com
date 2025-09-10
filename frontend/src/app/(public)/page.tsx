"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft, ShieldCheck, Truck, PhoneCall, LoaderCircle, Twitter, Instagram, Facebook } from 'lucide-react';

// --- واجهات البيانات (Interfaces) ---
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

interface Brand {
  id: number;
  name: string;
  logo: string;
}

// --- تمت الإضافة: نظام التنبيهات (Toast Notification System) ---
const ToastContext = createContext<{ showToast: (message: string) => void }>({ showToast: () => {} });

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => {
            setToast({ message: '', visible: false });
        }, 3000);
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


// --- Hook مخصص لجلب البيانات مع حالات التحميل والخطأ ---
const useFetchData = <T,>(fetcher: () => Promise<T>) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useCallback to prevent re-creating fetcher function on every render
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


// --- Hook مخصص لتأثير الظهور التدريجي ---
const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [element, setElement] = useState<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [element, options]);

    return [setElement, isVisible] as const;
};


// --- تقسيم الواجهة لمكونات صغيرة ومعزولة ---

// مكون لعرض قسم مع تأثير الظهور
const AnimatedSection = React.memo(({ children }: { children: React.ReactNode }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
    return (
        <section ref={ref} className={`transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {children}
        </section>
    );
});
AnimatedSection.displayName = 'AnimatedSection';


// مكون لعرض بطاقة المنتج
const ProductCard = React.memo(({ product, onAddToCart }: { product: Product; onAddToCart: (productName: string) => void; }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { showToast } = useToast();

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation(); // Prevent event bubbling
        setIsFavorite(!isFavorite);
        showToast(isFavorite ? `تمت إزالة "${product.name}" من المفضلة` : `تمت إضافة "${product.name}" إلى المفضلة`);
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onAddToCart(product.name);
    };

    return (
        <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <a href={`/products/${product.slug}`} className="flex flex-col flex-grow">
                <div className="overflow-hidden h-72 p-4 bg-white">
                     <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 h-10 overflow-hidden line-clamp-2">{product.short_description}</p>
                    </div>
                    <div className="mt-auto pt-2 flex items-baseline gap-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-xl font-bold text-[#eab676]">{product.sale_price} ر.س</span>
                                <span className="text-sm text-gray-400 line-through">{product.regular_price} ر.س</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-[#1e81b0]">{product.regular_price} ر.س</span>
                        )}
                    </div>
                </div>
            </a>
            <button onClick={handleFavoriteClick} aria-label={`Add ${product.name} to favorites`} className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white z-10 ${isFavorite ? 'text-red-500' : 'text-gray-600'}`}>
                <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button onClick={handleCartClick} aria-label={`Add ${product.name} to cart`} className="absolute bottom-5 left-5 bg-white p-3 rounded-full shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-[#eab676] hover:text-white z-10">
                <ShoppingCart size={22} />
            </button>
        </div>
    );
});
ProductCard.displayName = 'ProductCard';


// مكون لعرض هيكل التحميل (Loading Skeleton) لبطاقة المنتج
const ProductSkeleton = () => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm animate-pulse">
        <div className="bg-gray-300 h-72 w-full"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3 mt-4"></div>
        </div>
    </div>
);


// مكون السلايدر الرئيسي
const HeroSlider = ({ slides }: { slides: Slide[] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const next = useCallback(() => setCurrentSlide((curr) => (curr === slides.length - 1 ? 0 : curr + 1)), [slides.length]);
    const prev = () => setCurrentSlide((curr) => (curr === 0 ? slides.length - 1 : curr - 1));

    useEffect(() => {
        if (slides.length > 1) {
            const slideInterval = setInterval(next, 5000);
            return () => clearInterval(slideInterval);
        }
    }, [slides.length, next]);

    if (!slides || slides.length === 0) {
        return <div className="relative h-[600px] w-full bg-gray-200 animate-pulse flex items-center justify-center"><LoaderCircle className="animate-spin text-gray-400" size={48} /></div>;
    }
    
    return (
        <section className="relative h-[600px] w-full overflow-hidden" aria-roledescription="carousel" aria-label="Hero promotions">
            <div className="flex transition-transform ease-out duration-700 h-full" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                {slides.map((slide, index) => (
                    <div key={slide.id} className="w-full h-full flex-shrink-0 relative">
                        <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" fetchPriority={index === 0 ? "high" : "auto"} />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center text-white p-4">
                            <div className="bg-black/30 backdrop-blur-sm p-8 rounded-lg max-w-3xl">
                                <h1 className="text-4xl md:text-6xl font-bold">{slide.title}</h1>
                                <p className="mt-4 text-lg md:text-xl">{slide.subtitle}</p>
                                <a href={slide.link} className="mt-8 inline-block bg-[#eab676] text-white font-bold py-3 px-10 rounded-lg hover:bg-opacity-90 transition-transform hover:scale-105">
                                    تسوق الآن
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slides.length > 1 && (
                <>
                    <button onClick={prev} aria-label="Previous slide" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full z-10 transition-colors"><ChevronRight size={28} className="text-gray-800" /></button>
                    <button onClick={next} aria-label="Next slide" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white p-3 rounded-full z-10 transition-colors"><ChevronLeft size={28} className="text-gray-800" /></button>
                    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                        {slides.map((_, i) => (
                            <button key={i} onClick={() => setCurrentSlide(i)} className={`w-3 h-3 rounded-full transition-all ${currentSlide === i ? 'bg-white scale-110' : 'bg-white/50'}`} aria-label={`Go to slide ${i+1}`}></button>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};


// مكون التذييل (Footer)
const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">متجرنا</h3>
                    <p className="text-gray-400">نقدم لكم أفضل المنتجات بأعلى جودة. رضاكم هو هدفنا الأول.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white">عنا</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">اتصل بنا</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">الأسئلة الشائعة</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white">سياسة الخصوصية</a></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">تابعنا</h3>
                    <div className="flex space-x-4">
                        <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><Facebook size={24}/></a>
                        <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white"><Twitter size={24}/></a>
                        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><Instagram size={24}/></a>
                    </div>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold mb-4">النشرة البريدية</h3>
                    <p className="text-gray-400 mb-4">اشترك ليصلك كل جديد وعروض حصرية.</p>
                    <form className="flex">
                        <input type="email" placeholder="بريدك الإلكتروني" className="w-full rounded-r-lg p-2 text-gray-800" />
                        <button type="submit" className="bg-[#eab676] px-4 rounded-l-lg font-semibold">اشتراك</button>
                    </form>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500">
                <p>&copy; {new Date().getFullYear()} متجرنا. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    </footer>
);

// --- تم التعديل: الربط مع API حقيقي ---
// ! هام: يجب تغيير هذا الرابط إلى الرابط الفعلي للـ API الخاص بك
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = {
    getSlides: async (): Promise<Slide[]> => {
        // يمكن جلب السلايدات من الـ API الخاص بك أيضاً
        return [
            { id: 1, title: 'اكتشف أحدث التشكيلات', subtitle: 'تصاميم عصرية تلبي كل الأذواق', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', link: '/products' },
            { id: 2, title: 'عروض خاصة لفترة محدودة', subtitle: 'خصومات تصل إلى 50%', image_url: 'https://images.unsplash.com/photo-1445205170230-053b8_3016050?q=80&w=2071&auto-format&fit=crop', link: '/offers' },
        ];
    },
    // دالة محول لتحويل بيانات API الخاصة بك إلى الواجهة المستخدمة في التطبيق
    // تأكد من أن أسماء الحقول (مثل apiProduct.name) تطابق الأسماء في ProductResource
    productAdapter: (apiProduct: any): Product => ({
        id: apiProduct.id,
        name: apiProduct.name, // من قاعدة البيانات
        slug: apiProduct.slug, // من قاعدة البيانات
        regular_price: parseFloat(apiProduct.regular_price), // من قاعدة البيانات
        sale_price: apiProduct.sale_price ? parseFloat(apiProduct.sale_price) : undefined, // من قاعدة البيانات
        image: apiProduct.image, // تأكد أن هذا الحقل يحتوي على رابط الصورة الكامل
        short_description: apiProduct.short_description, // من قاعدة البيانات
    }),

    getFeaturedProducts: async (): Promise<Product[]> => {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products from your API');
        const responseData = await response.json();
        const data = responseData.data; // لأن Laravel API Resources تغلف البيانات
        return data.slice(0, 4).map(api.productAdapter); // نأخذ أول 4 منتجات كمميزة
    },
    
    getSpecialOffers: async (): Promise<Product[]> => {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch special offers from your API');
        const responseData = await response.json();
        const data = responseData.data;
        // نأخذ آخر 4 منتجات كعروض خاصة كمثال
        return data.slice(-4).reverse().map(api.productAdapter);
    },

    getCategories: async (): Promise<Category[]> => {
        // ! TODO: يجب إنشاء Route و Controller في Laravel لجلب التصنيفات
        // حالياً، لا يزال يستخدم بيانات وهمية
        const response = await fetch('https://fakestoreapi.com/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data: string[] = await response.json();
        const categoryImages: { [key: string]: string } = {
            'electronics': 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1925&auto=format&fit=crop',
            'jewelery': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1887&auto-format&fit=crop',
            "men's clothing": 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto-format&fit=crop',
            "women's clothing": 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80&w=1965&auto-format&fit=crop'
        };
        return data.map((name, index) => ({
            id: index + 1,
            name: name,
            slug: name.replace(/'/g, "").replace(/\s/g, "-"),
            image: categoryImages[name] || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto-format&fit=crop'
        }));
    },
    getBrands: async (): Promise<Brand[]> => {
        // ! TODO: يجب إنشاء Route و Controller في Laravel لجلب الماركات
        return [
            { id: 1, name: 'Adidas', logo: '' },
            { id: 2, name: 'Nike', logo: '' },
            { id: 3, name: 'Zara', logo: '' },
            { id: 4, name: 'Gucci', logo: '' },
        ];
    }
}


// --- المكون الرئيسي للصفحة الرئيسية ---
function HomePageContent() {
    const { showToast } = useToast();
    const { data: slides } = useFetchData(api.getSlides);
    const { data: featuredProducts, loading: productsLoading, error: productsError } = useFetchData(api.getFeaturedProducts);
    const { data: specialOffers, loading: offersLoading, error: offersError } = useFetchData(api.getSpecialOffers);
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetchData(api.getCategories);
    const { data: brands, loading: brandsLoading } = useFetchData(api.getBrands);

    const handleAddToCart = useCallback((productName: string) => {
        showToast(`تمت إضافة "${productName}" إلى السلة!`);
    }, [showToast]);

    return (
        <div className="bg-white">
            <HeroSlider slides={slides || []} />
            
            <AnimatedSection>
                <div className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-bold text-[#1e81b0]">المنتجات المميزة</h2>
                            <a href="/products" className="flex items-center gap-2 text-[#1e81b0] font-semibold hover:text-[#eab676] transition-colors">
                                <span>عرض الكل</span>
                                <ArrowLeft size={20} />
                            </a>
                        </div>
                        {productsError && <p className="text-red-500 text-center">{productsError}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {productsLoading ? (
                                Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
                            ) : (
                                featuredProducts?.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)
                            )}
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            
            <AnimatedSection>
                <div className="py-20 bg-[#fff8f0]">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-bold text-[#eab676]">عروض حصرية</h2>
                             <a href="/offers" className="flex items-center gap-2 text-[#1e81b0] font-semibold hover:text-[#eab676] transition-colors">
                                <span>مشاهدة الكل</span>
                                <ArrowLeft size={20} />
                            </a>
                        </div>
                        {offersError && <p className="text-red-500 text-center">{offersError}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {offersLoading ? (
                                Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
                            ) : (
                                specialOffers?.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />)
                            )}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            <AnimatedSection>
                <div className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-[#1e81b0] mb-12">تسوق حسب التصنيف</h2>
                        {categoriesError && <p className="text-red-500 text-center">{categoriesError}</p>}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {categoriesLoading ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="w-full h-80 bg-gray-300 rounded-lg animate-pulse"></div>) 
                            : categories?.map((category) => (
                                <a href={`/category/${category.slug}`} key={category.id} className="group relative rounded-lg overflow-hidden shadow-lg">
                                    <img src={category.image} alt={category.name} className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center">
                                        <h3 className="text-2xl font-bold text-white mb-6 transform group-hover:translate-y-[-10px] transition-transform duration-300">{category.name}</h3>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            <AnimatedSection>
                 <div className="py-24 bg-cover bg-center bg-fixed" style={{backgroundImage: "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop')"}}>
                    <div className="container mx-auto px-6 text-center text-white">
                        <div className="bg-black/40 backdrop-blur-sm p-10 rounded-lg inline-block">
                            <h2 className="text-4xl font-bold">تخفيضات نهاية الموسم</h2>
                            <p className="mt-4 text-lg max-w-xl mx-auto">لا تفوت فرصة الحصول على أفضل المنتجات بأفضل الأسعار. تسوق الآن!</p>
                            <a href="/offers" className="mt-8 inline-block bg-[#eab676] text-white font-bold py-3 px-12 rounded-lg hover:bg-opacity-90 transition-transform hover:scale-105">
                                اكتشف العروض
                            </a>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            
            <AnimatedSection>
                <div className="py-16 bg-white">
                    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                            <Truck size={40} className="mx-auto text-[#1e81b0]" />
                            <h3 className="mt-4 text-xl font-semibold">شحن سريع ومجاني</h3>
                            <p className="mt-2 text-gray-500">لجميع الطلبات فوق 500 ر.س</p>
                        </div>
                         <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                            <ShieldCheck size={40} className="mx-auto text-[#1e81b0]" />
                            <h3 className="mt-4 text-xl font-semibold">دفع آمن</h3>
                            <p className="mt-2 text-gray-500">نضمن لك حماية كاملة لبياناتك</p>
                        </div>
                         <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md hover:-translate-y-1 transition-all">
                            <PhoneCall size={40} className="mx-auto text-[#1e81b0]" />
                            <h3 className="mt-4 text-xl font-semibold">دعم فني 24/7</h3>
                            <p className="mt-2 text-gray-500">مستعدون لمساعدتك في أي وقت</p>
                        </div>
                    </div>
                </div>
            </AnimatedSection>
            
            <AnimatedSection>
                <div className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-[#1e81b0] mb-12">أشهر الماركات</h2>
                        <div className="flex flex-wrap items-center justify-center gap-6">
                           {brandsLoading ? Array.from({length: 4}).map((_, i) => <div key={i} className="h-24 w-40 bg-gray-200 rounded-lg animate-pulse"></div>) 
                           : brands?.map((brand) => (
                                <div key={brand.id} title={brand.name} className="bg-gray-100 p-4 rounded-lg border border-transparent hover:border-gray-300 hover:shadow-sm w-40 h-24 flex items-center justify-center filter grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer">
                                    <img 
                                        src={`https://logo.clearbit.com/${brand.name.toLowerCase().replace(/\s/g, '')}.com?size=128`} 
                                        alt={`${brand.name} logo`} 
                                        className="max-h-12 w-auto object-contain" 
                                        onError={(e) => {
                                            e.currentTarget.onerror = null; // Prevent infinite loops
                                            e.currentTarget.src = `https://via.placeholder.com/120x60/f0f0f0/cccccc?text=${brand.name}`;
                                        }}
                                        loading="lazy" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </AnimatedSection>

            <Footer />
        </div>
    );
}

export default function HomePage() {
    return (
        <ToastProvider>
            <HomePageContent />
        </ToastProvider>
    );
}

