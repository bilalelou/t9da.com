"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Heart, Search, Menu, X } from "lucide-react";

// استيراد المزود الرئيسي ومعه الـ hook الخاص بالسلة والمفضلة
import { AppProviders, useCart, useWishlist } from "@/contexts/Providers";

// --- مكون شريط التنقل (Navbar) مع عدد المنتجات في السلة ---
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
    }, [pathname]);

    const isActive = (path: string) => pathname === path;

    const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
        <Link href={href} className={`relative font-semibold text-gray-700 hover:text-[#eab676] transition-colors pb-2 ${isActive(href) ? 'text-[#eab676] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#eab676]' : ''}`}>
            {children}
        </Link>
    );

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                
                <Link href="/" className="text-3xl font-bold text-[#eab676]">
                    T9DA.COM
                </Link>

                <nav className="hidden lg:flex items-center gap-8 text-base">
                    <NavLink href="/">الرئيسية</NavLink>
                    <NavLink href="/shop">المنتجات</NavLink>
                    <NavLink href="/categories">التصنيفات</NavLink>
                    <NavLink href="/offers">العروض</NavLink>
                    <NavLink href="/contact">اتصل بنا</NavLink>
                </nav>

                <div className="hidden lg:flex items-center gap-5 text-gray-700">
                    <Link href="/search" className="hover:text-[#eab676]"><Search size={22} /></Link>
                    
                    <Link href="/wishlist" className="relative hover:text-[#eab676]">
                        <Heart size={22} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/cart" className="relative hover:text-[#eab676]">
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    
                    <Link href="/login" className="hover:text-[#eab676]"><User size={22} /></Link>
                </div>

                <div className="lg:hidden flex items-center gap-4">
                     <Link href="/wishlist" className="relative hover:text-[#eab676]">
                        <Heart size={24} />
                        {wishlistItems.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {wishlistItems.length}
                            </span>
                        )}
                    </Link>
                     <Link href="/cart" className="relative hover:text-[#eab676]">
                        <ShoppingCart size={24} />
                        {totalItems > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                    <button onClick={() => setIsMenuOpen(true)}>
                        <Menu className="h-7 w-7 text-gray-700" />
                    </button>
                </div>
            </div>

            {/* --- [تم الإصلاح] --- */}
            {/* تمت إعادة الكود الكامل للقائمة الجانبية هنا */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 lg:hidden" onClick={() => setIsMenuOpen(false)}>
                    <div 
                        className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white p-6 flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-end mb-8">
                            <button onClick={() => setIsMenuOpen(false)}>
                                <X className="h-7 w-7 text-gray-700" />
                            </button>
                        </div>
                        <nav className="flex flex-col items-center gap-8 text-xl font-medium text-gray-800">
                            {/* عند الضغط على رابط، القائمة ستغلق تلقائياً بسبب useEffect */}
                            <Link href="/">الرئيسية</Link>
                            <Link href="/shop">المنتجات</Link>
                            <Link href="/categories">التصنيفات</Link>
                            <Link href="/offers">العروض</Link>
                            <Link href="/contact">اتصل بنا</Link>
                        </nav>
                        <div className="mt-auto border-t pt-6 flex justify-center gap-8 text-gray-700">
                            <Link href="/search"><Search size={24} /></Link>
                            
                            <Link href="/wishlist" className="relative">
                                <Heart size={24} />
                                {wishlistItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {wishlistItems.length}
                                    </span>
                                )}
                            </Link>
                            
                            <Link href="/cart" className="relative">
                                <ShoppingCart size={24} />
                                {totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                                        {totalItems}
                                    </span>
                                )}
                            </Link>
                            
                            <Link href="/login"><User size={24} /></Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

// --- مكون الفوتر (Footer) ---
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
            <div className="min-h-screen flex flex-col bg-[#f9fafb]">
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </AppProviders>
    );
}
