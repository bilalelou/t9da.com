'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Clock, Phone, Mail } from 'lucide-react';

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-gray-50" dir="rtl">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-green-50 border-b border-green-100 px-6 py-8 text-center">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-600 mb-4" />
                        <h1 className="text-3xl font-bold text-green-900 mb-2">تم إرسال طلبك بنجاح!</h1>
                        <p className="text-lg text-green-700">شكراً لك على ثقتك بنا. سنتواصل معك قريباً لتأكيد الطلب.</p>
                    </div>

                    {/* Order Details */}
                    <div className="px-6 py-8">
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">ماذا يحدث الآن؟</h2>
                            
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    <div className="mr-3">
                                        <h3 className="text-sm font-medium text-gray-900">مراجعة الطلب</h3>
                                        <p className="text-sm text-gray-500">سنراجع طلبك ونتأكد من توفر جميع المنتجات</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <Phone className="w-4 h-4 text-yellow-600" />
                                        </div>
                                    </div>
                                    <div className="mr-3">
                                        <h3 className="text-sm font-medium text-gray-900">تأكيد الطلب</h3>
                                        <p className="text-sm text-gray-500">سنتصل بك لتأكيد الطلب وتفاصيل الشحن</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                            <Package className="w-4 h-4 text-green-600" />
                                        </div>
                                    </div>
                                    <div className="mr-3">
                                        <h3 className="text-sm font-medium text-gray-900">تحضير وشحن الطلب</h3>
                                        <p className="text-sm text-gray-500">سنحضر طلبك ونرسله إليك في أسرع وقت ممكن</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Expected Timeline */}
                        <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <h3 className="text-lg font-medium text-blue-900 mb-2">المدة المتوقعة للتوصيل</h3>
                            <p className="text-blue-700">
                                <strong>2-5 أيام عمل</strong> للمدن الكبرى
                                <br />
                                <strong>3-7 أيام عمل</strong> للمناطق الأخرى
                            </p>
                        </div>

                        {/* Contact Info */}
                        <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 mb-3">تحتاج للمساعدة؟</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Phone className="w-5 h-5 text-gray-400 ml-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">اتصل بنا</p>
                                        <p className="text-sm text-gray-600">+212 6 12 34 56 78</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-5 h-5 text-gray-400 ml-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">راسلنا</p>
                                        <p className="text-sm text-gray-600">support@t9da.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link 
                                href="/products" 
                                className="flex-1 bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                متابعة التسوق
                            </Link>
                            <Link 
                                href="/" 
                                className="flex-1 border border-gray-300 text-gray-700 text-center px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                العودة للرئيسية
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        رقم مرجعي للطلب: <span className="font-mono text-gray-700">#{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}