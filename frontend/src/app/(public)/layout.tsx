"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import { AppProviders, useCart, useWishlist } from "@/contexts/Providers";

const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { totalItems } = useCart();
    const { wishlistItems } = useWishlist();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    return (
        <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* الشعار */}
                <Link href="/" className="flex items-center gap-3">
                    <Image 
                        src="/images/logo.png" 
                        alt="T9DA.COM Logo" 
                        width={48} 
                        height={48}
                        className="object-contain"
                    />
                </Link>

                {/* روابط التنقل للشاشات الكبيرة */}
                <nav className="hidden lg:flex items-center space-x-4 space-x-reverse">
                    <Link href="/" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/") ? 'text-[#1e81b0] bg-[#eab676]/10' : 'text-gray-700 hover:text-[#1e81b0]'}`}>
                        الرئيسية
                    </Link>
                    <Link href="/shop" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/shop") ? 'text-[#1e81b0] bg-[#eab676]/10' : 'text-gray-700 hover:text-[#1e81b0]'}`}>
                        المنتجات
                    </Link>
                    <Link href="/categories" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/categories") ? 'text-[#1e81b0] bg-[#eab676]/10' : 'text-gray-700 hover:text-[#1e81b0]'}`}>
                        التصنيفات
                    </Link>
                    <Link href="/offers" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/offers") ? 'text-[#1e81b0] bg-[#eab676]/10' : 'text-gray-700 hover:text-[#1e81b0]'}`}>
                        العروض
                    </Link>
                    <Link href="/contact" className={`px-4 py-2 rounded-lg transition-colors ${isActive("/contact") ? 'text-[#1e81b0] bg-[#eab676]/10' : 'text-gray-700 hover:text-[#1e81b0]'}`}>
                        اتصل بنا
                    </Link>
                </nav>

                {/* أيقونات للشاشات الكبيرة */}
                <div className="hidden lg:flex items-center gap-2">
                    <Link href="/search" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Search size={20} />
                    </Link>
                    
                    <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Heart size={20} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#eab676] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-[#1e81b0] text-white rounded-lg hover:bg-[#1e81b0]/90 transition-colors font-medium">
                        <User size={18} />
                        <span>حسابي</span>
                    </Link>
                </div>

                {/* أيقونات الموبايل */}
                <div className="lg:hidden flex items-center gap-3">
                    <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Heart size={20} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                    <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#eab676] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button 
                        onClick={() => setIsMenuOpen(true)} 
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label="فتح القائمة"
                    >
                        <Menu className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* القائمة الجانبية للموبايل */}
            {isMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                    
                    <div className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl z-50 lg:hidden overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b">
                            <div className="flex items-center gap-3">
                                <Image 
                                    src="/images/logo.png" 
                                    alt="T9DA.COM Logo" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                                <span className="font-bold text-xl text-[#1e81b0]">T9DA</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)} 
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <nav className="space-y-3">
                                <Link 
                                    href="/" 
                                    className={`block p-3 rounded-lg font-medium transition-colors ${
                                        isActive("/") 
                                            ? 'bg-[#1e81b0] text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    الرئيسية
                                </Link>
                                <Link 
                                    href="/shop" 
                                    className={`block p-3 rounded-lg font-medium transition-colors ${
                                        isActive("/shop") 
                                            ? 'bg-[#1e81b0] text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    المنتجات
                                </Link>
                                <Link 
                                    href="/categories" 
                                    className={`block p-3 rounded-lg font-medium transition-colors ${
                                        isActive("/categories") 
                                            ? 'bg-[#1e81b0] text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    التصنيفات
                                </Link>
                                <Link 
                                    href="/offers" 
                                    className={`block p-3 rounded-lg font-medium transition-colors ${
                                        isActive("/offers") 
                                            ? 'bg-[#1e81b0] text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    العروض
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className={`block p-3 rounded-lg font-medium transition-colors ${
                                        isActive("/contact") 
                                            ? 'bg-[#1e81b0] text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    اتصل بنا
                                </Link>
                            </nav>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t bg-gray-50">
                            <div className="flex justify-center gap-4 mb-4">
                                <Link 
                                    href="/search" 
                                    className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Search size={20} className="text-gray-600" />
                                </Link>
                                
                                <Link 
                                    href="/wishlist" 
                                    className="relative p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Heart size={20} className="text-gray-600" />
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </Link>
                                
                                <Link 
                                    href="/cart" 
                                    className="relative p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <ShoppingCart size={20} className="text-gray-600" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#eab676] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            </div>
                            
                            <Link 
                                href="/login" 
                                className="w-full flex items-center justify-center gap-2 p-3 bg-[#1e81b0] text-white rounded-lg font-medium hover:bg-[#1e81b0]/90 transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <User size={18} />
                                حسابي
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12 mt-20">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image 
                                src="/images/logo.png" 
                                alt="T9DA.COM Logo" 
                                width={32} 
                                height={32}
                                className="object-contain"
                            />
                            <span className="font-bold text-xl text-[#eab676]">T9DA.COM</span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            منصة تسوق إلكترونية متكاملة تقدم أفضل المنتجات بأجود الأسعار
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#eab676]">روابط سريعة</h3>
                        <ul className="space-y-2">
                            <li><Link href="/shop" className="text-gray-400 hover:text-white transition-colors">المنتجات</Link></li>
                            <li><Link href="/categories" className="text-gray-400 hover:text-white transition-colors">التصنيفات</Link></li>
                            <li><Link href="/offers" className="text-gray-400 hover:text-white transition-colors">العروض</Link></li>
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-[#eab676]">خدمة العملاء</h3>
                        <ul className="space-y-2">
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">سياسة الخصوصية</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">الشروط والأحكام</Link></li>
                            <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors">سياسة الإرجاع</Link></li>
                            <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">الدعم الفني</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2024 T9DA.COM. جميع الحقوق محفوظة.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AppProviders>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </AppProviders>
    );
}