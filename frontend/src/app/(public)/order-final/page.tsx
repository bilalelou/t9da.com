'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { Pencil, Trash2, ArrowLeft, ShoppingBag, CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';

interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  shippingMethod: string;
  paymentMethod: string;
}

export default function FinalOrderReviewPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    // استرجاع معلومات الشحن من localStorage
    const savedShippingInfo = localStorage.getItem('shippingInfo');
    if (savedShippingInfo) {
      setShippingInfo(JSON.parse(savedShippingInfo));
    } else {
      // إذا لم توجد معلومات شحن، توجيه المستخدم لصفحة checkout
      router.push('/checkout2');
      return;
    }

    // حساب ملخص الطلب
    const subtotal = getTotalPrice();
    const shipping = subtotal > 500 ? 0 : 50; // شحن مجاني للطلبات أكثر من 500 درهم
    const tax = subtotal * 0.2; // ضريبة 20%
    const discount = parseFloat(localStorage.getItem('appliedDiscount') || '0');
    const total = subtotal + shipping + tax - discount;

    setOrderSummary({
      subtotal,
      shipping,
      tax,
      discount,
      total
    });
  }, [getTotalPrice, router]);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleConfirmOrder = () => {
    if (!shippingInfo) {
      alert('يرجى إدخال معلومات الشحن أولاً');
      router.push('/checkout2');
      return;
    }

    if (items.length === 0) {
      alert('السلة فارغة');
      return;
    }

    setShowConfirmation(true);
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);

    try {
      // إعداد بيانات الطلب
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        shipping_info: shippingInfo,
        order_summary: orderSummary,
        order_date: new Date().toISOString()
      };

      // محاكاة إرسال الطلب للخادم
      console.log('إرسال الطلب:', orderData);
      
      // تأخير لمحاكاة استجابة الخادم
      await new Promise(resolve => setTimeout(resolve, 3000));

      // حفظ رقم الطلب
      const orderNumber = `ORD-${Date.now()}`;
      localStorage.setItem('lastOrderNumber', orderNumber);

      // مسح البيانات
      clearCart();
      localStorage.removeItem('shippingInfo');
      localStorage.removeItem('appliedDiscount');

      // الانتقال إلى صفحة تأكيد النجاح
      router.push('/orders/success');
    } catch (error) {
      console.error('خطأ في إرسال الطلب:', error);
      alert('حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">السلة فارغة</h2>
          <p className="text-gray-600 mb-8">يبدو أنك لم تقم بإضافة أي منتجات إلى السلة بعد</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            العودة للتسوق
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">تأكيد الطلب</h3>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من إرسال هذا الطلب؟ لن يمكنك تعديله بعد التأكيد.
              </p>
              <div className="flex space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  disabled={isLoading}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleFinalSubmit}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {isLoading ? 'جارِ الإرسال...' : 'تأكيد الطلب'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 space-x-reverse">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">مراجعة الطلب النهائية</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            {shippingInfo && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 ml-2" />
                    معلومات الشحن
                  </h2>
                  <button
                    onClick={() => router.push('/checkout2')}
                    className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
                  >
                    <Pencil className="h-4 w-4 ml-1" />
                    تعديل
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">الاسم الكامل</span>
                      <p className="text-gray-900">{shippingInfo.fullName}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">البريد الإلكتروني</span>
                      <p className="text-gray-900">{shippingInfo.email}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">رقم الهاتف</span>
                      <p className="text-gray-900">{shippingInfo.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">العنوان</span>
                      <p className="text-gray-900">{shippingInfo.address}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">المدينة والولاية</span>
                      <p className="text-gray-900">{shippingInfo.city}, {shippingInfo.state}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">الرمز البريدي</span>
                      <p className="text-gray-900">{shippingInfo.postalCode}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 ml-2 text-blue-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-500">طريقة الشحن</span>
                      <p className="text-gray-900">{shippingInfo.shippingMethod}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 ml-2 text-green-500" />
                    <div>
                      <span className="text-sm font-medium text-gray-500">طريقة الدفع</span>
                      <p className="text-gray-900">{shippingInfo.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">المنتجات المطلوبة ({items.length})</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 space-x-reverse p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                    <img
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">{item.name}</h3>
                      <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mt-1">
                        <span>السعر: {item.price.toFixed(2)} درهم</span>
                        {item.variant && (
                          <>
                            <span>•</span>
                            <span>النوع: {item.variant}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="حذف المنتج"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {(item.price * item.quantity).toFixed(2)} درهم
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">المجموع الفرعي</span>
                  <span className="font-medium">{orderSummary.subtotal.toFixed(2)} درهم</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">رسوم الشحن</span>
                  <span className="font-medium">
                    {orderSummary.shipping === 0 ? (
                      <span className="text-green-600">مجاني</span>
                    ) : (
                      `${orderSummary.shipping.toFixed(2)} درهم`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">الضريبة (20%)</span>
                  <span className="font-medium">{orderSummary.tax.toFixed(2)} درهم</span>
                </div>
                {orderSummary.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span className="font-medium">-{orderSummary.discount.toFixed(2)} درهم</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>المجموع الكلي</span>
                    <span className="text-blue-600">{orderSummary.total.toFixed(2)} درهم</span>
                  </div>
                </div>
              </div>

              {orderSummary.subtotal > 500 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                    <span className="text-sm text-green-800 font-medium">
                      تهانينا! حصلت على شحن مجاني
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleConfirmOrder}
                  disabled={!shippingInfo || items.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  تأكيد وإرسال الطلب
                </button>
                
                <button
                  onClick={() => router.push('/checkout2')}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  العودة لتعديل الطلب
                </button>
              </div>

              {(!shippingInfo || items.length === 0) && (
                <p className="text-sm text-red-600 mt-3 text-center">
                  {!shippingInfo ? 'يرجى إدخال معلومات الشحن أولاً' : 'السلة فارغة'}
                </p>
              )}

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                  <span className="text-sm text-gray-700">
                    طلب آمن ومحمي بتشفير SSL
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}