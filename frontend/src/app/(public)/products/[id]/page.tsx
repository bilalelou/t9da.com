'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';





// Define interfaces for our data
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  category: string;
  brand: string;
  features: string[];
  specifications: { [key: string]: string };
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
  discount?: number;
  isNew?: boolean;
  isBestseller?: boolean;
}

interface Review {
  id: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

// Sample data for demonstration
const sampleProduct: Product = {
  id: "1",
  name: "سماعات بلوتوث لاسلكية عالية الجودة",
  price: 299,
  originalPrice: 399,
  description: "سماعات بلوتوث عالية الجودة مع تقنية إلغاء الضوضاء النشطة وبطارية تدوم حتى 30 ساعة. تصميم مريح وأنيق مناسب للاستخدام اليومي والسفر. تتميز بجودة صوت استثنائية وتقنيات متقدمة تجعلها الخيار الأمثل لعشاق الموسيقى والمحترفين.",
  images: [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=600"
  ],
  rating: 4.5,
  reviewCount: 128,
  inStock: true,
  category: "إلكترونيات",
  brand: "TechSound",
  features: [
    "إلغاء الضوضاء النشطة",
    "بطارية تدوم 30 ساعة",
    "اتصال بلوتوث 5.0",
    "مقاوم للماء IPX4",
    "شحن سريع",
    "صوت عالي الدقة",
    "تحكم باللمس",
    "ميكروفون مدمج"
  ],
  specifications: {
    "نوع الاتصال": "بلوتوث 5.0",
    "مدة البطارية": "30 ساعة",
    "وقت الشحن": "2 ساعة",
    "المقاومة": "IPX4",
    "الوزن": "250 جرام",
    "الضمان": "سنتان",
    "نطاق التردد": "20Hz - 20kHz",
    "المدى": "10 متر"
  },
  variants: {
    colors: ["أسود", "أبيض", "أزرق", "أحمر"],
    sizes: []
  },
  discount: 25,
  isNew: false,
  isBestseller: true
};

const sampleReviews: Review[] = [
  {
    id: "1",
    userName: "أحمد محمد",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    rating: 5,
    comment: "منتج رائع وجودة ممتازة، التوصيل كان سريعاً جداً. أنصح به بشدة! جودة الصوت مذهلة وإلغاء الضوضاء يعمل بشكل مثالي.",
    date: "2024-01-15",
    helpful: 12,
    verified: true
  },
  {
    id: "2",
    userName: "فاطمة علي",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    rating: 4,
    comment: "جيد جداً بالنسبة لسعره، لكن تمنيت لو كانت البطارية تدوم أطول. التصميم أنيق والراحة ممتازة.",
    date: "2024-01-12",
    helpful: 8,
    verified: true
  },
  {
    id: "3",
    userName: "محمد السعد",
    rating: 5,
    comment: "أفضل سماعات اشتريتها على الإطلاق! جودة الصوت رائعة وإلغاء الضوضاء ممتاز. تستحق كل ريال دفعته فيها.",
    date: "2024-01-10",
    helpful: 15,
    verified: false
  },
  {
    id: "4",
    userName: "نورا الحربي",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100",
    rating: 5,
    comment: "ممتازة للرياضة والسفر. مقاومة الماء تعمل بشكل رائع والصوت واضح جداً حتى أثناء التمرين.",
    date: "2024-01-08",
    helpful: 6,
    verified: true
  }
];

// Main Product Detail Page Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ProductDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would use params.id to fetch the specific product
  // For now, we'll just use the sample data
  // Note: params.id is available but we're using sample data for this demo
  const [product] = useState<Product>(sampleProduct);
  const [activeImage, setActiveImage] = useState<string>(sampleProduct.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>(sampleProduct.variants?.colors?.[0] || '');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
    userName: ''
  });

  return (
    <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500 mb-6 sm:mb-8">
            <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
            <span className="text-gray-400">›</span>
            <Link href="/products" className="hover:text-blue-600 transition-colors">المنتجات</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900 truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 mb-8 sm:mb-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl shadow-lg overflow-hidden group">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Zoom Button */}
                <button
                  onClick={() => setIsImageZoomed(true)}
                  className="absolute top-4 left-4 bg-white bg-opacity-80 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                {/* Badges */}
                <div className="absolute top-4 right-4 space-y-2">
                  {product.discount && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      -{product.discount}%
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full block">
                      جديد
                    </span>
                  )}
                  {product.isBestseller && (
                    <span className="bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full block">
                      الأكثر مبيعاً
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(image)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                      activeImage === image
                        ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-4 sm:space-y-6">
              {/* Category & Brand */}
              <div className="flex items-center space-x-2 space-x-reverse text-sm">
                <span className="text-blue-600 font-medium">{product.category}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{product.brand}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.rating} ({product.reviewCount} تقييم)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                  {product.price} ر.س
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {product.originalPrice} ر.س
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
                      وفر {product.originalPrice - product.price} ر.س
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center space-x-2 space-x-reverse">
                {product.inStock ? (
                  <>
                    <span className="text-green-500">✓</span>
                    <span className="text-green-600 font-semibold">متوفر في المخزن</span>
                  </>
                ) : (
                  <>
                    <span className="text-red-500">⚠</span>
                    <span className="text-red-600 font-semibold">غير متوفر حالياً</span>
                  </>
                )}
              </div>

              {/* Color Selection */}
              {product.variants?.colors && product.variants.colors.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">اللون</h3>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    {product.variants.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                          selectedColor === color
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
                  <div className="flex items-center border border-gray-300 rounded-lg w-full sm:w-auto">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors flex-shrink-0"
                    >
                      −
                    </button>
                    <span className="px-6 py-3 text-lg font-semibold min-w-[60px] text-center flex-1 sm:flex-initial">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="p-3 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors flex-shrink-0"
                    >
                      +
                    </button>
                  </div>

                  <button
                    disabled={!product.inStock}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 space-x-reverse font-semibold"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    <span>إضافة للسلة</span>
                  </button>

                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>

                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">المميزات الرئيسية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-gray-600">ضمان شامل</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span className="text-gray-600">شحن مجاني</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-gray-600">دعم فني 24/7</span>
                  </div>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-600">جودة مضمونة</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 space-x-reverse px-6">
                {[
                  {
                    id: 'description',
                    name: 'الوصف',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  },
                  {
                    id: 'specifications',
                    name: 'المواصفات',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  },
                  {
                    id: 'reviews',
                    name: 'التقييمات',
                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'description' | 'specifications' | 'reviews')}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="ml-2">{tab.icon}</span>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === 'description' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">وصف المنتج</h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">المميزات الخاصة</h4>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-blue-500">✓</span>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">المواصفات التقنية</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-900">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">آراء العملاء</h3>
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {showReviewForm ? 'إلغاء' : 'إضافة تقييم'}
                    </button>
                  </div>

                  {/* Add Review Form */}
                  {showReviewForm && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">إضافة تقييمك</h4>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        // Here you would typically send the review to your backend
                        console.log('New review:', newReview);
                        setShowReviewForm(false);
                        setNewReview({ rating: 5, comment: '', userName: '' });
                      }} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسمك
                          </label>
                          <input
                            type="text"
                            value={newReview.userName}
                            onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="أدخل اسمك"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            التقييم
                          </label>
                          <div className="flex items-center space-x-2 space-x-reverse">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                className={`text-2xl ${star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                              >
                                ★
                              </button>
                            ))}
                            <span className="text-sm text-gray-600 mr-2">({newReview.rating} من 5)</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            تعليقك
                          </label>
                          <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="شاركنا رأيك في المنتج..."
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-3 space-x-reverse">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            إرسال التقييم
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            إلغاء
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">{product.rating}</div>
                      <div className="flex items-center justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">من {product.reviewCount} تقييم</div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <div key={stars} className="flex items-center space-x-3 space-x-reverse">
                          <span className="text-sm text-gray-600 w-8">{stars} ⭐</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${Math.random() * 80 + 10}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{Math.floor(Math.random() * 50)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {sampleReviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6">
                        <div className="flex items-start space-x-4 space-x-reverse">
                          {review.userAvatar && (
                            <Image
                              src={review.userAvatar}
                              alt={review.userName}
                              width={48}
                              height={48}
                              className="rounded-full"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 space-x-reverse mb-2">
                              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                              {review.verified && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                  مشتري موثق
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 space-x-reverse mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-600 mb-3">{review.comment}</p>
                            <div className="flex items-center space-x-4 space-x-reverse">
                              <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 space-x-reverse">
                                <span>👍</span>
                                <span>مفيد ({review.helpful})</span>
                              </button>
                              <button className="text-sm text-gray-500 hover:text-gray-700">
                                رد
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">منتجات مشابهة</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  id: 1,
                  name: "ساعة ذكية رياضية",
                  price: 199,
                  originalPrice: 249,
                  image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                  rating: 4.8,
                  reviewCount: 89,
                  discount: 20
                },
                {
                  id: 2,
                  name: "هاتف ذكي متطور",
                  price: 1299,
                  image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                  rating: 4.6,
                  reviewCount: 156
                },
                {
                  id: 3,
                  name: "كاميرا رقمية احترافية",
                  price: 899,
                  originalPrice: 1199,
                  image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                  rating: 4.7,
                  reviewCount: 203,
                  discount: 25
                },
                {
                  id: 4,
                  name: "لابتوب عالي الأداء",
                  price: 2499,
                  originalPrice: 2999,
                  image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
                  rating: 4.9,
                  reviewCount: 312,
                  discount: 17
                }
              ].map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="aspect-square relative">
                      <Image
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover"
                      />
                      {relatedProduct.discount && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          -{relatedProduct.discount}%
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center space-x-2 space-x-reverse mb-2">
                        <span className="text-lg font-bold text-blue-600">{relatedProduct.price} ر.س</span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">{relatedProduct.originalPrice} ر.س</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 space-x-reverse">
                        {[...Array(5)].map((_, j) => (
                          <span key={j} className={`text-sm ${j < Math.floor(relatedProduct.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-500">({relatedProduct.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Image Zoom Modal */}
          {isImageZoomed && (
            <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
              <div className="relative max-w-4xl max-h-full">
                <button
                  onClick={() => setIsImageZoomed(false)}
                  className="absolute top-4 right-4 bg-white bg-opacity-80 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-100 transition-all z-10"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Image
                  src={activeImage}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            </div>
          )}
      </div>
    </div>
  );
}