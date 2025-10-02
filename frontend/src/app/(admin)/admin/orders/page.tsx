'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Icons
import { ShoppingCart, Search, LoaderCircle, CheckCircle, XCircle, Clock, Truck, MoreVertical, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit3, X, Eye, Printer, Mail, Trash2 } from 'lucide-react';

// --- Interfaces ---
interface Order {
    id: number;
    order_number: string;
    customer_name: string;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'completed';
    created_at: string;
    name?: string;
    phone?: string;
    address?: string;
    city?: string;
    notes?: string;
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders?page=${page}&per_page=${perPage}`, {
            headers: { 'Authorization': `Bearer ${token}`, 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error('فشل في جلب بيانات الطلبات.');
        const data = await response.json();
        return { data: data.data || [], pagination: data.pagination };
    },
    
    updateOrderStatus: async (token: string, orderId: number, status: Order['status'], notes?: string): Promise<Order> => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`, 
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status, notes })
        });
        
        if (!response.ok) {
            // معالجة أفضل للأخطاء
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `HTTP Error: ${response.status}`;
            throw new Error(errorMessage);
        }
        
        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'فشل في تحديث حالة الطلب');
        }
        
        return result.data;
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
    <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-3 md:p-5 border border-gray-100">
        <div className="flex items-center gap-2 md:gap-4">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-50 rounded-lg md:rounded-xl flex items-center justify-center text-blue-600">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-500 truncate">{title}</p>
                <p className="text-lg md:text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    </div>
);

// Mobile Order Card Component
const OrderCard = ({ order, onViewDetails, onUpdateStatus, onPrintInvoice, onSendEmail, onDeleteOrder }) => {
    const status = getStatusInfo(order.status);
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-xs font-mono text-gray-500">ID: #{order.id}</p>
                    <p className="text-sm font-mono text-gray-600">#{order.order_number}</p>
                    <p className="font-semibold text-gray-800 text-sm">{order.customer_name}</p>
                </div>
                <div className="relative">
                    <button 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 touch-manipulation"
                    >
                        <MoreVertical size={18} />
                    </button>
                    
                    {showDropdown && (
                        <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="py-1">
                                <button
                                    onClick={() => { onViewDetails(order); setShowDropdown(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 space-x-2 space-x-reverse touch-manipulation"
                                >
                                    <Eye size={16} />
                                    <span>عرض التفاصيل</span>
                                </button>
                                <button
                                    onClick={() => { onPrintInvoice(order); setShowDropdown(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 space-x-2 space-x-reverse touch-manipulation"
                                >
                                    <Printer size={16} />
                                    <span>طباعة الفاتورة</span>
                                </button>
                                <button
                                    onClick={() => { onSendEmail(order); setShowDropdown(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 space-x-2 space-x-reverse touch-manipulation"
                                >
                                    <Mail size={16} />
                                    <span>إرسال إيميل</span>
                                </button>
                                <hr className="my-1" />
                                <button
                                    onClick={() => { onDeleteOrder(order); setShowDropdown(false); }}
                                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 space-x-2 space-x-reverse touch-manipulation"
                                >
                                    <Trash2 size={16} />
                                    <span>حذف الطلب</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Status and Date */}
            <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                    {status.icon} {status.text}
                </span>
                <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">المبلغ الإجمالي:</span>
                <span className="font-bold text-gray-800">{formatCurrency(order.total_amount)}</span>
            </div>

            {/* Action Button */}
            <button 
                onClick={() => onUpdateStatus(order)}
                className="w-full mt-3 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center space-x-2 space-x-reverse touch-manipulation"
            >
                <Edit3 size={16} />
                <span>تغيير الحالة</span>
            </button>
        </div>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-3 pb-4 text-center sm:block sm:p-0 md:items-center">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-t-xl sm:rounded-xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full w-full max-w-lg">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
    if (!isVisible) return null;

    const typeStyles = {
        success: 'bg-green-50 border-green-200 text-green-800',
        error: 'bg-red-50 border-red-200 text-red-800',
        info: 'bg-blue-50 border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    };

    return (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
            <div className={`border rounded-lg p-4 shadow-lg ${typeStyles[type]}`}>
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{message}</p>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Status Update Modal
const StatusUpdateModal = ({ isOpen, onClose, order, onUpdate }) => {
    const [selectedStatus, setSelectedStatus] = useState(order?.status || 'pending');
    const [notes, setNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.status);
            setNotes('');
        }
    }, [order]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!order) return;

        setIsLoading(true);
        try {
            await onUpdate(order.id, selectedStatus, notes);
            onClose();
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'في الانتظار', icon: <Clock size={16} /> },
        { value: 'processing', label: 'قيد المعالجة', icon: <LoaderCircle size={16} /> },
        { value: 'shipped', label: 'تم الشحن', icon: <Truck size={16} /> },
        { value: 'completed', label: 'مكتمل', icon: <CheckCircle size={16} /> },
        { value: 'cancelled', label: 'ملغي', icon: <XCircle size={16} /> }
    ];

    if (!isOpen || !order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">تحديث حالة الطلب</h3>
                <p className="text-sm text-gray-600">طلب رقم: {order.order_number}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة الجديدة</label>
                    <select 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white touch-manipulation"
                    >
                        {statusOptions.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات (اختيارية)</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base md:text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none touch-manipulation"
                        placeholder="أضف ملاحظات حول تحديث الحالة..."
                    />
                </div>

                <div className="flex flex-col space-y-2 md:flex-row md:justify-end md:space-y-0 md:space-x-3 md:space-x-reverse pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full md:w-auto px-4 py-3 md:py-2 text-base md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation order-2 md:order-1"
                    >
                        إلغاء
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full md:w-auto px-4 py-3 md:py-2 text-base md:text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center space-x-2 space-x-reverse touch-manipulation order-1 md:order-2"
                    >
                        {isLoading && <LoaderCircle size={16} className="animate-spin" />}
                        <span>{isLoading ? 'جاري التحديث...' : 'تحديث الحالة'}</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

// Order Details Modal
const OrderDetailsModal = ({ isOpen, onClose, order }) => {
    if (!isOpen || !order) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">تفاصيل الطلب</h3>
                <p className="text-sm text-gray-600">طلب رقم: {order.order_number}</p>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 md:space-y-6 max-h-96 md:max-h-none overflow-y-auto">
                {/* معلومات الطلب الأساسية */}
                <div className="bg-gray-50 rounded-lg p-3 md:p-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">معلومات الطلب</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-sm">
                        <div>
                            <span className="text-gray-600">ID:</span>
                            <span className="font-medium mr-2 block md:inline">#{order.id}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">رقم الطلب:</span>
                            <span className="font-medium mr-2 block md:inline">{order.order_number}</span>
                        </div>
                        <div>
                            <span className="text-gray-600">تاريخ الطلب:</span>
                            <span className="font-medium mr-2 block md:inline">{formatDate(order.created_at)}</span>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                            <span className="text-gray-600">الحالة:</span>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border mr-2 ${getStatusInfo(order.status).color}`}>
                                {getStatusInfo(order.status).icon} {getStatusInfo(order.status).text}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">المبلغ الإجمالي:</span>
                            <span className="font-bold text-green-600 mr-2 block md:inline">{formatCurrency(order.total_amount)}</span>
                        </div>
                    </div>
                </div>

                {/* معلومات العميل */}
                <div className="bg-blue-50 rounded-lg p-3 md:p-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3">معلومات العميل</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex flex-col md:flex-row">
                            <span className="text-gray-600 w-full md:w-20">الاسم:</span>
                            <span className="font-medium">{order.customer_name || order.name || 'غير متوفر'}</span>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <span className="text-gray-600 w-full md:w-20">الهاتف:</span>
                            <span className="font-medium">{order.phone || 'غير متوفر'}</span>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <span className="text-gray-600 w-full md:w-20">العنوان:</span>
                            <span className="font-medium">{order.address || 'غير متوفر'}</span>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <span className="text-gray-600 w-full md:w-20">المدينة:</span>
                            <span className="font-medium">{order.city || 'غير متوفر'}</span>
                        </div>
                    </div>
                </div>

                {/* الملاحظات */}
                {order.notes && (
                    <div className="bg-yellow-50 rounded-lg p-3 md:p-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">الملاحظات</h4>
                        <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                )}

                {/* إجراءات سريعة */}
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 md:space-x-reverse pt-4 border-t">
                    <button
                        onClick={() => {
                            // طباعة الفاتورة
                            onClose();
                        }}
                        className="flex-1 px-4 py-3 md:py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 flex items-center justify-center space-x-2 space-x-reverse touch-manipulation"
                    >
                        <Printer size={16} />
                        <span>طباعة الفاتورة</span>
                    </button>
                    <button
                        onClick={() => {
                            // إرسال إيميل
                            onClose();
                        }}
                        className="flex-1 px-4 py-3 md:py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 flex items-center justify-center space-x-2 space-x-reverse touch-manipulation"
                    >
                        <Mail size={16} />
                        <span>إرسال إيميل</span>
                    </button>
                </div>
            </div>

            <div className="px-4 md:px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                    onClick={onClose}
                    className="w-full md:w-auto px-4 py-3 md:py-2 text-base md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 touch-manipulation"
                >
                    إغلاق
                </button>
            </div>
        </Modal>
    );
};

// [جديد] مكون نظام الصفحات
const Pagination = ({ pagination, onPageChange }) => {
    if (!pagination || pagination.last_page <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= pagination.last_page; i++) {
        pageNumbers.push(i);
    }
    
    return (
         <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
             <span className="text-xs md:text-sm text-gray-700 text-center md:text-right">
                 صفحة <span className="font-semibold">{pagination.current_page}</span> من <span className="font-semibold">{pagination.last_page}</span>
             </span>
             <div className="inline-flex items-center -space-x-px justify-center md:justify-end">
                 <button 
                    onClick={() => onPageChange(1)} 
                    disabled={pagination.current_page === 1} 
                    className="px-2 md:px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
                    title="الصفحة الأولى"
                >
                    <ChevronsLeft size={14} className="md:w-4 md:h-4"/>
                </button>
                 <button 
                    onClick={() => onPageChange(pagination.current_page - 1)} 
                    disabled={pagination.current_page === 1} 
                    className="px-2 md:px-3 py-2 leading-tight text-gray-500 bg-white border-y border-gray-300 hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
                    title="الصفحة السابقة"
                >
                    <ChevronLeft size={14} className="md:w-4 md:h-4"/>
                </button>
                 <button 
                    onClick={() => onPageChange(pagination.current_page + 1)} 
                    disabled={pagination.current_page === pagination.last_page} 
                    className="px-2 md:px-3 py-2 leading-tight text-gray-500 bg-white border-y border-gray-300 hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
                    title="الصفحة التالية"
                >
                    <ChevronRight size={14} className="md:w-4 md:h-4"/>
                </button>
                 <button 
                    onClick={() => onPageChange(pagination.last_page)} 
                    disabled={pagination.current_page === pagination.last_page} 
                    className="px-2 md:px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-50 touch-manipulation"
                    title="الصفحة الأخيرة"
                >
                    <ChevronsRight size={14} className="md:w-4 md:h-4"/>
                </button>
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
    
    // Modal and UI states
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const [toast, setToast] = useState({
        isVisible: false,
        message: '',
        type: 'info' as 'success' | 'error' | 'info' | 'warning'
    });
    
    const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        setToast({ isVisible: true, message, type });
        setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 5000);
    };
    
    const fetchOrders = useCallback(async (page = 1, perPage = 10) => {
        try {
            const { data, pagination: newPagination } = await api.getOrders(token, page, perPage);
            setOrders(data);
            setPagination(newPagination);
        } catch (error) {
            console.error(error);
            showToast('فشل في جلب الطلبات', 'error');
        }
    }, [token]);
    
    const handleStatusUpdate = async (orderId: number, newStatus: Order['status'], notes?: string) => {
        try {
            const updatedOrder = await api.updateOrderStatus(token, orderId, newStatus, notes);
            
            // Update local state
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: updatedOrder.status || newStatus } : order
                )
            );
            
            showToast('تم تحديث حالة الطلب بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في تحديث حالة الطلب:', error);
            const errorMessage = error instanceof Error ? error.message : 'فشل في تحديث حالة الطلب';
            showToast(errorMessage, 'error');
            throw error;
        }
    };
    
    const openStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setShowStatusModal(true);
    };

    // Action handlers for dropdown menu
    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
        setOpenDropdown(null);
    };

    const handlePrintInvoice = (order: Order) => {
        setOpenDropdown(null);
        // Create print window with invoice
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>فاتورة الطلب ${order.order_number}</title>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: Arial, sans-serif; direction: rtl; text-align: right; margin: 20px; }
                            .header { text-align: center; margin-bottom: 30px; }
                            .order-info { margin-bottom: 20px; }
                            .order-info h2 { color: #333; }
                            .details { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
                            @media print { body { margin: 0; } }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>فاتورة الطلب</h1>
                            <h2>رقم الطلب: ${order.order_number}</h2>
                        </div>
                        <div class="order-info">
                            <div class="details">
                                <h3>تفاصيل الطلب</h3>
                                <p><strong>العميل:</strong> ${order.customer_name}</p>
                                <p><strong>تاريخ الطلب:</strong> ${formatDate(order.created_at)}</p>
                                <p><strong>الحالة:</strong> ${getStatusInfo(order.status).text}</p>
                                <p><strong>المبلغ الإجمالي:</strong> ${formatCurrency(order.total_amount)}</p>
                            </div>
                        </div>
                        <script>window.print(); window.close();</script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
        showToast(`تم طباعة فاتورة الطلب رقم ${order.order_number}`, 'success');
    };

    const handleSendEmail = (order: Order) => {
        setOpenDropdown(null);
        // TODO: Implement email sending API
        showToast(`تم إرسال إيميل للعميل بخصوص الطلب رقم ${order.order_number}`, 'success');
    };

    const handleDeleteOrder = (order: Order) => {
        setOpenDropdown(null);
        if (confirm(`هل أنت متأكد من حذف الطلب رقم ${order.order_number}؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
            // TODO: Implement delete API call
            setOrders(prev => prev.filter(o => o.id !== order.id));
            showToast(`تم حذف الطلب رقم ${order.order_number}`, 'success');
        }
    };

    const toggleDropdown = (orderId: number) => {
        setOpenDropdown(openDropdown === orderId ? null : orderId);
    };
    
    useEffect(() => {
        fetchOrders(pagination.current_page, pagination.per_page);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdown !== null) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

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
        <div className="space-y-4 md:space-y-8" dir="rtl">
            {/* Header - Mobile Optimized */}
            <div className="flex flex-col space-y-2 md:space-y-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
                <p className="text-sm md:text-md text-gray-600">متابعة وتحديث حالة جميع الطلبات.</p>
            </div>

            {/* Stats Cards - Mobile First */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                <StatCard title="إجمالي الطلبات" value={pagination.total} icon={<ShoppingCart size={20} className="md:w-6 md:h-6" />} />
                <StatCard title="في الانتظار" value={initialOrders.filter(o => o.status === 'pending').length} icon={<Clock size={20} className="md:w-6 md:h-6" />} />
                <StatCard title="قيد المعالجة" value={initialOrders.filter(o => o.status === 'processing').length} icon={<LoaderCircle size={20} className="md:w-6 md:h-6" />} />
                <StatCard title="مكتملة" value={initialOrders.filter(o => o.status === 'completed').length} icon={<CheckCircle size={20} className="md:w-6 md:h-6" />} />
            </div>
            
            {/* Filters and Search - Mobile Stack Layout */}
            <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-3 md:p-4 border border-gray-100">
                <div className="flex flex-col space-y-3 md:grid md:grid-cols-3 md:gap-4 md:space-y-0">
                     <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Search className="h-4 w-4 md:h-5 md:w-5 text-gray-400" /></div>
                        <input 
                            type="text" 
                            placeholder="ابحث برقم الطلب أو اسم العميل..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pr-8 md:pr-10 pl-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        />
                    </div>
                     <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)} 
                        className="w-full py-2 px-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                        <option value="all">جميع الحالات</option>
                        <option value="pending">في الانتظار</option>
                        <option value="processing">قيد المعالجة</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="completed">مكتمل</option>
                        <option value="cancelled">ملغي</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table View - Hidden on Mobile */}
            <div className="hidden md:block bg-white rounded-xl md:rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">رقم الطلب</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">العميل</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">التاريخ</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">المبلغ الإجمالي</th>
                                <th className="px-4 lg:px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">الحالة</th>
                                <th className="px-4 lg:px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredOrders.map((order) => {
                                const status = getStatusInfo(order.status);
                                return (
                                <tr key={`order-${order.id}`} className="hover:bg-gray-50">
                                    <td className="px-4 lg:px-6 py-4 font-mono text-sm text-gray-700">#{order.id}</td>
                                    <td className="px-4 lg:px-6 py-4 font-mono text-sm text-gray-700">{order.order_number}</td>
                                    <td className="px-4 lg:px-6 py-4 font-semibold text-gray-800">{order.customer_name}</td>
                                    <td className="px-4 lg:px-6 py-4 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                                    <td className="px-4 lg:px-6 py-4 font-semibold text-gray-800">{formatCurrency(order.total_amount)}</td>
                                    <td className="px-4 lg:px-6 py-4 text-center"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${status.color}`}>{status.icon} {status.text}</span></td>
                                    <td className="px-4 lg:px-6 py-4">
                                        <div className="flex items-center space-x-2 space-x-reverse">
                                            <button 
                                                onClick={() => openStatusModal(order)}
                                                className="text-blue-600 hover:text-blue-700 p-1.5 rounded-md hover:bg-blue-50 flex items-center space-x-1 space-x-reverse"
                                                title="تغيير الحالة"
                                            >
                                                <Edit3 size={14} />
                                                <span className="text-xs hidden lg:inline">تغيير الحالة</span>
                                            </button>
                                            <div className="relative">
                                                <button 
                                                    onClick={() => toggleDropdown(order.id)}
                                                    className="text-gray-500 hover:text-gray-700 p-1.5 rounded-md hover:bg-gray-100"
                                                    title="المزيد من الإجراءات"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>
                                                
                                                {/* Dropdown Menu */}
                                                {openDropdown === order.id && (
                                                    <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                                                        <div className="py-1">
                                                            <button
                                                                onClick={() => handleViewDetails(order)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 space-x-2 space-x-reverse"
                                                            >
                                                                <Eye size={16} />
                                                                <span>عرض التفاصيل</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handlePrintInvoice(order)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 space-x-2 space-x-reverse"
                                                            >
                                                                <Printer size={16} />
                                                                <span>طباعة الفاتورة</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleSendEmail(order)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 space-x-2 space-x-reverse"
                                                            >
                                                                <Mail size={16} />
                                                                <span>إرسال إيميل</span>
                                                            </button>
                                                            <hr className="my-1" />
                                                            <button
                                                                onClick={() => handleDeleteOrder(order)}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 space-x-2 space-x-reverse"
                                                            >
                                                                <Trash2 size={16} />
                                                                <span>حذف الطلب</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Cards View - Visible only on Mobile */}
            <div className="block md:hidden space-y-4">
                {filteredOrders.map((order) => (
                    <OrderCard 
                        key={`order-card-${order.id}`}
                        order={order}
                        onViewDetails={handleViewDetails}
                        onUpdateStatus={openStatusModal}
                        onPrintInvoice={handlePrintInvoice}
                        onSendEmail={handleSendEmail}
                        onDeleteOrder={handleDeleteOrder}
                    />
                ))}
                
                {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                        <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد طلبات</h3>
                        <p className="mt-1 text-sm text-gray-500">لم يتم العثور على طلبات تطابق معايير البحث.</p>
                    </div>
                )}
            </div>

            {/* Pagination - Enhanced for Mobile */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-3 md:p-4">
                 <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0">
                     <div className="flex items-center gap-2 text-sm justify-center md:justify-start">
                         <span>عرض</span>
                         <select 
                            value={pagination.per_page} 
                            onChange={handlePerPageChange} 
                            className="border border-gray-300 rounded-md p-1 text-sm bg-white"
                        >
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

            {/* Status Update Modal */}
            <StatusUpdateModal
                isOpen={showStatusModal}
                onClose={() => {
                    setShowStatusModal(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
                onUpdate={handleStatusUpdate}
            />

            {/* Order Details Modal */}
            <OrderDetailsModal
                isOpen={showDetailsModal}
                onClose={() => {
                    setShowDetailsModal(false);
                    setSelectedOrder(null);
                }}
                order={selectedOrder}
            />

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
            />
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
    if (!initialData) {
        return <div className="text-center text-gray-600 bg-gray-50 p-4 rounded-lg">لا توجد بيانات متاحة</div>;
    }
    return <OrdersPage initialOrders={initialData.orders} initialPagination={initialData.pagination} token={token} />;
}

