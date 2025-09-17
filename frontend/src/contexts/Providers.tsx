'use client';

import React, { useState, useMemo, useContext, useCallback, createContext, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

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
}
interface CartItem extends Product {
    quantity: number;
}

// --- 1. سياق التنبيهات (Toast Context) ---
const ToastContext = createContext({
    showToast: (_message: string, _type?: 'success' | 'error') => {}
});

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
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


// --- 2. سياق سلة المشتريات (Cart Context) ---
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    clearCart: () => void;
    resetCart: () => void;
    totalItems: number;
    subtotal: number;
    savings: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { showToast } = useToast();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // تحميل البيانات من localStorage عند بدء تشغيل التطبيق
    useEffect(() => {
        try {
            const localData = localStorage.getItem('cart');
            if (localData) {
                // التأكد من أن البيانات صحيحة عند التحميل
                const parsedData = JSON.parse(localData).map((item: CartItem) => ({
                    ...item,
                    quantity: parseInt(String(item.quantity), 10) > 0 ? parseInt(String(item.quantity), 10) : 1,
                    price: parseFloat(String(item.price)) > 0 ? parseFloat(String(item.price)) : 0,
                    originalPrice: item.originalPrice && parseFloat(String(item.originalPrice)) > 0 ? parseFloat(String(item.originalPrice)) : undefined,
                    stock: parseInt(String(item.stock), 10) > 0 ? parseInt(String(item.stock), 10) : 999
                }));
                setCartItems(parsedData);
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
            // في حالة وجود خطأ، امسح البيانات الفاسدة
            localStorage.removeItem('cart');
            setCartItems([]);
        }
        setIsInitialLoad(false);
    }, []);

    // حفظ البيانات في localStorage عند أي تغيير في السلة
    useEffect(() => {
        if (!isInitialLoad) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, isInitialLoad]);

    const removeFromCart = useCallback((productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        showToast("تم حذف المنتج من السلة.");
    }, [showToast]);

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        // التأكد من أن الكمية الجديدة هي رقم صالح
        const numQuantity = parseInt(String(newQuantity), 10);

        // إذا كانت الكمية غير صالحة أو أقل من 1، قم بحذف المنتج
        if (isNaN(numQuantity) || numQuantity < 1) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === productId) {
                // التأكد من أن المخزون هو رقم صحيح
                const availableStock = parseInt(String(item.stock), 10) || 999;
                const updatedQuantity = Math.min(numQuantity, availableStock);
                
                if (numQuantity > availableStock) {
                    showToast(`الكمية القصوى المتاحة هي ${availableStock}`, 'error');
                }
                return { 
                    ...item, 
                    quantity: updatedQuantity
                };
            }
            return item;
        }));
    }, [removeFromCart, showToast]);

    const addToCart = useCallback((product: Product, quantity = 1) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.id === product.id);
            if (exist) {
                const currentQuantity = parseInt(String(exist.quantity), 10) || 0;
                const newQuantity = Math.min(currentQuantity + quantity, product.stock);
                if (currentQuantity >= product.stock) {
                    showToast('لا يمكن إضافة المزيد، لقد وصلت للكمية القصوى.', 'error');
                }
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prevItems, { ...product, quantity }];
        });
        if (quantity > 0) showToast(`تمت إضافة "${product.name}" إلى السلة!`);
    }, [showToast]);
    
    const clearCart = useCallback(() => {
        setCartItems([]);
        showToast("تم إفراغ السلة.");
    }, [showToast]);

    const resetCart = useCallback(() => {
        localStorage.removeItem('cart');
        setCartItems([]);
        showToast("تم إعادة تعيين السلة بنجاح.", 'success');
    }, [showToast]);

    // التأكد من أن جميع العمليات الحسابية تتم على أرقام
    const subtotal = useMemo(() => 
        cartItems.reduce((sum, item) => {
            const quantity = parseInt(String(item.quantity), 10);
            const price = parseFloat(String(item.price));
            return sum + (isNaN(quantity) || isNaN(price) ? 0 : price * quantity);
        }, 0), [cartItems]);
        
    const savings = useMemo(() => 
        cartItems.reduce((sum, item) => {
            if (!item.originalPrice) return sum;
            const quantity = parseInt(String(item.quantity), 10);
            const price = parseFloat(String(item.price));
            const originalPrice = parseFloat(String(item.originalPrice));
            return sum + (isNaN(quantity) || isNaN(price) || isNaN(originalPrice) ? 0 : (originalPrice - price) * quantity);
        }, 0), [cartItems]);
        
    const totalItems = useMemo(() => 
        cartItems.reduce((sum, item) => {
            const quantity = parseInt(String(item.quantity), 10);
            return sum + (isNaN(quantity) ? 0 : quantity);
        }, 0), [cartItems]);

    const value = useMemo(() => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, resetCart, subtotal, savings, totalItems }), 
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, resetCart, subtotal, savings, totalItems]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- 3. سياق المفضلة (Wishlist Context) ---
interface WishlistItem {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    stock: number;
    inStock: boolean;
    category?: string;
    brand?: string;
    rating?: number;
    reviewCount?: number;
    addedAt: number; // timestamp
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    clearWishlist: () => void;
    isInWishlist: (productId: number) => boolean;
    totalWishlistItems: number;
    moveToCart: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // تحميل البيانات من localStorage عند بدء تشغيل التطبيق
    useEffect(() => {
        try {
            const localData = localStorage.getItem('wishlist');
            if (localData) {
                const parsedData = JSON.parse(localData).map((item: WishlistItem) => ({
                    ...item,
                    id: parseInt(String(item.id), 10),
                    price: parseFloat(String(item.price)) || 0,
                    originalPrice: item.originalPrice ? parseFloat(String(item.originalPrice)) : undefined,
                    stock: parseInt(String(item.stock), 10) || 0,
                    addedAt: item.addedAt || Date.now()
                }));
                setWishlistItems(parsedData);
            }
        } catch (error) {
            console.error("Failed to parse wishlist from localStorage", error);
            localStorage.removeItem('wishlist');
            setWishlistItems([]);
        }
        setIsInitialLoad(false);
    }, []);

    // حفظ البيانات في localStorage عند أي تغيير في المفضلة
    useEffect(() => {
        if (!isInitialLoad) {
            localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, isInitialLoad]);

    const addToWishlist = useCallback((product: Product) => {
        const existingItem = wishlistItems.find(item => item.id === product.id);
        
        if (existingItem) {
            showToast('المنتج موجود في المفضلة مسبقاً', 'error');
            return;
        }

        const wishlistItem: WishlistItem = {
            ...product,
            addedAt: Date.now()
        };

        setWishlistItems(prev => [wishlistItem, ...prev]);
        showToast(`تمت إضافة "${product.name}" إلى المفضلة!`);
    }, [wishlistItems, showToast]);

    const removeFromWishlist = useCallback((productId: number) => {
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        showToast('تم حذف المنتج من المفضلة');
    }, [showToast]);

    const clearWishlist = useCallback(() => {
        setWishlistItems([]);
        showToast('تم مسح جميع المنتجات من المفضلة');
    }, [showToast]);

    const isInWishlist = useCallback((productId: number) => {
        return wishlistItems.some(item => item.id === productId);
    }, [wishlistItems]);

    const moveToCart = useCallback((productId: number) => {
        const product = wishlistItems.find(item => item.id === productId);
        if (product) {
            addToCart(product, 1);
            removeFromWishlist(productId);
            showToast(`تم نقل "${product.name}" إلى السلة!`);
        }
    }, [wishlistItems, addToCart, removeFromWishlist, showToast]);

    const totalWishlistItems = useMemo(() => wishlistItems.length, [wishlistItems]);

    const value = useMemo(() => ({
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
        totalWishlistItems,
        moveToCart
    }), [wishlistItems, addToWishlist, removeFromWishlist, clearWishlist, isInWishlist, totalWishlistItems, moveToCart]);

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// --- 4. المزود الرئيسي للتطبيق (AppProviders) ---
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <CartProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
            </CartProvider>
        </ToastProvider>
    );
}
