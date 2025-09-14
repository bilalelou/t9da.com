'use client';

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';

// Icons
import { LoaderCircle, Search, SlidersHorizontal, X, ChevronUp, ChevronDown, Heart, ShoppingCart, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Interfaces ---
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
interface CartItem extends Product {
    quantity: number;
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

// --- Contexts (Toast, Favorites, and Cart) ---
// [تصحيح] تم دمج الـ Providers هنا لحل مشكلة الاستيراد
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false, type: 'success' });
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast({ message: '', visible: false, type: 'success' }), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div className={`fixed bottom-10 right-10 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101] ${toast.type === 'success' ? 'bg-gray-800' : 'bg-red-600'}`}>
                    <CheckCircle size={22} className={toast.type === 'success' ? 'text-green-400' : 'text-white'}/>
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};

const FavoritesContext = createContext<{ favoriteIds: Set<number>; toggleFavorite: (id: number) => void; }>({ favoriteIds: new Set(), toggleFavorite: () => {} });
const useFavorites = () => useContext(FavoritesContext);

const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const toggleFavorite = useCallback((productId: number) => {
        setFavoriteIds(prev => { const newIds = new Set(prev); if (newIds.has(productId)) newIds.delete(productId); else newIds.add(productId); return newIds; });
    }, []);
    const value = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds]);
    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

const CartContext = createContext<any>(null);
const useCart = () => {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within a CartProvider');
    return context;
};

const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const { showToast } = useToast();

    useEffect(() => {
        try { const localData = localStorage.getItem('cart'); if (localData) setCartItems(JSON.parse(localData)); }
        catch (error) { console.error("Failed to parse cart", error); }
    }, []);

    useEffect(() => { localStorage.setItem('cart', JSON.stringify(cartItems)); }, [cartItems]);

    const addToCart = (product: Product) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.id === product.id);
            if (exist) {
                const newQuantity = Math.min(exist.quantity + 1, product.stock);
                if (exist.quantity >= product.stock) {
                    showToast('لا يمكن إضافة المزيد، لقد وصلت للكمية القصوى.', 'error');
                }
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        showToast(`تمت إضافة "${product.name}" إلى السلة!`);
    };

    const value = useMemo(() => ({ cartItems, addToCart }), [cartItems]);
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


// --- API Helper ---
const API_BASE_URL = 'http://localhost:8000/api';
const api = {
    getShopData: async (filters: any): Promise<{ products: Product[], categories: Category[], brands: Brand[], pagination: PaginationInfo }> => {
        const params = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/shop?${params}`);
        if (!response.ok) throw new Error('فشل في جلب بيانات المتجر.');
        const data = await response.json();
        const adaptedProducts = data.products.map(p => ({
            ...p,
            price: p.sale_price ?? p.regular_price,
            originalPrice: p.sale_price ? p.regular_price : undefined,
            inStock: p.stock > 0,
        }));
        return { ...data, products: adaptedProducts };
    }
};

// --- Components ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

const ProductCard = React.memo(({ product }: { product: Product }) => {
    const { favoriteIds, toggleFavorite } = useFavorites();
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const isFavorite = favoriteIds.has(product.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        toggleFavorite(product.id);
        showToast(isFavorite ? `تمت إزالة "${product.name}" من المفضلة` : `تمت إضافة "${product.name}" إلى المفضلة`);
    };

    const handleCartClick = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        addToCart(product);
    };

    return (
        <a href={`/products/${product.slug}`} className="cursor-pointer group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full">
            <div className="relative overflow-hidden h-80">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/400x400/f0f0f0/cccccc?text=No+Image'; }} />
                <button onClick={handleFavoriteClick} className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md transition-all ${isFavorite ? 'text-red-500' : 'text-gray-600'}`}><Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} /></button>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
                </div>
                <div className="pt-3 mt-auto flex items-end justify-between">
                    {product.originalPrice ? (
                        <div><span className="text-xl font-bold text-red-600">{formatCurrency(product.price)}</span><span className="text-sm text-gray-400 line-through ml-2">{formatCurrency(product.originalPrice)}</span></div>
                    ) : (<span className="text-xl font-bold text-gray-800">{formatCurrency(product.price)}</span>)}
                    <button onClick={handleCartClick} className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center transform group-hover:bg-blue-700 transition-colors"><ShoppingCart size={20}/></button>
                </div>
            </div>
        </a>
    );
});
ProductCard.displayName = "ProductCard";

const AccordionItem = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4 text-right"><span className="font-semibold text-gray-800">{title}</span><ChevronDown size={20} className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}><div className="pb-4">{children}</div></div>
        </div>
    );
};

const FilterSidebar = ({ categories, brands, filters, setFilters, isOpen, onClose }) => {
    const handleCheckboxChange = (filterKey: string, value: string) => {
        const currentValues = filters[filterKey] ? filters[filterKey].split(',') : [];
        const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
        setFilters(prev => ({ ...prev, [filterKey]: newValues.join(','), page: 1 }));
    };

    const content = (
         <div className="px-4">
            <div className="flex justify-between items-center py-4 border-b border-gray-200"><h3 className="font-bold text-lg text-gray-900">الفلترة</h3><button onClick={() => setFilters({ page: 1, sort: filters.sort, per_page: filters.per_page })} className="text-sm text-red-500 hover:underline">مسح الكل</button></div>
            <AccordionItem title="التصنيفات" defaultOpen={true}><ul className="space-y-3 max-h-60 overflow-y-auto pr-2">{categories.map(c => (<li key={c.id}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={(filters.categories || '').includes(c.slug)} onChange={() => handleCheckboxChange('categories', c.slug)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/> <span className="mr-3 text-sm text-gray-700">{c.name}</span></label></li>))}</ul></AccordionItem>
            <AccordionItem title="الماركات"><ul className="space-y-3 max-h-60 overflow-y-auto pr-2">{brands.map(b => (<li key={b.id}><label className="flex items-center cursor-pointer"><input type="checkbox" checked={(filters.brands || '').includes(b.slug)} onChange={() => handleCheckboxChange('brands', b.slug)} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/> <span className="mr-3 text-sm text-gray-700">{b.name}</span></label></li>))}</ul></AccordionItem>
            <AccordionItem title="السعر" defaultOpen={true}><div className="pt-2"><input type="range" min="0" max="10000" value={filters.max_price || 10000} onChange={e => setFilters(prev => ({...prev, max_price: e.target.value, page: 1}))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"/><div className="flex justify-between text-sm text-gray-600 mt-2"><span>0 د.م.</span><span>{formatCurrency(filters.max_price || 10000)}</span></div></div></AccordionItem>
        </div>
    );
    
    return (
        <>
            <aside className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white shadow-xl z-[100] transform transition-transform lg:relative lg:max-w-none lg:w-72 lg:h-auto lg:shadow-none lg:border lg:rounded-2xl lg:bg-white lg:sticky lg:top-24 ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                 <div className="flex justify-between items-center p-4 border-b lg:hidden"><h3 className="font-bold">الفلترة</h3><button onClick={onClose}><X size={24}/></button></div>
                <div className="overflow-y-auto h-[calc(100vh-60px)] lg:h-auto">{content}</div>
            </aside>
            {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black/60 z-[99] lg:hidden"></div>}
        </>
    );
};

const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.last_page <= 1) return null;
    return (
         <div className="flex items-center justify-center gap-2 mt-12">
             <button onClick={() => onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={18}/></button>
             <span className="text-sm text-gray-700">صفحة {pagination.current_page} من {pagination.last_page}</span>
             <button onClick={() => onPageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={18}/></button>
        </div>
    );
};

const ActiveFilters = ({ filters, setFilters, categories, brands }) => {
    const activeCategories = (filters.categories || '').split(',').filter(Boolean).map(slug => categories.find(c => c.slug === slug)?.name).filter(Boolean);
    const activeBrands = (filters.brands || '').split(',').filter(Boolean).map(slug => brands.find(b => b.slug === slug)?.name).filter(Boolean);

    const removeFilter = (key, value) => {
        const slug = key === 'categories' ? categories.find(c=>c.name === value)?.slug : brands.find(b=>b.name === value)?.slug;
        const current = filters[key].split(',');
        const updated = current.filter(item => item !== slug).join(',');
        setFilters(prev => ({...prev, [key]: updated}));
    };
    
    if (!activeCategories.length && !activeBrands.length) return null;

    return (
        <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="text-sm font-semibold">الفلاتر النشطة:</span>
            {activeCategories.map(name => (<div key={name} className="flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full"><span>{name}</span><button onClick={()=>removeFilter('categories', name)}><X size={14}/></button></div>))}
             {activeBrands.map(name => (<div key={name} className="flex items-center gap-1 bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full"><span>{name}</span><button onClick={()=>removeFilter('brands', name)}><X size={14}/></button></div>))}
        </div>
    );
};


function ShopPage() {
    const [shopData, setShopData] = useState<{ products: Product[], categories: Category[], brands: Brand[], pagination: PaginationInfo } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ page: 1, sort: 'latest', per_page: 9 });

    const fetchShopData = useCallback(async () => {
        setLoading(true); setError(null);
        try { const data = await api.getShopData(filters); setShopData(data); }
        catch (err) { setError(err.message); }
        finally { setLoading(false); }
    }, [filters]);

    useEffect(() => { fetchShopData(); }, [fetchShopData]);
    
    const handlePageChange = (newPage) => {
        if(shopData && newPage > 0 && newPage <= shopData.pagination.last_page) {
            setFilters(prev => ({...prev, page: newPage}));
        }
    };

    if (error) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg container mx-auto my-8">خطأ: {error}</div>;
    if (!shopData) return <div className="flex items-center justify-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;

    const { products, categories, brands, pagination } = shopData;

    return (
         <div className="bg-gray-50">
             <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">اكتشف مجموعتنا</h1>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">تصفح أحدث المنتجات المختارة بعناية لتناسب جميع احتياجاتك.</p>
                </div>
                <div className="flex flex-row items-start gap-8">
                    <FilterSidebar categories={categories} brands={brands} filters={filters} setFilters={setFilters} isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
                    <main className="flex-grow">
                         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-white rounded-2xl border border-gray-200">
                            <p className="text-gray-600 text-sm">عرض {products.length} من {pagination.total} منتجات</p>
                            <select value={filters.sort} onChange={(e) => setFilters(prev => ({...prev, sort: e.target.value, page: 1}))} className="border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="latest">الأحدث</option>
                                <option value="price-asc">السعر: من الأقل للأعلى</option>
                                <option value="price-desc">السعر: من الأعلى للأقل</option>
                            </select>
                        </div>
                        
                        <ActiveFilters filters={filters} setFilters={setFilters} categories={categories} brands={brands} />

                         {loading ? <div className="text-center py-20"><LoaderCircle className="animate-spin mx-auto text-blue-600"/></div> : 
                            products.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                        {products.map(product => (<ProductCard key={product.id} product={product} />))}
                                    </div>
                                    <Pagination pagination={pagination} onPageChange={handlePageChange} />
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white rounded-2xl border"><h2 className="text-2xl font-semibold text-gray-700">لا توجد منتجات تطابق بحثك</h2><p className="text-gray-500 mt-2">حاول تغيير خيارات الفلترة.</p></div>
                            )
                        }
                    </main>
                </div>
            </div>
         </div>
    );
};

// --- Entry Point ---
export default function ShopPageLoader() {
    return (
        <ToastProvider>
            <FavoritesProvider>
                <CartProvider>
                    <ShopPage />
                </CartProvider>
            </FavoritesProvider>
        </ToastProvider>
    );
}

