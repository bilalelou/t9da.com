'use client';

import React, { useState, useEffect } from 'react';
import { Package, ShoppingBag, Star, Eye, ArrowRight } from 'lucide-react';

interface DashboardStats {
  total_orders: number;
  total_spent: number;
  loyalty_points: number;
}

interface Order {
  id: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  created_at: string;
  items_count: number;
}

interface DashboardData {
  stats: DashboardStats;
  orders: {
    data: Order[];
  };
}

export default function UserDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('api_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const response = await fetch(`${API_BASE_URL}/user/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const dashboardData = await response.json();
        setData(dashboardData);
      }
    } catch (error) {
      console.error('خطأ في جلب بيانات لوحة التحكم:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('ar-MA', { 
      style: 'currency', 
      currency: 'MAD' 
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusInfo = (status: Order['status']) => {
    switch (status) {
      case 'pending': return { text: 'في الانتظار', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'confirmed': return { text: 'مؤكد', color: 'text-blue-700 bg-blue-100 border-blue-300' };
      case 'processing': return { text: 'قيد المعالجة', color: 'text-blue-700 bg-blue-100 border-blue-300' };
      case 'shipped': return { text: 'تم الشحن', color: 'text-blue-800 bg-blue-200 border-blue-400' };
      case 'delivered': return { text: 'مكتمل', color: 'text-blue-900 bg-blue-300 border-blue-500' };
      case 'cancelled': return { text: 'ملغي', color: 'text-gray-600 bg-gray-100 border-gray-300' };
      default: return { text: status, color: 'text-gray-600 bg-gray-100 border-gray-300' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
            <p className="text-blue-100 text-lg">تتبع طلباتك وإدارة حسابك بسهولة</p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Package className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">إجمالي الطلبات</p>
              <p className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{data?.stats?.total_orders || 0}</p>
              <p className="text-xs text-blue-500 mt-1">طلب منجز</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Package className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">إجمالي المشتريات</p>
              <p className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{formatCurrency(data?.stats?.total_spent || 0)}</p>
              <p className="text-xs text-blue-500 mt-1">مبلغ منفق</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <ShoppingBag className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">نقاط الولاء</p>
              <p className="text-4xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors">{data?.stats?.loyalty_points || 0}</p>
              <p className="text-xs text-blue-500 mt-1">نقطة متاحة</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <Star className="w-7 h-7 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border-2 border-blue-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-900">الطلبات الأخيرة</h2>
              <p className="text-blue-700 text-sm mt-1">آخر 5 طلبات قمت بها</p>
            </div>
            <a 
              href="/user-dashboard/orders" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
            >
              عرض الكل
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="p-6">
          {data?.orders?.data && data.orders.data.length > 0 ? (
            <div className="space-y-4">
              {data.orders.data.slice(0, 5).map((order) => {
                const status = getStatusInfo(order.status);
                return (
                  <div key={order.id} className="flex items-center justify-between p-5 border border-blue-100 rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">طلب #{order.id}</p>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(order.created_at)} • {order.items_count} منتج</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${status.color}`}>
                        {status.text}
                      </span>
                      <p className="font-bold text-blue-600 text-lg">{formatCurrency(order.total)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد طلبات</h3>
              <p className="text-gray-600 mb-6">ابدأ التسوق لإنشاء طلبك الأول</p>
              <a 
                href="/shop" 
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تسوق الآن
                <ShoppingBag className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}