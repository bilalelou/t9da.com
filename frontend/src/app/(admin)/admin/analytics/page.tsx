'use client';

import React, { useState, useEffect } from 'react';
// [مهم] تأكد من تثبيت مكتبة الرسوم البيانية: npm install recharts
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Icons
import { DollarSign, ShoppingCart, Users, BarChart2, LoaderCircle, ArrowUp, ArrowDown } from 'lucide-react';

// --- Interfaces ---
interface AnalyticsData {
    stats: {
        revenue: { current: number; growth: number; };
        orders: { current: number; growth: number; };
        customers: { current: number; growth: number; };
    };
    sales_over_time: { date: string; sales: number; }[];
    top_categories: { name: string; total_sales: number; }[];
}

// --- API Helper ---
const api = {
    getAnalytics: async (token: string): Promise<AnalyticsData> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics`, { 
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات التحليلات.');
        const data = await response.json();
        return data.data;
    },
};

// --- Helper Functions ---
const formatCurrency = (amount: number, notation: 'standard' | 'compact' = 'standard') => {
    if (typeof amount !== 'number' || isNaN(amount)) return '0 د.م.';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD', notation }).format(amount);
};

const formatPercentage = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
const getGrowthColor = (growth: number) => growth >= 0 ? 'text-green-600' : 'text-red-600';
const getGrowthIcon = (growth: number) => growth >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />;

// --- Sub-components ---
const StatCard = ({ title, value, growth, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                {icon}
            </div>
        </div>
        <div className={`flex items-center text-sm mt-2 ${getGrowthColor(growth)}`}>
            {getGrowthIcon(growth)}
            <span className="font-semibold mr-1">{formatPercentage(growth)}</span>
            <span className="text-gray-500 text-xs mr-1">عن الشهر الماضي</span>
        </div>
    </div>
);

// --- Main Analytics Page Component ---
const AnalyticsPage = ({ data }) => {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    
    // [تصحيح] الوصول الآمن للبيانات لمنع الأخطاء
    const revenue = data?.stats?.revenue;
    const orders = data?.stats?.orders;
    const customers = data?.stats?.customers;

    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">التحليلات والتقارير</h1>
                <p className="text-md text-gray-600 mt-1">نظرة شاملة على أداء متجرك.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي الإيرادات" value={formatCurrency(revenue?.current ?? 0)} growth={revenue?.growth ?? 0} icon={<DollarSign size={24} />} />
                <StatCard title="إجمالي الطلبات" value={(orders?.current ?? 0).toLocaleString('ar-EG')} growth={orders?.growth ?? 0} icon={<ShoppingCart size={24} />} />
                <StatCard title="عملاء جدد" value={(customers?.current ?? 0).toLocaleString('ar-EG')} growth={customers?.growth ?? 0} icon={<Users size={24} />} />
                <StatCard title="متوسط قيمة الطلب" value={formatCurrency((revenue?.current ?? 0) / (orders?.current || 1))} growth={0} icon={<BarChart2 size={24} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">أداء المبيعات (آخر 30 يوم)</h2>
                    <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <LineChart data={data?.sales_over_time ?? []} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" fontSize={12}/>
                                <YAxis tickFormatter={(value) => formatCurrency(value, 'compact')} fontSize={12}/>
                                <Tooltip formatter={(value: number) => [formatCurrency(value), 'المبيعات']} />
                                <Legend />
                                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} name="المبيعات" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                     <h2 className="text-xl font-bold text-gray-900 mb-4">التصنيفات الأكثر مبيعاً</h2>
                     <div style={{ width: '100%', height: 350 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data?.top_categories ?? []}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={110}
                                    fill="#8884d8"
                                    dataKey="total_sales"
                                    nameKey="name"
                                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                                >
                                    {(data?.top_categories ?? []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => [formatCurrency(value), 'المبيعات']} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Data Fetching Wrapper ---
export default function AnalyticsPageLoader() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }
        api.getAnalytics(token)
            .then(setAnalyticsData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }
    if (!analyticsData) {
        return <div className="text-center text-gray-500">لا توجد بيانات كافية لعرض التحليلات.</div>
    }

    return <AnalyticsPage data={analyticsData} />;
}

