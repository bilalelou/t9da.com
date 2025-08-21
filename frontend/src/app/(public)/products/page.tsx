'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define interfaces for our data
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: number;
  tags: string[];
}

interface FilterState {
  category: string;
  brand: string;
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  searchQuery: string;
}

// Sample products data
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "سماعات بلوتوث لاسلكية عالية الجودة",
    price: 299,
    originalPrice: 399,
    description: "سماعات بلوتوث عالية الجودة مع تقنية إلغاء الضوضاء",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.5,
    reviewCount: 128,
    category: "إلكترونيات",
    brand: "TechSound",
    inStock: true,
    isBestseller: true,
    discount: 25,
    tags: ["بلوتوث", "لاسلكي", "إلغاء ضوضاء"]
  },
  {
    id: "2",
    name: "ساعة ذكية رياضية متطورة",
    price: 199,
    originalPrice: 249,
    description: "ساعة ذكية مع مراقبة اللياقة البدنية ومقاومة الماء",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.8,
    reviewCount: 89,
    category: "إلكترونيات",
    brand: "SmartFit",
    inStock: true,
    isNew: true,
    discount: 20,
    tags: ["ذكية", "رياضة", "مقاوم للماء"]
  },
  {
    id: "3",
    name: "هاتف ذكي متطور بكاميرا احترافية",
    price: 1299,
    description: "هاتف ذكي بمعالج قوي وكاميرا احترافية",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.6,
    reviewCount: 156,
    category: "إلكترونيات",
    brand: "TechPro",
    inStock: true,
    isBestseller: true,
    tags: ["هاتف", "كاميرا", "معالج قوي"]
  },
  {
    id: "4",
    name: "كاميرا رقمية احترافية",
    price: 899,
    originalPrice: 1199,
    description: "كاميرا رقمية احترافية للمصورين المحترفين",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.7,
    reviewCount: 203,
    category: "كاميرات",
    brand: "PhotoPro",
    inStock: true,
    discount: 25,
    tags: ["كاميرا", "احترافية", "تصوير"]
  },
  {
    id: "5",
    name: "لابتوب عالي الأداء للألعاب",
    price: 2499,
    originalPrice: 2999,
    description: "لابتوب قوي مخصص للألعاب والتصميم",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.9,
    reviewCount: 312,
    category: "حاسوب",
    brand: "GameTech",
    inStock: true,
    isBestseller: true,
    discount: 17,
    tags: ["لابتوب", "ألعاب", "أداء عالي"]
  },
  {
    id: "6",
    name: "تابلت للرسم والتصميم",
    price: 599,
    originalPrice: 799,
    description: "تابلت احترافي للرسم الرقمي والتصميم",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.4,
    reviewCount: 87,
    category: "حاسوب",
    brand: "DesignPro",
    inStock: false,
    discount: 25,
    tags: ["تابلت", "رسم", "تصميم"]
  },
  {
    id: "7",
    name: "مكبر صوت ذكي",
    price: 149,
    description: "مكبر صوت ذكي مع مساعد صوتي",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.2,
    reviewCount: 156,
    category: "إلكترونيات",
    brand: "SmartAudio",
    inStock: true,
    isNew: true,
    tags: ["مكبر صوت", "ذكي", "مساعد صوتي"]
  },
  {
    id: "8",
    name: "شاشة كمبيوتر منحنية 4K",
    price: 799,
    originalPrice: 999,
    description: "شاشة منحنية عالية الدقة للألعاب والعمل",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
    rating: 4.6,
    reviewCount: 234,
    category: "حاسوب",
    brand: "DisplayTech",
    inStock: true,
    discount: 20,
    tags: ["شاشة", "منحنية", "4K"]
  }
];



// Main Products Page Component
export default function ProductsPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    brand: '',
    priceRange: [0, 3000],
    rating: 0,
    inStock: false,
    searchQuery: ''
  });

  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'newest'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const itemsPerPage = 12;

  // Get unique categories and brands
  const categories = [...new Set(sampleProducts.map(p => p.category))];
  const brands = [...new Set(sampleProducts.map(p => p.brand))];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = sampleProducts.filter(product => {
      // Search filter
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.tags.some(tag => tag.toLowerCase().includes(filters.searchQuery.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      // Brand filter
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Rating filter
      if (filters.rating > 0 && product.rating < filters.rating) {
        return false;
      }

      // In stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return a.isNew ? -1 : b.isNew ? 1 : 0;
        default:
          return a.name.localeCompare(b.name, 'ar');
      }
    });

    return filtered;
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Wishlist functions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: '',
      brand: '',
      priceRange: [0, 3000],
      rating: 0,
      inStock: false,
      searchQuery: ''
    });
    setCurrentPage(1);
  };

  return (
    <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900">المنتجات</span>
          </nav>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">جميع المنتجات</h1>
            <p className="text-gray-600 text-lg">اكتشف مجموعتنا الواسعة من المنتجات عالية الجودة</p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">الفلاتر</h2>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </button>
                </div>

                <div className={`space-y-6 ${isFilterOpen ? 'block' : 'hidden lg:block'}`}>
                  {/* Clear All Filters */}
                  {(filters.searchQuery || filters.category || filters.brand || filters.inStock || filters.rating > 0) && (
                    <div className="pb-4 border-b border-gray-200">
                      <button
                        onClick={resetFilters}
                        className="w-full bg-red-50 text-red-600 py-2 px-4 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>مسح جميع الفلاتر</span>
                      </button>
                    </div>
                  )}

                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      التصنيفات
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={filters.category === ''}
                          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                          className="ml-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">جميع التصنيفات</span>
                        <span className="mr-auto text-sm text-gray-500">({sampleProducts.length})</span>
                      </label>
                      {categories.map(category => {
                        const count = sampleProducts.filter(p => p.category === category).length;
                        return (
                          <label key={category} className="flex items-center group cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={filters.category === category}
                              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                              className="ml-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{category}</span>
                            <span className="mr-auto text-sm text-gray-500">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      العلامات التجارية
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="radio"
                          name="brand"
                          value=""
                          checked={filters.brand === ''}
                          onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                          className="ml-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">جميع العلامات</span>
                        <span className="mr-auto text-sm text-gray-500">({sampleProducts.length})</span>
                      </label>
                      {brands.map(brand => {
                        const count = sampleProducts.filter(p => p.brand === brand).length;
                        return (
                          <label key={brand} className="flex items-center group cursor-pointer">
                            <input
                              type="radio"
                              name="brand"
                              value={brand}
                              checked={filters.brand === brand}
                              onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                              className="ml-3 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">{brand}</span>
                            <span className="mr-auto text-sm text-gray-500">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      نطاق السعر
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">من</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={filters.priceRange[0]}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              priceRange: [Number(e.target.value), prev.priceRange[1]]
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm text-gray-600 mb-1">إلى</label>
                          <input
                            type="number"
                            placeholder="3000"
                            value={filters.priceRange[1]}
                            onChange={(e) => setFilters(prev => ({
                              ...prev,
                              priceRange: [prev.priceRange[0], Number(e.target.value)]
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          />
                        </div>
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        {filters.priceRange[0]} ر.س - {filters.priceRange[1]} ر.س
                      </div>

                      {/* Quick Price Ranges */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'أقل من 200', range: [0, 200] },
                          { label: '200 - 500', range: [200, 500] },
                          { label: '500 - 1000', range: [500, 1000] },
                          { label: 'أكثر من 1000', range: [1000, 3000] }
                        ].map((priceRange) => (
                          <button
                            key={priceRange.label}
                            onClick={() => setFilters(prev => ({ ...prev, priceRange: priceRange.range as [number, number] }))}
                            className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                              filters.priceRange[0] === priceRange.range[0] && filters.priceRange[1] === priceRange.range[1]
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                            }`}
                          >
                            {priceRange.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      التقييم
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          value={0}
                          checked={filters.rating === 0}
                          onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                          className="ml-3 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">جميع التقييمات</span>
                      </label>
                      {[4, 3, 2, 1].map(rating => {
                        const count = sampleProducts.filter(p => p.rating >= rating).length;
                        return (
                          <label key={rating} className="flex items-center group cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              value={rating}
                              checked={filters.rating === rating}
                              onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                              className="ml-3 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="flex items-center space-x-1 space-x-reverse">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ★
                                </span>
                              ))}
                              <span className="text-gray-700 text-sm mr-2 group-hover:text-blue-600 transition-colors">فأكثر</span>
                              <span className="mr-auto text-sm text-gray-500">({count})</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Availability */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      التوفر
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.inStock}
                          onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                          className="ml-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">متوفر فقط</span>
                        <span className="mr-auto text-sm text-gray-500">
                          ({sampleProducts.filter(p => p.inStock).length})
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Special Offers */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 ml-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      العروض الخاصة
                    </h3>
                    <div className="space-y-3">
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          className="ml-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">منتجات مخفضة</span>
                        <span className="mr-auto text-sm text-gray-500">
                          ({sampleProducts.filter(p => p.discount).length})
                        </span>
                      </label>
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          className="ml-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">منتجات جديدة</span>
                        <span className="mr-auto text-sm text-gray-500">
                          ({sampleProducts.filter(p => p.isNew).length})
                        </span>
                      </label>
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          className="ml-3 text-blue-600 focus:ring-blue-500 rounded"
                        />
                        <span className="text-gray-700 group-hover:text-blue-600 transition-colors">الأكثر مبيعاً</span>
                        <span className="mr-auto text-sm text-gray-500">
                          ({sampleProducts.filter(p => p.isBestseller).length})
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-4 space-x-reverse">
                  <span className="text-gray-600">
                    عرض {paginatedProducts.length} من {filteredProducts.length} منتج
                  </span>
                  {(filters.searchQuery || filters.category || filters.brand || filters.inStock || filters.rating > 0) && (
                    <button
                      onClick={resetFilters}
                      className="text-blue-600 hover:text-blue-700 text-sm underline"
                    >
                      إزالة جميع الفلاتر
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-4 space-x-reverse">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">ترتيب حسب الاسم</option>
                    <option value="price">ترتيب حسب السعر</option>
                    <option value="rating">ترتيب حسب التقييم</option>
                    <option value="newest">الأحدث أولاً</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid/List */}
              {paginatedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد منتجات</h3>
                  <p className="mt-1 text-sm text-gray-500">لم نجد أي منتجات تطابق معايير البحث الخاصة بك.</p>
                  <div className="mt-6">
                    <button
                      onClick={resetFilters}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      إزالة جميع الفلاتر
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {paginatedProducts.map((product) => (
                    <div key={product.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative aspect-square">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />

                        {/* Badges */}
                        <div className="absolute top-3 right-3 space-y-2">
                          {product.discount && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                              -{product.discount}%
                            </span>
                          )}
                          {product.isNew && (
                            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full block">
                              جديد
                            </span>
                          )}
                          {product.isBestseller && (
                            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full block">
                              الأكثر مبيعاً
                            </span>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="absolute top-3 left-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="bg-white bg-opacity-80 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-100 transition-all"
                          >
                            <svg
                              className={`w-4 h-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-700'}`}
                              fill={wishlist.includes(product.id) ? 'currentColor' : 'none'}
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setQuickViewProduct(product)}
                            className="bg-white bg-opacity-80 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-100 transition-all"
                          >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </div>

                        {/* Stock Status */}
                        {!product.inStock && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                              غير متوفر
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
                            {product.name}
                          </Link>
                        </h3>

                        <div className="flex items-center space-x-2 space-x-reverse mb-3">
                          <span className="text-lg font-bold text-blue-600">{product.price} ر.س</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">{product.originalPrice} ر.س</span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1 space-x-reverse mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                          <span className="text-sm text-gray-500">({product.reviewCount})</span>
                        </div>

                        <button
                          disabled={!product.inStock}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                          </svg>
                          <span>{product.inStock ? 'إضافة للسلة' : 'غير متوفر'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center mt-12">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      السابق
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'border border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="px-2 text-gray-400">...</span>;
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick View Modal */}
          {quickViewProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">عرض سريع</h2>
                    <button
                      onClick={() => setQuickViewProduct(null)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image */}
                    <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden">
                      <Image
                        src={quickViewProduct.image}
                        alt={quickViewProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-gray-900">{quickViewProduct.name}</h3>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-2xl font-bold text-blue-600">{quickViewProduct.price} ر.س</span>
                        {quickViewProduct.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">{quickViewProduct.originalPrice} ر.س</span>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 space-x-reverse">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.floor(quickViewProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-gray-600 mr-2">({quickViewProduct.reviewCount} تقييم)</span>
                      </div>

                      <p className="text-gray-600">{quickViewProduct.description}</p>

                      <div className="flex items-center space-x-2 space-x-reverse">
                        {quickViewProduct.inStock ? (
                          <>
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-600 font-semibold">متوفر في المخزن</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            <span className="text-red-600 font-semibold">غير متوفر حالياً</span>
                          </>
                        )}
                      </div>

                      <div className="flex space-x-4 space-x-reverse pt-4">
                        <Link
                          href={`/products/${quickViewProduct.id}`}
                          className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
                        >
                          عرض التفاصيل
                        </Link>
                        <button
                          disabled={!quickViewProduct.inStock}
                          className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                        >
                          إضافة للسلة
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}