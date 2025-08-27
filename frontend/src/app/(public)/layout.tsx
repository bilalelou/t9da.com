"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { User, ShoppingCart, Heart, Search, Menu, X } from "lucide-react";

// --- Navbar Component (defined inside this file) ---
const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => pathname === path;

  // Reusable link component for DRY code
  const NavLink = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <Link href={href} className={`relative font-semibold text-gray-700 hover:text-[#eab676] transition-colors pb-2 ${isActive(href) ? 'text-[#eab676] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#eab676]' : ''}`}>
      {children}
    </Link>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Right Side: Logo */}
        <Link href="/" className="text-3xl font-bold text-[#eab676]">
          T9DA.COM
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-base">
          <NavLink href="/">الرئيسية</NavLink>
          <NavLink href="/products">المنتجات</NavLink>
          <NavLink href="/categories">التصنيفات</NavLink>
          <NavLink href="/offers">العروض</NavLink>
          <NavLink href="/contact">اتصل بنا</NavLink>
        </nav>

        {/* Left Side: Desktop Action Icons */}
        <div className="hidden lg:flex items-center gap-5 text-gray-700">
          <Link href="/search" className="hover:text-[#eab676]"><Search size={22} /></Link>
          <Link href="/wishlist" className="hover:text-[#eab676]"><Heart size={22} /></Link>
          <Link href="/cart" className="hover:text-[#eab676]"><ShoppingCart size={22} /></Link>
          <Link href="/login" className="hover:text-[#eab676]"><User size={22} /></Link>
        </div>

        {/* Mobile: Hamburger Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(true)}>
            <Menu className="h-7 w-7 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
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
              <Link href="/" onClick={() => setIsMenuOpen(false)}>الرئيسية</Link>
              <Link href="/products" onClick={() => setIsMenuOpen(false)}>المنتجات</Link>
              <Link href="/categories" onClick={() => setIsMenuOpen(false)}>التصنيفات</Link>
              <Link href="/offers" onClick={() => setIsMenuOpen(false)}>العروض</Link>
              <Link href="/contact" onClick={() => setIsMenuOpen(false)}>اتصل بنا</Link>
            </nav>
            <div className="mt-auto border-t pt-6 flex justify-center gap-8 text-gray-700">
                <Link href="/search" className="hover:text-[#eab676]"><Search size={24} /></Link>
                <Link href="/wishlist" className="hover:text-[#eab676]"><Heart size={24} /></Link>
                <Link href="/cart" className="hover:text-[#eab676]"><ShoppingCart size={24} /></Link>
                <Link href="/login" className="hover:text-[#eab676]"><User size={24} /></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

// --- Footer Component (defined inside this file) ---
const Footer = () => (
    <footer className="bg-white text-[#34495e] py-8">
        <div className="container mx-auto px-4 text-center text-sm">
            © {new Date().getFullYear()} T9DA.COM — All Rights Reserved
        </div>
    </footer>
);

// --- Main Layout Component ---
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9fafb]">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}