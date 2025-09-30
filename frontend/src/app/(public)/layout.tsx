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
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                
                {/* الشعار */}
                <div className="flex items-center gap-1">
                    <Link href="/" className="flex items-center">
                        <div className="relative h-10 w-10 md:h-12 md:w-12">
                            <Image 
                                src="/images/logo.png" 
                                alt="T9DA.COM Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    <Link href="/" className="hidden sm:block">
                        <div className="flex flex-col items-end">
                            <span className="font-bold text-lg md:text-xl text-gray-800">T9DA.COM</span>
                            <span className="text-xs text-gray-500">تسوق سعيد</span>
                        </div>
                    </Link>
                </div>

                {/* حقل البحث */}
                <div className="hidden md:flex flex-1 mx-6 max-w-xl relative">
                    <div className="relative w-full">
                        <input 
                            type="text" 
                            placeholder="ابحث عن منتجات، ماركات، والمزيد" 
                            className="w-full py-2 px-4 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <Search size={16} className="text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* أيقونات للشاشات المتوسطة والكبيرة */}
                <div className="flex items-center gap-1 md:gap-2">
                    <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Heart size={18} className="text-gray-600" />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/user-dashboard" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <User size={18} className="text-gray-600" />
                    </Link>
                    
                    <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ShoppingCart size={18} className="text-gray-600" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    <button 
                        onClick={() => setIsMenuOpen(true)} 
                        className="md:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="فتح القائمة"
                    >
                        <Menu className="h-5 w-5 text-gray-600" />
                    </button>
                </div>
            </div>
            
            {/* شريط التنقل للشاشات المتوسطة والكبيرة */}
            <div className="hidden md:block border-t border-gray-100">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center justify-center space-x-6 space-x-reverse py-1">
                        <Link href="/" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/") ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                            الرئيسية
                        </Link>
                        <Link href="/shop" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/shop") ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                            المنتجات
                        </Link>
                        <Link href="/categories" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/categories") ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                            التصنيفات
                        </Link>
                        <Link href="/offers" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/offers") ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                            العروض
                        </Link>
                        <Link href="/contact" className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/contact") ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}>
                            اتصل بنا
                        </Link>
                    </nav>
                </div>
            </div>

            {/* القائمة الجانبية للموبايل */}
            {isMenuOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    ></div>
                    
                    <div className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl z-50 md:hidden overflow-y-auto">
                        <div className="flex items-center justify-between p-4 border-b">
                            <div className="flex items-center gap-2">
                                <Image 
                                    src="/images/logo.png" 
                                    alt="T9DA.COM Logo" 
                                    width={32} 
                                    height={32}
                                    className="object-contain"
                                />
                                <span className="font-bold text-xl text-gray-800">T9DA.COM</span>
                            </div>
                            <button 
                                onClick={() => setIsMenuOpen(false)} 
                                className="p-2 rounded-full hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {/* حقل البحث للموبايل */}
                        <div className="p-4 border-b">
                            <div className="relative w-full">
                                <input 
                                    type="text" 
                                    placeholder="ابحث عن منتجات، ماركات، والمزيد" 
                                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 text-right text-sm"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Search size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <nav className="space-y-2">
                                <Link 
                                    href="/" 
                                    className={`block p-3 rounded-lg font-medium transition-colors text-sm ${
                                        isActive("/") 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    الرئيسية
                                </Link>
                                <Link 
                                    href="/shop" 
                                    className={`block p-3 rounded-lg font-medium transition-colors text-sm ${
                                        isActive("/shop") 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    المنتجات
                                </Link>
                                <Link 
                                    href="/categories" 
                                    className={`block p-3 rounded-lg font-medium transition-colors text-sm ${
                                        isActive("/categories") 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    التصنيفات
                                </Link>
                                <Link 
                                    href="/offers" 
                                    className={`block p-3 rounded-lg font-medium transition-colors text-sm ${
                                        isActive("/offers") 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    العروض
                                </Link>
                                <Link 
                                    href="/contact" 
                                    className={`block p-3 rounded-lg font-medium transition-colors text-sm ${
                                        isActive("/contact") 
                                            ? 'bg-blue-50 text-blue-600' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    اتصل بنا
                                </Link>
                            </nav>
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-gray-50">
                            <div className="flex justify-center gap-4 mb-4">
                                <Link 
                                    href="/wishlist" 
                                    className="relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Heart size={18} className="text-gray-600" />
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </Link>
                                
                                <Link 
                                    href="/user-dashboard" 
                                    className="p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User size={18} className="text-gray-600" />
                                </Link>
                                
                                <Link 
                                    href="/cart" 
                                    className="relative p-3 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <ShoppingCart size={18} className="text-gray-600" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            </div>
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
                            <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">اتصل بنا</Link></li>
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