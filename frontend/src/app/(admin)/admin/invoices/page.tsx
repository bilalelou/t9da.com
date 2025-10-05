'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    FileText, 
    Eye, 
    CheckCircle, 
    Clock, 
    XCircle, 
    Search,
    Filter,
    Download,
    Loader2,
    AlertCircle,
    Building2,
    User,
    Calendar,
    DollarSign
} from 'lucide-react';

interface Invoice {
    id: number;
    invoice_code: string;
    payment_reference?: string;
    order_id: number;
    amount: number;
    bank_name: string;
    account_number: string;
    status: 'pending' | 'paid' | 'rejected';
    payment_proof: string | null;
    payment_proof_url: string | null;
    admin_notes: string | null;
    created_at: string;
    order?: {
        order_number: string;
        user: {
            name: string;
            email: string;
        };
    };
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid' | 'rejected'>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        fetchInvoices();
    }, [statusFilter]);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('api_token');
            
            const url = statusFilter === 'all' 
                ? `${API_BASE_URL}/admin/invoices`
                : `${API_BASE_URL}/admin/invoices?status=${statusFilter}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('فشل في جلب الفواتير');
            }

            const result = await response.json();
            
            if (result.success) {
                setInvoices(result.invoices.data || result.invoices);
            } else {
                throw new Error(result.message || 'فشل في جلب الفواتير');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ ما');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (invoiceId: number, newStatus: 'paid' | 'rejected', notes?: string) => {
        try {
            const token = localStorage.getItem('api_token');
            
            const response = await fetch(`${API_BASE_URL}/admin/invoices/${invoiceId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    status: newStatus,
                    admin_notes: notes
                })
            });

            if (!response.ok) {
                throw new Error('فشل في تحديث حالة الفاتورة');
            }

            fetchInvoices();
            setShowDetailsModal(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'حدث خطأ ما');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ar-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-MA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                        <Clock className="w-3 h-3" />
                        في انتظار الدفع
                    </span>
                );
            case 'paid':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                        <CheckCircle className="w-3 h-3" />
                        تم الدفع
                    </span>
                );
            case 'rejected':
                return (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 w-fit">
                        <XCircle className="w-3 h-3" />
                        مرفوض
                    </span>
                );
            default:
                return null;
        }
    };

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = 
            invoice.invoice_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.order?.order_number?.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearch;
    });

    const stats = {
        total: invoices.length,
        pending: invoices.filter(i => i.status === 'pending').length,
        paid: invoices.filter(i => i.status === 'paid').length,
        rejected: invoices.filter(i => i.status === 'rejected').length,
        totalAmount: invoices.reduce((sum, i) => sum + i.amount, 0),
        paidAmount: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0)
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchInvoices}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        إعادة المحاولة
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة الفواتير</h1>
                <p className="text-gray-600">إدارة ومتابعة جميع فواتير التحويل البنكي</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">إجمالي الفواتير</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">في الانتظار</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">تم الدفع</p>
                            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">المبلغ المدفوع</p>
                            <p className="text-lg font-bold text-green-600">{formatCurrency(stats.paidAmount)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="ابحث برقم الفاتورة، رمز الدفع، أو رقم الطلب..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            الكل
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === 'pending'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            في الانتظار
                        </button>
                        <button
                            onClick={() => setStatusFilter('paid')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === 'paid'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            مدفوع
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                statusFilter === 'rejected'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            مرفوض
                        </button>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم الفاتورة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رمز الدفع
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    رقم الطلب
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    المبلغ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    الحالة
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    التاريخ
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    إجراءات
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredInvoices.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">لا توجد فواتير</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {invoice.invoice_code}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {invoice.payment_reference ? (
                                                <div className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
                                                    {invoice.payment_reference}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {invoice.order?.order_number || `#${invoice.order_id}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(invoice.amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(invoice.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-600">
                                                {formatDate(invoice.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                href={`/invoice/${invoice.id}`}
                                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                <Eye className="w-4 h-4" />
                                                عرض
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
