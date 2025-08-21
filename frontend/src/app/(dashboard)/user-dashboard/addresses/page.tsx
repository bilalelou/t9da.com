'use client';

import React, { useState } from 'react';

// Define interfaces
interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault: boolean;
}

// Sample data
const initialAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'المنزل',
    fullName: 'أحمد محمد العلي',
    phone: '+966 50 123 4567',
    street: 'شارع الملك فهد، حي العليا، مبنى رقم 123',
    city: 'الرياض',
    district: 'العليا',
    postalCode: '12345',
    isDefault: true
  },
  {
    id: '2',
    type: 'work',
    name: 'العمل',
    fullName: 'أحمد محمد العلي',
    phone: '+966 50 123 4567',
    street: 'طريق الملك عبدالعزيز، حي الملز، برج الأعمال، الطابق 15',
    city: 'الرياض',
    district: 'الملز',
    postalCode: '12346',
    isDefault: false
  },
  {
    id: '3',
    type: 'other',
    name: 'منزل الوالدين',
    fullName: 'محمد عبدالله العلي',
    phone: '+966 50 987 6543',
    street: 'شارع الأمير سلطان، حي الروضة، فيلا رقم 456',
    city: 'الرياض',
    district: 'الروضة',
    postalCode: '12347',
    isDefault: false
  }
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const getAddressTypeText = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return 'المنزل';
      case 'work':
        return 'العمل';
      case 'other':
        return 'أخرى';
      default:
        return type;
    }
  };

  const getAddressTypeIcon = (type: Address['type']) => {
    switch (type) {
      case 'home':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        );
      case 'work':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'other':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  const setAsDefault = (addressId: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    })));
  };

  const deleteAddress = (addressId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العنوان؟')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
    }
  };

  const editAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">عناويني</h1>
              <p className="text-sm text-gray-600">إدارة عناوين التوصيل الخاصة بك</p>
            </div>
            
            <button
              onClick={handleAddAddress}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>إضافة عنوان جديد</span>
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Addresses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    {getAddressTypeIcon(address.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                    <p className="text-sm text-gray-600">{getAddressTypeText(address.type)}</p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    افتراضي
                  </span>
                )}
              </div>

              {/* Address Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-600">الاسم الكامل</p>
                  <p className="font-medium text-gray-900">{address.fullName}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">رقم الهاتف</p>
                  <p className="font-medium text-gray-900">{address.phone}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-600">العنوان</p>
                  <p className="text-gray-700 leading-relaxed">{address.street}</p>
                  <p className="text-gray-700">{address.district}، {address.city}</p>
                  <p className="text-gray-700">الرمز البريدي: {address.postalCode}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => editAddress(address)}
                  className="flex-1 px-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  تعديل
                </button>
                
                {!address.isDefault && (
                  <button
                    onClick={() => setAsDefault(address.id)}
                    className="flex-1 px-3 py-2 text-green-600 hover:text-green-700 text-sm font-medium border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    جعل افتراضي
                  </button>
                )}
                
                <button
                  onClick={() => deleteAddress(address.id)}
                  className="px-3 py-2 text-red-600 hover:text-red-700 text-sm font-medium border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}

          {/* Add New Address Card */}
          <div
            onClick={handleAddAddress}
            className="bg-white rounded-2xl shadow-lg p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:shadow-xl transition-all cursor-pointer group"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 group-hover:bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                <svg className="w-8 h-8 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">إضافة عنوان جديد</h3>
              <p className="text-gray-600">أضف عنوان توصيل جديد</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {addresses.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد عناوين محفوظة</h3>
            <p className="text-gray-600 mb-6">أضف عنوان التوصيل الأول لك</p>
            <button
              onClick={handleAddAddress}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              إضافة عنوان جديد
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">نصائح مهمة</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-3 space-x-reverse">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>تأكد من صحة العنوان ورقم الهاتف لضمان التوصيل السليم</p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>يمكنك حفظ عدة عناوين واختيار الافتراضي منها</p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>أضف تفاصيل إضافية مثل رقم الشقة أو معالم مميزة</p>
            </div>
            <div className="flex items-start space-x-3 space-x-reverse">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>العنوان الافتراضي سيُستخدم تلقائياً في الطلبات الجديدة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal would go here */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'تعديل العنوان' : 'إضافة عنوان جديد'}
            </h3>
            <p className="text-gray-600 mb-4">سيتم إضافة نموذج إضافة/تعديل العنوان هنا</p>
            <div className="flex space-x-3 space-x-reverse">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
