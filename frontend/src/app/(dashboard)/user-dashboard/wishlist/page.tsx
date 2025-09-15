'use client';

import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';

// Icons
import { Heart, ShoppingCart, LoaderCircle, Trash2, CheckCircle, Star } from 'lucide-react';

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
    category: string;
    rating: number;
    reviews: number;
}
interface CartItem extends Product {
    quantity: number;
}


// --- [تصحيح] تم دمج كل أنظمة إدارة الحالة هنا لحل مشكلة الاستيراد ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const useToast = () => useContext(ToastContext);
const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' });
    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div dir="rtl" className={`fixed bottom-10 right-10 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101] ${toast.type === 'success' ? 'bg-gray-800' : 'bg-red-600'}`}>
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
    const { showToast } = useToast();
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    
    useEffect(() => {
        try { const localData = localStorage.getItem('favorites'); if (localData) setFavoriteIds(new Set(JSON.parse(localData))); }
        catch (error) { console.error("Failed to parse favorites", error); }
    }, []);

    useEffect(() => { localStorage.setItem('favorites', JSON.stringify(Array.from(favoriteIds))); }, [favoriteIds]);

    const toggleFavorite = useCallback((productId: number) => {
        setFavoriteIds(prev => {
            const newIds = new Set(prev);
            const isFavorite = newIds.has(productId);
            if (isFavorite) {
                newIds.delete(productId);
                showToast(`تمت إزالة المنتج من المفضلة`);
            } else {
                newIds.add(productId);
                 showToast(`تمت إضافة المنتج إلى المفضلة`);
            }
            return newIds;
        });
    }, [showToast]);
    const value = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds, toggleFavorite]);
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
                if (exist.quantity >= product.stock) showToast('لا يمكن إضافة المزيد، لقد وصلت للكمية القصوى.', 'error');
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
        showToast(`تمت إضافة "${product.name}" إلى السلة!`);
    };
    const value = useMemo(() => ({ cartItems, addToCart }), [cartItems]);
    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const AppProviders = ({ children }) => (
    <ToastProvider>
        <FavoritesProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </FavoritesProvider>
    </ToastProvider>
);

// --- API Helper ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getProductsByIds: async (ids: number[]): Promise<Product[]> => {
        if (ids.length === 0) return [];
        const response = await fetch(`${API_BASE_URL}/products-by-ids`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ ids }),
        });
        if (!response.ok) throw new Error('فشل في جلب منتجات المفضلة.');
        const data = await response.json();
        return data.map(p => ({
            ...p,
            price: p.sale_price ?? p.regular_price,
            originalPrice: p.sale_price ? p.regular_price : undefined,
            inStock: p.stock > 0,
        }));
    }
};

// --- Components ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={16} className={i < Math.round(rating) ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"} />
    ));
};

const WishlistItemCard = ({ product }: { product: Product }) => {
    const { toggleFavorite } = useFavorites();
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <a href={`/product/${product.slug}`} className="block relative h-64 overflow-hidden">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </a>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs text-blue-600 font-medium mb-1">{product.category}</p>
                <a href={`/product/${product.slug}`}><h3 className="font-bold text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">{product.name}</h3></a>
                <div className="flex items-center gap-1 my-2">{renderStars(product.rating)}<span className="text-xs text-gray-500">({product.reviews} مراجعة)</span></div>
                <div className="mt-auto pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                         <div className="flex items-baseline gap-2">
                             <span className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
                             {product.originalPrice && <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>}
                         </div>
                         <p className={`font-semibold text-xs ${product.inStock ? 'text-green-600' : 'text-red-500'}`}>{product.inStock ? 'متوفر' : 'غير متوفر'}</p>
                    </div>
                     <div className="flex items-center gap-2">
                        <button onClick={() => addToCart(product)} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm" disabled={!product.inStock}>
                            إضافة للسلة
                        </button>
                        <button onClick={() => toggleFavorite(product.id)} className="p-2 text-gray-500 bg-gray-100 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors" title="إزالة من المفضلة">
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Wishlist Page Component ---
function WishlistPage() {
    const { favoriteIds } = useFavorites();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (favoriteIds.size === 0) { setProducts([]); setLoading(false); return; }
            try {
                setLoading(true);
                const fetchedProducts = await api.getProductsByIds(Array.from(favoriteIds));
                setProducts(fetchedProducts);
            } catch (err: any) { setError(err.message); }
            finally { setLoading(false); }
        };
        fetchWishlistProducts();
    }, [favoriteIds]);

    if (loading) return <div className="flex justify-center py-20"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    if (error) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    
    if (products.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-100">
                <Heart size={64} className="mx-auto text-red-300" strokeWidth={1.5} />
                <h2 className="text-2xl font-bold text-gray-800 mt-6">قائمة مفضلتك فارغة</h2>
                <a href="/shop" className="mt-8 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">اكتشف منتجاتنا</a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (<WishlistItemCard key={product.id} product={product} />))}
        </div>
    );
}

// --- Entry Point ---
export default function WishlistPageLoader() {
    return (
        <AppProviders>
            <div className="bg-gray-50 min-h-screen">
                <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                     <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">قائمة المفضلة</h1>
                        <p className="mt-3 text-lg text-gray-600">المنتجات التي قمت بحفظها للعودة إليها لاحقاً.</p>
                    </div>
                    <WishlistPage />
                </div>
            </div>
        </AppProviders>
    );
}

