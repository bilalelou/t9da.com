'use client';

import React, { useState } from 'react';

// Define interfaces
interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    growth: number;
  };
  orders: {
    current: number;
    previous: number;
    growth: number;
  };
  customers: {
    current: number;
    previous: number;
    growth: number;
  };
  conversion: {
    current: number;
    previous: number;
    growth: number;
  };
}

interface SalesData {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  revenue: number;
}

// Sample data
const analyticsData: AnalyticsData = {
  revenue: {
    current: 245000,
    previous: 198000,
    growth: 23.7
  },
  orders: {
    current: 1560,
    previous: 1340,
    growth: 16.4
  },
  customers: {
    current: 890,
    previous: 750,
    growth: 18.7
  },
  conversion: {
    current: 3.2,
    previous: 2.8,
    growth: 14.3
  }
};

const salesData: SalesData[] = [
  { month: 'يناير', revenue: 180000, orders: 1200, customers: 650 },
  { month: 'فبراير', revenue: 195000, orders: 1280, customers: 680 },
  { month: 'مارس', revenue: 210000, orders: 1350, customers: 720 },
  { month: 'أبريل', revenue: 225000, orders: 1420, customers: 760 },
  { month: 'مايو', revenue: 240000, orders: 1500, customers: 800 },
  { month: 'يونيو', revenue: 245000, orders: 1560, customers: 890 }
];

const topProducts: TopProduct[] = [
  {
    id: '1',
    name: 'سماعات بلوتوث لاسلكية',
    category: 'إلكترونيات',
    sales: 128,
    revenue: 38400,
    growth: 15.2
  },
  {
    id: '2',
    name: 'ساعة ذكية رياضية',
    category: 'إكسسوارات',
    sales: 89,
    revenue: 115700,
    growth: 22.8
  },
  {
    id: '3',
    name: 'كاميرا رقمية احترافية',
    category: 'كاميرات',
    sales: 45,
    revenue: 112500,
    growth: 8.5
  },
  {
    id: '4',
    name: 'لوحة مفاتيح ميكانيكية',
    category: 'ألعاب',
    sales: 167,
    revenue: 75150,
    growth: 31.4
  },
  {
    id: '5',
    name: 'مكبر صوت محمول',
    category: 'صوتيات',
    sales: 92,
    revenue: 17380,
    growth: -5.2
  }
];

const customerSegments: CustomerSegment[] = [
  { segment: 'عملاء VIP', count: 156, percentage: 17.5, revenue: 98000 },
  { segment: 'عملاء ذهبيين', count: 234, percentage: 26.3, revenue: 78000 },
  { segment: 'عملاء فضيين', count: 312, percentage: 35.1, revenue: 52000 },
  { segment: 'عملاء جدد', count: 188, percentage: 21.1, revenue: 17000 }
];

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getGrowthColor = (growth: number) => {
    return growth > 0 ? 'text-green-600' : 'text-red-600';
  };

  const getGrowthIcon = (growth: number) => {
    return growth > 0 ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V8" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">التحليلات والإحصائيات</h1>
              <p className="text-sm text-gray-600">تحليل أداء المتجر والمبيعات</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">هذا الأسبوع</option>
                <option value="month">هذا الشهر</option>
                <option value="quarter">هذا الربع</option>
                <option value="year">هذا العام</option>
              </select>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>تصدير التقرير</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenue.current)}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analyticsData.revenue.growth)}`}>
                  {getGrowthIcon(analyticsData.revenue.growth)}
                  <span className="text-sm font-medium mr-1">
                    {formatPercentage(analyticsData.revenue.growth)}
                  </span>
                  <span className="text-xs text-gray-500">من الشهر الماضي</span>
                </div>
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
                <p className="text-sm font-medium text-gray-600">إجمالي الطلبات</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.orders.current}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analyticsData.orders.growth)}`}>
                  {getGrowthIcon(analyticsData.orders.growth)}
                  <span className="text-sm font-medium mr-1">
                    {formatPercentage(analyticsData.orders.growth)}
                  </span>
                  <span className="text-xs text-gray-500">من الشهر الماضي</span>
                </div>
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
                <p className="text-sm font-medium text-gray-600">العملاء النشطين</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customers.current}</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analyticsData.customers.growth)}`}>
                  {getGrowthIcon(analyticsData.customers.growth)}
                  <span className="text-sm font-medium mr-1">
                    {formatPercentage(analyticsData.customers.growth)}
                  </span>
                  <span className="text-xs text-gray-500">من الشهر الماضي</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">معدل التحويل</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.conversion.current}%</p>
                <div className={`flex items-center mt-2 ${getGrowthColor(analyticsData.conversion.growth)}`}>
                  {getGrowthIcon(analyticsData.conversion.growth)}
                  <span className="text-sm font-medium mr-1">
                    {formatPercentage(analyticsData.conversion.growth)}
                  </span>
                  <span className="text-xs text-gray-500">من الشهر الماضي</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">اتجاه المبيعات</h3>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="revenue">الإيرادات</option>
                <option value="orders">الطلبات</option>
                <option value="customers">العملاء</option>
              </select>
            </div>
            
            {/* Simple Chart Placeholder */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-500">رسم بياني للمبيعات</p>
                <p className="text-sm text-gray-400">سيتم إضافة مكتبة الرسوم البيانية</p>
              </div>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">شرائح العملاء</h3>
            
            <div className="space-y-4">
              {customerSegments.map((segment, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full mr-3 ${
                      index === 0 ? 'bg-purple-500' :
                      index === 1 ? 'bg-yellow-500' :
                      index === 2 ? 'bg-gray-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{segment.segment}</p>
                      <p className="text-xs text-gray-500">{segment.count} عميل</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{segment.percentage}%</p>
                    <p className="text-xs text-gray-500">{formatCurrency(segment.revenue)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">أفضل المنتجات أداءً</h3>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-right py-3 text-sm font-medium text-gray-500">المنتج</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">المبيعات</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">الإيرادات</th>
                  <th className="text-right py-3 text-sm font-medium text-gray-500">النمو</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3 ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm text-gray-900">{product.sales}</td>
                    <td className="py-4 text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</td>
                    <td className="py-4">
                      <div className={`flex items-center ${getGrowthColor(product.growth)}`}>
                        {getGrowthIcon(product.growth)}
                        <span className="text-sm font-medium mr-1">
                          {formatPercentage(product.growth)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
