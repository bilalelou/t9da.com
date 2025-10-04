"use client";

import React, { useState, useContext } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/contexts/Providers';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showToast('تم إرسال رسالتك بنجاح! سنتواصل معك في أقرب وقت ممكن.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
        setSubmitting(false);
    };

    const contactInfo = [
        {
            icon: <MapPin size={24} />,
            title: "العنوان",
            content: "شارع محمد الخامس، الدار البيضاء، المغرب"
        },
        {
            icon: <Phone size={24} />,
            title: "الهاتف",
            content: "+212 123 456 789"
        },
        {
            icon: <Mail size={24} />,
            title: "البريد الإلكتروني",
            content: "info@t9da.com"
        },
        {
            icon: <Clock size={24} />,
            title: "ساعات العمل",
            content: "الاثنين - السبت: 9:00 - 18:00"
        }
    ];

    const contactMethods = [
        {
            icon: <MessageCircle size={28} />,
            title: "الدردشة المباشرة",
            description: "تحدث معنا فوراً عبر الدردشة المباشرة",
            action: "ابدأ المحادثة",
            available: "متاح الآن"
        },
        {
            icon: <Phone size={28} />,
            title: "المكالمة الهاتفية",
            description: "اتصل بنا مباشرة للحصول على مساعدة فورية",
            action: "اتصل الآن",
            available: "9:00 - 18:00"
        },
        {
            icon: <Mail size={28} />,
            title: "البريد الإلكتروني",
            description: "أرسل لنا رسالة وسنرد عليك خلال 24 ساعة",
            action: "أرسل رسالة",
            available: "رد خلال 24 ساعة"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-50 to-white py-20 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="relative inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-8">
                            <MessageSquare size={40} className="text-white" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full"></div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            تواصل معنا
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed">
                            نحن هنا لمساعدتك في أي وقت. تواصل معنا عبر القنوات المختلفة
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 relative">
                            طرق التواصل
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        </span>
                        <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
                            كيف يمكنك التواصل معنا؟
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            اختر الطريقة الأنسب لك للتواصل مع فريق الدعم
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {contactMethods.map((method, index) => (
                            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-xl mb-6 transition-all duration-300">
                                    {method.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    {method.title}
                                </h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {method.description}
                                </p>
                                <div className="mb-6">
                                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-sm font-semibold rounded-full">
                                        {method.available}
                                    </span>
                                </div>
                                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 relative overflow-hidden group">
                                    <span className="relative z-10">{method.action}</span>
                                    <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form & Info */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Form */}
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 relative">
                                <div className="absolute top-4 left-4 w-4 h-4 bg-yellow-400 rounded-full opacity-20"></div>
                                <div className="absolute bottom-4 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-30"></div>
                                <h2 className="text-2xl font-bold mb-2">أرسل لنا رسالة</h2>
                                <p className="text-blue-100">سنتواصل معك في أقرب وقت ممكن</p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            الاسم الكامل *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder="أدخل اسمك الكامل"
                                            />
                                            <User size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            البريد الإلكتروني *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder="example@email.com"
                                            />
                                            <Mail size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            رقم الهاتف
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                                placeholder="+212 123 456 789"
                                            />
                                            <Phone size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            الموضوع *
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        >
                                            <option value="">اختر الموضوع</option>
                                            <option value="general">استفسار عام</option>
                                            <option value="support">دعم فني</option>
                                            <option value="order">استفسار عن طلب</option>
                                            <option value="complaint">شكوى</option>
                                            <option value="suggestion">اقتراح</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        الرسالة *
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                                        placeholder="اكتب رسالتك هنا..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    {submitting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            إرسال الرسالة
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div>
                                <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 relative">
                                    معلومات الاتصال
                                    <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                                </span>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                                    تواصل معنا مباشرة
                                </h2>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    يمكنك التواصل معنا عبر المعلومات التالية أو زيارتنا في مقرنا الرئيسي
                                </p>
                            </div>

                            <div className="space-y-6">
                                {contactInfo.map((info, index) => (
                                    <div key={index} className="bg-gray-50 p-6 rounded-xl hover:bg-blue-50 transition-colors duration-300 group relative">
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-600 text-blue-600 group-hover:text-white rounded-lg flex items-center justify-center transition-all duration-300 relative">
                                                {info.icon}
                                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {info.title}
                                                </h3>
                                                <p className="text-gray-600">
                                                    {info.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Map Placeholder */}
                            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin size={48} className="text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500 font-medium">خريطة الموقع</p>
                                    <p className="text-gray-400 text-sm">سيتم إضافة الخريطة التفاعلية قريباً</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 relative">
                            الأسئلة الشائعة
                            <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                        </span>
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                            أسئلة يتكرر طرحها
                        </h2>
                        <p className="text-lg text-gray-600">
                            إجابات سريعة على الأسئلة الأكثر شيوعاً
                        </p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                question: "كم يستغرق وقت التوصيل؟",
                                answer: "عادة ما يستغرق التوصيل من 2-5 أيام عمل حسب موقعك الجغرافي."
                            },
                            {
                                question: "هل يمكنني إرجاع المنتج؟",
                                answer: "نعم، يمكنك إرجاع المنتج خلال 14 يوماً من تاريخ الاستلام."
                            },
                            {
                                question: "ما هي طرق الدفع المتاحة؟",
                                answer: "نقبل الدفع عند الاستلام، البطاقات البنكية، والمحافظ الإلكترونية."
                            },
                            {
                                question: "كيف يمكنني تتبع طلبي؟",
                                answer: "ستحصل على رقم تتبع عبر الرسائل النصية والبريد الإلكتروني فور شحن طلبك."
                            }
                        ].map((faq, index) => (
                            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors duration-300 group relative">
                                <div className="absolute top-3 left-3 w-2 h-2 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    {faq.question}
                                </h3>
                                <p className="text-gray-600">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
