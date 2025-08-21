'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Define interfaces
interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  category: string;
  rating: number;
  reviews: number;
}

// Sample data
const wishlistItems: WishlistItem[] = [
  {
    id: '1',
    name: 'سماعات بلوتوث لاسلكية عالية الجودة',
    price: 299,
    originalPrice: 399,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    inStock: true,
    category: 'إلكترونيات',
    rating: 4.5,
    reviews: 128
  },
  {
    id: '2',
    name: 'ساعة ذكية رياضية مقاومة للماء',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    inStock: true,
    category: 'إكسسوارات',
    rating: 4.8,
    reviews: 89
  },
  {
    id: '3',
    name: 'حقيبة لابتوب أنيقة ومقاومة للماء',
    price: 199,
    originalPrice: 249,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    inStock: false,
    category: 'حقائب',
    rating: 4.3,
    reviews: 45
  },
  {
    id: '4',
    name: 'كاميرا رقمية احترافية',
    price: 2499,
    originalPrice: 2799,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    inStock: true,
    category: 'كاميرات',
    rating: 4.9,
    reviews: 234
  },
  {
    id: '5',
    name: 'لوحة مفاتيح ميكانيكية للألعاب',
    price: 450,
    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    inStock: true,
    category: 'ألعاب',
    rating: 4.6,
    reviews: 167
  },
  {
    id: '6',
    name: 'مكبر صوت محمول عالي الجودة',
    price: 189,
    originalPrice: 229,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400',
    inStock: false,
    category: 'صوتيات',
    rating: 4.4,
    reviews: 92
  }
];

export default function WishlistPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR'
    }).format(amount);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      );
    }

    return stars;
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const removeFromWishlist = (itemId: string) => {
    // Here you would typically call an API to remove the item
    console.log('Remove item:', itemId);
  };

  const addToCart = (itemId: string) => {
    // Here you would typically call an API to add the item to cart
    console.log('Add to cart:', itemId);
  };

  const addSelectedToCart = () => {
    selectedItems.forEach(itemId => addToCart(itemId));
    setSelectedItems([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">قائمة الأمنيات</h1>
              <p className="text-sm text-gray-600">{wishlistItems.length} منتج في قائمة أمنياتك</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {selectedItems.length > 0 && (
                <button
                  onClick={addSelectedToCart}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إضافة المحدد للسلة ({selectedItems.length})
                </button>
              )}
              
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">جميع المنتجات</option>
                <option value="available">متوفر فقط</option>
                <option value="sale">في التخفيضات</option>
                <option value="price-low">الأقل سعراً</option>
                <option value="price-high">الأعلى سعراً</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Wishlist Items */}
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Wishlist and Selection Controls */}
                  <div className="absolute top-3 right-3 flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => toggleItemSelection(item.id)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors ${
                        selectedItems.includes(item.id)
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 text-red-500"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Sale Badge */}
                  {item.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-medium">
                      خصم {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                    </div>
                  )}

                  {/* Stock Status */}
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-medium bg-black bg-opacity-75 px-3 py-1 rounded-lg">
                        غير متوفر
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  {/* Category */}
                  <p className="text-xs text-blue-600 font-medium mb-2">{item.category}</p>
                  
                  {/* Product Name */}
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                  
                  {/* Rating */}
                  <div className="flex items-center space-x-1 space-x-reverse mb-3">
                    <div className="flex items-center space-x-1 space-x-reverse">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-sm text-gray-600">({item.reviews})</span>
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-2 space-x-reverse mb-4">
                    <span className="text-lg font-bold text-gray-900">{formatCurrency(item.price)}</span>
                    {item.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{formatCurrency(item.originalPrice)}</span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => addToCart(item.id)}
                      disabled={!item.inStock}
                      className={`w-full py-2 rounded-lg font-medium transition-colors ${
                        item.inStock
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {item.inStock ? 'إضافة للسلة' : 'غير متوفر'}
                    </button>
                    
                    <Link
                      href={`/products/${item.id}`}
                      className="block w-full py-2 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">قائمة الأمنيات فارغة</h3>
            <p className="text-gray-600 mb-6">ابدأ بإضافة المنتجات التي تعجبك إلى قائمة أمنياتك</p>
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        )}

        {/* Summary */}
        {wishlistItems.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">ملخص قائمة الأمنيات</h3>
                <p className="text-sm text-gray-600">
                  {wishlistItems.filter(item => item.inStock).length} من {wishlistItems.length} منتج متوفر
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">إجمالي القيمة التقديرية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(wishlistItems.reduce((total, item) => total + item.price, 0))}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
