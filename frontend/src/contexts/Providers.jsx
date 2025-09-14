'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, useMemo } from 'react';
import { CheckCircle } from 'lucide-react';

// --- Interfaces ---
export interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    originalPrice?: number;
    image: string;
    stock: number;
    inStock: boolean;
}
export interface CartItem extends Product {
    quantity: number;
}

// --- 1. Toast Notification System ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
export const useToast = () => useContext(ToastContext);

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

// --- 2. Favorites Context ---
const FavoritesContext = createContext<{ favoriteIds: Set<number>; toggleFavorite: (id: number) => void; }>({ favoriteIds: new Set(), toggleFavorite: () => {} });
export const useFavorites = () => useContext(FavoritesContext);

const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const toggleFavorite = useCallback((productId: number) => {
        setFavoriteIds(prev => { const newIds = new Set(prev); if (newIds.has(productId)) newIds.delete(productId); else newIds.add(productId); return newIds; });
    }, []);
    const value = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds]);
    return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

// --- 3. Cart Context ---
const CartContext = createContext<any>(null);
export const useCart = () => {
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

    const addToCart = (product: Product, quantity = 1) => {
        setCartItems(prevItems => {
            const exist = prevItems.find(item => item.id === product.id);
            if (exist) {
                const newQuantity = Math.min(exist.quantity + quantity, product.stock);
                if (exist.quantity >= product.stock) showToast('لا يمكن إضافة المزيد، لقد وصلت للكمية القصوى.', 'error');
                return prevItems.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prevItems, { ...product, quantity }];
        });
        showToast(`تمت إضافة "${product.name}" إلى السلة!`);
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
        showToast("تم حذف المنتج من السلة.");
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity < 1) { removeFromCart(productId); return; }
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === productId) {
                const updatedQuantity = Math.min(newQuantity, item.stock);
                if (newQuantity > item.stock) showToast(`الكمية القصوى المتاحة هي ${item.stock}`, 'error');
                return { ...item, quantity: updatedQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => { if (window.confirm('هل أنت متأكد؟')) { setCartItems([]); showToast("تم إفراغ السلة."); } };

    const value = useMemo(() => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }), [cartItems]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// --- Main Provider Component ---
export default function AppProviders({ children }) {
    return (
        <ToastProvider>
            <FavoritesProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </FavoritesProvider>
        </ToastProvider>
    );
}

