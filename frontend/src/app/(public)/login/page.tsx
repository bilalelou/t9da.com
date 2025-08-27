"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function T9daLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@t9da.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.user && data.token) {
        localStorage.setItem('api_token', data.token);
        const destination = data.user.role === "admin" ? "/admin/dashboard" : "/dashboard";
        router.push(destination);
      } else {
        setError(data.message || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
      }
    } catch {
      setError("حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    // --- التغيير هنا: تم استبدال bg-gray-50 باللون الذي طلبته ---
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#f9fafb]" dir="rtl">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center">
            <Link href="/" className="inline-block text-4xl font-bold text-[#eab676] mb-4">
              T9DA.COM
            </Link>
            <h1 className="text-2xl font-bold text-[#1e81b0]">مرحباً بعودتك</h1>
            <p className="text-gray-500 mt-1">سجل الدخول للمتابعة إلى حسابك</p>
          </div>
          
          {error && (
            <div className="text-center bg-red-100 text-red-700 text-sm p-3 rounded-md border border-red-200">
                {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eab676]"
                placeholder="أدخل بريدك الإلكتروني"
              />
            </div>

            <div>
              <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eab676] pl-10"
                  placeholder="أدخل كلمة المرور"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                    id="rememberMe" 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)} 
                    className="h-4 w-4 rounded border-gray-300 text-[#2596be] focus:ring-[#eab676]" 
                />
                <label htmlFor="rememberMe" className="mr-2 text-sm text-gray-600">تذكرني</label>
              </div>
              <Link href="/forgot-password" className="text-sm text-[#1e81b0] hover:text-[#eab676] font-medium">
                هل نسيت كلمة المرور؟
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2596be] hover:bg-[#1e81b0] text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              <span>ليس لديك حساب؟ </span>
              <Link href="/register" className="font-medium text-[#1e81b0] hover:text-[#eab676]">
                أنشئ حساباً
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}