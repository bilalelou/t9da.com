"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, LogIn, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import ErrorAlert from '@/components/ui/ErrorAlert';
import { parseLoginError, getErrorSuggestions, LoginError } from '@/utils/loginErrorMessages';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<LoginError | null>(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!email || !password) {
            let errorMessage = '';
            let errorType: 'email' | 'password' | 'general' = 'general';
            
            if (!email && !password) {
                errorMessage = 'الرجاء إدخال البريد الإلكتروني وكلمة المرور.';
            } else if (!email) {
                errorMessage = 'الرجاء إدخال البريد الإلكتروني.';
                errorType = 'email';
            } else {
                errorMessage = 'الرجاء إدخال كلمة المرور.';
                errorType = 'password';
            }
            
            setError({
                type: 'validation_error',
                message: errorMessage,
                suggestion: 'تأكد من ملء جميع الحقول المطلوبة',
                field: errorType
            });
            setLoading(false);
            return;
        }
        
        // التحقق من صحة البريد الإلكتروني
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError({
                type: 'validation_error',
                message: 'الرجاء إدخال بريد إلكتروني صحيح.',
                suggestion: 'تأكد من كتابة البريد الإلكتروني بالشكل الصحيح (example@domain.com)',
                field: 'email'
            });
            setLoading(false);
            return;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

        try {
            const response = await fetch(`${apiBaseUrl}/login`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    "Accept": "application/json" 
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem('api_token', data.token);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                
                if (data.user && data.user.role) {
                    const userRole = data.user.role;

                    let destination = '/'; 
                    switch (userRole) {
                        case 'admin':
                            destination = '/admin';
                            break;
                        case 'user':
                        case 'customer':
                            destination = '/user-dashboard';
                            break;
                        default:
                            destination = '/';
                            break;
                    }
                    window.location.href = destination;
                } else {
                    window.location.href = '/user-dashboard';
                }

            } else {
                // معالجة الأخطاء باستخدام النظام المحسن
                const loginError = parseLoginError(data);
                setError(loginError);
            }
        } catch (err) {
            console.error('Connection error:', err);
            setError({
                type: 'connection_error',
                message: 'حدث خطأ في الاتصال بالخادم',
                suggestion: 'تحقق من اتصال الإنترنت والمحاولة مرة أخرى',
                field: 'network'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 p-4">
            <div className="w-full max-w-md">
                {/* Logo Section */}
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
                    <div className="text-center">
                         <h1 className="text-2xl font-bold text-gray-800">مرحباً بعودتك!</h1>
                         <p className="mt-2 text-gray-600">
                             سجل الدخول للمتابعة إلى حسابك
                         </p>
                    </div>

                    {error && (
                        <ErrorAlert
                            message={error.message}
                            type={error.field as 'email' | 'password' | 'account' | 'network' | 'general'}
                            suggestions={getErrorSuggestions(error.type)}
                            onClose={() => setError(null)}
                        />
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
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
                                    className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-3 shadow-sm focus:border-[#eab676] focus:ring-[#eab676] transition"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div>
                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                كلمة المرور
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-10 shadow-sm focus:border-[#eab676] focus:ring-[#eab676] transition"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-[#1e81b0] focus:ring-[#eab676]"
                                />
                                <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
                                    تذكرني
                                </label>
                            </div>

                            <div className="text-sm">
                                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-800 transition">
                                    هل نسيت كلمة المرور؟
                                </Link>
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
                                        <LogIn size={20} />
                                        تسجيل الدخول
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                            ليس لديك حساب؟{' '}
                            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition">
                                إنشاء حساب جديد
                            </Link>
                        </p>
                    </div>
                </div>
                
                <p className="text-center text-sm text-gray-500 mt-6">
                    بتسجيل الدخول، أنت توافق على{' '}
                    <Link href="/terms" className="text-blue-600 hover:underline">
                        شروط الخدمة
                    </Link>
                    {' '}و{' '}
                    <Link href="/privacy" className="text-blue-600 hover:underline">
                        سياسة الخصوصية
                    </Link>
                </p>
            </div>
        </div>
    );
}

