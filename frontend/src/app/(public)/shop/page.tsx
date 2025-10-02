'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart, useWishlist } from '@/contexts/Providers';
import { LoaderCircle, SlidersHorizontal, X, ChevronDown, ShoppingCart, CheckCircle, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import * as api from '@/lib/api';

// --- الواجهات (Interfaces) ---
interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    stock: number;
    inStock: boolean;
    short_description?: string;
    has_free_shipping?: boolean;
    free_shipping_note?: string;
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

interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// --- المكونات الفرعية للصفحة ---

const formatCurrency = (price: number) => {
    if (typeof price !== 'number' || isNaN(price) || price === null || price === undefined) {
        return 'غير محدد';
    }
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
};

// دالة لتحويل بيانات المنتج من API إلى format المطلوب
const transformProduct = (apiProduct: any): Product => {
    const salePrice = apiProduct.sale_price && parseFloat(apiProduct.sale_price) > 0 ? parseFloat(apiProduct.sale_price) : null;
    const regularPrice = parseFloat(apiProduct.regular_price) || 0;
    
    return {
        id: apiProduct.id,
        name: apiProduct.name,
        slug: apiProduct.slug,
        price: salePrice || regularPrice,
        originalPrice: salePrice ? regularPrice : undefined,
        thumbnail: apiProduct.thumbnail,
        stock: apiProduct.stock || 0,
        inStock: (apiProduct.stock || 0) > 0,
        short_description: apiProduct.short_description,
        has_free_shipping: apiProduct.has_free_shipping || false,
        free_shipping_note: apiProduct.free_shipping_note || ''
    };
};

const ProductCard = React.memo(({ product }: { product: Product }) => {
    const { addToCart, cartItems } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    
    const isInCart = useMemo(() => cartItems.some(item => item.id === product.id), [cartItems, product.id]);
    const isWishlisted = isInWishlist(product.id);
    const hasSale = product.originalPrice && product.originalPrice > product.price;

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isInCart) {
            addToCart(product);
        }
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };
    
    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
            <a href={`/shop/${product.slug}`} className="block">
                <div className="relative h-52 bg-gradient-to-br from-gray-50 to-gray-100">
                    <img 
                        src={product.thumbnail} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=No+Image'; }} 
                    />
                    
                    {hasSale && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                            خصم
                        </div>
                    )}
                    
                    {product.has_free_shipping && (
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg" style={{top: hasSale ? '3.5rem' : '0.75rem'}}>
                            شحن مجاني
                        </div>
                    )}
                    
                    <button
                        onClick={handleWishlistClick}
                        className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 shadow-lg ${
                            isWishlisted 
                                ? 'bg-red-500 text-white hover:bg-red-600 scale-110' 
                                : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
                        }`}
                    >
                        <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                    </button>
                </div>
            </a>
            
            <div className="p-5">
                <a href={`/shop/${product.slug}`}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                </a>
                
                <div className="flex items-end justify-between">
                    <div className="flex flex-col">
                        {hasSale ? (
                            <>
                                <span className="text-xl font-bold text-red-600">{formatCurrency(product.price)}</span>
                                <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice!)}</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                        )}
                    </div>
                    
                    <button
                        onClick={handleCartClick}
                        disabled={isInCart}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:scale-110 ${
                            isInCart 
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                        }`}
                    >
                        {isInCart ? <CheckCircle size={20}/> : <ShoppingCart size={20}/>}
                    </button>
                </div>
            </div>
        </div>
    );
});
ProductCard.displayName = "ProductCard";

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-right font-medium text-gray-800 hover:bg-gray-50 px-1 rounded">
                <span>{title}</span>
                <ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}><div className="pb-4 pr-2">{children}</div></div>
        </div>
    );
};

const FilterSidebar: React.FC<{
    categories: Category[];
    brands: Brand[];
    colors: Color[];
    sizes: Size[];
    filters: any;
    setFilters: any;
    applyFilters: (filters: any) => void;
    isOpen: boolean;
    onClose: () => void;
}> = ({ categories, brands, colors, sizes, filters, setFilters, applyFilters, isOpen, onClose }) => {
    const [localFilters, setLocalFilters] = useState({
        categories: filters.categories || [],
        brands: filters.brands || [],
        color: filters.color || '',
        size: filters.size || '',
        min_price: filters.min_price || '',
        max_price: filters.max_price || ''
    });

    const handleCategoryChange = (categoryName: string) => {
        const newCategories = localFilters.categories.includes(categoryName)
            ? localFilters.categories.filter((c: string) => c !== categoryName)
            : [...localFilters.categories, categoryName];
        
        setLocalFilters(prev => ({ ...prev, categories: newCategories }));
        applyFilters({ categories: newCategories });
    };

    const handleBrandChange = (brandName: string) => {
        const newBrands = localFilters.brands.includes(brandName)
            ? localFilters.brands.filter((b: string) => b !== brandName)
            : [...localFilters.brands, brandName];
        
        setLocalFilters(prev => ({ ...prev, brands: newBrands }));
        applyFilters({ brands: newBrands });
    };

    const handleColorChange = (colorName: string) => {
        const newColor = localFilters.color === colorName ? '' : colorName;
        setLocalFilters(prev => ({ ...prev, color: newColor }));
        applyFilters({ color: newColor });
    };

    const handleSizeChange = (sizeName: string) => {
        const newSize = localFilters.size === sizeName ? '' : sizeName;
        setLocalFilters(prev => ({ ...prev, size: newSize }));
        applyFilters({ size: newSize });
    };

    const clearAllFilters = () => {
        const clearedFilters = { categories: [], brands: [], color: '', size: '', min_price: '', max_price: '' };
        setLocalFilters(clearedFilters);
        applyFilters(clearedFilters);
    };

    const handlePriceChange = (minPrice: string, maxPrice: string) => {
        setLocalFilters(prev => ({ ...prev, min_price: minPrice, max_price: maxPrice }));
        applyFilters({ min_price: minPrice, max_price: maxPrice });
    };

    const content = (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-900">الفلاتر</h3>
                <button onClick={clearAllFilters} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors">مسح الكل</button>
            </div>
            
            <AccordionItem title="التصنيفات" defaultOpen={true}>
                <div className="space-y-2">
                    {categories.map((c: Category) => (
                        <label key={c.id} className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={localFilters.categories.includes(c.name)} 
                                onChange={() => handleCategoryChange(c.name)} 
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            /> 
                            <span className="mr-2 text-sm text-gray-700">{c.name}</span>
                        </label>
                    ))}
                </div>
            </AccordionItem>
            
            <AccordionItem title="الماركات">
                <div className="space-y-2">
                    {brands.map((b: Brand) => (
                        <label key={b.id} className="flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={localFilters.brands.includes(b.name)} 
                                onChange={() => handleBrandChange(b.name)} 
                                className="h-4 w-4 text-blue-600 rounded border-gray-300"
                            /> 
                            <span className="mr-2 text-sm text-gray-700">{b.name}</span>
                        </label>
                    ))}
                </div>
            </AccordionItem>
            
            <AccordionItem title="الألوان">
                <div className="grid grid-cols-4 gap-2">
                    {colors.map((color: Color) => (
                        <label key={color.id} className="flex flex-col items-center cursor-pointer">
                            <input 
                                type="radio" 
                                name="color"
                                checked={localFilters.color === color.name} 
                                onChange={() => handleColorChange(color.name)} 
                                className="sr-only"
                            /> 
                            <div 
                                className={`w-6 h-6 rounded-full border-2 ${localFilters.color === color.name ? 'border-blue-500' : 'border-gray-300'}`} 
                                style={{ backgroundColor: color.hex_code }}
                            ></div>
                            <span className="text-xs text-gray-600 mt-1">{color.name}</span>
                        </label>
                    ))}
                </div>
            </AccordionItem>
            
            <AccordionItem title="الأحجام">
                <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size: Size) => (
                        <label key={size.id} className="cursor-pointer">
                            <input 
                                type="radio" 
                                name="size"
                                checked={localFilters.size === size.name} 
                                onChange={() => handleSizeChange(size.name)} 
                                className="sr-only"
                            /> 
                            <div className={`w-full h-8 border rounded flex items-center justify-center text-xs ${localFilters.size === size.name ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600'}`}>
                                {size.name}
                            </div>
                        </label>
                    ))}
                </div>
            </AccordionItem>
            
            <AccordionItem title="نطاق السعر">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            type="number"
                            placeholder="السعر الأدنى"
                            value={localFilters.min_price}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, min_price: e.target.value }))}
                            onBlur={(e) => handlePriceChange(e.target.value, localFilters.max_price)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                        <input
                            type="number"
                            placeholder="السعر الأقصى"
                            value={localFilters.max_price}
                            onChange={(e) => setLocalFilters(prev => ({ ...prev, max_price: e.target.value }))}
                            onBlur={(e) => handlePriceChange(localFilters.min_price, e.target.value)}
                            className="w-full px-2 py-1 border rounded text-sm"
                        />
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
    
    return (
        <>
            <aside className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl z-[100] transform transition-transform lg:max-w-none lg:w-72 lg:flex-shrink-0 lg:h-auto lg:shadow-sm lg:border lg:border-gray-200 lg:rounded-xl lg:bg-white lg:sticky lg:top-4 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="flex justify-between items-center p-4 border-b lg:hidden">
                    <h3 className="font-semibold">الفلاتر</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <div className="overflow-y-auto h-[calc(100vh-60px)] lg:h-auto">{content}</div>
            </aside>
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/50 z-[99] lg:hidden"></div>}
        </>
    );
};

const Pagination = ({ pagination, onPageChange }: { pagination: PaginationInfo, onPageChange: (page: number) => void }) => {
    if (!pagination || pagination.last_page <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-4 mt-16">
            <button 
                onClick={() => onPageChange(pagination.current_page - 1)} 
                disabled={pagination.current_page === 1} 
                className="p-3 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:cursor-not-allowed"
            >
                <ChevronRight size={20}/>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-xl">
                <span className="text-sm font-medium text-gray-700">صفحة {pagination.current_page} من {pagination.last_page}</span>
            </div>
            <button 
                onClick={() => onPageChange(pagination.current_page + 1)} 
                disabled={pagination.current_page === pagination.last_page} 
                className="p-3 border border-gray-200 rounded-xl disabled:opacity-50 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:cursor-not-allowed"
            >
                <ChevronLeft size={20}/>
            </button>
        </div>
    );
};

const ActiveFilters = ({ filters, setFilters, categories, brands }: any) => {
    const categoriesArray = Array.isArray(filters.categories) ? filters.categories : (filters.categories || '').split(',').filter(Boolean);
    const brandsArray = Array.isArray(filters.brands) ? filters.brands : (filters.brands || '').split(',').filter(Boolean);
    
    const activeCategories = categoriesArray.map((slug: string) => categories.find((c: Category) => c.slug === slug)?.name).filter(Boolean);
    const activeBrands = brandsArray.map((slug: string) => brands.find((b: Brand) => b.slug === slug)?.name).filter(Boolean);

    const removeFilter = (key: string, value: string) => {
        const slug = key === 'categories' ? categories.find((c: Category) => c.name === value)?.slug : brands.find((b: Brand) => b.name === value)?.slug;
        const currentArray = Array.isArray(filters[key]) ? filters[key] : (filters[key] || '').split(',').filter(Boolean);
        const updated = currentArray.filter((item: string) => item !== slug);
        setFilters((prev: any) => ({...prev, [key]: updated}));
    };
    
    if (!activeCategories.length && !activeBrands.length) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-sm font-semibold text-gray-700">الفلاتر النشطة:</span>
            {activeCategories.map((name: string) => (<div key={name} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"><span>{name}</span><button onClick={()=>removeFilter('categories', name)} className="hover:text-red-500"><X size={14}/></button></div>))}
            {activeBrands.map((name: string) => (<div key={name} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full"><span>{name}</span><button onClick={()=>removeFilter('brands', name)} className="hover:text-red-500"><X size={14}/></button></div>))}
        </div>
    );
};

// --- المكون الرئيسي لصفحة المتجر ---
export default function ShopPage() {
    const [shopData, setShopData] = useState<{ products: Product[], categories: Category[], brands: Brand[], pagination: PaginationInfo } | null>(null);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Size[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ 
        page: 1, 
        sort: 'latest', 
        per_page: 9,
        color: '',
        size: '',
        min_price: '',
        max_price: '',
        categories: [] as string[],
        brands: [] as string[]
    });

    const fetchShopData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [data, colorsData, sizesData] = await Promise.all([
                api.getShopData(filters),
                api.getColors(),
                api.getSizes()
            ]);
            
            const transformedData = {
                ...data,
                products: data.products.map(transformProduct)
            };
            
            setShopData(transformedData);
            setColors(colorsData);
            setSizes(sizesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);
    
    const applyFilters = (newFilters: {
        categories?: string[];
        brands?: string[];
        sort?: string;
        color?: string;
        size?: string;
        min_price?: string;
        max_price?: string;
    }) => {
        setFilters(prev => ({ ...prev, page: 1, ...newFilters }));
    };
    
    const handlePageChange = (newPage: number) => {
        if(shopData && newPage > 0 && newPage <= shopData.pagination.last_page) {
            setFilters(prev => ({...prev, page: newPage}));
            window.scrollTo(0, 0);
        }
    };

    if (error) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg container mx-auto my-8">خطأ: {error}</div>;
    if (!shopData) return <div className="flex items-center justify-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;

    const { products, categories, brands, pagination } = shopData;

    return (
        <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">المتجر</h1>
                    <p className="text-gray-600 text-lg">اكتشف مجموعة واسعة من المنتجات المميزة</p>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
                </div>
                
                <div className="flex flex-col lg:flex-row-reverse items-start gap-8">
                    
                    <FilterSidebar 
                        categories={categories} 
                        brands={brands} 
                        colors={colors}
                        sizes={sizes}
                        filters={filters} 
                        setFilters={setFilters}
                        applyFilters={applyFilters}
                        isOpen={isFilterOpen} 
                        onClose={() => setIsFilterOpen(false)} 
                    />
                    
                    <main className="flex-grow w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 text-gray-700 lg:hidden mb-4 sm:mb-0 py-3 px-5 border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                                <SlidersHorizontal size={20} />
                                <span className="font-medium">الفلاتر</span>
                            </button>
                            
                            <div className="flex items-center gap-2 text-gray-600 text-sm hidden sm:flex">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="font-medium">عرض {products.length} من {pagination.total} منتجات</span>
                            </div>
                            
                            <select value={filters.sort} onChange={(e) => setFilters(prev => ({...prev, sort: e.target.value, page: 1}))} className="border border-gray-200 rounded-xl p-3 text-sm w-full mt-2 sm:mt-0 sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                <option value="latest">الأحدث</option>
                                <option value="price-asc">السعر: من الأقل للأعلى</option>
                                <option value="price-desc">السعر: من الأعلى للأقل</option>
                            </select>
                        </div>
                        
                        <ActiveFilters filters={filters} setFilters={setFilters} categories={categories} brands={brands} />

                        {loading ? 
                            <div className="text-center py-20"><LoaderCircle className="animate-spin mx-auto text-blue-600" size={32}/></div> : 
                            products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {products.map(product => (<ProductCard key={product.id} product={product} />))}
                                    </div>
                                    <Pagination pagination={pagination} onPageChange={handlePageChange} />
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border">
                                    <h2 className="text-2xl font-semibold text-gray-700">لا توجد منتجات تطابق بحثك</h2>
                                    <p className="text-gray-500 mt-2">حاول تغيير خيارات الفلترة.</p>
                                </div>
                            )
                        }
                    </main>
                </div>
            </div>
        </div>
    );
};