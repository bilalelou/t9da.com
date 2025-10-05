'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    Download, 
    Upload, 
    CheckCircle, 
    Clock, 
    XCircle,
    FileText,
    Building2,
    CreditCard,
    AlertCircle,
    Package
} from 'lucide-react';
import Link from 'next/link';

interface Invoice {
    id: number;
    invoice_code: string;
    order_id: number;
    amount: number;
    bank_name: string;
    account_number: string;
    status: 'pending' | 'paid' | 'rejected';
    payment_proof: string | null;
    payment_proof_url: string | null;
    admin_notes: string | null;
    created_at: string;
    can_upload_proof: boolean;
    is_paid: boolean;
    is_rejected: boolean;
    order?: {
        order_number: string;
        user: {
            name: string;
            email: string;
        };
        order_items: Array<{
            product_name: string;
            quantity: number;
            price: number;
        }>;
    };
}

export default function InvoicePage() {
    const params = useParams();
    const router = useRouter();
    const invoiceId = params?.id as string;
    
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [uploadingProof, setUploadingProof] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        if (invoiceId) {
            fetchInvoice();
        }
    }, [invoiceId]);

    const fetchInvoice = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`);
            
            if (!response.ok) {
                throw new Error('فشل في جلب الفاتورة');
            }

            const result = await response.json();
            
            if (result.success) {
                setInvoice(result.invoice);
            } else {
                throw new Error(result.message || 'فشل في جلب الفاتورة');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ ما');
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
            setUploadError('يرجى رفع صورة فقط (JPG, PNG, etc.)');
            return;
        }

        // التحقق من حجم الملف (2MB max)
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('حجم الملف يجب أن يكون أقل من 2 ميجابايت');
            return;
        }

        try {
            setUploadingProof(true);
            setUploadError(null);
            setUploadSuccess(false);

            const token = localStorage.getItem('api_token');
            if (!token) {
                throw new Error('يجب تسجيل الدخول أولاً');
            }

            const formData = new FormData();
            formData.append('payment_proof', file);

            const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/upload-proof`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setUploadSuccess(true);
                // تحديث الفاتورة
                fetchInvoice();
                setTimeout(() => setUploadSuccess(false), 3000);
            } else {
                throw new Error(result.message || 'فشل في رفع الملف');
            }
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'حدث خطأ في رفع الملف');
        } finally {
            setUploadingProof(false);
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

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending':
                return {
                    text: 'في انتظار الدفع',
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                    icon: <Clock className="w-5 h-5" />
                };
            case 'paid':
                return {
                    text: 'تم الدفع',
                    color: 'bg-green-100 text-green-800 border-green-300',
                    icon: <CheckCircle className="w-5 h-5" />
                };
            case 'rejected':
                return {
                    text: 'مرفوض',
                    color: 'bg-red-100 text-red-800 border-red-300',
                    icon: <XCircle className="w-5 h-5" />
                };
            default:
                return {
                    text: status,
                    color: 'bg-gray-100 text-gray-800 border-gray-300',
                    icon: <FileText className="w-5 h-5" />
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">جاري تحميل الفاتورة...</p>
                </div>
            </div>
        );
    }

    if (error || !invoice) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">خطأ</h2>
                    <p className="text-gray-600 mb-6">{error || 'الفاتورة غير موجودة'}</p>
                    <Link href="/user-dashboard/orders" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        العودة للطلبات
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(invoice.status);

    return (
        <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Link 
                        href="/user-dashboard/orders"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        العودة للطلبات
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900">فاتورة الدفع</h1>
                </div>

                {/* Success Message */}
                {uploadSuccess && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800">تم رفع إثبات الدفع بنجاح!</span>
                    </div>
                )}

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Invoice Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">فاتورة رقم</h2>
                                <p className="text-blue-100">{invoice.invoice_code}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-lg border-2 flex items-center gap-2 ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span className="font-semibold">{statusInfo.text}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-blue-100">
                            <Package className="w-4 h-4" />
                            <span className="text-sm">طلب رقم: {invoice.order?.order_number || invoice.order_id}</span>
                        </div>
                    </div>

                    {/* Invoice Details */}
                    <div className="p-6 space-y-6">
                        {/* Amount */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-700 text-lg">المبلغ المطلوب</span>
                                <span className="text-3xl font-bold text-blue-600">{formatCurrency(invoice.amount)}</span>
                            </div>
                        </div>

                        {/* Bank Details */}
                        <div className="border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-blue-600" />
                                معلومات التحويل البنكي
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">اسم البنك</span>
                                    <span className="font-semibold text-gray-900">{invoice.bank_name}</span>
                                </div>
                                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="text-gray-600">رقم الحساب</span>
                                    <div className="text-left">
                                        <span className="font-mono font-semibold text-gray-900 text-lg">
                                            {invoice.account_number}
                                        </span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(invoice.account_number);
                                                alert('تم نسخ رقم الحساب!');
                                            }}
                                            className="block mt-2 text-sm text-blue-600 hover:text-blue-700"
                                        >
                                            نسخ رقم الحساب
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upload Payment Proof */}
                        {invoice.can_upload_proof && (
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Upload className="w-6 h-6 text-blue-600" />
                                    رفع إثبات الدفع
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    بعد إتمام التحويل البنكي، يرجى رفع صورة من إيصال الدفع أو لقطة شاشة للتحويل.
                                </p>
                                
                                {uploadError && (
                                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-800">
                                        <AlertCircle className="w-5 h-5" />
                                        <span>{uploadError}</span>
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                        disabled={uploadingProof}
                                        className="hidden"
                                        id="payment-proof-upload"
                                    />
                                    <label
                                        htmlFor="payment-proof-upload"
                                        className={`flex items-center justify-center gap-2 w-full px-6 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${
                                            uploadingProof ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {uploadingProof ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                                <span className="text-gray-600">جاري الرفع...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-5 h-5 text-gray-600" />
                                                <span className="text-gray-600">اضغط لرفع صورة إثبات الدفع</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                                <p className="text-sm text-gray-500 mt-2">
                                    الحد الأقصى لحجم الملف: 2 ميجابايت. الصيغ المدعومة: JPG, PNG
                                </p>
                            </div>
                        )}

                        {/* Current Payment Proof */}
                        {invoice.payment_proof_url && (
                            <div className="border border-gray-200 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FileText className="w-6 h-6 text-blue-600" />
                                    إثبات الدفع المرفوع
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <img
                                        src={invoice.payment_proof_url}
                                        alt="إثبات الدفع"
                                        className="max-w-full h-auto rounded-lg shadow-md mx-auto"
                                        style={{ maxHeight: '400px' }}
                                    />
                                    <a
                                        href={invoice.payment_proof_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
                                    >
                                        <Download className="w-4 h-4" />
                                        تحميل الصورة
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Admin Notes */}
                        {invoice.admin_notes && (
                            <div className={`border rounded-lg p-6 ${
                                invoice.is_rejected ? 'border-red-200 bg-red-50' : 'border-gray-200'
                            }`}>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    ملاحظات الإدارة
                                </h3>
                                <p className={invoice.is_rejected ? 'text-red-700' : 'text-gray-600'}>
                                    {invoice.admin_notes}
                                </p>
                            </div>
                        )}

                        {/* Invoice Info */}
                        <div className="border-t pt-4 text-sm text-gray-500">
                            <p>تاريخ الإنشاء: {formatDate(invoice.created_at)}</p>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        تعليمات الدفع
                    </h3>
                    <ol className="list-decimal list-inside space-y-2 text-blue-800">
                        <li>قم بتحويل المبلغ المطلوب إلى الحساب البنكي المذكور أعلاه</li>
                        <li>احتفظ بإيصال الدفع أو التحويل</li>
                        <li>ارفع صورة واضحة من الإيصال في الخانة المخصصة</li>
                        <li>سيتم مراجعة الدفع وتأكيده خلال 24 ساعة</li>
                        <li>سيتم إشعارك بحالة الطلب عبر البريد الإلكتروني</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
