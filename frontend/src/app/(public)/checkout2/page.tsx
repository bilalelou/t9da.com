'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/contexts/Providers';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
    ShoppingCart, 
    MapPin, 
    Phone, 
    Mail, 
    User, 
    CreditCard, 
    Truck, 
    Shield, 
    ArrowLeft, 
    Check,
    AlertTriangle,
    Plus,
    Minus
} from 'lucide-react';
import Link from 'next/link';

// تنسيق العملة
const formatCurrency = (price) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);

// بيانات المدن وتكاليف الشحن
const shippingCosts = {
    'الدار البيضاء': 30,
    'الرباط': 35,
    'مراكش': 45,
    'أكادير': 50,
    'طنجة': 40,
    'فاس': 40,
    'مكناس': 40,
    'وجدة': 55,
    'default': 40,
};

const cities = Object.keys(shippingCosts).filter(c => c !== 'default');

const paymentMethods = [
    {
        id: 'cod',
        name: 'الدفع عند الاستلام',
        description: 'ادفع عند استلام الطلب',
        icon: <Truck className="w-5 h-5" />
    },
    {
        id: 'card',
        name: 'بطاقة ائتمانية',
        description: 'Visa, Mastercard',
        icon: <CreditCard className="w-5 h-5" />
    }
];

export default function CheckoutPage() {
    const { cartItems, clearCart, updateQuantity, subtotal } = useCart();
    const router = useRouter();

    // Simple toast function
    const showToast = (message, type) => {
        if (type === 'success') {
            alert(`✅ ${message}`);
        } else {
            alert(`❌ ${message}`);
        }
    };

    // حالات الصفحة
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // بيانات الشحن
    const [shippingAddress, setShippingAddress] = useState({
        fullName: '',
        phone: '',
        email: '',
        city: '',
        address: '',
        postalCode: '',
        notes: ''
    });

    // طريقة الدفع
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');

    // كود الخصم
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // التحقق من وجود منتجات في السلة
    useEffect(() => {
        if (cartItems.length === 0) {
            router.push('/cart');
        }
    }, [cartItems, router]);

    // حساب التكاليف
    const shipping = useMemo(() => {
        if (subtotal > 500) return 0; // شحن مجاني فوق 500 درهم
        if (!shippingAddress.city) return null;
        return shippingCosts[shippingAddress.city] || shippingCosts.default;
    }, [subtotal, shippingAddress.city]);

    const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
    const total = shipping !== null ? subtotal - couponDiscount + shipping : subtotal - couponDiscount;

    // التحقق من صحة البيانات
    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!shippingAddress.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
            if (!shippingAddress.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
            if (!shippingAddress.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
            if (!shippingAddress.city) newErrors.city = 'المدينة مطلوبة';
            if (!shippingAddress.address.trim()) newErrors.address = 'العنوان مطلوب';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // تطبيق كود الخصم
    const applyCoupon = () => {
        const validCoupons = { 'SAVE10': 10, 'WELCOME20': 20, 'FIRST30': 30 };
        const upperCoupon = couponCode.toUpperCase();
        
        if (validCoupons[upperCoupon]) {
            setAppliedCoupon({ code: upperCoupon, discount: validCoupons[upperCoupon] });
            showToast(`تم تطبيق كود الخصم ${upperCoupon} بنجاح!`, 'success');
        } else {
            showToast('كود الخصم غير صحيح أو منتهي الصلاحية', 'error');
        }
    };

    // إزالة كود الخصم
    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode('');
        showToast('تم إزالة كود الخصم', 'success');
    };

    // الانتقال للخطوة التالية
    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    // إتمام الطلب
    const completeOrder = async () => {
        if (!validateStep(1)) return;
        
        setIsLoading(true);
        try {
            // محاكاة API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // مسح السلة وإعادة التوجيه
            clearCart();
            showToast('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.', 'success');
            router.push('/cart');
        } catch {
            showToast('حدث خطأ في إرسال الطلب، يرجى المحاولة مرة أخرى', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // إذا كانت السلة فارغة
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
                <div className="text-center">
                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">السلة فارغة</h3>
                    <p className="mt-1 text-sm text-gray-500">أضف منتجات إلى السلة أولاً</p>
                    <div className="mt-6">
                        <Link href="/products" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                            تصفح المنتجات
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/cart" className="flex items-center text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-5 h-5 ml-2" />
                                العودة للسلة
                            </Link>
                        </div>
                        <h1 className="text-xl font-semibold text-gray-900">إتمام الطلب</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center space-x-4 space-x-reverse">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                    currentStep >= step 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-500'
                                }`}>
                                    {currentStep > step ? <Check className="w-4 h-4" /> : step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-16 h-1 mx-2 ${
                                        currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                                    }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {currentStep === 1 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">معلومات الشحن</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الاسم الكامل *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={shippingAddress.fullName}
                                                onChange={(e) => setShippingAddress({...shippingAddress, fullName: e.target.value})}
                                                className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="أدخل اسمك الكامل"
                                            />
                                        </div>
                                        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            رقم الهاتف *
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={shippingAddress.phone}
                                                onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                                                className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.phone ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="0612345678"
                                            />
                                        </div>
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            البريد الإلكتروني *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <input
                                                type="email"
                                                value={shippingAddress.email}
                                                onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                                                className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                placeholder="example@email.com"
                                            />
                                        </div>
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            المدينة *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                                            <select
                                                value={shippingAddress.city}
                                                onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                                                className={`w-full pr-10 pl-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                    errors.city ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            >
                                                <option value="">اختر المدينة</option>
                                                {cities.map(city => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            العنوان التفصيلي *
                                        </label>
                                        <textarea
                                            value={shippingAddress.address}
                                            onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                                            rows={3}
                                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            placeholder="الحي، الشارع، رقم المنزل..."
                                        />
                                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الرمز البريدي (اختياري)
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.postalCode}
                                            onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="12345"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            ملاحظات إضافية (اختياري)
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingAddress.notes}
                                            onChange={(e) => setShippingAddress({...shippingAddress, notes: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="معلومات إضافية للتوصيل..."
                                        />
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={nextStep}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        المتابعة لطريقة الدفع
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 2 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">طريقة الدفع</h2>
                                
                                <div className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div
                                            key={method.id}
                                            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                                selectedPaymentMethod === method.id
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            onClick={() => setSelectedPaymentMethod(method.id)}
                                        >
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    checked={selectedPaymentMethod === method.id}
                                                    onChange={() => setSelectedPaymentMethod(method.id)}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="mr-3 flex items-center">
                                                    {method.icon}
                                                    <div className="mr-2">
                                                        <div className="text-sm font-medium text-gray-900">{method.name}</div>
                                                        <div className="text-sm text-gray-500">{method.description}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {selectedPaymentMethod === 'cod' && (
                                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex">
                                            <AlertTriangle className="h-5 w-5 text-yellow-400" />
                                            <div className="mr-3">
                                                <h3 className="text-sm font-medium text-yellow-800">الدفع عند الاستلام</h3>
                                                <p className="mt-1 text-sm text-yellow-700">
                                                    ستدفع قيمة الطلب نقداً عند استلامه من المندوب. تأكد من توفر المبلغ المطلوب.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={() => setCurrentStep(1)}
                                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        العودة
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        مراجعة الطلب
                                    </button>
                                </div>
                            </div>
                        )}
                        
                        {currentStep === 3 && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-6">مراجعة الطلب</h2>
                                
                                {/* معلومات الشحن */}
                                <div className="mb-6 pb-6 border-b border-gray-200">
                                    <h3 className="text-md font-medium text-gray-900 mb-3">عنوان الشحن</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="font-medium">{shippingAddress.fullName}</p>
                                        <p className="text-sm text-gray-600">{shippingAddress.phone}</p>
                                        <p className="text-sm text-gray-600">{shippingAddress.email}</p>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {shippingAddress.address}, {shippingAddress.city}
                                            {shippingAddress.postalCode && `, ${shippingAddress.postalCode}`}
                                        </p>
                                        {shippingAddress.notes && (
                                            <p className="text-sm text-gray-600 mt-1">ملاحظات: {shippingAddress.notes}</p>
                                        )}
                                    </div>
                                </div>

                                {/* طريقة الدفع */}
                                <div className="mb-6">
                                    <h3 className="text-md font-medium text-gray-900 mb-3">طريقة الدفع</h3>
                                    <div className="bg-gray-50 rounded-lg p-4 flex items-center">
                                        {paymentMethods.find(p => p.id === selectedPaymentMethod)?.icon}
                                        <div className="mr-2">
                                            <p className="font-medium">{paymentMethods.find(p => p.id === selectedPaymentMethod)?.name}</p>
                                            <p className="text-sm text-gray-600">{paymentMethods.find(p => p.id === selectedPaymentMethod)?.description}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <button
                                        onClick={() => setCurrentStep(2)}
                                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        العودة
                                    </button>
                                    <button
                                        onClick={completeOrder}
                                        disabled={isLoading}
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                                                جاري إرسال الطلب...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-4 h-4 ml-2" />
                                                تأكيد الطلب
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">ملخص الطلب</h3>
                            
                            {/* المنتجات */}
                            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-3 space-x-reverse">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                                            <p className="text-sm text-gray-500">{formatCurrency(item.price)}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 space-x-reverse">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Minus className="w-3 h-3" />
                                            </button>
                                            <span className="w-8 text-center text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* كود الخصم */}
                            <div className="mb-4 pb-4 border-b border-gray-200">
                                {!appliedCoupon ? (
                                    <div className="flex space-x-2 space-x-reverse">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="كود الخصم"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                        />
                                        <button
                                            onClick={applyCoupon}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                                        >
                                            تطبيق
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-center">
                                            <Check className="w-4 h-4 text-green-600 ml-2" />
                                            <span className="text-sm font-medium text-green-800">{appliedCoupon.code}</span>
                                            <span className="text-sm text-green-600 mr-2">({appliedCoupon.discount}% خصم)</span>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-green-600 hover:text-green-800 text-sm"
                                        >
                                            إزالة
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* التكاليف */}
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>المجموع الفرعي</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>الخصم</span>
                                        <span>-{formatCurrency(couponDiscount)}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between">
                                    <span>الشحن</span>
                                    <span>
                                        {shipping === null ? 'يحسب لاحقاً' : shipping === 0 ? 'مجاني' : formatCurrency(shipping)}
                                    </span>
                                </div>
                                
                                {subtotal > 500 && shipping === 0 && (
                                    <p className="text-xs text-green-600">🎉 تهانينا! حصلت على شحن مجاني</p>
                                )}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-between font-medium text-lg">
                                    <span>الإجمالي</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}