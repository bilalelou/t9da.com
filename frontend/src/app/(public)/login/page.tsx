"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, LogIn, Eye, EyeOff, LoaderCircle, Building } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('الرجاء إدخال البريد الإلكتروني وكلمة المرور.');
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
                const errorMessage = data.message || "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Connection error:', err);
            setError("حدث خطأ في الاتصال بالخادم. يرجى التأكد من تشغيله.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <a href="#" className="inline-flex items-center gap-2 text-4xl font-bold text-[#eab676] tracking-wider">
                        <Building size={36}/>
                        <span>متجري</span>
                    </a>
                </div>
                
                <div className="bg-white p-8 shadow-2xl rounded-2xl space-y-6 transition-all duration-500 hover:shadow-3xl">
                    <div className="text-center">
                         <h1 className="text-2xl font-bold text-[#1e81b0]">مرحباً بعودتك!</h1>
                         <p className="mt-1 text-gray-500">
                             سجل الدخول للمتابعة إلى حسابك.
                         </p>
                    </div>

                    {error && (
                        <div className="text-center bg-red-100 text-red-700 text-sm p-3 rounded-lg border border-red-200 animate-shake">
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
                                <Link href="/forgot-password" className="font-medium text-[#1e81b0] hover:text-[#eab676]">
                                    هل نسيت كلمة المرور؟
                                </Link>
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
                                        <LogIn className="ml-2 h-5 w-5" />
                                        تسجيل الدخول
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
                
                 <p className="mt-8 text-center text-sm text-gray-600">
                    ليس لديك حساب؟{' '}
                    <Link href="/register" className="font-medium text-[#1e81b0] hover:text-[#eab676]">
                        أنشئ حساباً جديداً
                    </Link>
                </p>
            </div>
        </div>
    );
}

