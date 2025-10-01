"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, MessageCircle, Phone, Mail } from 'lucide-react';

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const faqData = [
        {
            category: "الطلبات والشراء",
            questions: [
                {
                    question: "كيف يمكنني تقديم طلب؟",
                    answer: "يمكنك تقديم طلب بسهولة من خلال إضافة المنتجات إلى السلة والذهاب إلى صفحة الدفع. ستحتاج لإنشاء حساب أو تسجيل الدخول أولاً."
                },
                {
                    question: "ما هي طرق الدفع المتاحة؟",
                    answer: "نقبل جميع بطاقات الائتمان الرئيسية، الدفع عند الاستلام، والتحويل البنكي. جميع المعاملات آمنة ومشفرة."
                },
                {
                    question: "هل يمكنني تعديل طلبي بعد تأكيده؟",
                    answer: "يمكنك تعديل طلبك خلال 30 دقيقة من تأكيده عبر التواصل مع خدمة العملاء أو من خلال حسابك الشخصي."
                },
                {
                    question: "كيف يمكنني تتبع طلبي؟",
                    answer: "ستتلقى رسالة تأكيد تحتوي على رقم التتبع. يمكنك أيضاً تتبع طلبك من خلال حسابك على الموقع في قسم 'طلباتي'."
                }
            ]
        },
        {
            category: "الشحن والتوصيل",
            questions: [
                {
                    question: "ما هي أوقات التوصيل؟",
                    answer: "نوصل من الاثنين إلى السبت من 9 صباحاً حتى 6 مساءً. يمكنك اختيار الوقت المناسب لك أثناء عملية الطلب."
                },
                {
                    question: "كم تكلفة الشحن؟",
                    answer: "الشحن مجاني للطلبات فوق 500 درهم داخل المدن الرئيسية. للمناطق الأخرى، تبدأ رسوم الشحن من 25 درهم."
                },
                {
                    question: "هل توصلون لجميع المدن؟",
                    answer: "نغطي جميع المدن المغربية الرئيسية والمناطق المحيطة بها. للتأكد من التوصيل لمنطقتك، يرجى إدخال الرمز البريدي أثناء الطلب."
                },
                {
                    question: "ماذا لو لم أكن متواجداً وقت التوصيل؟",
                    answer: "سيتصل بك المندوب قبل الوصول. في حالة عدم التواجد، سنعيد المحاولة في اليوم التالي أو يمكنك تحديد موعد جديد."
                }
            ]
        },
        {
            category: "الإرجاع والاستبدال",
            questions: [
                {
                    question: "ما هي مدة الإرجاع؟",
                    answer: "يمكنك إرجاع المنتجات خلال 30 يوماً من تاريخ الاستلام، شرط أن تكون في حالتها الأصلية مع التغليف."
                },
                {
                    question: "كيف أطلب إرجاع منتج؟",
                    answer: "ادخل على حسابك، اختر الطلب المراد إرجاعه، واختر 'طلب إرجاع'. أو تواصل مع خدمة العملاء مباشرة."
                },
                {
                    question: "متى سأحصل على استرداد المبلغ؟",
                    answer: "بعد استلام وفحص المنتج، سنقوم بإرجاع المبلغ خلال 3-5 أيام عمل إلى نفس طريقة الدفع المستخدمة."
                },
                {
                    question: "هل يمكنني استبدال المنتج بآخر؟",
                    answer: "نعم، يمكنك استبدال المنتج بآخر من نفس القيمة أو دفع الفرق إذا كان المنتج الجديد أغلى."
                }
            ]
        },
        {
            category: "الحساب والأمان",
            questions: [
                {
                    question: "كيف أنشئ حساباً جديداً؟",
                    answer: "اضغط على 'إنشاء حساب' في أعلى الصفحة وأدخل بياناتك. يمكنك أيضاً التسجيل باستخدام رقم الهاتف فقط."
                },
                {
                    question: "نسيت كلمة المرور، ماذا أفعل؟",
                    answer: "اضغط على 'نسيت كلمة المرور' في صفحة تسجيل الدخول وأدخل بريدك الإلكتروني. ستتلقى رابط إعادة تعيين كلمة المرور."
                },
                {
                    question: "هل بياناتي آمنة؟",
                    answer: "نعم، نستخدم أحدث تقنيات الحماية والتشفير لضمان أمان جميع بياناتك الشخصية والمالية."
                },
                {
                    question: "كيف أحدث بيانات حسابي؟",
                    answer: "ادخل على حسابك واذهب إلى 'إعدادات الحساب' حيث يمكنك تحديث جميع بياناتك الشخصية والعناوين."
                }
            ]
        }
    ];

    const toggleQuestion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const filteredFAQ = faqData.map(category => ({
        ...category,
        questions: category.questions.filter(
            item =>
                item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.questions.length > 0);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8">
                            <HelpCircle size={40} className="text-white" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            الأسئلة الشائعة
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            نجيب على جميع استفساراتك لتجربة تسوق أفضل
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto relative">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="ابحث عن سؤالك..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-4 pr-14 text-gray-900 bg-white rounded-xl border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-lg transition-all duration-300"
                                />
                                <Search size={24} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    {filteredFAQ.length > 0 ? (
                        <div className="space-y-8">
                            {filteredFAQ.map((category, categoryIndex) => (
                                <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 relative">
                                        <div className="absolute top-4 left-4 w-4 h-4 bg-yellow-400 rounded-full opacity-20"></div>
                                        <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-30"></div>
                                        <h2 className="text-2xl font-bold">{category.category}</h2>
                                    </div>
                                    
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {category.questions.map((item, questionIndex) => {
                                                const globalIndex = categoryIndex * 100 + questionIndex;
                                                const isOpen = openIndex === globalIndex;
                                                
                                                return (
                                                    <div key={questionIndex} className="border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors duration-300 group">
                                                        <button
                                                            onClick={() => toggleQuestion(globalIndex)}
                                                            className="w-full p-6 text-right bg-gray-50 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between relative"
                                                        >
                                                            <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            <h3 className="text-lg font-semibold text-gray-900 flex-1 text-right">
                                                                {item.question}
                                                            </h3>
                                                            <div className="mr-4 text-blue-600">
                                                                {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                                            </div>
                                                        </button>
                                                        
                                                        {isOpen && (
                                                            <div className="p-6 bg-white border-t border-gray-200">
                                                                <p className="text-gray-600 leading-relaxed text-right">
                                                                    {item.answer}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search size={40} className="text-gray-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">لم نجد نتائج</h3>
                            <p className="text-gray-600 mb-8">جرب البحث بكلمات مختلفة أو تصفح الأقسام أدناه</p>
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
                            >
                                عرض جميع الأسئلة
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Support Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 relative">
                            لم تجد إجابتك؟
                            <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            تواصل مع فريق الدعم
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            فريقنا جاهز لمساعدتك في أي وقت
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <MessageCircle size={28} />,
                                title: "الدردشة المباشرة",
                                description: "تحدث معنا فوراً",
                                action: "ابدأ المحادثة",
                                available: "متاح الآن"
                            },
                            {
                                icon: <Phone size={28} />,
                                title: "اتصل بنا",
                                description: "للمساعدة الفورية",
                                action: "اتصل الآن",
                                available: "9:00 - 18:00"
                            },
                            {
                                icon: <Mail size={28} />,
                                title: "أرسل رسالة",
                                description: "سنرد خلال 24 ساعة",
                                action: "أرسل رسالة",
                                available: "رد سريع"
                            }
                        ].map((method, index) => (
                            <div key={index} className="bg-gray-50 hover:bg-blue-50 p-8 rounded-2xl text-center transition-all duration-300 group relative">
                                <div className="absolute top-3 right-3 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-xl mb-6 transition-all duration-300">
                                    {method.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {method.title}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {method.description}
                                </p>
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
                                        {method.available}
                                    </span>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                                    {method.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Quick Tips Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-12">
                        <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 relative">
                            نصائح سريعة
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            نصائح لتجربة أفضل
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                title: "إنشاء حساب",
                                tip: "أنشئ حساباً لتتبع طلباتك وحفظ عناوينك المفضلة"
                            },
                            {
                                title: "قائمة الرغبات",
                                tip: "احفظ المنتجات المفضلة لديك لشرائها لاحقاً"
                            },
                            {
                                title: "التنبيهات",
                                tip: "فعّل التنبيهات لتصلك العروض والخصومات الحصرية"
                            },
                            {
                                title: "تقييم المنتجات",
                                tip: "اقرأ تقييمات العملاء لاتخاذ قرار شراء أفضل"
                            }
                        ].map((tip, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors duration-300 group relative">
                                <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {tip.title}
                                </h3>
                                <p className="text-gray-600">
                                    {tip.tip}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}