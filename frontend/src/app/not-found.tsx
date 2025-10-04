import Link from 'next/link';
import { Home, Search, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الصفحة غير موجودة - 404 | T9da.com',
  description: 'الصفحة التي تبحث عنها غير موجودة. تصفح منتجاتنا أو ابحث عما تريد في متجر T9da.com',
  robots: 'noindex,nofollow',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          <div className="text-8xl font-bold text-yellow-500 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            الصفحة غير موجودة
          </h1>
          <p className="text-gray-600 mb-8">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى مكان آخر
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 group"
          >
            <Home className="w-5 h-5 ml-2" />
            العودة للصفحة الرئيسية
            <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/search"
            className="inline-flex items-center justify-center w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors duration-200 group"
          >
            <Search className="w-5 h-5 ml-2" />
            البحث في المنتجات
          </Link>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              روابط مفيدة
            </h2>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Link href="/categories" className="text-blue-600 hover:underline">
                جميع الفئات
              </Link>
              <Link href="/offers" className="text-blue-600 hover:underline">
                العروض الخاصة
              </Link>
              <Link href="/new-arrivals" className="text-blue-600 hover:underline">
                المنتجات الجديدة
              </Link>
              <Link href="/contact" className="text-blue-600 hover:underline">
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}