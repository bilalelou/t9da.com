'use client';

import React, { useState } from 'react';

// Icons
import { Phone, Mail, MapPin, Send, LoaderCircle, CheckCircle, Clock } from 'lucide-react';

// --- Interfaces ---
interface ContactForm {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    subject?: string;
    message?: string;
    general?: string;
}

// --- API Helper ---
const api = {
    sendMessage: async (formData: ContactForm) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {  
        method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (!response.ok) {
            throw { message: data.message, errors: data.errors };
        }
        return data;
    }
};


// --- Main Contact Page Component ---
export default function ContactPage() {
    const [formData, setFormData] = useState<ContactForm>({ name: '', email: '', phone: '', subject: '', message: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (field: keyof ContactForm, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            await api.sendMessage(formData);
            setIsSubmitted(true);
        } catch (err: any) {
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setErrors({ general: err.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.' });
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    // Success Screen
    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
                <div className="max-w-md mx-auto text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">تم إرسال رسالتك بنجاح!</h1>
                    <p className="text-gray-600 mb-8">شكراً لتواصلك معنا. سنقوم بالرد عليك خلال 24 ساعة.</p>
                    <div className="space-y-4">
                        <a href="/" className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">العودة للرئيسية</a>
                        <button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="block w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors">إرسال رسالة أخرى</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 sm:py-12" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">تواصل معنا</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">نحن هنا لمساعدتك. تواصل معنا وسنقوم بالرد عليك في أقرب وقت.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0"><Phone size={24} className="text-blue-600"/></div><div><h3 className="text-lg font-semibold text-gray-900 mb-1">الهاتف</h3><p className="text-gray-600"><a href="tel:+212522334455" className="hover:text-blue-700" dir="ltr">+212 5 22 33 44 55</a></p></div></div></div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0"><Mail size={24} className="text-green-600"/></div><div><h3 className="text-lg font-semibold text-gray-900 mb-1">البريد الإلكتروني</h3><p className="text-gray-600"><a href="mailto:contact@t9da.com" className="hover:text-blue-700">contact@t9da.com</a></p></div></div></div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0"><MapPin size={24} className="text-purple-600"/></div><div><h3 className="text-lg font-semibold text-gray-900 mb-1">العنوان</h3><p className="text-gray-600">شارع محمد الخامس، الدار البيضاء، المغرب</p></div></div></div>
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0"><Clock size={24} className="text-orange-600"/></div><div><h3 className="text-lg font-semibold text-gray-900 mb-1">ساعات العمل</h3><p className="text-gray-600 text-sm">الإثنين - الجمعة: 9 ص - 6 م</p></div></div></div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">أرسل لنا رسالة</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {errors.general && (<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">{errors.general}</div>)}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل *</label><input id="name" type="text" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} className={`w-full px-4 py-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`} placeholder="أحمد محمد"/>{errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}</div>
                                    <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني *</label><input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className={`w-full px-4 py-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`} placeholder="example@email.com"/>{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}</div>
                                </div>
                                <div><label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف *</label><input id="phone" type="tel" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} className={`w-full px-4 py-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-gray-300'}`} placeholder="0601234567"/>{errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}</div>
                                <div><label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">الموضوع *</label><input id="subject" type="text" value={formData.subject} onChange={(e) => handleInputChange('subject', e.target.value)} className={`w-full px-4 py-3 border rounded-lg ${errors.subject ? 'border-red-500' : 'border-gray-300'}`} placeholder="بخصوص طلب رقم..."/>{errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}</div>
                                <div><label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">الرسالة *</label><textarea id="message" rows={5} value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} className={`w-full px-4 py-3 border rounded-lg resize-none ${errors.message ? 'border-red-500' : 'border-gray-300'}`} placeholder="اكتب رسالتك هنا..."></textarea>{errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}</div>
                                <button type="submit" disabled={isLoading} className="w-full py-3 px-6 rounded-lg font-semibold transition-all bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400">
                                    {isLoading ? (<div className="flex items-center justify-center gap-2"><LoaderCircle className="animate-spin w-5 h-5" /><span>جاري الإرسال...</span></div>) : (<div className="flex items-center justify-center gap-2"><Send className="w-5 h-5"/><span>إرسال الرسالة</span></div>)}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

