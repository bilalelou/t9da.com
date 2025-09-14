'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export const dynamic = 'force-dynamic';


// Define interfaces
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

// Sample data
const sampleCartItems: CartItem[] = [
  {
    id: '1',
    name: 'سماعات بلوتوث لاسلكية عالية الجودة',
    price: 299,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  },
  {
    id: '2',
    name: 'ساعة ذكية رياضية متطورة',
    price: 199,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400'
  }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'credit-card',
    name: 'بطاقة ائتمان',
    description: 'فيزا، ماستركارد، أمريكان إكسبريس',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    description: 'دفع سريع وآمن عبر Apple Pay',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
    )
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    description: 'دفع سريع وآمن عبر Google Pay',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
    )
  },
  {
    id: 'stc-pay',
    name: 'STC Pay',
    description: 'محفظة STC الرقمية',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    )
  },
  {
    id: 'bank-transfer',
    name: 'تحويل بنكي',
    description: 'تحويل مباشر من البنك',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    )
  },
  {
    id: 'cash-on-delivery',
    name: 'دفع عند الاستلام',
    description: 'ادفع نقداً عند وصول الطلب',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

// Shipping regions and pricing
const shippingRegions = {
  'riyadh': { name: 'الرياض', multiplier: 1 },
  'jeddah': { name: 'جدة', multiplier: 1 },
  'dammam': { name: 'الدمام', multiplier: 1 },
  'mecca': { name: 'مكة المكرمة', multiplier: 1.2 },
  'medina': { name: 'المدينة المنورة', multiplier: 1.2 },
  'other': { name: 'مدن أخرى', multiplier: 1.5 }
};

const baseShippingOptions: ShippingOption[] = [
  {
    id: 'standard',
    name: 'شحن عادي',
    description: 'التوصيل خلال 3-5 أيام عمل',
    price: 25,
    estimatedDays: '3-5 أيام'
  },
  {
    id: 'express',
    name: 'شحن سريع',
    description: 'التوصيل خلال 1-2 أيام عمل',
    price: 50,
    estimatedDays: '1-2 أيام'
  },
  {
    id: 'same-day',
    name: 'توصيل نفس اليوم',
    description: 'التوصيل خلال 4-6 ساعات (المدن الرئيسية فقط)',
    price: 75,
    estimatedDays: '4-6 ساعات'
  },
  {
    id: 'free',
    name: 'شحن مجاني',
    description: 'التوصيل خلال 5-7 أيام عمل (للطلبات أكثر من 500 ر.س)',
    price: 0,
    estimatedDays: '5-7 أيام'
  }
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'السعودية'
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('credit-card');
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const [selectedRegion, setSelectedRegion] = useState('riyadh');
  const [errors, setErrors] = useState<Partial<ShippingInfo>>({});

  // Calculate totals
  const subtotal = sampleCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const selectedShippingOption = shippingOptions.find(option => option.id === selectedShipping);
  const shippingCost = selectedShippingOption?.price || 0;
  const tax = Math.round(subtotal * 0.15); // 15% VAT
  const total = subtotal + shippingCost + tax;

  // Calculate shipping options based on region and order total
  const getShippingOptions = () => {
    const region = shippingRegions[selectedRegion as keyof typeof shippingRegions];
    const isFreeShippingEligible = subtotal >= 500;

    return baseShippingOptions.map(option => ({
      ...option,
      price: option.id === 'free'
        ? (isFreeShippingEligible ? 0 : Math.round(option.price * region.multiplier))
        : Math.round(option.price * region.multiplier)
    })).filter(option => {
      // Hide same-day delivery for non-major cities
      if (option.id === 'same-day' && !['riyadh', 'jeddah', 'dammam'].includes(selectedRegion)) {
        return false;
      }
      // Hide free shipping if not eligible
      if (option.id === 'free' && !isFreeShippingEligible) {
        return false;
      }
      return true;
    });
  };

  const shippingOptions = getShippingOptions();

  // Validation
  const validateShippingInfo = () => {
    const newErrors: Partial<ShippingInfo> = {};
    
    if (!shippingInfo.firstName.trim()) newErrors.firstName = 'الاسم الأول مطلوب';
    if (!shippingInfo.lastName.trim()) newErrors.lastName = 'اسم العائلة مطلوب';
    if (!shippingInfo.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!shippingInfo.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!shippingInfo.address.trim()) newErrors.address = 'العنوان مطلوب';
    if (!shippingInfo.city.trim()) newErrors.city = 'المدينة مطلوبة';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateShippingInfo()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePlaceOrder = () => {
    // Here you would typically send the order to your backend
    alert('تم إرسال طلبك بنجاح! سيتم التواصل معك قريباً.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
          <span className="text-gray-400">›</span>
          <Link href="/cart" className="hover:text-blue-600 transition-colors">السلة</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900">إتمام الطلب</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إتمام الطلب</h1>
          <p className="text-gray-600">أكمل معلوماتك لإتمام عملية الشراء</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8 space-x-reverse">
            {[
              { step: 1, title: 'معلومات الشحن', icon: '📋' },
              { step: 2, title: 'الدفع والشحن', icon: '💳' },
              { step: 3, title: 'مراجعة الطلب', icon: '✅' }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep >= item.step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > item.step ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-semibold">{item.step}</span>
                  )}
                </div>
                <span className={`mr-3 text-sm font-medium ${
                  currentStep >= item.step ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Step 1: Shipping Information */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    معلومات الشحن والفوترة
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الأول *</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="أدخل الاسم الأول"
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم العائلة *</label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="أدخل اسم العائلة"
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="example@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+966 50 123 4567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">العنوان *</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="أدخل العنوان الكامل"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">المدينة *</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="أدخل المدينة"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">الرمز البريدي</label>
                      <input
                        type="text"
                        value={shippingInfo.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="12345"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Payment and Shipping */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    طريقة الدفع والشحن
                  </h2>

                  {/* Payment Methods */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">طريقة الدفع</h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="ml-3 text-blue-600 focus:ring-blue-500"
                          />
                          <div className="flex items-center space-x-3 space-x-reverse">
                            <div className="text-blue-600">{method.icon}</div>
                            <div>
                              <div className="font-medium text-gray-900">{method.name}</div>
                              <div className="text-sm text-gray-500">{method.description}</div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Digital Payment Options */}
                  {(selectedPaymentMethod === 'apple-pay' || selectedPaymentMethod === 'google-pay' || selectedPaymentMethod === 'stc-pay') && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        {selectedPaymentMethod === 'apple-pay' && 'Apple Pay'}
                        {selectedPaymentMethod === 'google-pay' && 'Google Pay'}
                        {selectedPaymentMethod === 'stc-pay' && 'STC Pay'}
                      </h4>
                      <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                          {paymentMethods.find(method => method.id === selectedPaymentMethod)?.icon}
                        </div>
                        <p className="text-gray-600 mb-4">
                          سيتم توجيهك لإتمام الدفع عبر {paymentMethods.find(method => method.id === selectedPaymentMethod)?.name}
                        </p>
                        <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          <span>دفع آمن ومشفر</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Transfer Info */}
                  {selectedPaymentMethod === 'bank-transfer' && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">معلومات التحويل البنكي</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">اسم البنك:</span>
                          <span className="font-medium">البنك الأهلي السعودي</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">رقم الحساب:</span>
                          <span className="font-medium">123456789012</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">اسم المستفيد:</span>
                          <span className="font-medium">شركة متجري للتجارة الإلكترونية</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">IBAN:</span>
                          <span className="font-medium">SA1234567890123456789012</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <strong>ملاحظة:</strong> يرجى إرسال إيصال التحويل عبر الواتساب على رقم: 966501234567
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Info */}
                  {selectedPaymentMethod === 'cash-on-delivery' && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">الدفع عند الاستلام</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>ادفع نقداً عند وصول الطلب</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>فحص المنتج قبل الدفع</span>
                        </div>
                        <div className="flex items-center space-x-2 space-x-reverse text-sm text-green-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>لا توجد رسوم إضافية</span>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          يرجى تحضير المبلغ الصحيح. المبلغ المطلوب: <strong>{total.toLocaleString()} ر.س</strong>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Credit Card Form */}
                  {selectedPaymentMethod === 'credit-card' && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">معلومات البطاقة الائتمانية</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">رقم البطاقة</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">تاريخ الانتهاء</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">رمز الأمان (CVV)</label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">اسم حامل البطاقة</label>
                          <input
                            type="text"
                            placeholder="الاسم كما هو مكتوب على البطاقة"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Shipping Region */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">منطقة التوصيل</h3>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.entries(shippingRegions).map(([key, region]) => (
                        <option key={key} value={key}>{region.name}</option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      اختر منطقتك لحساب تكلفة الشحن بدقة
                    </p>
                  </div>

                  {/* Free Shipping Banner */}
                  {subtotal < 500 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-blue-800">
                          أضف {(500 - subtotal).toLocaleString()} ر.س أخرى للحصول على شحن مجاني!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Shipping Options */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">خيارات الشحن</h3>
                    <div className="space-y-3">
                      {shippingOptions.map((option) => (
                        <label key={option.id} className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) => setSelectedShipping(e.target.value)}
                              className="ml-3 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="font-medium text-gray-900">{option.name}</div>
                              <div className="text-sm text-gray-500">{option.description}</div>
                            </div>
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-gray-900">{option.price} ر.س</div>
                            <div className="text-sm text-gray-500">{option.estimatedDays}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    مراجعة الطلب
                  </h2>

                  {/* Shipping Information Review */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">معلومات الشحن</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>الاسم:</strong> {shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p><strong>البريد الإلكتروني:</strong> {shippingInfo.email}</p>
                      <p><strong>الهاتف:</strong> {shippingInfo.phone}</p>
                      <p><strong>العنوان:</strong> {shippingInfo.address}, {shippingInfo.city}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">طريقة الدفع</h3>
                    <div className="text-sm text-gray-600">
                      {paymentMethods.find(method => method.id === selectedPaymentMethod)?.name}
                    </div>
                  </div>

                  {/* Shipping Method Review */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">طريقة الشحن</h3>
                    <div className="text-sm text-gray-600">
                      {selectedShippingOption?.name} - {selectedShippingOption?.price} ر.س
                      <br />
                      <span className="text-gray-500">{selectedShippingOption?.description}</span>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mb-6">
                    <label className="flex items-start space-x-3 space-x-reverse">
                      <input
                        type="checkbox"
                        className="mt-1 text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-600">
                        أوافق على <Link href="/terms" className="text-blue-600 hover:underline">الشروط والأحكام</Link> و
                        <Link href="/privacy" className="text-blue-600 hover:underline"> سياسة الخصوصية</Link>
                      </span>
                    </label>
                  </div>

                  {/* Order Confirmation */}
                  <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-3 space-x-reverse mb-3">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-semibold text-blue-900">تأكيد الطلب</h3>
                    </div>
                    <p className="text-sm text-blue-800">
                      بالنقر على "تأكيد الطلب" أدناه، ستتم معالجة طلبك وإرسال تأكيد عبر البريد الإلكتروني.
                      سيتم التواصل معك خلال 24 ساعة لتأكيد التفاصيل.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Link
                  href="/cart"
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  العودة للسلة
                </Link>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    التالي
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    تأكيد الطلب
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">ملخص الطلب</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {sampleCartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 space-x-reverse">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(item.price * item.quantity).toLocaleString()} ر.س
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{subtotal.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الشحن</span>
                  <span className="font-medium">{shippingCost.toLocaleString()} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium">{tax.toLocaleString()} ر.س</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-blue-600">{total.toLocaleString()} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-green-800 font-medium">معاملة آمنة ومشفرة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
