"use client";

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { Heart, CheckCircle, ShoppingCart, LoaderCircle, X, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

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
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Brand {
    id: number;
    name: string;
    slug: string;
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
                <div className="fixed bottom-10 right-10 bg-gray-800 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101]">
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
const FavoritesContext = createContext<FavoritesContextType>({ favoriteIds: new Set(), toggleFavorite: () => {} });

const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const toggleFavorite = useCallback((productId: number) => {
        setFavoriteIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(productId)) newIds.delete(productId);
            else newIds.add(productId);
            return newIds;
        });
    }, []);
    const contextValue = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds, toggleFavorite]);
    return <FavoritesContext.Provider value={contextValue}>{children}</FavoritesContext.Provider>;
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

// --- المكونات ---

const formatCurrency = (price: number) => {
  if (typeof price !== 'number' || isNaN(price)) return '';
  return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

const ProductCard = React.memo(({ product }: { product: Product }) => {
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
        showToast(`تمت إضافة "${product.name}" إلى السلة!`);
    };
    
    return (
        <a href={`/products/${product.slug}`} className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
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
        </a>
    );
});
ProductCard.displayName = 'ProductCard';

// --- مكون الفلترة المتقدم ---
const FilterSidebarContent = ({
    categories, brands, products,
    filters, handleCheckboxChange, setPriceRange, resetFilters,
    categoryCounts, brandCounts, minPrice, maxPrice
}) => {
    const { selectedCategories, selectedBrands, selectedColors, selectedSizes, priceRange } = filters;
    const { setSelectedCategories, setSelectedBrands, setSelectedColors, setSelectedSizes } = filters.setters;

    // حالة الأقسام القابلة للطي
    const [openCats, setOpenCats] = useState(true);
    const [openColors, setOpenColors] = useState(true);
    const [openSizes, setOpenSizes] = useState(true);
    const [openBrands, setOpenBrands] = useState(true);
    const [openPrice, setOpenPrice] = useState(true);

    const availableColors = ['#183153', '#000000', '#f97316', '#2563eb', '#93c5fd', '#d6ad60', '#b58900', '#eab676'];
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    return (
        <div className="p-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold tracking-wide text-gray-700">PRODUCT CATEGORIES</h3>
                <button onClick={resetFilters} className="text-xs text-gray-500 hover:text-red-500 flex items-center gap-1"><X size={14} /><span>Reset</span></button>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <button onClick={() => setOpenCats(v => !v)} className="w-full flex items-center justify-between text-[13px] font-semibold text-gray-800 mb-3">
                    <span>Categories</span>{openCats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openCats && (
                    <ul className="space-y-3">
                        {categories.map(c => (
                            <li key={c.id} className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer text-[13px] text-gray-700 capitalize">
                                    <input type="checkbox" checked={selectedCategories.includes(c.slug)} onChange={() => handleCheckboxChange(setSelectedCategories, c.slug)} className="h-3.5 w-3.5 rounded border-gray-300 text-[#1e81b0] focus:ring-[#1e81b0]"/>
                                    <span className="ml-2">{c.name}</span>
                                </label>
                                <span className="text-xs text-gray-400">{categoryCounts[c.slug] ?? 0}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Colors */}
            <div className="mb-6">
                <button onClick={() => setOpenColors(v => !v)} className="w-full flex items-center justify-between text-[13px] font-semibold text-gray-800 mb-3">
                    <span>Color</span>{openColors ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openColors && (
                    <div className="flex flex-wrap gap-2">
                        {availableColors.map(color => (
                            <button key={color} onClick={() => handleCheckboxChange(setSelectedColors, color)} className={`w-5 h-5 rounded-full border ${selectedColors.includes(color) ? 'ring-2 ring-[#1e81b0] border-[#1e81b0]' : 'border-gray-300'}`} style={{ backgroundColor: color }} aria-label={`Filter by color ${color}`}></button>
                        ))}
                    </div>
                )}
            </div>

            {/* Sizes */}
            <div className="mb-6">
                <button onClick={() => setOpenSizes(v => !v)} className="w-full flex items-center justify-between text-[13px] font-semibold text-gray-800 mb-3">
                    <span>Sizes</span>{openSizes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSizes && (
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map(size => (
                            <button key={size} onClick={() => handleCheckboxChange(setSelectedSizes, size)} className={`px-2.5 py-1.5 rounded border text-xs font-medium ${selectedSizes.includes(size) ? 'bg-[#1e81b0] text-white border-[#1e81b0]' : 'bg-white text-gray-700 border-gray-300'}`}>{size}</button>
                        ))}
                    </div>
                )}
            </div>

            {/* Brands */}
            <div className="mb-6">
                <button onClick={() => setOpenBrands(v => !v)} className="w-full flex items-center justify-between text-[13px] font-semibold text-gray-800 mb-3">
                    <span>Brands</span>{openBrands ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openBrands && (
                    <ul className="space-y-3">
                        {brands.map(b => (
                            <li key={b.id} className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer text-[13px] text-gray-700 capitalize">
                                    <input type="checkbox" checked={selectedBrands.includes(b.slug)} onChange={() => handleCheckboxChange(setSelectedBrands, b.slug)} className="h-3.5 w-3.5 rounded border-gray-300 text-[#1e81b0] focus:ring-[#1e81b0]"/>
                                    <span className="ml-2">{b.name}</span>
                                </label>
                                <span className="text-xs text-gray-400">{brandCounts[b.slug] ?? 0}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Price */}
            <div>
                <button onClick={() => setOpenPrice(v => !v)} className="w-full flex items-center justify-between text_[13px] font-semibold text-gray-800 mb-3">
                    <span>Price</span>{openPrice ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openPrice && (
                    <div>
                        <input type="range" min={minPrice} max={maxPrice} value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-[11px] text-gray-500 mt-2">
                            <span>{formatCurrency(minPrice)}</span>
                            <span>{formatCurrency(priceRange)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- المكون الرئيسي لصفحة المنتجات ---
const AllProductsPage = ({ allProducts, categories, brands }: { allProducts: Product[]; categories: Category[]; brands: Brand[]; }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('latest');
    
    // حساب نطاق السعر
    const { minPrice, maxPrice } = useMemo(() => {
        const prices = allProducts.map(p => (p.sale_price ?? p.regular_price)).filter(n => typeof n === 'number');
        const min = prices.length ? Math.floor(Math.min(...prices)) : 0;
        const max = prices.length ? Math.ceil(Math.max(...prices)) : 1000;
        return { minPrice: min, maxPrice: max };
    }, [allProducts]);
    const [priceRange, setPriceRange] = useState<number>(0);
    useEffect(() => setPriceRange(maxPrice), [maxPrice]);
    
    // منع حركة الصفحة في الخلف
    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isFilterOpen]);

    const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
        setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };
    
    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setPriceRange(maxPrice);
        setSortBy('latest');
    };

    // فلترة وترتيب المنتجات
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...allProducts];
        if (selectedCategories.length > 0) filtered = filtered.filter(p => selectedCategories.includes(p.category));
        if (selectedBrands.length > 0) filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        if (selectedColors.length > 0) filtered = filtered.filter(p => p.colors.some(c => selectedColors.includes(c)));
        if (selectedSizes.length > 0) filtered = filtered.filter(p => p.sizes.some(s => selectedSizes.includes(s)));
        
        filtered = filtered.filter(p => (p.sale_price ?? p.regular_price) <= priceRange);

        switch (sortBy) {
            case 'price-asc': filtered.sort((a, b) => (a.sale_price ?? a.regular_price) - (b.sale_price ?? b.regular_price)); break;
            case 'price-desc': filtered.sort((a, b) => (b.sale_price ?? b.regular_price) - (a.sale_price ?? a.regular_price)); break;
            case 'latest': default: filtered.sort((a, b) => b.id - a.id); break;
        }
        return filtered;
    }, [allProducts, selectedCategories, selectedBrands, selectedColors, selectedSizes, priceRange, sortBy]);

    // حساب عدد المنتجات في كل فئة وماركة
    const categoryCounts = useMemo(() => {
        const map: Record<string, number> = {};
        allProducts.forEach(p => { map[p.category] = (map[p.category] || 0) + 1; });
        return map;
    }, [allProducts]);
    const brandCounts = useMemo(() => {
        const map: Record<string, number> = {};
        allProducts.forEach(p => { map[p.brand] = (map[p.brand] || 0) + 1; });
        return map;
    }, [allProducts]);

    const filterProps = {
        categories, brands, products: allProducts,
        filters: {
            selectedCategories, selectedBrands, selectedColors, selectedSizes, priceRange,
            setters: { setSelectedCategories, setSelectedBrands, setSelectedColors, setSelectedSizes }
        },
        handleCheckboxChange, setPriceRange, resetFilters,
        categoryCounts, brandCounts, minPrice, maxPrice
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 py-12">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">جميع المنتجات</h1>
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="flex items-center gap-2 lg:hidden bg-gray-800 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition"
                >
                    <SlidersHorizontal size={20} />
                    <span>فلترة</span>
                </button>
            </div>
            <div className="flex flex-row items-start gap-8">
                {/* --- الفلتر الجانبي --- */}
                {/* نسخة الهاتف (منزلقة) */}
                <aside 
                    className={`fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-xl z-[100] transform transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
                    aria-modal="true" role="dialog"
                >
                    <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                        <h3 className="text-xl font-bold text-gray-800">الفلترة</h3>
                        <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-gray-200" aria-label="إغلاق الفلتر">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="overflow-y-auto h-[calc(100vh-65px)]">
                        <FilterSidebarContent {...filterProps} />
                    </div>
                </aside>
                {isFilterOpen && <div onClick={() => setIsFilterOpen(false)} className="fixed inset-0 bg-black bg-opacity-60 z-[99] lg:hidden"></div>}
                
                {/* نسخة الحاسوب (ثابتة) */}
                <aside className="hidden lg:block w-72 flex-shrink-0 self-start sticky top-24">
                     <div className="border rounded-lg bg-gray-50/50">
                        <FilterSidebarContent {...filterProps} />
                    </div>
                </aside>
                
                {/* --- شبكة المنتجات --- */}
                <main className="flex-grow">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                        <p className="text-gray-600 whitespace-nowrap">{filteredAndSortedProducts.length} منتجات</p>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border border-gray-300 rounded-lg p-2 w-full sm:w-auto">
                            <option value="latest">ترتيب حسب: الأحدث</option>
                            <option value="price-asc">السعر: من الأقل إلى الأعلى</option>
                            <option value="price-desc">السعر: من الأعلى إلى الأقل</option>
                        </select>
                    </div>
                    {filteredAndSortedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {filteredAndSortedProducts.map(product => (<ProductCard key={product.id} product={product} />))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-semibold text-gray-700">لا توجد منتجات تطابق بحثك</h2>
                            <p className="text-gray-500 mt-2">حاول تغيير خيارات التصفية.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

// --- API ---
const API_BASE_URL = 'http://localhost:8000/api';
const handleApiError = (error: unknown) => {
    console.error('API Error:', error);
    if (error instanceof TypeError && typeof error.message === 'string' && error.message.includes('fetch')) {
        throw new Error('خطأ في الاتصال بالخادم. تأكد من تشغيل الخادم المحلي.');
    }
    if (error instanceof Error) throw error;
    throw new Error('حدث خطأ غير معروف.');
};

const api = {
    productAdapter: (apiProduct: any): Product => ({
        id: apiProduct.id,
        name: apiProduct.name || 'منتج بدون اسم',
        slug: apiProduct.slug || '',
        regular_price: Number(apiProduct.regular_price ?? 0) || 0,
        sale_price: apiProduct.sale_price != null ? Number(apiProduct.sale_price) : undefined,
        image: apiProduct.image ? `${API_BASE_URL.replace('/api', '')}/storage/uploads/${apiProduct.image}` : 'https://placehold.co/400x400?text=No+Image',
        images: apiProduct.images
            ? (typeof apiProduct.images === 'string'
                ? apiProduct.images.split(',')
                : Array.isArray(apiProduct.images) ? apiProduct.images : [])
                .map((img: string) => `${API_BASE_URL.replace('/api', '')}/storage/uploads/${String(img).trim()}`)
            : [],
        short_description: apiProduct.short_description || 'وصف غير متوفر',
        description: apiProduct.description || 'وصف كامل ومفصل للمنتج.',
        category: apiProduct.category?.slug || 'uncategorized',
        brand: apiProduct.brand?.slug || 'unknown-brand',
        colors: apiProduct.colors || ['#ffffff', '#000000'],
        sizes: apiProduct.sizes || ['M', 'L'],
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

    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const responseData = await response.json();
            return responseData.data || [];
        } catch(error) { handleApiError(error); return []; }
    },

    getBrands: async (): Promise<Brand[]> => {
        try {
            const mockBrands: Brand[] = [
                { id: 1, name: 'Samsung', slug: 'samsung' },
                { id: 2, name: 'Apple', slug: 'apple' },
                { id: 3, name: 'Nike', slug: 'nike' },
                { id: 4, name: 'Adidas', slug: 'adidas' },
            ];
            return Promise.resolve(mockBrands);
        } catch(error) { 
            console.error("Error fetching mock brands:", error);
            return []; 
        }
    }
}

// --- المكون الرئيسي للتطبيق الذي يجلب البيانات ---
function AppLoader() {
    const { data: allProducts, loading: productsLoading, error: productsError } = useFetchData(api.getAllProducts);
    const { data: categories, loading: categoriesLoading, error: categoriesError } = useFetchData(api.getCategories);
    const { data: brands, loading: brandsLoading, error: brandsError } = useFetchData(api.getBrands);

    const loading = productsLoading || categoriesLoading || brandsLoading;
    const error = productsError || categoriesError || brandsError;

    if (loading) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-gray-400" size={48} /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500 p-4 text-center">{error}</div>;

    return <AllProductsPage allProducts={allProducts || []} categories={categories || []} brands={brands || []} />;
}

// --- نقطة الدخول الرئيسية ---
export default function Page() {
    return (
        <ToastProvider>
            <FavoritesProvider>
                <div className="bg-white min-h-screen">
                    {/* يمكنك وضع الهيدر والفوتر هنا */}
                    <main>
                       <AppLoader />
                    </main>
                </div>
            </FavoritesProvider>
        </ToastProvider>
    );
}

