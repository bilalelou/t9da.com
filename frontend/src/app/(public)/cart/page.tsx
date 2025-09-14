'use client';

import React, { useState, useMemo, useContext, useCallback, createContext, useEffect } from 'react';

// Icons
import { ShoppingCart, Trash2, Minus, Plus, Tag, AlertTriangle, CheckCircle } from 'lucide-react';

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
}
interface CartItem extends Product {
    quantity: number;
}

// --- Contexts (Toast & Cart) ---
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
    
    const savings = useMemo(() => cartItems.reduce((sum, item) => item.originalPrice ? sum + ((item.originalPrice - item.price) * item.quantity) : sum, 0), [cartItems]);


    const value = useMemo(() => ({ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, savings }), [cartItems, savings]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};


// --- Main Cart Page Component ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

function CartPage() {
    const { cartItems, clearCart, updateQuantity, removeFromCart, savings } = useCart();
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

    const subtotal = useMemo(() => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cartItems]);
    const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
    const tax = (subtotal - couponDiscount) * 0.20; // 20% VAT
    const total = subtotal - couponDiscount + tax;

    const applyCoupon = () => {
        const validCoupons = { 'SAVE10': 10, 'WELCOME20': 20 };
        if (validCoupons[couponCode.toUpperCase()]) {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: validCoupons[couponCode.toUpperCase()]});
        } else {
            alert('كود الخصم غير صحيح');
        }
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <ShoppingCart size={64} className="mx-auto text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">سلة مشترياتك فارغة</h2>
                <a href="/shop" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">ابدأ التسوق الآن</a>
            </div>
        );
    }
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center pb-4 border-b mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">المنتجات ({cartItems.length})</h2>
                    <button onClick={clearCart} className="text-sm text-red-500 hover:underline flex items-center gap-1"><Trash2 size={16}/> إفراغ السلة</button>
                </div>
                <div className="divide-y divide-gray-200">
                    {cartItems.map(item => (
                        <div key={item.id} className="flex items-start gap-4 py-6">
                            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border flex-shrink-0" />
                            <div className="flex-grow">
                                <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                {!item.inStock && (<div className="mt-1 flex items-center gap-2 text-red-600 text-sm"><AlertTriangle size={16}/> <span>غير متوفر حالياً</span></div>)}
                                <div className="flex items-center border rounded-lg w-fit mt-3">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2"><Minus size={16}/></button>
                                    <span className="px-4 font-bold">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-3 py-2 disabled:opacity-50"><Plus size={16}/></button>
                                </div>
                            </div>
                            <div className="text-left">
                                <p className="text-lg font-bold text-blue-600">{formatCurrency(item.price * item.quantity)}</p>
                                {item.originalPrice && <p className="text-sm text-gray-400 line-through">{formatCurrency(item.originalPrice * item.quantity)}</p>}
                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-400 hover:text-red-500 mt-2">إزالة</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-gray-50 rounded-2xl p-6 border sticky top-24">
                    <h3 className="text-xl font-bold border-b pb-4 mb-4">ملخص الطلب</h3>
                    <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between"><span>المجموع الفرعي</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
                        {savings > 0 && <div className="flex justify-between text-green-600"><span>التوفير</span><span className="font-semibold">-{formatCurrency(savings)}</span></div>}
                        {appliedCoupon && <div className="flex justify-between text-green-600"><span>خصم ({appliedCoupon.code})</span><span className="font-semibold">-{formatCurrency(couponDiscount)}</span></div>}
                        <div className="flex justify-between"><span>الضريبة (20%)</span><span className="font-semibold">{formatCurrency(tax)}</span></div>
                        <div className="flex justify-between font-bold text-gray-900 text-lg pt-4 border-t"><span>الإجمالي</span><span>{formatCurrency(total)}</span></div>
                    </div>
                    <div className="mt-6"><label className="font-semibold mb-2 block">كود الخصم</label><div className="flex gap-2"><input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="أدخل الكود" className="w-full border-gray-300 rounded-lg"/><button onClick={applyCoupon} disabled={!couponCode} className="bg-gray-800 text-white px-4 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50">تطبيق</button></div></div>
                    <a href="/checkout" className="block text-center w-full mt-6 bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 transition">إتمام الطلب</a>
                </div>
            </div>
        </div>
    );
}

// --- Entry Point ---
export default function CartPageLoader() {
    return (
        <ToastProvider>
            <CartProvider>
                <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                    <CartPage />
                </div>
            </CartProvider>
        </ToastProvider>
    );
}

