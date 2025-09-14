'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/contexts/Providers'; // تأكد من أن المسار صحيح
import { ShoppingCart, Trash2, Minus, Plus, Tag, AlertTriangle, ArrowRight, ChevronLeft, MapPin } from 'lucide-react';
import Link from 'next/link';

// دالة مساعدة لتنسيق العملة
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

// بيانات وهمية لتكاليف الشحن حسب المدينة (يمكنك استبدالها بـ API call)
const shippingCosts = {
    'Casablanca': 30,
    'Rabat': 35,
    'Marrakech': 45,
    'Agadir': 50,
    'Tanger': 40,
    'Fès': 40,
    'Meknès': 40,
    'Oujda': 55,
    'default': 40, // تكلفة افتراضية للمدن الأخرى
};
const cities = Object.keys(shippingCosts).filter(c => c !== 'default');

export default function CartPage() {
    const { cartItems, clearCart, updateQuantity, removeFromCart, subtotal, savings } = useCart();
    
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null);

    // حساب تكلفة الشحن بناءً على المدينة المختارة والمجموع
    const shipping = useMemo(() => {
        if (subtotal > 500) return 0; // شحن مجاني دائماً فوق 500 د.م.
        if (!selectedCity) return null; // إذا لم يتم اختيار مدينة بعد
        return shippingCosts[selectedCity] || shippingCosts.default;
    }, [subtotal, selectedCity]);

    const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
    // حساب الإجمالي فقط إذا تم تحديد تكلفة الشحن
    const total = (shipping !== null) ? subtotal - couponDiscount + shipping : subtotal - couponDiscount;

    const applyCoupon = () => {
        const validCoupons = { 'SAVE10': 10, 'WELCOME20': 20 };
        if (validCoupons[couponCode.toUpperCase()]) {
            setAppliedCoupon({ code: couponCode.toUpperCase(), discount: validCoupons[couponCode.toUpperCase()]});
        } else {
            alert('كود الخصم غير صحيح أو منتهي الصلاحية');
        }
    };

    // تصميم حالة السلة الفارغة
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 py-16 text-center flex flex-col items-center">
                <div className="bg-gray-100 p-8 rounded-full mb-6">
                    <ShoppingCart size={64} className="mx-auto text-gray-400" strokeWidth={1.5} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mt-4">سلة مشترياتك فارغة</h1>
                <p className="text-gray-500 mt-3 max-w-md">
                    يبدو أنك لم تقم بإضافة أي منتجات بعد. تصفح منتجاتنا الرائعة وابدأ رحلة التسوق!
                </p>
                <Link href="/shop" className="mt-8 inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform hover:scale-105 shadow-lg">
                    <ArrowRight size={20} />
                    <span>ابدأ التسوق الآن</span>
                </Link>
            </div>
        );
    }
    
    // التصميم الجديد للسلة الممتلئة
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">سلة المشتريات</h1>
                    <p className="mt-3 text-lg text-gray-500">مراجعة طلبك قبل إتمام عملية الشراء</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* قسم المنتجات */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-2xl border shadow-sm">
                        <div className="flex justify-between items-center pb-4 border-b mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">منتجاتك ({cartItems.length})</h2>
                            <button onClick={clearCart} className="text-sm text-red-500 hover:underline flex items-center gap-1 transition-colors">
                                <Trash2 size={16}/> إفراغ السلة
                            </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4 py-6">
                                    <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg border hover:opacity-80 transition-opacity" />
                                    </Link>
                                    <div className="flex-grow">
                                        <Link href={`/shop/${item.slug}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors text-lg">{item.name}</Link>
                                        
                                        {item.stock <= 0 ? (
                                            <div className="mt-1 flex items-center gap-2 text-red-500 text-sm font-semibold">
                                                <AlertTriangle size={16}/> <span>نفذت الكمية</span>
                                            </div>
                                        ) : item.stock < 5 ? (
                                            <div className="mt-1 text-amber-600 text-sm font-semibold">
                                                باقي {item.stock} قطع فقط!
                                            </div>
                                        ) : null}

                                        <p className="text-gray-500 text-sm mt-1">{formatCurrency(item.price)} للقطعة</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex items-center border rounded-lg bg-gray-50">
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"><Plus size={16}/></button>
                                            <span className="px-4 font-bold text-gray-800 w-12 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-gray-600 hover:bg-gray-200 rounded-l-lg"><Minus size={16}/></button>
                                        </div>
                                        <p className="text-lg font-bold text-blue-700">{formatCurrency(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                         <Link href="/shop" className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline">
                            <ChevronLeft size={20} />
                            <span>متابعة التسوق</span>
                        </Link>
                    </div>

                    {/* قسم ملخص الطلب المحسّن */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl p-6 border shadow-lg sticky top-24">
                            <h3 className="text-2xl font-bold border-b pb-4 mb-4">ملخص الطلب</h3>
                            
                            <div className="mb-6">
                                <label className="font-semibold mb-2 block text-sm text-gray-800 flex items-center gap-2">
                                    <MapPin size={16} className="text-gray-500"/>
                                    قم بتحديد عنوان الشحن
                                </label>
                                <select 
                                    value={selectedCity} 
                                    onChange={e => setSelectedCity(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="" disabled>اختر مدينتك...</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    سيتم حساب تكلفة الشحن بناءً على مدينتك. الشحن مجاني للطلبات فوق {formatCurrency(500)}.
                                </p>
                            </div>

                            <div className="space-y-3 text-gray-700 mb-6">
                                <div className="flex justify-between"><span>المجموع الفرعي</span><span className="font-semibold">{formatCurrency(subtotal)}</span></div>
                                {savings > 0 && <div className="flex justify-between text-green-600"><span>التوفير من العروض</span><span className="font-semibold">-{formatCurrency(savings)}</span></div>}
                                {appliedCoupon && <div className="flex justify-between text-green-600"><span>خصم الكوبون ({appliedCoupon.code})</span><span className="font-semibold">-{formatCurrency(couponDiscount)}</span></div>}
                                
                                <div className="flex justify-between">
                                    <span>الشحن</span>
                                    {shipping === null ? (
                                        <span className="text-sm text-amber-600">اختر مدينة</span>
                                    ) : (
                                        <span className={`font-semibold ${shipping === 0 ? 'text-green-600' : ''}`}>{shipping === 0 ? 'مجاني' : formatCurrency(shipping)}</span>
                                    )}
                                </div>
                            </div>
                            
                            <hr className="my-4 border-dashed"/>
                            
                            <div className="flex justify-between font-bold text-gray-900 text-xl mb-6">
                                <span>الإجمالي</span>
                                <span>{shipping !== null ? formatCurrency(total) : '---'}</span>
                            </div>

                            <Link href="/checkout" 
                                className={`block text-center w-full bg-blue-600 text-white font-bold py-4 rounded-lg transition-all 
                                ${!selectedCity ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 hover:scale-105 shadow-md'}`}
                                onClick={(e) => { if (!selectedCity) e.preventDefault(); }}
                                aria-disabled={!selectedCity}
                            >
                                المتابعة لإتمام الطلب
                            </Link>

                             <div className="mt-6">
                                <label className="font-semibold mb-2 block text-sm">لديك كود خصم؟</label>
                                <div className="flex gap-2">
                                    <input type="text" value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="أدخل الكود هنا" className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500" />
                                    <button onClick={applyCoupon} disabled={!couponCode} className="bg-gray-800 text-white px-4 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" aria-label="تطبيق كود الخصم">
                                        <Tag size={18}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
