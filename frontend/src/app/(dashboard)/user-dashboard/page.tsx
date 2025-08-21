'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define interfaces
interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  loyaltyPoints: number;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  trackingNumber?: string;
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
}

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  street: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

// Sample data
const userProfile: UserProfile = {
  name: 'أحمد محمد العلي',
  email: 'ahmed@example.com',
  phone: '+966 50 123 4567',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
  joinDate: '2023-06-15',
  totalOrders: 24,
  totalSpent: 15750,
  loyaltyPoints: 1250
};

const recentOrders: Order[] = [
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
  }
];

const wishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'سماعات بلوتوث لاسلكية',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
    inStock: true
  },
  {
    id: '2',
    name: 'ساعة ذكية رياضية',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
    inStock: true
  },
  {
    id: '3',
    name: 'حقيبة لابتوب أنيقة',
    price: 199,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150',
    inStock: false
  }
];

const addresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'المنزل',
    street: 'شارع الملك فهد، حي العليا',
    city: 'الرياض',
    postalCode: '12345',
    isDefault: true
  },
  {
    id: '2',
    type: 'work',
    name: 'العمل',
    street: 'طريق الملك عبدالعزيز، حي الملز',
    city: 'الرياض',
    postalCode: '12346',
    isDefault: false
  }
];

export default function UserDashboardPage() {

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">نظرة عامة</h1>
              <p className="text-sm text-gray-600">مرحباً بك في حسابك الشخصي</p>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <Link href="/products" className="text-gray-600 hover:text-gray-900 text-sm">
                تصفح المنتجات
              </Link>
              <Link href="/cart" className="text-gray-600 hover:text-gray-900 text-sm">
                السلة
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي المشتريات</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(userProfile.totalSpent)}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">نقاط الولاء</p>
                <p className="text-2xl font-bold text-gray-900">{userProfile.loyaltyPoints}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">الطلبات الأخيرة</h2>
            <Link
              href="/user-dashboard/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              عرض الكل
            </Link>
          </div>

          <div className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <div>
                    <p className="font-medium text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.date} • {order.items} منتج</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="font-medium text-gray-900">{formatCurrency(order.total)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">إجراءات سريعة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/products"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">تصفح المنتجات</span>
            </Link>

            <Link
              href="/user-dashboard/orders"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">تتبع الطلبات</span>
            </Link>

            <Link
              href="/user-dashboard/wishlist"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">قائمة الأمنيات</span>
            </Link>

            <Link
              href="/user-dashboard/profile"
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-900">تحديث الملف</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
