'use client';

import React from 'react';
import Link from 'next/link';

// Define interfaces
interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  trackingNumber?: string;
}

// Sample data
const orders: Order[] = [
  {
    id: 'ORD-2024-001',
    date: '2024-01-15',
    total: 1250,
    status: 'shipped',
    items: 3,
    trackingNumber: 'TRK123456789'
  },
  {
    id: 'ORD-2024-002',
    date: '2024-01-10',
    total: 890,
    status: 'delivered',
    items: 2
  },
  {
    id: 'ORD-2024-003',
    date: '2024-01-05',
    total: 2100,
    status: 'processing',
    items: 5
  },
  {
    id: 'ORD-2024-004',
    date: '2023-12-28',
    total: 650,
    status: 'delivered',
    items: 1
  },
  {
    id: 'ORD-2024-005',
    date: '2023-12-20',
    total: 1800,
    status: 'cancelled',
    items: 4
  },
  {
    id: 'ORD-2024-006',
    date: '2023-12-15',
    total: 950,
    status: 'delivered',
    items: 2
  }
];

export default function OrdersPage() {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      case 'delivered':
        return 'تم التسليم';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">طلباتي</h1>
              <p className="text-sm text-gray-600">تتبع وإدارة جميع طلباتك</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">جميع الطلبات</option>
                <option value="pending">في الانتظار</option>
                <option value="processing">قيد المعالجة</option>
                <option value="shipped">تم الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغي</option>
              </select>
              
              <Link
                href="/products"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                طلب جديد
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                  <p className="text-sm text-gray-600">تاريخ الطلب: {order.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">عدد المنتجات</p>
                  <p className="text-lg font-semibold text-gray-900">{order.items} منتج</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">إجمالي المبلغ</p>
                  <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                </div>
                {order.trackingNumber && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">رقم التتبع</p>
                    <p className="text-lg font-semibold text-gray-900">{order.trackingNumber}</p>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  عرض التفاصيل
                </button>
                {order.status === 'shipped' && (
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    تتبع الشحنة
                  </button>
                )}
                {order.status === 'delivered' && (
                  <>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      إعادة الطلب
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      تقييم المنتجات
                    </button>
                  </>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    إلغاء الطلب
                  </button>
                )}
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  تحميل الفاتورة
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">لا توجد طلبات بعد</h3>
            <p className="text-gray-600 mb-6">ابدأ التسوق واطلب منتجاتك المفضلة</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        )}

        {/* Pagination */}
        {orders.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <p className="text-sm text-gray-600">
              عرض 1-{orders.length} من {orders.length} طلب
            </p>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                السابق
              </button>
              <button className="px-3 py-2 bg-blue-600 text-white rounded-lg">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                التالي
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
