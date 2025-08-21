'use client';

import React, { useState } from 'react';

// Define interfaces
interface StoreSettings {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  language: string;
  logo: string;
}

interface PaymentSettings {
  enableCreditCard: boolean;
  enablePayPal: boolean;
  enableBankTransfer: boolean;
  enableCashOnDelivery: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  shippingZones: string[];
  estimatedDeliveryDays: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  inventoryNotifications: boolean;
  customerNotifications: boolean;
  marketingEmails: boolean;
}

// Sample data
const storeSettings: StoreSettings = {
  name: 'متجر التقنية الحديثة',
  description: 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية',
  email: 'info@techstore.com',
  phone: '+966 11 123 4567',
  address: 'الرياض، المملكة العربية السعودية',
  currency: 'SAR',
  timezone: 'Asia/Riyadh',
  language: 'ar',
  logo: '/logo.png'
};

const paymentSettings: PaymentSettings = {
  enableCreditCard: true,
  enablePayPal: false,
  enableBankTransfer: true,
  enableCashOnDelivery: true,
  stripePublicKey: 'pk_test_...',
  stripeSecretKey: 'sk_test_...',
  paypalClientId: ''
};

const shippingSettings: ShippingSettings = {
  freeShippingThreshold: 200,
  standardShippingCost: 25,
  expressShippingCost: 50,
  shippingZones: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'],
  estimatedDeliveryDays: 3
};

const notificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  orderNotifications: true,
  inventoryNotifications: true,
  customerNotifications: false,
  marketingEmails: true
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'store' | 'payment' | 'shipping' | 'notifications' | 'users'>('store');
  const [store, setStore] = useState(storeSettings);
  const [payment, setPayment] = useState(paymentSettings);
  const [shipping, setShipping] = useState(shippingSettings);
  const [notifications, setNotifications] = useState(notificationSettings);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const saveSettings = () => {
    console.log('Save settings:', { store, payment, shipping, notifications });
  };

  const resetSettings = () => {
    if (window.confirm('هل أنت متأكد من إعادة تعيين الإعدادات؟')) {
      setStore(storeSettings);
      setPayment(paymentSettings);
      setShipping(shippingSettings);
      setNotifications(notificationSettings);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات المتجر</h1>
              <p className="text-sm text-gray-600">إدارة إعدادات المتجر والنظام</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={resetSettings}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إعادة تعيين
              </button>
              
              <button
                onClick={saveSettings}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>حفظ التغييرات</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('store')}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 space-x-reverse ${
                    activeTab === 'store'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>إعدادات المتجر</span>
                </button>

                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 space-x-reverse ${
                    activeTab === 'payment'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span>طرق الدفع</span>
                </button>

                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 space-x-reverse ${
                    activeTab === 'shipping'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>الشحن والتوصيل</span>
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 space-x-reverse ${
                    activeTab === 'notifications'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM4 15h8v-2H4v2zM4 11h10V9H4v2z" />
                  </svg>
                  <span>الإشعارات</span>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full text-right px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 space-x-reverse ${
                    activeTab === 'users'
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <span>المستخدمين والصلاحيات</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Store Settings Tab */}
            {activeTab === 'store' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات المتجر العامة</h2>
                
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر</label>
                      <input
                        type="text"
                        value={store.name}
                        onChange={(e) => setStore({...store, name: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        value={store.email}
                        onChange={(e) => setStore({...store, email: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={store.phone}
                        onChange={(e) => setStore({...store, phone: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                      <select
                        value={store.currency}
                        onChange={(e) => setStore({...store, currency: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="SAR">ريال سعودي (SAR)</option>
                        <option value="USD">دولار أمريكي (USD)</option>
                        <option value="EUR">يورو (EUR)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">وصف المتجر</label>
                    <textarea
                      value={store.description}
                      onChange={(e) => setStore({...store, description: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                    <textarea
                      value={store.address}
                      onChange={(e) => setStore({...store, address: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات طرق الدفع</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">البطاقات الائتمانية</h4>
                        <p className="text-sm text-gray-600">Visa, MasterCard, American Express</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={payment.enableCreditCard}
                          onChange={(e) => setPayment({...payment, enableCreditCard: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">الدفع عند الاستلام</h4>
                        <p className="text-sm text-gray-600">الدفع النقدي عند التوصيل</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={payment.enableCashOnDelivery}
                          onChange={(e) => setPayment({...payment, enableCashOnDelivery: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات الإشعارات</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
                      <p className="text-sm text-gray-600">تلقي الإشعارات عبر البريد الإلكتروني</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailNotifications}
                        onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">إشعارات الطلبات</h4>
                      <p className="text-sm text-gray-600">إشعارات الطلبات الجديدة والتحديثات</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.orderNotifications}
                        onChange={(e) => setNotifications({...notifications, orderNotifications: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Users Settings Tab */}
            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">المستخدمين والصلاحيات</h2>

                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">إدارة المستخدمين</h3>
                  <p className="text-gray-600 mb-6">سيتم إضافة إدارة المستخدمين والصلاحيات قريباً</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    إضافة مستخدم جديد
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}