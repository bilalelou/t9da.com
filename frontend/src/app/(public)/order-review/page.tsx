'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define interfaces
interface OrderItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  category: string;
  brand: string;
}

interface OrderSummary {
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    region: string;
  };
  paymentMethod: string;
  shippingMethod: string;
  estimatedDelivery: string;
}

// Sample order data
const sampleOrder: OrderSummary = {
  orderNumber: 'ORD-2024-001234',
  items: [
    {
      id: '1',
      name: 'سماعات بلوتوث لاسلكية عالية الجودة',
      description: 'سماعات بلوتوث عالية الجودة مع تقنية إلغاء الضوضاء',
      price: 299,
      originalPrice: 399,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
      quantity: 2,
      category: 'إلكترونيات',
      brand: 'TechSound'
    },
    {
      id: '2',
      name: 'ساعة ذكية رياضية متطورة',
      description: 'ساعة ذكية مع مراقبة اللياقة البدنية ومقاومة الماء',
      price: 199,
      originalPrice: 249,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
      quantity: 1,
      category: 'إلكترونيات',
      brand: 'SmartFit'
    }
  ],
  subtotal: 797,
  discount: 80,
  shippingCost: 25,
  tax: 108,
  total: 850,
  shippingInfo: {
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    address: 'شارع الملك فهد، حي العليا',
    city: 'الرياض',
    region: 'منطقة الرياض'
  },
  paymentMethod: 'بطاقة ائتمان',
  shippingMethod: 'شحن سريع (1-2 أيام)',
  estimatedDelivery: '25 أغسطس 2024'
};

export default function OrderReviewPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setOrderConfirmed(true);
    }, 2000);
  };

  if (orderConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              {/* Success Icon */}
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">تم تأكيد طلبك بنجاح!</h1>
              <p className="text-gray-600 mb-2">رقم الطلب: <strong>{sampleOrder.orderNumber}</strong></p>
              <p className="text-gray-600 mb-8">
                سيتم إرسال تأكيد الطلب إلى بريدك الإلكتروني خلال دقائق قليلة
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/orders"
                  className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  تتبع الطلب
                </Link>
                <Link
                  href="/products"
                  className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  مواصلة التسوق
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
          <span className="text-gray-400">›</span>
          <Link href="/cart" className="hover:text-blue-600 transition-colors">السلة</Link>
          <span className="text-gray-400">›</span>
          <Link href="/checkout" className="hover:text-blue-600 transition-colors">إتمام الطلب</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900">مراجعة الطلب</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">مراجعة الطلب النهائية</h1>
          <p className="text-gray-600">تأكد من صحة جميع المعلومات قبل تأكيد الطلب</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                المنتجات المطلوبة ({sampleOrder.items.length})
              </h2>
              
              <div className="space-y-4">
                {sampleOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 space-x-reverse p-4 border border-gray-200 rounded-lg">
                    <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-1">{item.description}</p>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                        <span>الكمية: {item.quantity}</span>
                        <span>الفئة: {item.category}</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="font-bold text-blue-600">
                          {(item.price * item.quantity).toLocaleString()} ر.س
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {(item.originalPrice * item.quantity).toLocaleString()} ر.س
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.price.toLocaleString()} ر.س × {item.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                معلومات التوصيل
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">المستلم</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>الاسم:</strong> {sampleOrder.shippingInfo.firstName} {sampleOrder.shippingInfo.lastName}</p>
                    <p><strong>الهاتف:</strong> {sampleOrder.shippingInfo.phone}</p>
                    <p><strong>البريد الإلكتروني:</strong> {sampleOrder.shippingInfo.email}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">عنوان التوصيل</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{sampleOrder.shippingInfo.address}</p>
                    <p>{sampleOrder.shippingInfo.city}, {sampleOrder.shippingInfo.region}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Shipping Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                طرق الدفع والشحن
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">طريقة الدفع</h3>
                  <div className="flex items-center space-x-3 space-x-reverse p-3 bg-gray-50 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <span className="text-gray-900">{sampleOrder.paymentMethod}</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">طريقة الشحن</h3>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900 font-medium">{sampleOrder.shippingMethod}</p>
                    <p className="text-sm text-gray-600">التوصيل المتوقع: {sampleOrder.estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h3>
              
              {/* Order Number */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-blue-600 mb-1">رقم الطلب</p>
                  <p className="font-bold text-blue-900">{sampleOrder.orderNumber}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{sampleOrder.subtotal.toLocaleString()} ر.س</span>
                </div>
                
                {sampleOrder.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم</span>
                    <span className="font-medium">-{sampleOrder.discount.toLocaleString()} ر.س</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">الشحن</span>
                  <span className="font-medium">{sampleOrder.shippingCost.toLocaleString()} ر.س</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">ضريبة القيمة المضافة (15%)</span>
                  <span className="font-medium">{sampleOrder.tax.toLocaleString()} ر.س</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-blue-600">{sampleOrder.total.toLocaleString()} ر.س</span>
                  </div>
                </div>
              </div>

              {/* Confirm Order Button */}
              <button
                onClick={handleConfirmOrder}
                disabled={isProcessing}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  isProcessing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>جاري المعالجة...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>تأكيد الطلب</span>
                  </div>
                )}
              </button>

              {/* Back to Checkout */}
              <Link
                href="/checkout"
                className="block w-full mt-4 py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
              >
                العودة لتعديل الطلب
              </Link>

              {/* Security Badge */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm text-green-800 font-medium">طلب آمن ومضمون</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
