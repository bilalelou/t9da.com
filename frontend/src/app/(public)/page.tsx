"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { Heart, CheckCircle, ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft, ShieldCheck, Truck, PhoneCall, LoaderCircle, Twitter, Instagram, Facebook, Star, Tag } from 'lucide-react';

// --- واجهات البيانات (Interfaces) ---
interface Slide {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link: string;
}

// تم التحديث: إضافة حقل للصور المتعددة
interface Product {
  id: number;
  name: string;
  slug: string;
  regular_price: number;
  sale_price?: number;
  image: string;
  images?: string[]; // مصفوفة روابط الصور الإضافية
  short_description: string;
  description?: string; // الوصف الكامل
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

// --- نظام التنبيهات (Toast Notification System) ---
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

// --- Context لإدارة حالة "المفضلة" ---
interface FavoritesContextType {
    favoriteIds: Set<number>;
    toggleFavorite: (productId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextType>({
    favoriteIds: new Set(),
    toggleFavorite: () => {},
});

const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());

    const toggleFavorite = (productId: number) => {
        setFavoriteIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(productId)) {
                newIds.delete(productId);
            } else {
                newIds.add(productId);
            }
            return newIds;
        });
    };
    
    const contextValue = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds]);

    return (
        <FavoritesContext.Provider value={contextValue}>
            {children}
        </FavoritesContext.Provider>
    );
};

const useFavorites = () => useContext(FavoritesContext);


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


// --- المكونات ---

const AnimatedSection = React.memo(({ children }: { children: React.ReactNode }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
    return (
        <section ref={ref} className={`transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {children}
        </section>
    );
});
AnimatedSection.displayName = 'AnimatedSection';

const formatCurrency = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) return '';
  return new Intl.NumberFormat('ar-MA', {
    style: 'currency',
    currency: 'MAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// تم التحديث: إضافة onNavigate للانتقال بين الصفحات
const ProductCard = React.memo(({ product, onAddToCart, onNavigate }: { product: Product; onAddToCart: (productName: string) => void; onNavigate: (page: string, slug: string) => void; }) => {
    const { favoriteIds, toggleFavorite } = useFavorites();
    const { showToast } = useToast();
    
    const isFavorite = favoriteIds.has(product.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        toggleFavorite(product.id);
        showToast(isFavorite ? `تمت إزالة "${product.name}" من المفضلة` : `تمت إضافة "${product.name}" إلى المفضلة`);
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        onAddToCart(product.name);
    };
    
    // تم التغيير: استخدام onNavigate بدلاً من href
    return (
        <div onClick={() => onNavigate('product', product.slug)} className="cursor-pointer group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <div className="flex flex-col flex-grow">
                <div className="overflow-hidden h-72 p-4 bg-white">
                  <img src={product.image} alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=Image+Not+Found'; }}
                    />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                    <div className="flex-grow mb-2">
                        <h3 className="text-lg font-semibold text-gray-800 truncate" title={product.name}>{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-3">{product.short_description}</p>
                    </div>
                    <div className="pt-2 mt-auto flex items-baseline gap-2">
                        {product.sale_price ? (
                            <>
                                <span className="text-xl font-bold text-[#eab676]">{formatCurrency(product.sale_price)}</span>
                                <span className="text-sm text-gray-400 line-through">{formatCurrency(product.regular_price)}</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-[#1e81b0]">{formatCurrency(product.regular_price)}</span>
                        )}
                    </div>
                </div>
            </div>
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

// --- جديد: رأس الصفحة (Header) ---
const Header = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div onClick={() => onNavigate('home')} className="text-2xl font-bold text-[#1e81b0] cursor-pointer">
                    متجري
                </div>
                <nav className="flex items-center gap-6">
                    <a onClick={() => onNavigate('home')} className="text-gray-600 hover:text-[#1e81b0] cursor-pointer">الرئيسية</a>
                    <a href="#" className="text-gray-600 hover:text-[#1e81b0]">المنتجات</a>
                    <a href="#" className="text-gray-600 hover:text-[#1e81b0]">اتصل بنا</a>
                    <button className="relative">
                        <ShoppingCart size={24} className="text-gray-600 hover:text-[#1e81b0]" />
                        <span className="absolute -top-2 -right-2 bg-[#eab676] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
                    </button>
                </nav>
            </div>
        </header>
    );
};


// --- جديد: صفحة تفاصيل المنتج ---
const ProductDetailPage = ({ product, onAddToCart, onNavigate }: { product: Product; onAddToCart: (productName: string) => void; onNavigate: (page: string) => void; }) => {
    const { showToast } = useToast();
    const [mainImage, setMainImage] = useState(product.image);

    const handleAddToCartClick = () => {
        onAddToCart(product.name);
        showToast(`تمت إضافة "${product.name}" إلى السلة بنجاح!`);
    };
    
    const allImages = [product.image, ...(product.images || [])];

    return (
        <div className="container mx-auto px-6 py-12">
            <button onClick={() => onNavigate('home')} className="flex items-center gap-2 text-gray-600 hover:text-[#1e81b0] mb-8">
                <ArrowLeft size={20} />
                <span>العودة إلى المتجر</span>
            </button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* معرض الصور */}
                <div>
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <img src={mainImage} alt={product.name} className="w-full h-auto object-cover transition-transform duration-300 hover:scale-105" />
                    </div>
                    <div className="flex gap-2">
                        {allImages.map((img, index) => (
                            <div key={index} onClick={() => setMainImage(img)} className={`w-20 h-20 border rounded-lg overflow-hidden cursor-pointer ${mainImage === img ? 'border-[#1e81b0] border-2' : ''}`}>
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
                    
                    <div className="flex items-center gap-2 mb-6">
                       <Tag size={22} className="text-green-500" />
                       <span className="font-semibold text-green-600">متوفر في المخزون</span>
                    </div>

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
                </div>
            </div>
        </div>
    );
};


// --- API ---
const API_BASE_URL = 'http://localhost:8000/api';

const handleApiError = (error: any) => {
    console.error('API Error:', error);
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم المحلي.');
    }
    throw error;
};

const api = {
    getSlides: async (): Promise<Slide[]> => {
        return [
            { id: 1, title: 'اكتشف أحدث التشكيلات', subtitle: 'تصاميم عصرية تلبي كل الأذواق', image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1_935b?q=80&w=2070&auto=format&fit=crop', link: '/products' },
            { id: 2, title: 'عروض خاصة لفترة محدودة', subtitle: 'خصومات تصل إلى 50%', image_url: 'https://images.unsplash.com/photo-1445205170230-053b8_3016050?q=80&w=2071&auto-format&fit=crop', link: '/offers' },
        ];
    },
    
    // تم التحديث: إضافة حقل description و images
    productAdapter: (apiProduct: any): Product => ({
        id: apiProduct.id,
        name: apiProduct.name || 'منتج بدون اسم',
        slug: apiProduct.slug || '',
        regular_price: parseFloat(apiProduct.regular_price) || 0,
        sale_price: apiProduct.sale_price != null ? parseFloat(apiProduct.sale_price) : undefined,
        image: apiProduct.image ? `${API_BASE_URL.replace('/api', '')}/storage/uploads/${apiProduct.image}` : 'https://placehold.co/400x400?text=No+Image',
        images: apiProduct.images ? apiProduct.images.map((img: string) => `${API_BASE_URL.replace('/api', '')}/storage/uploads/${img}`) : [],
        short_description: apiProduct.short_description || 'وصف غير متوفر',
        description: apiProduct.description || apiProduct.short_description,
    }),
    
    getAllProducts: async (): Promise<Product[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch products`);
            const responseData = await response.json();
            const productList = Array.isArray(responseData) ? responseData : responseData.data;
            return Array.isArray(productList) ? productList.map(api.productAdapter) : [];
        } catch (error) {
            handleApiError(error);
            return [];
        }
    },

    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            if (!response.ok) throw new Error('Failed to fetch categories');
            const data: string[] = await response.json();
            const categoryImages: { [key: string]: string } = {
                'electronics': 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1925&auto=format&fit=crop',
                'jewelery': 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1887&auto=format&fit=crop',
                "men's clothing": 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1887&auto=format&fit=crop',
                "women's clothing": 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?q=80&w=1965&auto=format&fit=crop'
            };
            return data.map((name, index) => ({
                id: index + 1,
                name: name,
                slug: name.replace(/'/g, "").replace(/\s/g, "-"),
                image: categoryImages[name] || 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop'
            }));
        } catch(error) {
             handleApiError(error);
             return [];
        }
    },
    getBrands: async (): Promise<Brand[]> => {
       try {
            return [
                { id: 1, name: 'Adidas', logo: '' },
                { id: 2, name: 'Nike', logo: '' },
                { id: 3, name: 'Zara', logo: '' },
                { id: 4, name: 'Gucci', logo: '' },
            ];
       } catch(error) {
            handleApiError(error);
            return [];
       }
    }
}


// --- مكون الصفحة الرئيسية ---
function HomePageContent({ onNavigate }: { onNavigate: (page: string, slug?: string) => void }) {
    const { showToast } = useToast();
    const { data: slides } = useFetchData(api.getSlides);
    const { data: allProducts, loading: productsLoading, error: productsError } = useFetchData(api.getAllProducts);
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetchData(api.getCategories);
    const { data: brands, loading: brandsLoading } = useFetchData(api.getBrands);
    
    const featuredProducts = useMemo(() => allProducts?.slice(0, 4) || [], [allProducts]);
    const specialOffers = useMemo(() => allProducts?.slice(-4).reverse() || [], [allProducts]);


    const handleAddToCart = useCallback((productName: string) => {
        showToast(`تمت إضافة "${productName}" إلى السلة!`);
    }, [showToast]);

    return (
        <>
            <HeroSlider slides={slides || []} />
            
            <AnimatedSection>
                <div className="py-20 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <div className="flex items-center justify-between mb-12">
                            <h2 className="text-4xl font-bold text-[#1e81b0]">المنتجات المميزة</h2>
                            <a href="#" className="flex items-center gap-2 text-[#1e81b0] font-semibold hover:text-[#eab676] transition-colors">
                                <span>عرض الكل</span>
                                <ArrowLeft size={20} />
                            </a>
                        </div>
                        {productsError && <p className="text-red-500 text-center">{productsError}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {productsLoading ? (
                                Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
                            ) : (
                                featuredProducts?.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onNavigate={onNavigate} />)
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
                             <a href="#" className="flex items-center gap-2 text-[#1e81b0] font-semibold hover:text-[#eab676] transition-colors">
                                <span>مشاهدة الكل</span>
                                <ArrowLeft size={20} />
                            </a>
                        </div>
                        {productsError && <p className="text-red-500 text-center">{productsError}</p>}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {productsLoading ? (
                                Array.from({ length: 4 }).map((_, index) => <ProductSkeleton key={index} />)
                            ) : (
                                specialOffers?.map((product) => <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} onNavigate={onNavigate} />)
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

        </>
    );
}

// --- المكون الرئيسي للتطبيق الذي يدير التنقل ---
function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

    const { data: allProducts, loading, error } = useFetchData(api.getAllProducts);

    const navigateTo = (page: string, slug: string | null = null) => {
        setCurrentPage(page);
        setSelectedProductSlug(slug);
    };
    
    const handleAddToCart = useCallback((productName: string) => {
        // سيتم لاحقاً إضافة منطق سلة المشتريات هنا
        console.log(`Added ${productName} to cart`);
    }, []);

    const renderContent = () => {
        if (loading) {
            return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-gray-400" size={48} /></div>;
        }
        
        if(error) {
            return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
        }

        switch (currentPage) {
            case 'product':
                const selectedProduct = allProducts?.find(p => p.slug === selectedProductSlug);
                if (selectedProduct) {
                    return <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} onNavigate={navigateTo} />;
                }
                // Fallback if product not found
                return <HomePageContent onNavigate={navigateTo} />;
            case 'home':
            default:
                return <HomePageContent onNavigate={navigateTo} />;
        }
    };
    
    return (
        <div className="bg-white">
            <Header onNavigate={navigateTo} />
            <main>
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
}

// --- نقطة الدخول الرئيسية ---
export default function Page() {
    return (
        <ToastProvider>
            <FavoritesProvider>
                <App />
            </FavoritesProvider>
        </ToastProvider>
    );
}

