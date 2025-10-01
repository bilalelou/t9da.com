"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowLeft, LoaderCircle, CheckCircle } from 'lucide-react';

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
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="relative h-14 w-14">
                            <Image 
                                src="/images/logo.png" 
                                alt="T9DA.COM Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-2xl text-gray-800 group-hover:text-blue-600 transition-colors">T9DA.COM</span>
                            <span className="text-sm text-gray-500">تسوق سعيد</span>
                        </div>
                    </Link>
                </div>
                
                <div className="bg-white p-8 shadow-xl rounded-2xl border border-gray-100 space-y-6">
                    
                    {sent ? (
                        <div className="text-center space-y-4 py-4">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-4 rounded-full">
                                    <CheckCircle className="h-16 w-16 text-green-600" />
                                </div>
                            </div>
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
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
                                >
                                    <ArrowLeft size={18} />
                                    العودة إلى تسجيل الدخول
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="text-center">
                                <h1 className="text-2xl font-bold text-gray-800">نسيت كلمة المرور؟</h1>
                                <p className="mt-2 text-gray-600">
                                    لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg border border-red-200">
                                    {error}
                                </div>
                            )}

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                                            className="block w-full rounded-lg border border-gray-300 pl-3 pr-10 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                                            placeholder="أدخل بريدك الإلكتروني"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-3 px-4 font-semibold text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <LoaderCircle className="animate-spin" size={20} />
                                        ) : (
                                            <>
                                                <Mail size={20} />
                                                إرسال رابط إعادة التعيين
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="text-center pt-4 border-t border-gray-100">
                                <Link 
                                    href="/login" 
                                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium transition"
                                >
                                    <ArrowLeft size={16} />
                                    العودة إلى تسجيل الدخول
                                </Link>
                            </div>
                        </>
                    )}
                </div>
                
                <p className="text-center text-sm text-gray-500 mt-6">
                    تذكرت كلمة المرور؟{' '}
                    <Link href="/login" className="text-blue-600 hover:underline font-medium">
                        تسجيل الدخول
                    </Link>
                </p>
            </div>
        </div>
    );
}