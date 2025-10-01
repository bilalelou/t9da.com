'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Icons
import { Mail, Lock, User, LogIn, LoaderCircle, Phone, Eye, EyeOff } from 'lucide-react';

// --- API Helper ---
const api = {
    register: async (name: string, email: string, phone: string, password: string, password_confirmation: string) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {   
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password, password_confirmation }),
        });

        const data = await response.json();
        if (!response.ok) {
            throw { message: data.message, errors: data.errors };
        }
        return data;
    }
};

// --- Main Register Page Component ---
export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        setLoading(true);

        const fullName = name; 

        try {
            await api.register(fullName, email, phone, password, passwordConfirmation);
            setSuccess(true);
        } catch (err: unknown) {
             if (err && typeof err === 'object' && 'errors' in err) {
                setValidationErrors((err as { errors: Record<string, string[]> }).errors);
                setError('الرجاء مراجعة الأخطاء في النموذج.');
            } else {
                setError((err as { message?: string }).message || 'فشل في إنشاء الحساب.');
            }
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
                   
                    {success ? (
                        <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                            <div className="flex justify-center mb-4">
                                <div className="bg-green-100 p-3 rounded-full">
                                    <LogIn size={32} className="text-green-600" />
                                </div>
                            </div>
                            <h1 className="text-xl font-bold text-green-800">تم إنشاء الحساب بنجاح!</h1>
                            <p className="mt-2 text-gray-600">
                                يمكنك الآن <Link href="/login" className="font-bold text-blue-600 hover:underline">تسجيل الدخول</Link>.
                            </p>
                        </div>
                    ) : (
                        <>
                         <div className="text-center">
                             <h1 className="text-2xl font-bold text-gray-800">إنشاء حساب جديد</h1>
                             <p className="mt-2 text-gray-600">
                                 انضم إلينا اليوم وابدأ التسوق
                             </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-700 text-sm p-4 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><User className="h-5 w-5 text-gray-400" /></div>
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="اسمك الكامل" />
                                </div>
                                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني <span className="text-gray-500 text-xs">(اختياري)</span></label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Mail className="h-5 w-5 text-gray-400" /></div>
                                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="your@email.com" />
                                </div>
                                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>}
                            </div>

                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Phone className="h-5 w-5 text-gray-400" /></div>
                                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="0600000000" />
                                </div>
                                {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone[0]}</p>}
                            </div>

                            <div>
                                 <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Lock className="h-5 w-5 text-gray-400" /></div>
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                                {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password[0]}</p>}
                            </div>

                            <div>
                                 <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Lock className="h-5 w-5 text-gray-400" /></div>
                                    <input id="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required className="w-full rounded-lg border border-gray-300 py-3 pr-10 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" placeholder="••••••••" />
                                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-3 px-4 font-semibold text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {loading ? <LoaderCircle className="animate-spin" size={20} /> : <><LogIn size={20} />إنشاء حساب</>}
                                </button>
                            </div>
                        </form>

                        <div className="text-center pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600">
                                لديك حساب بالفعل؟{' '}
                                <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition">
                                    تسجيل الدخول
                                </Link>
                            </p>
                        </div>
                        </>
                    )}
                </div>
                
                <p className="text-center text-sm text-gray-500 mt-6">
                    بإنشاء حساب، أنت توافق على{' '}
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
