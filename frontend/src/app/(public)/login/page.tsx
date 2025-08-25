"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react"; // Re-added Eye and EyeOff icons

// --- Social Login Button Component ---
const SocialButton = ({ provider, icon, label }: { provider: string, icon: React.ReactNode, label: string }) => {
    const handleSocialLogin = () => {
        console.log(`Login with ${provider}`);
        // سيتم تنفيذ منطق الدخول عبر الشبكات الاجتماعية هنا
    };

    return (
        <button
            onClick={handleSocialLogin}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 transition-colors"
        >
            {icon}
            <span className="font-semibold">{label}</span>
        </button>
    );
};

export default function SplitScreenLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@t9da.com"); // Default for easy testing
  const [password, setPassword] = useState("password"); // Default for easy testing
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        localStorage.setItem('api_token', data.token);
        const destination = data.user.role === "admin" ? "/admin/dashboard" : "/user-dashboard";
        router.push(destination);
      } else {
        setError(data.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-100 via-purple-50 to-white" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <span className="text-4xl font-bold text-indigo-600 tracking-wider">t9da.com</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-4">مرحباً بعودتك!</h1>
            <p className="text-gray-500 mt-2">سجل الدخول للمتابعة إلى حسابك</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
              <SocialButton 
                  provider="google"
                  label="Google"
                  icon={<svg className="w-5 h-5 ml-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
              />
              <SocialButton 
                  provider="apple"
                  label="Apple"
                  icon={<svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
              />
          </div>

          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-3 bg-white text-gray-500">أو سجل الدخول بالبريد الإلكتروني</span></div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-800 text-sm p-3 rounded-lg border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none"><Mail className="h-5 w-5 text-gray-400" /></span>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-2">كلمة المرور</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none"><Lock className="h-5 w-5 text-gray-400" /></span>
                <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="********" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="mr-2 text-sm text-gray-600">تذكرني</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">هل نسيت كلمة المرور؟</Link>
            </div>

            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition transform hover:scale-105" disabled={isSubmitting}>
              {isSubmitting ? (<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>) : (<><span className="ml-2">تسجيل الدخول</span><LogIn className="h-5 w-5" /></>)}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            ليس لديك حساب؟{' '}<Link href="/register" className="font-medium text-indigo-600 hover:underline">أنشئ حساباً جديداً</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
