'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ProductCard, { Product } from '@/components/ProductCard';

// Sample wishlist data
const sampleWishlistItems: Product[] = [
  {
    id: '1',
    name: 'سماعات بلوتوث لاسلكية عالية الجودة',
    description: 'سماعات بلوتوث عالية الجودة مع تقنية إلغاء الضوضاء النشطة وبطارية تدوم حتى 30 ساعة',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    rating: 4.5,
    reviewCount: 128,
    category: 'إلكترونيات',
    brand: 'TechSound',
    inStock: true,
    isNew: false,
    isBestseller: true,
    discount: 25,
    tags: ['سماعات', 'بلوتوث', 'لاسلكي']
  },
  {
    id: '2',
    name: 'ساعة ذكية رياضية متطورة',
    description: 'ساعة ذكية مع مراقبة اللياقة البدنية ومقاومة الماء وشاشة AMOLED عالية الدقة',
    price: 199,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    rating: 4.3,
    reviewCount: 89,
    category: 'إلكترونيات',
    brand: 'SmartFit',
    inStock: true,
    isNew: true,
    isBestseller: false,
    discount: 20,
    tags: ['ساعة ذكية', 'رياضة', 'صحة']
  },
  {
    id: '3',
    name: 'هاتف ذكي متطور بكاميرا احترافية',
    description: 'هاتف ذكي بمعالج قوي وكاميرا احترافية ثلاثية العدسات وشاشة 6.7 بوصة',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    rating: 4.7,
    reviewCount: 256,
    category: 'إلكترونيات',
    brand: 'TechPro',
    inStock: false,
    isNew: false,
    isBestseller: true,
    tags: ['هاتف ذكي', 'كاميرا', 'تصوير']
  },
  {
    id: '4',
    name: 'لابتوب للألعاب عالي الأداء',
    description: 'لابتوب مخصص للألعاب مع كرت رسومات متطور ومعالج سريع وذاكرة كبيرة',
    price: 2499,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    rating: 4.6,
    reviewCount: 167,
    category: 'إلكترونيات',
    brand: 'GameTech',
    inStock: true,
    isNew: true,
    isBestseller: false,
    discount: 11,
    tags: ['لابتوب', 'ألعاب', 'أداء عالي']
  },
  {
    id: '5',
    name: 'كاميرا رقمية احترافية',
    description: 'كاميرا رقمية احترافية مع عدسة قابلة للتبديل وجودة تصوير 4K',
    price: 1899,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    rating: 4.8,
    reviewCount: 94,
    category: 'إلكترونيات',
    brand: 'PhotoPro',
    inStock: true,
    isNew: false,
    isBestseller: true,
    tags: ['كاميرا', 'تصوير', 'احترافي']
  },
  {
    id: '6',
    name: 'جهاز تابلت للرسم الرقمي',
    description: 'جهاز تابلت متطور للرسم الرقمي مع قلم حساس للضغط وشاشة عالية الدقة',
    price: 899,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    rating: 4.4,
    reviewCount: 73,
    category: 'إلكترونيات',
    brand: 'ArtTech',
    inStock: true,
    isNew: false,
    isBestseller: false,
    discount: 18,
    tags: ['تابلت', 'رسم', 'إبداع']
  }
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<Product[]>(sampleWishlistItems);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(wishlistItems.map(item => item.category)))];

  // Filter items by category
  const filteredItems = selectedCategory === 'all' 
    ? wishlistItems 
    : wishlistItems.filter(item => item.category === selectedCategory);

  // Handle add to cart
  const handleAddToCart = (productId: string) => {
    console.log('Adding to cart:', productId);
    // Implement add to cart logic here
    alert('تم إضافة المنتج إلى السلة!');
  };

  // Handle remove from wishlist
  const handleRemoveFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== productId));
  };

  // Handle quick view
  const handleQuickView = (product: Product) => {
    console.log('Quick view:', product);
    // Implement quick view modal logic here
  };

  // Clear all wishlist
  const handleClearWishlist = () => {
    if (confirm('هل أنت متأكد من حذف جميع المنتجات من المفضلة؟')) {
      setWishlistItems([]);
    }
  };

  // Add all to cart
  const handleAddAllToCart = () => {
    const inStockItems = filteredItems.filter(item => item.inStock);
    if (inStockItems.length === 0) {
      alert('لا توجد منتجات متوفرة لإضافتها للسلة');
      return;
    }
    
    console.log('Adding all to cart:', inStockItems.map(item => item.id));
    alert(`تم إضافة ${inStockItems.length} منتج إلى السلة!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-900">المفضلة</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
              <svg className="w-8 h-8 ml-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              قائمة المفضلة
            </h1>
            <p className="text-gray-600">
              {wishlistItems.length > 0 
                ? `لديك ${wishlistItems.length} منتج في المفضلة`
                : 'قائمة المفضلة فارغة'
              }
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={handleAddAllToCart}
                className="flex items-center space-x-2 space-x-reverse bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
                <span>إضافة الكل للسلة</span>
              </button>
              
              <button
                onClick={handleClearWishlist}
                className="flex items-center space-x-2 space-x-reverse text-red-600 hover:text-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>مسح الكل</span>
              </button>
            </div>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty Wishlist */
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-24 w-24 text-gray-400 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">قائمة المفضلة فارغة</h2>
              <p className="text-gray-600 mb-8">لم تقم بإضافة أي منتجات إلى قائمة المفضلة بعد</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                تصفح المنتجات
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-sm font-medium text-gray-700">تصفية حسب الفئة:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {category === 'all' ? 'جميع الفئات' : category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wishlist Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">إجمالي المنتجات</p>
                    <p className="text-2xl font-bold text-gray-900">{filteredItems.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">متوفر</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredItems.filter(item => item.inStock).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">غير متوفر</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {filteredItems.filter(item => !item.inStock).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onAddToWishlist={handleRemoveFromWishlist}
                  onQuickView={handleQuickView}
                  isInWishlist={true}
                  showQuickActions={true}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-12 text-center">
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                مواصلة التسوق
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
