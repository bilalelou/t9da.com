'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

// Icons
import { LoaderCircle, CheckCircle, Package, ChevronLeft, ChevronRight, Clock, Truck, XCircle, X, Eye } from 'lucide-react';

// --- Interfaces ---
interface Order {
    id: number;
    total: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    created_at: string;
    items_count: number;
}

interface OrderItem {
    id: number;
    product_name: string;
    product_image: string;
    quantity: number;
    price: number;
    total: number;
    variant?: {
        color?: string;
        size?: string;
    };
}

interface OrderDetails extends Order {
    items: OrderItem[];
    shipping_address?: {
        name: string;
        phone: string;
        address: string;
        city: string;
    };
    notes?: string;
}
interface PaginationInfo {
    current_page: number;
    last_page: number;
    total: number;
}

// --- [تصحيح] تم دمج أنظمة إدارة الحالة هنا لحل مشكلة الاستيراد ---
const ToastContext = createContext<{ showToast: (message: string, type?: 'success' | 'error') => void }>({ showToast: () => {} });
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({ message: '', visible: false, type: 'success' as 'success' | 'error' });
    const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, visible: true, type });
        setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
    }, []);
    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast.visible && (
                <div dir="rtl" className={`fixed bottom-10 right-10 text-white py-3 px-6 rounded-lg shadow-xl flex items-center gap-3 z-[101] ${toast.type === 'success' ? 'bg-gray-800' : 'bg-red-600'}`}>
                    <CheckCircle size={22} className={toast.type === 'success' ? 'text-green-400' : 'text-white'}/>
                    <span>{toast.message}</span>
                </div>
            )}
        </ToastContext.Provider>
    );
};

const AppProviders = ({ children }) => (
    <ToastProvider>
        {children}
    </ToastProvider>
);


// --- API Helper ---
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const api = {
    getOrders: async (token: string, page: number = 1): Promise<{ orders: Order[], pagination: PaginationInfo }> => {
        const response = await fetch(`${API_BASE_URL}/user/dashboard?page=${page}`, { 
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } 
        });
        if (!response.ok) {
            if (response.status === 401) window.location.href = '/login';
            throw new Error('فشل في جلب الطلبات.');
        }
        const data = await response.json();
        return {
            orders: data.orders.data,
            pagination: data.orders.pagination
        };
    },
    
    getOrderDetails: async (token: string, orderId: number): Promise<OrderDetails> => {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, { 
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' } 
        });
        if (!response.ok) {
            if (response.status === 401) window.location.href = '/login';
            throw new Error('فشل في جلب تفاصيل الطلب.');
        }
        return await response.json();
    },
};

// --- Helper Functions ---
const formatCurrency = (price: number) => new Intl.NumberFormat('ar-MA', { style: 'currency', currency: 'MAD' }).format(price);
const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' });
const getStatusInfo = (status: Order['status']) => {
    switch (status) {
        case 'pending': return { text: 'في الانتظار', color: 'bg-yellow-100 text-yellow-800', icon: <Clock size={14}/> };
        case 'processing': return { text: 'قيد المعالجة', color: 'bg-blue-100 text-blue-800', icon: <LoaderCircle size={14} className="animate-spin"/> };
        case 'shipped': return { text: 'تم الشحن', color: 'bg-purple-100 text-purple-800', icon: <Truck size={14}/> };
        case 'delivered': return { text: 'مكتمل', color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14}/> };
        case 'cancelled': return { text: 'ملغي', color: 'bg-red-100 text-red-800', icon: <XCircle size={14}/> };
        default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
};

// --- Order Details Modal Component ---
interface OrderDetailsModalProps {
    orderId: number | null;
    isOpen: boolean;
    onClose: () => void;
    token: string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ orderId, isOpen, onClose, token }) => {
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && orderId && token) {
            setLoading(true);
            setError(null);
            api.getOrderDetails(token, orderId)
                .then(setOrderDetails)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [isOpen, orderId, token]);

    if (!isOpen) return null;

    const status = orderDetails ? getStatusInfo(orderDetails.status) : null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">تفاصيل الطلب #{orderId}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    {loading && (
                        <div className="flex justify-center items-center py-20">
                            <LoaderCircle className="animate-spin text-blue-600" size={48} />
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-20">
                            <div className="text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>
                        </div>
                    )}

                    {orderDetails && (
                        <div className="space-y-6">
                            {/* Order Summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">حالة الطلب</h3>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 w-fit ${status?.color}`}>
                                        {status?.icon} {status?.text}
                                    </span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">تاريخ الطلب</h3>
                                    <p className="text-gray-600">{formatDate(orderDetails.created_at)}</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">المبلغ الإجمالي</h3>
                                    <p className="text-xl font-bold text-blue-600">{formatCurrency(orderDetails.total)}</p>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            {orderDetails.shipping_address && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-3">عنوان التسليم</h3>
                                    <div className="space-y-1 text-gray-600">
                                        <p><span className="font-medium">الاسم:</span> {orderDetails.shipping_address.name}</p>
                                        <p><span className="font-medium">الهاتف:</span> {orderDetails.shipping_address.phone}</p>
                                        <p><span className="font-medium">المدينة:</span> {orderDetails.shipping_address.city}</p>
                                        <p><span className="font-medium">العنوان:</span> {orderDetails.shipping_address.address}</p>
                                    </div>
                                </div>
                            )}

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-4">المنتجات المطلوبة</h3>
                                <div className="space-y-3">
                                    {orderDetails.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                                            <img 
                                                src={item.product_image || '/placeholder-product.jpg'} 
                                                alt={item.product_name}
                                                className="w-16 h-16 object-cover rounded-lg"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.src = '/placeholder-product.jpg';
                                                }}
                                            />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                                                {item.variant && (
                                                    <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                                        {item.variant.color && <span>اللون: {item.variant.color}</span>}
                                                        {item.variant.size && <span>المقاس: {item.variant.size}</span>}
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-gray-600">الكمية: {item.quantity}</span>
                                                    <div className="text-right">
                                                        <span className="text-sm text-gray-500">{formatCurrency(item.price)} × {item.quantity}</span>
                                                        <p className="font-semibold text-gray-900">{formatCurrency(item.total)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Notes */}
                            {orderDetails.notes && (
                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">ملاحظات</h3>
                                    <p className="text-gray-600">{orderDetails.notes}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Main My Orders Page Component ---
function MyOrdersPage() {
    const [ordersData, setOrdersData] = useState<{ orders: Order[], pagination: PaginationInfo } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [token, setToken] = useState<string | null>(null);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const apiToken = localStorage.getItem('api_token');
        if (!apiToken) {
            window.location.href = '/login';
            return;
        }
        setToken(apiToken);
    }, []);

    useEffect(() => {
        if (token) {
            setLoading(true);
            api.getOrders(token, currentPage)
                .then(setOrdersData)
                .catch(err => setError(err.message))
                .finally(() => setLoading(false));
        }
    }, [token, currentPage]);

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= (ordersData?.pagination.last_page || 1)) {
            setCurrentPage(newPage);
        }
    };

    const handleViewDetails = (orderId: number) => {
        setSelectedOrderId(orderId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrderId(null);
    };

    if (loading && !ordersData) return <div className="flex justify-center items-center h-screen"><LoaderCircle className="animate-spin text-blue-600" size={48} /></div>;
    if (error) return <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">{error}</div>;
    if (!ordersData || ordersData.orders.length === 0) {
        return (
            <div className="text-center py-20">
                <Package size={64} className="mx-auto text-gray-300" />
                <h2 className="text-2xl font-bold text-gray-800 mt-4">لا توجد لديك طلبات بعد</h2>
                <a href="/shop" className="mt-6 inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">ابدأ التسوق الآن</a>
            </div>
        );
    }

    const { orders, pagination } = ordersData;

    return (
        <div className="space-y-6">
            {orders.map((order) => {
                const status = getStatusInfo(order.status);
                return (
                    <div key={order.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 pb-4 border-b">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">طلب رقم #{order.id}</h3>
                                <p className="text-sm text-gray-600">تاريخ الطلب: {formatDate(order.created_at)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${status.color}`}>
                                {status.icon} {status.text}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center sm:text-right">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">عدد المنتجات</p>
                                <p className="text-lg font-semibold text-gray-900">{order.items_count} منتج</p>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-1">إجمالي المبلغ</p>
                                <p className="text-lg font-semibold text-gray-900">{formatCurrency(order.total)}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => handleViewDetails(order.id)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold flex items-center gap-2"
                            >
                                <Eye size={16} />
                                عرض التفاصيل
                            </button>
                        </div>
                    </div>
                );
            })}
             <div className="flex items-center justify-between mt-8">
                 <p className="text-sm text-gray-600">عرض {orders.length} من {pagination.total} طلب</p>
                 <div className="flex items-center gap-2">
                     <button onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="p-2 border rounded-lg disabled:opacity-50"><ChevronRight size={18}/></button>
                     <button onClick={() => handlePageChange(pagination.current_page + 1)} disabled={pagination.current_page === pagination.last_page} className="p-2 border rounded-lg disabled:opacity-50"><ChevronLeft size={18}/></button>
                 </div>
             </div>

            {/* Order Details Modal */}
            {token && (
                <OrderDetailsModal 
                    orderId={selectedOrderId}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    token={token}
                />
            )}
        </div>
    );
}

// --- Entry Point ---
export default function MyOrdersPageLoader() {
    return (
        <AppProviders>
             <div className="bg-gray-50 min-h-screen">
                 <div className="container mx-auto px-4 sm:px-6 py-12" dir="rtl">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">طلباتي</h1>
                        <p className="text-md text-gray-600 mt-1">تتبع وإدارة جميع طلباتك السابقة.</p>
                    </div>
                    <MyOrdersPage />
                </div>
            </div>
        </AppProviders>
    );
}

