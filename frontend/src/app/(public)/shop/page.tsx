'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useCart } from '@/contexts/Providers'; // تأكد من أن المسار صحيح
import { LoaderCircle, SlidersHorizontal, X, ChevronDown, ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// --- الواجهات (Interfaces) ---
interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    stock: number;
    inStock: boolean;
    short_description?: string;
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
interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// --- مساعد جلب البيانات من الـ API ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const api = {
    getShopData: async (filters: any): Promise<{ products: Product[], categories: Category[], brands: Brand[], pagination: PaginationInfo }> => {
        const params = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/shop?${params}`);
        if (!response.ok) throw new Error('فشل في جلب بيانات المتجر.');
        const data = await response.json();
        const adaptedProducts = data.products.map((p: any) => ({
            ...p,
            price: p.sale_price ?? p.regular_price,
            originalPrice: p.sale_price ? p.regular_price : undefined,
            inStock: p.stock > 0,
        }));
        return { ...data, products: adaptedProducts };
    }
};

// --- المكونات الفرعية للصفحة ---

const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

const ProductCard = React.memo(({ product }: { product: Product }) => {
    const { addToCart, cartItems } = useCart();
    
    const isInCart = useMemo(() => cartItems.some(item => item.id === product.id), [cartItems, product.id]);

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isInCart) {
            addToCart(product);
        }
    };
    
    return (
        <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
            <a href={`/shop/${product.slug}`} className="block">
                <div className="relative overflow-hidden h-80">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=No+Image'; }} />
                    
                    {isInCart && (
                        <div className="absolute top-0 left-0 bg-blue-600 text-white text-xs font-semibold px-3 py-1 m-3 rounded-full flex items-center gap-1 z-10">
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

const FilterSidebar = ({ categories, brands, filters, setFilters, isOpen, onClose }: any) => {
    const handleCheckboxChange = (filterKey: string, value: string) => {
        const currentValues = filters[filterKey] ? filters[filterKey].split(',') : [];
        const newValues = currentValues.includes(value) ? currentValues.filter((v: string) => v !== value) : [...currentValues, value];
        setFilters((prev: any) => ({ ...prev, [filterKey]: newValues.join(','), page: 1 }));
    };

    const content = (
       <div className="px-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-200 mb-2"><h3 className="font-bold text-lg text-gray-900">الفلترة</h3><button onClick={() => setFilters({ page: 1, sort: filters.sort, per_page: filters.per_page })} className="text-sm text-red-500 hover:underline">مسح الكل</button></div>
            <AccordionItem title="التصنيفات" defaultOpen={true}><ul className="space-y-3 max-h-60 overflow-y-auto pr-2">{categories.map((c: Category) => (<li key={c.id}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={(filters.categories || '').includes(c.slug)} onChange={() => handleCheckboxChange('categories', c.slug)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/> <span className="mr-3 text-sm text-gray-700">{c.name}</span></label></li>))}</ul></AccordionItem>
            <AccordionItem title="الماركات"><ul className="space-y-3 max-h-60 overflow-y-auto pr-2">{brands.map((b: Brand) => (<li key={b.id}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={(filters.brands || '').includes(b.slug)} onChange={() => handleCheckboxChange('brands', b.slug)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/> <span className="mr-3 text-sm text-gray-700">{b.name}</span></label></li>))}</ul></AccordionItem>
            <AccordionItem title="السعر" defaultOpen={true}><div className="pt-2"><input type="range" min="0" max="10000" value={filters.max_price || 10000} onChange={e => setFilters((prev: any) => ({...prev, max_price: e.target.value, page: 1}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/><div className="flex justify-between text-sm text-gray-600 mt-2"><span>0 د.م.</span><span>{formatCurrency(filters.max_price || 10000)}</span></div></div></AccordionItem>
        </div>
    );
    
    return (
        <>
            <aside className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl z-[100] transform transition-transform lg:relative lg:max-w-none lg:w-72 lg:flex-shrink-0 lg:h-auto lg:shadow-none lg:border lg:rounded-2xl lg:bg-white lg:sticky lg:top-24 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
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
    const activeCategories = (filters.categories || '').split(',').filter(Boolean).map((slug: string) => categories.find((c: Category) => c.slug === slug)?.name).filter(Boolean);
    const activeBrands = (filters.brands || '').split(',').filter(Boolean).map((slug: string) => brands.find((b: Brand) => b.slug === slug)?.name).filter(Boolean);

    const removeFilter = (key: string, value: string) => {
        const slug = key === 'categories' ? categories.find((c: Category) => c.name === value)?.slug : brands.find((b: Brand) => b.name === value)?.slug;
        const current = filters[key].split(',');
        const updated = current.filter((item: string) => item !== slug).join(',');
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ page: 1, sort: 'latest', per_page: 9 });

    const fetchShopData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await api.getShopData(filters);
            setShopData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);
    
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
                    
                    <FilterSidebar categories={categories} brands={brands} filters={filters} setFilters={setFilters} isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
                    
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
