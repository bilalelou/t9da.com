"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Heart, Search, Menu, X } from "lucide-react";

// استيراد المزود الرئيسي ومعه الـ hook الخاص بالسلة والمفضلة
import { AppProviders, useCart, useWishlist } from "@/contexts/Providers";

// --- مكون شريط التنقل (Navbar) العصري ---
const Navbar = () => {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // استخدام useCart والـ useWishlist للحصول على عدد المنتجات
    const { totalItems } = useCart();
    const { wishlistItems } = useWishlist();

    // إغلاق القائمة الجانبية عند تغيير المسار
    useEffect(() => {
        if (isMenuOpen) {
            setIsMenuOpen(false);
        }
    }, [pathname, isMenuOpen]);

    const isActive = (path: string) => pathname === path;

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link 
            href={href} 
            className={`relative font-medium transition-all duration-300 px-4 py-2 rounded-lg ${
                isActive(href) 
                    ? 'text-[#1e81b0] bg-[#eab676]/10 font-semibold' 
                    : 'text-gray-700 hover:text-[#1e81b0] hover:bg-gray-50'
            }`}
        >
            {children}
            {isActive(href) && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-[#eab676] rounded-full"></div>
            )}
        </Link>
    );

    return (
        <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                
                {/* الشعار */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <Image 
                            src="/images/logo.png" 
                            alt="T9DA.COM Logo" 
                            width={48} 
                            height={48}
                            className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <span className="text-2xl font-bold text-[#1e81b0] hidden sm:block">T9DA</span>
                </Link>

                {/* قائمة التنقل */}
                <nav className="hidden lg:flex items-center gap-1 bg-gray-50 rounded-xl px-6 py-2">
                    <NavLink href="/">الرئيسية</NavLink>
                    <NavLink href="/shop">المنتجات</NavLink>
                    <NavLink href="/categories">التصنيفات</NavLink>
                    <NavLink href="/offers">العروض</NavLink>
                    <NavLink href="/contact">اتصل بنا</NavLink>
                </nav>

                {/* أيقونات المتجر */}
                <div className="hidden lg:flex items-center gap-4 text-gray-600">
                    <Link href="/search" className="p-2 rounded-lg hover:bg-gray-100 hover:text-[#1e81b0] transition-all duration-300">
                        <Search size={20} />
                    </Link>
                    
                    <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 hover:text-red-500 transition-all duration-300">
                        <Heart size={20} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 hover:text-[#eab676] transition-all duration-300">
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#eab676] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-[#1e81b0] text-white rounded-lg hover:bg-[#1e81b0]/90 transition-all duration-300 font-medium">
                        <User size={18} />
                        <span className="hidden xl:block">حسابي</span>
                    </Link>
                </div>

                {/* أيقونات الموبايل */}
                <div className="lg:hidden flex items-center gap-3">
                     <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Heart size={22} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                     <Link href="/cart" className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-[#eab676] text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <Menu className="h-6 w-6 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* القائمة الجانبية */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div 
                        className="fixed inset-y-0 right-0 w-80 max-w-sm bg-white shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
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
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        {/* Navigation Links */}
                        <nav className="p-6 space-y-2">
                            {[
                                { href: "/", label: "الرئيسية" },
                                { href: "/shop", label: "المنتجات" },
                                { href: "/categories", label: "التصنيفات" },
                                { href: "/offers", label: "العروض" },
                                { href: "/contact", label: "اتصل بنا" }
                            ].map((item) => (
                                <Link 
                                    key={item.href}
                                    href={item.href} 
                                    className={`block p-3 rounded-lg font-medium transition-colors ${
                                        isActive(item.href) 
                                            ? 'bg-[#1e81b0] text-white' 
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                        
                        {/* Bottom Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex justify-center gap-4 mb-4">
                                <Link href="/search" className="p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <Search size={20} className="text-gray-600" />
                                </Link>
                                
                                <Link href="/wishlist" className="relative p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <Heart size={20} className="text-gray-600" />
                                    {wishlistItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {wishlistItems.length}
                                        </span>
                                    )}
                                </Link>
                                
                                <Link href="/cart" className="relative p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <ShoppingCart size={20} className="text-gray-600" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-[#eab676] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                            {totalItems}
                                        </span>
                                    )}
                                </Link>
                            </div>
                            
                            <Link href="/login" className="w-full flex items-center justify-center gap-2 p-3 bg-[#1e81b0] text-white rounded-lg font-medium hover:bg-[#1e81b0]/90 transition-colors">
                                <User size={18} />
                                حسابي
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

// --- مكون الفوتر ---
const Footer = () => (
    <footer className="bg-white text-[#34495e] py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm">
            © {new Date().getFullYear()} T9DA.COM — All Rights Reserved
        </div>
    </footer>
);

// --- مكون الـ Layout الرئيسي ---
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
        <AppProviders>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </AppProviders>
    );
}
