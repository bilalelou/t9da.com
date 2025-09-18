"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, LoaderCircle, Building, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email) {
            setError('الرجاء إدخال البريد الإلكتروني.');
            setLoading(false);
            return;
        }

        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('الرجاء إدخال بريد إلكتروني صحيح.');
            setLoading(false);
            return;
        }

        try {
            // محاكاة إرسال طلب إعادة تعيين كلمة المرور
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSent(true);
        } catch {
            setError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 text-4xl font-bold text-[#eab676] tracking-wider">
                        <Building size={36}/>
                        <span>متجري</span>
                    </Link>
                </div>
                
                <div className="bg-white p-8 shadow-2xl rounded-2xl space-y-6 transition-all duration-500 hover:shadow-3xl">
                    
                    {sent ? (
                        <div className="text-center space-y-4">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                            <h1 className="text-2xl font-bold text-green-700">تم إرسال الرابط!</h1>
                            <p className="text-gray-600">
                                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                            </p>
                            <p className="text-sm text-gray-500">
                                لم تستلم الرسالة؟ تحقق من مجلد الرسائل غير المرغوبة.
                            </p>
                            <div className="pt-4">
                                <Link 
                                    href="/login" 
                                    className="inline-flex items-center gap-2 text-[#1e81b0] hover:text-[#eab676] font-medium"
                                >
                                    <ArrowLeft size={18} />
                                    العودة إلى تسجيل الدخول
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-[#1e81b0]">نسيت كلمة المرور؟</h1>
                                <p className="mt-2 text-gray-600">
                                    لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
                                </p>
                            </div>

                            {error && (
                                <div className="text-center bg-red-100 text-red-700 text-sm p-3 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        البريد الإلكتروني
                                    </label>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-3 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-[#eab676] focus:outline-none focus:ring-[#eab676] sm:text-sm transition-all duration-300"
                                            placeholder="أدخل بريدك الإلكتروني"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full justify-center rounded-lg bg-[#2596be] hover:bg-[#1e81b0] py-3 px-4 font-semibold text-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#eab676] focus:ring-offset-2 transition-all duration-300 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            <>
                                                <Mail className="ml-2 h-5 w-5" />
                                                إرسال رابط إعادة التعيين
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center">
                                <Link 
                                    href="/login" 
                                    className="inline-flex items-center gap-2 text-sm text-[#1e81b0] hover:text-[#eab676] font-medium"
                                >
                                    <ArrowLeft size={16} />
                                    العودة إلى تسجيل الدخول
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}