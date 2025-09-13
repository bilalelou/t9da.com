'use client';

import React, { useState, useEffect, useMemo } from 'react';

// Icons
import { ShoppingCart, Search, LoaderCircle, CheckCircle, XCircle, Clock, Truck, MoreVertical, DollarSign, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// --- Interfaces ---
interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    total_price: number;
    status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled';
    created_at: string;
}

interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// --- API Helper ---
const api = {
    getOrders: async (token: string, page: number, perPage: number): Promise<{ data: Order[], pagination: PaginationInfo }> => {
        const response = await fetch(`http://localhost:8000/api/orders?page=${page}&per_page=${perPage}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات الطلبات.');
        const data = await response.json();
        return { data: data.data || [], pagination: data.pagination };
    },
};

// --- Helper Functions ---
const formatCurrency = (amount: number) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'غير متوفر';
    return new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ar-MA', { dateStyle: 'medium', timeStyle: 'short' });
};

// [تحسين] تم تحسين الألوان لتكون أكثر تميزاً
const getStatusInfo = (status: Order['status']) => {
    switch (status) {
        case 'pending': return { text: 'في الانتظار', color: 'border-yellow-300 bg-yellow-50 text-yellow-800', icon: <Clock className="w-4 h-4" /> };
        case 'processing': return { text: 'قيد المعالجة', color: 'border-blue-300 bg-blue-50 text-blue-800', icon: <LoaderCircle className="w-4 h-4 animate-spin" /> };
        case 'shipped': return { text: 'تم الشحن', color: 'border-indigo-300 bg-indigo-50 text-indigo-800', icon: <Truck className="w-4 h-4" /> };
        case 'completed': return { text: 'مكتمل', color: 'border-green-300 bg-green-50 text-green-800', icon: <CheckCircle className="w-4 h-4" /> };
        case 'cancelled': return { text: 'ملغي', color: 'border-red-300 bg-red-50 text-red-800', icon: <XCircle className="w-4 h-4" /> };
        default: return { text: status, color: 'border-gray-300 bg-gray-50 text-gray-800' };
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

// [جديد] مكون نظام الصفحات
const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.last_page <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= pagination.last_page; i++) {
        pageNumbers.push(i);
    }
    
    return (
         <div className="flex items-center justify-between mt-4">
             <span className="text-sm text-gray-700">
                 صفحة <span className="font-semibold">{pagination.current_page}</span> من <span className="font-semibold">{pagination.last_page}</span>
             </span>
             <div className="inline-flex items-center -space-x-px">
                 <button onClick={() => onPageChange(1)} disabled={pagination.current_page === 1} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50"><ChevronsLeft size={16}/></button>
                 <button onClick={() => onPageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-3 py-2 leading-tight text-gray-500 bg-white border-y border-gray-300 hover:bg-gray-100 disabled:opacity-50"><ChevronLeft size={16}/></button>
                 <button onClick={() => onPageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="px-3 py-2 leading-tight text-gray-500 bg-white border-y border-gray-300 hover:bg-gray-100 disabled:opacity-50"><ChevronRight size={16}/></button>
                 <button onClick={() => onPageChange(pagination.last_page)} disabled={pagination.current_page === pagination.last_page} className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50"><ChevronsRight size={16}/></button>
            </div>
         </div>
    );
};


// --- Main Orders Page Component ---
const OrdersPage = ({ initialOrders, initialPagination, token }) => {
    const [orders, setOrders] = useState<Order[]>(initialOrders);
    const [pagination, setPagination] = useState<PaginationInfo>(initialPagination);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    
    const fetchOrders = async (page = pagination.current_page, perPage = pagination.per_page) => {
        try {
            const { data, pagination: newPagination } = await api.getOrders(token, page, perPage);
            setOrders(data);
            setPagination(newPagination);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        fetchOrders();
    }, [pagination.current_page, pagination.per_page]);

    const handlePageChange = (newPage: number) => {
        setPagination(p => ({ ...p, current_page: newPage }));
    };

    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPagination(p => ({ ...p, per_page: Number(e.target.value), current_page: 1 }));
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) || order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [orders, searchTerm, statusFilter]);

    return (
        <div className="space-y-8" dir="rtl">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
                <p className="text-md text-gray-600 mt-1">متابعة وتحديث حالة جميع الطلبات.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="إجمالي الطلبات" value={pagination.total} icon={<ShoppingCart size={24} />} />
                <StatCard title="طلبات في الانتظار" value={initialOrders.filter(o => o.status === 'pending').length} icon={<Clock size={24} />} />
                <StatCard title="قيد المعالجة" value={initialOrders.filter(o => o.status === 'processing').length} icon={<LoaderCircle size={24} />} />
                <StatCard title="طلبات مكتملة" value={initialOrders.filter(o => o.status === 'completed').length} icon={<CheckCircle size={24} />} />
            </div>
            
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="relative md:col-span-1">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-5 w-5 text-gray-400" /></div>
                        <input type="text" placeholder="ابحث برقم الطلب أو اسم العميل..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                    </div>
                     <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <option value="all">جميع الحالات</option>
                        <option value="pending">في الانتظار</option>
                        <option value="processing">قيد المعالجة</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">العميل</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">التاريخ</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">المبلغ الإجمالي</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => {
                                const status = getStatusInfo(order.status);
                                return (
                                <tr key={order.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-sm text-gray-700">{order.order_number}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{order.customer_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                                    <td className="px-6 py-4 font-semibold text-gray-800">{formatCurrency(order.total_price)}</td>
                                    <td className="px-6 py-4 text-center"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>{status.icon} {status.text}</span></td>
                                    <td className="px-6 py-4"><button className="text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-gray-100"><MoreVertical size={18} /></button></td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                 <div className="p-4 border-t flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-2 text-sm">
                         <span>عرض</span>
                         <select value={pagination.per_page} onChange={handlePerPageChange} className="border border-gray-300 rounded-md p-1">
                             <option value="10">10</option>
                             <option value="25">25</option>
                             <option value="50">50</option>
                             <option value="100">100</option>
                         </select>
                         <span>عناصر لكل صفحة</span>
                     </div>
                     <Pagination pagination={pagination} onPageChange={handlePageChange} />
                 </div>
            </div>
        </div>
    );
}

// --- Data Fetching Wrapper ---
export default function OrdersPageLoader() {
    const [initialData, setInitialData] = useState<{ orders: Order[], pagination: PaginationInfo } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        setToken(apiToken);
        if (!apiToken) {
            window.location.href = '/login';
            return;
        }
        api.getOrders(apiToken, 1, 10).then(({ data, pagination }) => {
            setInitialData({ orders: data, pagination });
        }).catch(err => setError(err.message)).finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-96"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    }
    if (error) {
        return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">خطأ: {error}</div>;
    }
    return <OrdersPage initialOrders={initialData.orders} initialPagination={initialData.pagination} token={token} />;
}

