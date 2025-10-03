'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/contexts/Providers';
import { useRouter } from 'next/navigation';
import { 
    ShoppingCart, Trash2, Minus, Plus, Tag, AlertTriangle, ArrowRight, 
    ChevronLeft, MapPin, Gift, Heart, ShoppingBag,
    X, CheckCircle, Package
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// مكون Modal للتأكيد
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );
};

// دالة مساعدة لتنسيق العملة
const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-MA', { 
        style: 'currency', 
        currency: 'MAD',
        minimumFractionDigits: 2
    }).format(price);
};

// بيانات المدن وتكاليف الشحن
const shippingData: Record<string, { cost: number; region: string }> = {
    'الدار البيضاء': { cost: 30, region: 'الدار البيضاء-سطات' },
    'الرباط': { cost: 35, region: 'الرباط-سلا-القنيطرة' },
    'سلا': { cost: 35, region: 'الرباط-سلا-القنيطرة' },
    'مراكش': { cost: 45, region: 'مراكش-آسفي' },
    'فاس': { cost: 40, region: 'فاس-مكناس' },
    'مكناس': { cost: 40, region: 'فاس-مكناس' },
    'طنجة': { cost: 50, region: 'طنجة-تطوان-الحسيمة' },
    'أغادير': { cost: 55, region: 'سوس-ماسة' },
    'وجدة': { cost: 60, region: 'الشرق' },
    'القنيطرة': { cost: 38, region: 'الرباط-سلا-القنيطرة' },
    'تطوان': { cost: 52, region: 'طنجة-تطوان-الحسيمة' },
    'آسفي': { cost: 48, region: 'مراكش-آسفي' },
    'أخرى': { cost: 65, region: 'مناطق أخرى' }
};

const cities = Object.keys(shippingData);

// كوبونات الخصم المتاحة
const availableCoupons: Record<string, { 
    discount: number; 
    minAmount: number; 
    type: string; 
    description: string 
}> = {
    'FREESHIP': { discount: 30, minAmount: 0, type: 'shipping', description: 'شحن مجاني' },
    'VIP15': { discount: 15, minAmount: 500, type: 'percentage', description: 'خصم 15% للعملاء المميزين' }
};

export default function CartPage() {
    const { cartItems, clearCart, updateQuantity, removeFromCart, resetCart, subtotal, savings } = useCart();
    const router = useRouter();
    
    const [selectedCity, setSelectedCity] = useState<string>('');
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState<{
        code: string, 
        discount: number, 
        type: string,
        description: string
    } | null>(null);
    const [showCouponSuggestions, setShowCouponSuggestions] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
        show: boolean;
    }>({ message: '', type: 'success', show: false });
    const [freeShippingThreshold, setFreeShippingThreshold] = useState(500);

    // دالة عرض الإشعارات
    const showNotification = (message: string, type: 'success' | 'error' = 'error') => {
        setNotification({ message, type, show: true });
        setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
        }, 3000);
    };

    // جلب قيمة الشحن المجاني وحفظ المدينة
    useEffect(() => {
        const savedCity = localStorage.getItem('selectedCity');
        if (savedCity && cities.includes(savedCity)) {
            setSelectedCity(savedCity);
        }
        
        // جلب قيمة الشحن المجاني
        const fetchFreeShippingThreshold = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/settings`);
                const result = await response.json();
                
                if (result.success) {
                    const threshold = result.data?.find(s => s.key === 'shipping.free_shipping_threshold');
                    if (threshold) {
                        console.log('✅ تم جلب قيمة الشحن المجاني:', threshold.value);
                        setFreeShippingThreshold(Number(threshold.value));
                    } else {
                        console.log('❌ لم يتم العثور على قيمة الشحن المجاني');
                    }
                } else {
                    console.log('❌ فشل في جلب الإعدادات:', result);
                }
            } catch (error) {
                console.error('خطأ في جلب قيمة الشحن المجاني:', error);
            }
        };
        
        fetchFreeShippingThreshold();
    }, []);

    useEffect(() => {
        if (selectedCity) {
            localStorage.setItem('selectedCity', selectedCity);
        }
    }, [selectedCity]);

    // حساب تكلفة الشحن
    const shippingCost = useMemo(() => {
        if (subtotal >= freeShippingThreshold) return 0; // شحن مجاني
        if (!selectedCity || selectedCity === '') return null;
        return shippingData[selectedCity]?.cost || 50;
    }, [subtotal, selectedCity, freeShippingThreshold]);

    // حساب خصم الكوبون
    const couponDiscount = useMemo(() => {
        if (!appliedCoupon) return 0;
        
        const coupon = availableCoupons[appliedCoupon.code];
        if (!coupon || subtotal < coupon.minAmount) return 0;

        if (coupon.type === 'percentage') {
            return (subtotal * coupon.discount) / 100;
        } else if (coupon.type === 'fixed') {
            return coupon.discount;
        } else if (coupon.type === 'shipping' && shippingCost) {
            return Math.min(coupon.discount, shippingCost);
        }
        return 0;
    }, [appliedCoupon, subtotal, shippingCost]);

    // حساب المجموع النهائي
    const finalShippingCost = appliedCoupon?.type === 'shipping' 
        ? Math.max(0, (shippingCost || 0) - couponDiscount)
        : (shippingCost || 0);
    
    const total = subtotal - (appliedCoupon?.type !== 'shipping' ? couponDiscount : 0) + finalShippingCost;

    // تطبيق كوبون الخصم
    const applyCoupon = () => {
        const code = couponCode.toUpperCase().trim();
        const coupon = availableCoupons[code];
        
        if (!coupon) {
            showNotification('كود الخصم غير صحيح');
            return;
        }
        
        if (subtotal < coupon.minAmount) {
            showNotification(`الحد الأدنى للطلب لاستخدام هذا الكوبون هو ${formatCurrency(coupon.minAmount)}`);
            return;
        }
        
        setAppliedCoupon({
            code,
            discount: coupon.discount,
            type: coupon.type,
            description: coupon.description
        });
        setCouponCode('');
        setShowCouponSuggestions(false);
        showNotification('تم تطبيق كود الخصم بنجاح!', 'success');
    };

    // إزالة الكوبون
    const removeCoupon = () => {
        setAppliedCoupon(null);
    };

    // الانتقال لصفحة الدفع
    const handleCheckout = () => {
        if (!selectedCity) {
            // عرض رسالة بدلاً من alert
            return;
        }
        
        setIsProcessing(true);
        
        // حفظ بيانات الطلب في localStorage
        const orderData = {
            items: cartItems,
            city: selectedCity,
            shippingCost: finalShippingCost,
            coupon: appliedCoupon,
            subtotal,
            total,
            timestamp: Date.now()
        };
        
        localStorage.setItem('orderData', JSON.stringify(orderData));
        
        setTimeout(() => {
            router.push('/checkout');
        }, 1000);
    };

    // عرض الكوبونات المقترحة
    const suggestedCoupons = Object.entries(availableCoupons)
        .filter(([code, coupon]) => subtotal >= coupon.minAmount && (!appliedCoupon || appliedCoupon.code !== code))
        .slice(0, 3);

    // تصميم حالة السلة الفارغة المحسن
    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-md mx-auto">
                        <div className="bg-white p-12 rounded-3xl shadow-lg">
                            <div className="bg-gray-100 p-8 rounded-full mb-6 inline-block">
                                <ShoppingBag size={80} className="text-gray-400" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">سلة المشتريات فارغة</h1>
                            <p className="text-gray-500 mb-8 leading-relaxed">
                                يبدو أنك لم تقم بإضافة أي منتجات بعد.<br />
                                تصفح منتجاتنا الرائعة وابدأ رحلة التسوق!
                            </p>
                            <Link 
                                href="/shop" 
                                className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                <ShoppingBag size={20} />
                                <span>ابدأ التسوق الآن</span>
                                <ArrowRight size={20} />
                            </Link>
                        </div>
                        
                        {/* اقتراحات سريعة */}
                        <div className="mt-8 grid grid-cols-3 gap-4">
                            <Link href="/shop?category=electronics" className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                <Package className="mx-auto mb-2 text-blue-600" size={24} />
                                <p className="text-sm font-medium text-gray-700">إلكترونيات</p>
                            </Link>
                            <Link href="/shop?category=fashion" className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                <Heart className="mx-auto mb-2 text-pink-600" size={24} />
                                <p className="text-sm font-medium text-gray-700">أزياء</p>
                            </Link>
                            <Link href="/shop?category=home" className="p-4 bg-white rounded-xl shadow hover:shadow-md transition-shadow">
                                <Gift className="mx-auto mb-2 text-green-600" size={24} />
                                <p className="text-sm font-medium text-gray-700">منزل</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // التصميم الرئيسي للسلة الممتلئة
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">سلة المشتريات</h1>
                    <p className="text-gray-600">مراجعة طلبك قبل إتمام عملية الشراء</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* قسم المنتجات */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg">
                            <div className="flex justify-between items-center pb-4 border-b mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                    <ShoppingCart size={24} />
                                    منتجاتك ({cartItems.length})
                                </h2>
                                <button 
                                    onClick={() => setShowClearConfirm(true)} 
                                    className="text-red-500 hover:text-red-700 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
                                >
                                    <Trash2 size={16} />
                                    إفراغ السلة
                                </button>
                                
                                {/* زر إعادة تعيين للطوارئ - يظهر فقط في بيئة التطوير */}
                                {process.env.NODE_ENV === 'development' && (
                                    <button 
                                        onClick={() => setShowResetConfirm(true)}
                                        className="text-yellow-600 hover:text-yellow-800 flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-yellow-50 transition-all text-sm"
                                        title="إعادة تعيين السلة (للمطورين)"
                                    >
                                        🔧 Reset
                                    </button>
                                )}
                            </div>

                            <div className="space-y-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                                        <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
                                            <Image 
                                                src={item.thumbnail || '/images/placeholder-product.svg'} 
                                                alt={item.name} 
                                                width={96}
                                                height={96}
                                                className="w-24 h-24 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                                                placeholder="blur"
                                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                                priority={false}
                                                unoptimized={process.env.NODE_ENV === 'development'}
                                            />
                                        </Link>
                                        
                                        <div className="flex-grow min-w-0">
                                            <Link 
                                                href={`/shop/${item.slug}`} 
                                                className="font-semibold text-lg text-gray-800 hover:text-blue-600 transition-colors block truncate"
                                            >
                                                {item.name}
                                            </Link>
                                            
                                            {/* حالة المخزون */}
                                            {item.stock <= 0 ? (
                                                <div className="mt-2 flex items-center gap-2 text-red-500 text-sm font-semibold">
                                                    <AlertTriangle size={16} />
                                                    <span>نفذت الكمية</span>
                                                </div>
                                            ) : item.stock < 5 ? (
                                                <div className="mt-2 text-amber-600 text-sm font-semibold">
                                                    ⚠️ باقي {item.stock} قطع فقط!
                                                </div>
                                            ) : (
                                                <div className="mt-2 text-green-600 text-sm">
                                                    ✅ متوفر في المخزون
                                                </div>
                                            )}
                                            
                                            {/* مؤشر الشحن المجاني */}
                                            {item.has_free_shipping && (
                                                <div className="mt-2 flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                                        <path d="M3 4a1 1 0 00-1 1v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.5h1.5a2.5 2.5 0 005 0V8a1 1 0 00-1-1h-4.5z"/>
                                                    </svg>
                                                    شحن مجاني لهذا المنتج
                                                </div>
                                            )}

                                            <p className="text-gray-500 text-sm mt-1">
                                                {formatCurrency(item.price)} للقطعة
                                                {item.originalPrice && item.originalPrice > item.price && (
                                                    <span className="ml-2 line-through text-red-400">
                                                        {formatCurrency(item.originalPrice)}
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        {/* التحكم في الكمية */}
                                        <div className="flex flex-col items-end gap-3">
                                            <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50 overflow-hidden">
                                                <button 
                                                    onClick={() => {
                                                        const currentQuantity = parseInt(String(item.quantity), 10);
                                                        if (!isNaN(currentQuantity) && currentQuantity > 0) {
                                                            updateQuantity(item.id, currentQuantity - 1);
                                                        }
                                                    }} 
                                                    className="px-3 py-2 text-gray-600 hover:bg-gray-200 transition-colors"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-4 py-2 font-bold text-gray-800 min-w-[3rem] text-center border-x border-gray-300">
                                                    {item.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => {
                                                        const currentQuantity = parseInt(String(item.quantity), 10);
                                                        if (!isNaN(currentQuantity) && currentQuantity > 0) {
                                                            updateQuantity(item.id, currentQuantity + 1);
                                                        }
                                                    }} 
                                                    disabled={item.quantity >= item.stock}
                                                    className="px-3 py-2 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-all"
                                                title="حذف المنتج"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            
                                            <p className="text-lg font-bold text-blue-700">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link 
                                href="/shop" 
                                className="mt-6 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                            >
                                <ChevronLeft size={20} />
                                <span>متابعة التسوق</span>
                            </Link>
                        </div>
                    </div>

                    {/* قسم ملخص الطلب */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-6">
                            <h3 className="text-2xl font-bold border-b pb-4 mb-6 text-gray-800">
                                ملخص الطلب
                            </h3>
                            
                            {/* اختيار المدينة */}
                            <div className="mb-6">
                                <label className="font-semibold mb-3 text-sm text-gray-800 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-500" />
                                    اختر مدينة الشحن
                                </label>
                                <select 
                                    value={selectedCity} 
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                                >
                                    <option value="" disabled>اختر مدينتك...</option>
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-2">
                                    🚚 شحن مجاني للطلبات أكثر من {formatCurrency(freeShippingThreshold)}
                                </p>
                            </div>

                            {/* تفاصيل الأسعار */}
                            <div className="space-y-3 text-gray-700 mb-6">
                                <div className="flex justify-between">
                                    <span>المجموع الفرعي</span>
                                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                                </div>
                                
                                {savings > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>💰 التوفير</span>
                                        <span className="font-semibold">-{formatCurrency(savings)}</span>
                                    </div>
                                )}
                                
                                {appliedCoupon && (
                                    <div className="flex justify-between items-center text-green-600 bg-green-50 p-2 rounded-lg">
                                        <span className="flex items-center gap-1">
                                            <Tag size={16} />
                                            خصم ({appliedCoupon.code})
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">
                                                -{formatCurrency(appliedCoupon.type === 'shipping' ? 0 : couponDiscount)}
                                            </span>
                                            <button
                                                onClick={removeCoupon}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="إلغاء الكوبون"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex justify-between">
                                    <span>الشحن</span>
                                    {shippingCost === null ? (
                                        <span className="text-amber-600 text-sm">اختر مدينة</span>
                                    ) : (
                                        <span className={`font-semibold ${finalShippingCost === 0 ? 'text-green-600' : ''}`}>
                                            {finalShippingCost === 0 ? '🆓 مجاني' : formatCurrency(finalShippingCost)}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <hr className="my-4 border-dashed" />
                            
                            <div className="flex justify-between font-bold text-gray-900 text-xl mb-6">
                                <span>الإجمالي</span>
                                <span className="text-blue-600">
                                    {shippingCost !== null ? formatCurrency(total) : '---'}
                                </span>
                            </div>

                            {/* زر الدفع */}
                            <button
                                onClick={handleCheckout}
                                disabled={!selectedCity || isProcessing}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                                    selectedCity && !isProcessing
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg hover:shadow-xl'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                                {isProcessing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                                        جارِ التحضير...
                                    </span>
                                ) : (
                                    'المتابعة للدفع'
                                )}
                            </button>

                            {!selectedCity && (
                                <p className="text-center text-red-500 text-sm mt-2">
                                    يرجى اختيار المدينة أولاً
                                </p>
                            )}

                            {/* كوبون الخصم */}
                            <div className="mt-6">
                                <label className="font-semibold mb-3 block text-sm">
                                    🎟️ لديك كود خصم؟
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={couponCode} 
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        onFocus={() => setShowCouponSuggestions(true)}
                                        placeholder="أدخل الكود هنا" 
                                        className="flex-1 border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500 p-3"
                                    />
                                    <button 
                                        onClick={applyCoupon} 
                                        disabled={!couponCode.trim()}
                                        className="bg-gray-800 text-white px-4 rounded-lg font-semibold hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        تطبيق
                                    </button>
                                </div>
                                
                                {/* اقتراحات الكوبونات */}
                                {showCouponSuggestions && suggestedCoupons.length > 0 && (
                                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                        <p className="text-sm font-medium text-blue-800 mb-2">كوبونات متاحة:</p>
                                        <div className="space-y-1">
                                            {suggestedCoupons.map(([code, coupon]) => (
                                                <button
                                                    key={code}
                                                    onClick={() => setCouponCode(code)}
                                                    className="block w-full text-left text-xs text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100"
                                                >
                                                    <span className="font-mono bg-blue-100 px-1 rounded">{code}</span> - {coupon.description}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ميزات إضافية */}
                            <div className="mt-6 grid grid-cols-1 gap-2 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={14} className="text-green-500" />
                                    <span>دفع آمن ومضمون</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Package size={14} className="text-blue-500" />
                                    <span>شحن سريع خلال 2-3 أيام</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Heart size={14} className="text-red-500" />
                                    <span>ضمان الجودة 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal تأكيد إفراغ السلة */}
            <ConfirmModal
                isOpen={showClearConfirm}
                onClose={() => setShowClearConfirm(false)}
                onConfirm={() => {
                    clearCart();
                    setShowClearConfirm(false);
                }}
                title="إفراغ السلة"
                message="هل أنت متأكد من رغبتك في إفراغ السلة؟ سيتم حذف جميع المنتجات."
            />

            {/* Modal تأكيد إعادة تعيين السلة */}
            <ConfirmModal
                isOpen={showResetConfirm}
                onClose={() => setShowResetConfirm(false)}
                onConfirm={() => {
                    resetCart();
                    setShowResetConfirm(false);
                }}
                title="إعادة تعيين السلة"
                message="هل تريد إعادة تعيين السلة نهائياً؟ (للمطورين فقط)"
            />

            {/* Toast Notification */}
            {notification.show && (
                <div className={`fixed bottom-6 right-6 p-4 rounded-lg shadow-lg z-50 ${
                    notification.type === 'success' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                }`}>
                    <div className="flex items-center gap-2">
                        {notification.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertTriangle size={20} />
                        )}
                        <span>{notification.message}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
