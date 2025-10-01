"use client";

import React from 'react';
import { Package, RefreshCw, Clock, CheckCircle, AlertCircle, Truck, Shield } from 'lucide-react';

export default function ReturnsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
                            <RefreshCw size={40} className="text-white" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                            سياسة الإرجاع والاستبدال
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
                            نحن نضمن رضاك التام عن مشترياتك مع خيارات مرنة للإرجاع والاستبدال
                        </p>
                    </div>
                </div>
            </section>

            {/* Return Process Steps */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            كيفية إرجاع المنتجات
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            اتبع هذه الخطوات البسيطة لإرجاع منتجاتك بسهولة
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            {
                                step: "1",
                                icon: <Package size={32} />,
                                title: "تقديم طلب الإرجاع",
                                description: "قم بتعبئة نموذج طلب الإرجاع عبر الموقع أو تواصل معنا"
                            },
                            {
                                step: "2", 
                                icon: <CheckCircle size={32} />,
                                title: "موافقة الطلب",
                                description: "سنراجع طلبك ونرسل لك تأكيد الموافقة خلال 24 ساعة"
                            },
                            {
                                step: "3",
                                icon: <Truck size={32} />,
                                title: "إرسال المنتج",
                                description: "احزم المنتج بعناية وأرسله للعنوان المحدد"
                            },
                            {
                                step: "4",
                                icon: <RefreshCw size={32} />,
                                title: "استلام المبلغ",
                                description: "بعد فحص المنتج، سنقوم بإرجاع المبلغ خلال 3-5 أيام عمل"
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative">
                                <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 hover:shadow-lg text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full mb-6 font-bold text-xl">
                                        {item.step}
                                    </div>
                                    <div className="text-blue-600 mb-4 flex justify-center">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-1/2 -left-4 transform -translate-y-1/2 w-8 h-0.5 bg-blue-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Return Policy Details */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                شروط الإرجاع والاستبدال
                            </h2>
                            
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: <Clock size={24} />,
                                        title: "مدة الإرجاع",
                                        content: "يمكنك إرجاع المنتجات خلال 30 يوماً من تاريخ الاستلام"
                                    },
                                    {
                                        icon: <Package size={24} />,
                                        title: "حالة المنتج",
                                        content: "يجب أن يكون المنتج في حالته الأصلية مع التغليف والملصقات"
                                    },
                                    {
                                        icon: <Shield size={24} />,
                                        title: "الضمان",
                                        content: "نضمن استلام منتجاتك بحالة ممتازة أو استرداد كامل للمبلغ"
                                    }
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4 p-6 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg flex items-center justify-center">
                                                {item.icon}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600">
                                                {item.content}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border-2 border-yellow-200">
                            <div className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full mb-6">
                                    <AlertCircle size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    هل تحتاج مساعدة؟
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    فريق خدمة العملاء جاهز لمساعدتك في أي استفسار حول الإرجاع والاستبدال
                                </p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-center gap-2 text-gray-700">
                                        <span className="font-semibold">WhatsApp:</span>
                                        <span>+212 123 456 789</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-gray-700">
                                        <span className="font-semibold">البريد الإلكتروني:</span>
                                        <span>returns@t9da.com</span>
                                    </div>
                                </div>
                                <button className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    تواصل معنا
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                            الأسئلة الشائعة
                        </h2>
                        <p className="text-lg text-gray-600">
                            إجابات على أكثر الأسئلة شيوعاً حول الإرجاع والاستبدال
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "كم من الوقت يستغرق إرجاع المبلغ؟",
                                answer: "بعد استلام وفحص المنتج المرتجع، سنقوم بإرجاع المبلغ خلال 3-5 أيام عمل إلى نفس طريقة الدفع المستخدمة."
                            },
                            {
                                question: "هل يمكنني إرجاع المنتج إذا استخدمته؟",
                                answer: "يمكنك إرجاع المنتج حتى لو جربته، لكن يجب أن يكون في حالة جيدة ومع جميع المواد المرفقة والتغليف الأصلي."
                            },
                            {
                                question: "من يتحمل تكلفة الشحن للإرجاع؟",
                                answer: "إذا كان المنتج معيباً أو مختلفاً عن الوصف، فنحن نتحمل تكلفة الشحن. في الحالات الأخرى، يتحمل العميل التكلفة."
                            },
                            {
                                question: "هل يمكنني استبدال المنتج بآخر؟",
                                answer: "نعم، يمكنك استبدال المنتج بمنتج آخر من نفس القيمة أو دفع الفرق إذا كان المنتج الجديد أغلى."
                            }
                        ].map((item, index) => (
                            <div key={index} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <button className="w-full p-6 text-right bg-white hover:bg-gray-50 transition-colors border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        {item.question}
                                    </h3>
                                </button>
                                <div className="p-6 bg-gray-50">
                                    <p className="text-gray-600 leading-relaxed">
                                        {item.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}