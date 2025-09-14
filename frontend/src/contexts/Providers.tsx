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
    image: string;
    stock: number;
    inStock: boolean;
}
interface CartItem extends Product {
    quantity: number;
}

// --- 1. سياق التنبيهات (Toast Context) ---
const ToastContext = createContext({
    showToast: (message: string, type?: 'success' | 'error') => {}
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
                // التأكد من أن الكمية هي رقم صحيح عند التحميل
                const parsedData = JSON.parse(localData).map((item: any) => ({
                    ...item,
                    quantity: parseInt(String(item.quantity), 10) || 1
                }));
                setCartItems(parsedData);
            }
        } catch (error) {
            console.error("Failed to parse cart from localStorage", error);
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
                const updatedQuantity = Math.min(numQuantity, item.stock);
                if (numQuantity > item.stock) {
                    showToast(`الكمية القصوى المتاحة هي ${item.stock}`, 'error');
                }
                return { ...item, quantity: updatedQuantity };
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
        if (window.confirm('هل أنت متأكد من رغبتك في إفراغ السلة؟')) {
            setCartItems([]);
            showToast("تم إفراغ السلة.");
        }
    }, [showToast]);

    // التأكد من أن جميع العمليات الحسابية تتم على أرقام
    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price * (parseInt(String(item.quantity), 10) || 0)), 0), [cartItems]);
    const savings = useMemo(() => cartItems.reduce((sum, item) => item.originalPrice ? sum + ((item.originalPrice - item.price) * (parseInt(String(item.quantity), 10) || 0)) : sum, 0), [cartItems]);
    const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + (parseInt(String(item.quantity), 10) || 0), 0), [cartItems]);

    const value = useMemo(() => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, savings, totalItems }), 
    [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, savings, totalItems]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- 3. المزود الرئيسي للتطبيق (AppProviders) ---
export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </ToastProvider>
    );
}
