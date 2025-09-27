'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart, useWishlist } from '@/contexts/Providers'; // تأكد من أن المسار صحيح
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
        <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
            <a href={`/shop/${product.slug}`} className="block">
                <div className="relative overflow-hidden h-80">
                    <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=No+Image'; }} />
                    
                    {/* مؤشر الشحن المجاني */}
                    {product.has_free_shipping && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-md">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.5h1.5a2.5 2.5 0 005 0V8a1 1 0 00-1-1h-4.5z"/>
                            </svg>
                            شحن مجاني
                        </div>
                    )}
                    
                    {/* أزرار الإجراءات */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                        <button
                            onClick={handleWishlistClick}
                            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                                isWishlisted 
                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                    : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                            title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                        >
                            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                        </button>
                    </div>
                    
                    {isInCart && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 m-3 rounded-full flex items-center gap-1 z-10">
                            <CheckCircle size={14} />
                            <span>في السلة</span>
                        </div>
                    )}
                </div>
            </a>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow mb-4">
                     <a href={`/shop/${product.slug}`} className="block">
                        <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">{product.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
                    </a>
                </div>
                <div className="pt-3 mt-auto flex items-end justify-between">
                    {product.originalPrice ? (
                        <div><span className="text-xl font-bold text-red-600">{formatCurrency(product.price)}</span><span className="text-sm text-gray-400 line-through mr-2">{formatCurrency(product.originalPrice)}</span></div>
                    ) : (<span className="text-xl font-bold text-gray-800">{formatCurrency(product.price)}</span>)}

                    <div className="flex gap-2">
                        <button
                            onClick={handleWishlistClick}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                                isWishlisted 
                                    ? 'bg-red-500 text-white hover:bg-red-600' 
                                    : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-500'
                            }`}
                            title={isWishlisted ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                        >
                            <Heart size={18} className={isWishlisted ? 'fill-current' : ''} />
                        </button>
                        
                        <button 
                            onClick={handleCartClick} 
                            disabled={isInCart}
                            aria-label={isInCart ? "المنتج في السلة" : "إضافة إلى السلة"}
                            className={`w-10 h-10 text-white rounded-full flex items-center justify-center transition-all duration-300 transform 
                                ${isInCart 
                                    ? 'bg-gray-300 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
                                }`}
                        >
                            {isInCart ? <CheckCircle size={20}/> : <ShoppingCart size={20}/>}
                        </button>
                    </div>
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
       <div className="px-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-2">
                <h3 className="font-bold text-lg text-gray-900">الفلترة</h3>
                <button onClick={clearAllFilters} className="text-sm text-red-500 hover:underline">مسح الكل</button>
            </div>
            
            <AccordionItem title="التصنيفات" defaultOpen={true}>
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {categories.map((c: Category) => (
                        <li key={c.id}>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={localFilters.categories.includes(c.name)} 
                                    onChange={() => handleCategoryChange(c.name)} 
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                /> 
                                <span className="mr-3 text-sm text-gray-700">{c.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </AccordionItem>
            
            <AccordionItem title="الماركات">
                <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {brands.map((b: Brand) => (
                        <li key={b.id}>
                            <label className="flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={localFilters.brands.includes(b.name)} 
                                    onChange={() => handleBrandChange(b.name)} 
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                /> 
                                <span className="mr-3 text-sm text-gray-700">{b.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
            </AccordionItem>
            
            <AccordionItem title="الألوان">
                <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
                    {colors.map((color: Color) => (
                        <div key={color.id} className="flex flex-col items-center">
                            <label className="flex flex-col items-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="color"
                                    checked={localFilters.color === color.name} 
                                    onChange={() => handleColorChange(color.name)} 
                                    className="sr-only"
                                /> 
                                <div 
                                    className={`w-8 h-8 rounded-full border-2 ${localFilters.color === color.name ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`} 
                                    style={{ backgroundColor: color.hex_code }}
                                ></div>
                                <span className="text-xs text-gray-600 mt-1">{color.name}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </AccordionItem>
            
            <AccordionItem title="الأحجام">
                <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto pr-2">
                    {sizes.map((size: Size) => (
                        <div key={size.id}>
                            <label className="flex items-center justify-center cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="size"
                                    checked={localFilters.size === size.name} 
                                    onChange={() => handleSizeChange(size.name)} 
                                    className="sr-only"
                                /> 
                                <div 
                                    className={`w-12 h-8 border-2 rounded-md flex items-center justify-center text-xs font-medium ${localFilters.size === size.name ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}
                                >
                                    {size.name}
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </AccordionItem>
            
            <AccordionItem title="نطاق السعر">
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأدنى</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={localFilters.min_price}
                                onChange={(e) => setLocalFilters(prev => ({ ...prev, min_price: e.target.value }))}
                                onBlur={(e) => handlePriceChange(e.target.value, localFilters.max_price)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">السعر الأقصى</label>
                            <input
                                type="number"
                                placeholder="1000"
                                value={localFilters.max_price}
                                onChange={(e) => setLocalFilters(prev => ({ ...prev, max_price: e.target.value }))}
                                onBlur={(e) => handlePriceChange(localFilters.min_price, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePriceChange('0', '100')}
                            className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            أقل من 100 درهم
                        </button>
                        <button
                            onClick={() => handlePriceChange('100', '500')}
                            className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            100 - 500 درهم
                        </button>
                    </div>
                    
                    <div className="flex gap-2">
                        <button
                            onClick={() => handlePriceChange('500', '1000')}
                            className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            500 - 1000 درهم
                        </button>
                        <button
                            onClick={() => handlePriceChange('1000', '')}
                            className="flex-1 py-2 px-3 text-xs border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            أكثر من 1000 درهم
                        </button>
                    </div>
                </div>
            </AccordionItem>
        </div>
    );
    
    return (
        <>
            <aside className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl z-[100] transform transition-transform lg:max-w-none lg:w-72 lg:flex-shrink-0 lg:h-auto lg:shadow-none lg:border lg:rounded-2xl lg:bg-white lg:sticky lg:top-24 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                <div className="flex justify-between items-center p-4 border-b lg:hidden"><h3 className="font-bold">الفلترة</h3><button onClick={onClose}><X size={24}/></button></div>
                <div className="overflow-y-auto h-[calc(100vh-60px)] lg:h-auto">{content}</div>
            </aside>
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-[99] lg:hidden"></div>}
        </>
    );
};

const Pagination = ({ pagination, onPageChange }: { pagination: PaginationInfo, onPageChange: (page: number) => void }) => {
    if (!pagination || pagination.last_page <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"><ChevronRight size={18}/></button>
            <span className="text-sm text-gray-700">صفحة {pagination.current_page} من {pagination.last_page}</span>
            <button onClick={() => onPageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-2 border rounded-md disabled:opacity-50 hover:bg-gray-100 transition-colors"><ChevronLeft size={18}/></button>
        </div>
    );
};

const ActiveFilters = ({ filters, setFilters, categories, brands }: any) => {
    // تحويل arrays إلى arrays إذا لم تكن كذلك
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
            
            // تحويل بيانات المنتجات إلى الشكل المطلوب
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
            window.scrollTo(0, 0); // الانتقال لأعلى الصفحة عند تغيير الصفحة
        }
    };

    if (error) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg container mx-auto my-8">خطأ: {error}</div>;
    if (!shopData) return <div className="flex items-center justify-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;

    const { products, categories, brands, pagination } = shopData;

    return (
        <div className="bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">اكتشف مجموعتنا</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">تصفح أحدث المنتجات المختارة بعناية لتناسب جميع احتياجاتك.</p>
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
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-2xl border border-gray-200">
                            <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-2 text-gray-700 font-semibold lg:hidden mb-4 sm:mb-0 w-full sm:w-auto justify-center py-2 px-4 border rounded-lg hover:bg-gray-100 transition-colors">
                                <SlidersHorizontal size={20} />
                                <span>عرض الفلاتر</span>
                            </button>
                            
                            <p className="text-gray-600 text-sm hidden sm:block">عرض {products.length} من {pagination.total} منتجات</p>
                            
                            <select value={filters.sort} onChange={(e) => setFilters(prev => ({...prev, sort: e.target.value, page: 1}))} className="border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-full mt-2 sm:mt-0 sm:w-auto">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
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
