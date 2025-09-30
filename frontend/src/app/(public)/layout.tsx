"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Heart, Search, Menu, X, ChevronLeft, Smartphone, Home, Tv, Monitor, Gamepad2, Sparkles, Shirt, Dumbbell, Car } from "lucide-react";
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

// Categories Menu Component
const CategoriesMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const categories = [
        { name: 'الأجهزة الإلكترونية', icon: <Smartphone size={18} className="text-blue-500" /> },
        { name: 'المنزل والمطبخ', icon: <Home size={18} className="text-green-500" /> },
        { name: 'الهواتف', icon: <Smartphone size={18} className="text-purple-500" /> },
        { name: 'تلفزيون وصوت', icon: <Tv size={18} className="text-red-500" /> },
        { name: 'الحاسوب والألعاب', icon: <Monitor size={18} className="text-indigo-500" /> },
        { name: 'الجمال والصحة', icon: <Sparkles size={18} className="text-pink-500" /> },
        { name: 'ملابس وإكسسوارات', icon: <Shirt size={18} className="text-orange-500" /> },
        { name: 'الرياضة والألعاب', icon: <Gamepad2 size={18} className="text-cyan-500" /> },
        { name: 'رياضة', icon: <Dumbbell size={18} className="text-emerald-500" /> },
        { name: 'السيارات', icon: <Car size={18} className="text-gray-600" /> }
    ];

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors shadow-lg"
            >
                <Menu size={20} />
                <span className="font-medium">جميع الفئات</span>
            </button>
            
            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                        <div className="bg-slate-700 text-white p-4 flex items-center justify-between">
                            <span className="font-bold text-lg">جميع الفئات</span>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-slate-600 rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                            {categories.map((category, index) => (
                                <a 
                                    key={index}
                                    href={`/category/${category.name}`}
                                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <div className="flex items-center gap-3">
                                        {category.icon}
                                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{category.name}</span>
                                    </div>
                                    <ChevronLeft size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </a>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-20">
            {/* الشعار والوصف */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="relative h-12 w-12">
                                <Image 
                                    src="/images/logo.png" 
                                    alt="T9DA.COM Logo" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl text-gray-800">T9DA.COM</h3>
                                <p className="text-sm text-gray-500">تسوق سعيد</p>
                            </div>
                        </div>
                        <p className="text-gray-600 leading-relaxed mb-6 max-w-md">
                            متجرك الإلكتروني الموثوق للتسوق الآمن والسريع. نقدم أفضل المنتجات بأسعار منافسة مع خدمة عملاء متميزة على مدار الساعة.
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                </svg>
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-blue-50 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* قسم تسوق */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-yellow-600 relative">
                            تسوق
                            <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-yellow-400 rounded-full"></div>
                        </h3>
                        <ul className="space-y-4">
                            <li><Link href="/electronics" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الإلكترونيات</Link></li>
                            <li><Link href="/fashion" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>أزياء</Link></li>
                            <li><Link href="/home-kitchen" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>المنزل والمطبخ</Link></li>
                            <li><Link href="/new-arrivals" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الجديد</Link></li>
                        </ul>
                    </div>

                    {/* قسم الدعم */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-yellow-600 relative">
                            الدعم
                            <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-yellow-400 rounded-full"></div>
                        </h3>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>تواصل معنا</Link></li>
                            <li><Link href="/faq" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الأسئلة الشائعة</Link></li>
                            <li><Link href="/shipping" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الشحن</Link></li>
                            <li><Link href="/returns" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الإرجاع</Link></li>
                        </ul>
                    </div>

                    {/* قسم الشركة */}
                    <div>
                        <h3 className="font-bold text-lg mb-6 text-yellow-600 relative">
                            الشركة
                            <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-yellow-400 rounded-full"></div>
                        </h3>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>من نحن</Link></li>
                            <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الوظائف</Link></li>
                            <li><Link href="/press" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>الصحافة</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-blue-600 hover:translate-x-1 transition-all text-sm flex items-center gap-2 group"><span className="w-1 h-1 bg-gray-400 rounded-full group-hover:bg-blue-600 transition-colors"></span>شروط الخدمة</Link></li>
                        </ul>
                    </div>
                </div>
            </div>


                
            {/* الشريط السفلي */}
            <div className="bg-white border-t border-gray-100">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8">
                                <Image 
                                    src="/images/logo.png" 
                                    alt="T9DA.COM Logo" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-gray-500 text-sm">
                                © 2025 T9DA.COM - جميع الحقوق محفوظة
                            </p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            <Link href="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">سياسة الخصوصية</Link>
                            <Link href="/terms" className="text-gray-500 hover:text-blue-600 transition-colors">الشروط والأحكام</Link>
                            <Link href="/cookies" className="text-gray-500 hover:text-blue-600 transition-colors">ملفات تعريف الارتباط</Link>
                        </div>
                    </div>
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
                
                {/* Categories Menu Section */}
                <div className="bg-white border-b border-gray-100 py-4">
                    <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex justify-end">
                        <CategoriesMenu />
                    </div>
                </div>
                
                <main className="flex-1">
                    {children}
                </main>
                <Footer />
            </div>
        </AppProviders>
    );
}