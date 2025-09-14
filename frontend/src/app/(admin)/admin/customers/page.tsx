'use client';

import React, { useState, useMemo, useEffect } from 'react';

// Icons
import { Users, UserCheck, UserPlus, DollarSign, Search, MoreVertical, Edit, MessageSquare, UserX, LoaderCircle } from 'lucide-react';

// --- Interfaces ---
interface Customer {
    id: string;
    name: string;
    email: string;
    avatar: string; // URL to avatar image
    joinDate: string;
    totalOrders: number;
    totalSpent: number;
    status: 'active' | 'inactive' | 'blocked';
    city: string;
}

// --- API Helper ---
const api = {
    getCustomers: async () => {
        const token = localStorage.getItem('api_token');
        if (!token) {
            // Redirect to login if no token is found
            window.location.href = '/login';
            return []; // Return empty to prevent errors before redirect
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            if (response.status === 401) {
                 // Token is invalid or expired
                 localStorage.removeItem('api_token');
                 window.location.href = '/login';
            }
            throw new Error('فشل في جلب بيانات العملاء.');
        }

        const data = await response.json();
        // Assuming the API returns data in a { data: [...] } structure
        return data.data || data; 
    }
};


// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-MA', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getStatusInfo = (status: Customer['status']) => {
    switch (status) {
        case 'active': return { text: 'نشط', color: 'bg-green-100 text-green-800', icon: <UserCheck className="w-4 h-4" /> };
        case 'inactive': return { text: 'غير نشط', color: 'bg-gray-100 text-gray-700', icon: <UserX className="w-4 h-4" /> };
        case 'blocked': return { text: 'محظور', color: 'bg-red-100 text-red-800', icon: <UserX className="w-4 h-4" /> };
        default: return { text: status, color: 'bg-gray-100 text-gray-800', icon: <Users className="w-4 h-4" /> };
    }
};

// --- Sub-components ---
const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">{icon}</div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

const CustomerCard = ({ customer, onSelect, isSelected }) => {
    const status = getStatusInfo(customer.status);
    return (
        <div className="bg-white rounded-lg shadow p-4 border border-gray-100 space-y-3">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <input type="checkbox" checked={isSelected} onChange={() => onSelect(customer.id)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" />
                    <img src={customer.avatar} alt={customer.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                        <p className="font-bold text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                    </div>
                </div>
                <button className="text-gray-400 hover:text-gray-700 p-1"><MoreVertical size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-gray-100">
                <div><p className="text-gray-500">إجمالي المشتريات</p><p className="font-semibold text-gray-800">{formatCurrency(customer.totalSpent)}</p></div>
                <div><p className="text-gray-500">عدد الطلبات</p><p className="font-semibold text-gray-800">{customer.totalOrders}</p></div>
                <div><p className="text-gray-500">الموقع</p><p className="font-semibold text-gray-800">{customer.city}</p></div>
                <div><p className="text-gray-500">الحالة</p><span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.icon}{status.text}</span></div>
            </div>
        </div>
    );
};

// --- Main Customers Page Component ---
const CustomersPage = ({ customers }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

    const filteredAndSortedCustomers = useMemo(() => {
        let filtered = customers.filter(customer => {
            const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = selectedStatus === 'all' || customer.status === selectedStatus;
            return matchesSearch && matchesStatus;
        });
        return filtered.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name, 'ar');
            if (sortBy === 'totalSpent') return b.totalSpent - a.totalSpent;
            if (sortBy === 'joinDate') return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
            return 0;
        });
    }, [customers, searchTerm, selectedStatus, sortBy]);

    const toggleCustomerSelection = (customerId: string) => {
        setSelectedCustomers(prev => prev.includes(customerId) ? prev.filter(id => id !== customerId) : [...prev, customerId]);
    };
    
    const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedCustomers(e.target.checked ? filteredAndSortedCustomers.map(c => c.id) : []);
    };
    
    return (
        <div className="space-y-8" dir="rtl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">إدارة العملاء</h1>
                    <p className="text-md text-gray-600 mt-1">عرض وتحليل وتصدير بيانات عملائك.</p>
                </div>
                <div><button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"><UserPlus size={20} /><span>إضافة عميل</span></button></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي العملاء" value={customers.length.toLocaleString()} icon={<Users size={24} />} />
                <StatCard title="العملاء النشطين" value={customers.filter(c => c.status === 'active').length.toLocaleString()} icon={<UserCheck size={24} />} />
                <StatCard title="عملاء جدد (الشهر)" value="87" icon={<UserPlus size={24} />} />
                <StatCard title="إجمالي الإيرادات" value={formatCurrency(customers.reduce((acc, c) => acc + c.totalSpent, 0))} icon={<DollarSign size={24} />} />
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث بالاسم أو البريد..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>
                    <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="all">جميع الحالات</option>
                        <option value="active">نشط</option>
                        <option value="inactive">غير نشط</option>
                        <option value="blocked">محظور</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="name">ترتيب حسب: الاسم</option>
                        <option value="totalSpent">إجمالي المشتريات</option>
                        <option value="joinDate">تاريخ الانضمام</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto hidden sm:block">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right"><input type="checkbox" onChange={toggleSelectAll} className="rounded" /></th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">العميل</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الموقع</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">إجمالي المشتريات</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAndSortedCustomers.map((customer) => (
                                <tr key={customer.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4"><input type="checkbox" checked={selectedCustomers.includes(customer.id)} onChange={() => toggleCustomerSelection(customer.id)} className="rounded" /></td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3"><img src={customer.avatar} alt={customer.name} className="w-10 h-10 rounded-full object-cover" /><div><p className="font-semibold text-gray-900">{customer.name}</p><p className="text-sm text-gray-500">{customer.email}</p></div></div></td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{customer.city}</td>
                                    <td className="px-6 py-4 text-center"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusInfo(customer.status).color}`}>{getStatusInfo(customer.status).text}</span></td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{formatCurrency(customer.totalSpent)}</td>
                                    <td className="px-6 py-4"><div className="flex items-center gap-3 text-gray-500"><button className="hover:text-blue-600"><MessageSquare size={18} /></button><button className="hover:text-green-600"><Edit size={18} /></button><button className="hover:text-gray-900"><MoreVertical size={18} /></button></div></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="sm:hidden p-4 space-y-4 bg-gray-50">
                    {filteredAndSortedCustomers.map((customer) => (<CustomerCard key={customer.id} customer={customer} onSelect={toggleCustomerSelection} isSelected={selectedCustomers.includes(customer.id)} />))}
                </div>
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <p className="text-sm text-gray-700">عرض <span className="font-medium">1</span> إلى <span className="font-medium">{filteredAndSortedCustomers.length}</span> من <span className="font-medium">{customers.length}</span> نتيجة</p>
                    <div className="flex gap-1"><button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50">السابق</button><button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-50">التالي</button></div>
                </div>
            </div>
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function CustomersPageLoader() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await api.getCustomers();
                setCustomers(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }

    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }

    return <CustomersPage customers={customers} />;
}

