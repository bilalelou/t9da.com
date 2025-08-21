"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

// --- Define a type for our Product and Category data ---
interface Product {
  id: number;
  name: string;
  price: string;
  images: string[];
}

interface Category {
  id: number;
  name: string;
  icon: string;
}



// --- 2. Hero Section Component ---
const HeroSection = () => {
  return (
    <section className="bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-right">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">أناقة التكنولوجيا <br /> بين يديك</h1>
            <p className="text-lg text-gray-600 max-w-lg mx-auto md:mx-0 mb-8">استكشف مجموعتنا الحصرية من الأجهزة الإلكترونية التي تجمع بين الأداء الفائق والتصميم العصري.</p>
            <a href="#" className="inline-block bg-indigo-600 text-white font-bold rounded-lg text-lg px-10 py-4 hover:bg-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">ابدأ التسوق</a>
          </div>
          <div>
            <img src="https://placehold.co/800x600/e0e7ff/3730a3?text=Product+Showcase" alt="Product Showcase" className="rounded-xl shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

// --- 3. Categories Section ---
const CategoriesSection = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
                const response = await fetch(`${apiUrl}/categories`);
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setCategories(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (isLoading) return <div className="text-center py-20">جاري تحميل التصنيفات...</div>;

    return (
        <section className="bg-white py-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12"><h2 className="text-3xl md:text-4xl font-bold text-gray-800">تصفح حسب التصنيف</h2></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {categories.map(cat => (
                        <div key={cat.id} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-indigo-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                            <img src={cat.icon || 'https://placehold.co/100x100/ede9fe/4338ca?text=Icon'} alt={cat.name} className="w-24 h-24 mx-auto rounded-full mb-4 object-cover" />
                            <h3 className="text-lg font-semibold text-gray-800">{cat.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// --- 4. Featured Products Component ---
const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/products/featured`);
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        const data = await response.json();
        setProducts(data.data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (isLoading) return <div className="text-center py-20">جاري تحميل المنتجات...</div>;
  if (error) return <div className="text-center py-20 text-red-500">خطأ: {error}</div>;

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">الأكثر طلباً</h2>
          <p className="text-lg text-gray-600 mt-2">منتجات يثق بها عملاؤنا</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className="block">
              <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-transparent hover:border-indigo-500 h-full flex flex-col">
                <div className="overflow-hidden relative">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x400/f3f4f6/1f2937?text=No+Image'} 
                    alt={product.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">{product.name}</h3>
                  <div className="flex justify-between items-center mt-auto">
                      <p className="text-2xl font-bold text-indigo-600">{product.price} درهم</p>
                      <button className="bg-indigo-100 text-indigo-600 p-3 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 transform group-hover:scale-110"><ShoppingCart size={20} /></button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};



// --- Main Home Page ---
export default function HomePage() {
  return (
    <div className="font-sans">
      <HeroSection />
      <CategoriesSection />
      <FeaturedProducts />
    </div>
  );
}
