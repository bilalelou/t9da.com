'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Icons
import { Mail, Lock, User, LogIn, LoaderCircle, Building, Phone, Eye, EyeOff } from 'lucide-react';

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

    // --- Gemini API State ---
    const [welcomeEmail, setWelcomeEmail] = useState('');
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setValidationErrors({});
        setLoading(true);

        const fullName = name; 

        try {
            const data = await api.register(fullName, email, phone, password, passwordConfirmation);
            setSuccess(true);
        } catch (err: any) {
             if (err.errors) {
                setValidationErrors(err.errors);
                setError('الرجاء مراجعة الأخطاء في النموذج.');
            } else {
                setError(err.message || 'فشل في إنشاء الحساب.');
            }
        } finally {
            setLoading(false);
        }
    };

    // --- Gemini API Call ---
    const handleGenerateWelcomeEmail = async () => {
        if (!name || !email) {
            setError('الرجاء إدخال الاسم والبريد الإلكتروني أولاً.');
            return;
        }
        setIsGeneratingEmail(true);
        setError('');
        setWelcomeEmail('');

        const systemPrompt = `أنت مساعد ودود لمتجر إلكتروني اسمه 'متجري'. مهمتك هي كتابة رسائل ترحيبية للمستخدمين الجدد.`;
        const userQuery = `اكتب مسودة بريد إلكتروني ترحيبي قصير وشخصي باللغة العربية لمستخدم جديد اسمه "${name}". يجب أن يشكره البريد الإلكتروني على انضمامه، ويذكر اسم المتجر 'متجري'، ويسلط الضوء بإيجاز على مزايا إنشاء حساب (مثل العروض الحصرية أو إتمام الشراء بشكل أسرع). اجعل الرسالة موجزة وودية.`;

        const apiKey = ""; // Leave as-is for Canvas environment
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error('فشل في إنشاء البريد الإلكتروني. الرجاء المحاولة مرة أخرى.');
            }

            const result = await response.json();
            const candidate = result.candidates?.[0];

            if (candidate && candidate.content?.parts?.[0]?.text) {
                setWelcomeEmail(candidate.content.parts[0].text);
            } else {
                throw new Error('لم يتمكن الذكاء الاصطناعي من إنشاء رد.');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsGeneratingEmail(false);
        }
    };


    return (
        <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
            <div className="w-full max-w-md">
                 <div className="text-center mb-8">
                    <a href="/" className="inline-flex items-center gap-2 text-4xl font-bold text-[#eab676] tracking-wider">
                        <Building size={36}/>
                        <span>متجري</span>
                    </a>
                </div>
                
                <div className="bg-white p-8 shadow-2xl rounded-2xl space-y-6 transition-all duration-500 hover:shadow-3xl">
                   
                    {success ? (
                        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                            <h1 className="text-xl font-bold text-green-800">تم إنشاء الحساب بنجاح!</h1>
                            <p className="mt-2 text-gray-600">
                                يمكنك الآن <a href="/login" className="font-bold text-blue-600 hover:underline">تسجيل الدخول</a>.
                            </p>
                        </div>
                    ) : (
                        <>
                         <div className="text-center">
                             <h1 className="text-2xl font-bold text-[#1e81b0]">إنشاء حساب جديد</h1>
                             <p className="mt-1 text-gray-500">
                                 انضم إلينا اليوم وابدأ التسوق.
                             </p>
                        </div>

                        {error && (
                            <div className="text-center bg-red-100 text-red-700 text-sm p-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><User className="h-5 w-5 text-gray-400" /></div>
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-3 shadow-sm" placeholder="اسمك الكامل" />
                                </div>
                                {validationErrors.name && <p className="text-red-500 text-xs mt-1">{validationErrors.name[0]}</p>}
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Mail className="h-5 w-5 text-gray-400" /></div>
                                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-3 shadow-sm" placeholder="your@email.com" />
                                </div>
                                {validationErrors.email && <p className="text-red-500 text-xs mt-1">{validationErrors.email[0]}</p>}
                            </div>

                             <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Phone className="h-5 w-5 text-gray-400" /></div>
                                    <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-3 shadow-sm" placeholder="0600000000" />
                                </div>
                                {validationErrors.phone && <p className="text-red-500 text-xs mt-1">{validationErrors.phone[0]}</p>}
                            </div>

                            <div>
                                 <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Lock className="h-5 w-5 text-gray-400" /></div>
                                    <input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-10 shadow-sm" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                                {validationErrors.password && <p className="text-red-500 text-xs mt-1">{validationErrors.password[0]}</p>}
                            </div>

                            <div>
                                 <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><Lock className="h-5 w-5 text-gray-400" /></div>
                                    <input id="password_confirmation" type={showConfirmPassword ? 'text' : 'password'} value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required className="w-full rounded-lg border-gray-300 py-2.5 pr-10 pl-10 shadow-sm" placeholder="••••••••" />
                                     <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 hover:text-gray-600">
                                        {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <button type="submit" disabled={loading} className="flex w-full justify-center rounded-lg bg-[#2596be] hover:bg-[#1e81b0] py-3 px-4 font-semibold text-white shadow-md">
                                    {loading ? <LoaderCircle className="animate-spin" /> : <><LogIn className="ml-2 h-5 w-5" />إنشاء حساب</>}
                                </button>
                            </div>
                        </form>

                        {/* --- Gemini Feature --- */}
                        {name && email && (
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={handleGenerateWelcomeEmail}
                                    disabled={isGeneratingEmail}
                                    className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isGeneratingEmail ? (
                                        <>
                                            <LoaderCircle className="animate-spin h-5 w-5" />
                                            <span>جاري إنشاء البريد الترحيبي...</span>
                                        </>
                                    ) : (
                                        "✨ إنشاء بريد ترحيبي بواسطة Gemini"
                                    )}
                                </button>
                            </div>
                        )}

                        {welcomeEmail && (
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-semibold text-gray-800">مسودة البريد الإلكتروني الترحيبي:</h4>
                                <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{welcomeEmail}</p>
                            </div>
                        )}
                        </>
                    )}
                </div>
                 <p className="mt-8 text-center text-sm text-gray-600">
                    لديك حساب بالفعل؟{' '}
                    <Link href="/login" className="font-medium text-[#1e81b0] hover:text-[#eab676]">
                        سجل الدخول من هنا
                    </Link>
                </p>
            </div>
        </div>
    );
}