'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Define Product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  category: string;
  brand: string;
  inStock: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  discount?: number;
  tags?: string[];
}

// Define ProductCard props interface
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
  onAddToWishlist?: (productId: string) => void;
  onQuickView?: (product: Product) => void;
  isInWishlist?: boolean;
  className?: string;
  showQuickActions?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  isInWishlist = false,
  className = '',
  showQuickActions = true,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Calculate discount percentage
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0;

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && product.inStock) {
      onAddToCart(product.id);
    }
  };

  // Handle add to wishlist
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product.id);
    }
  };

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Render star rating
  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`text-sm ${
          index < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      >
        ★
      </span>
    ));
  };

  return (
    <div className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${className}`}>
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden">
        {/* Product Image */}
        <Link href={`/products/${product.id}`}>
          <div className="relative w-full h-full bg-gray-100">
            {!imageError ? (
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            
            {/* Loading skeleton */}
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-3 right-3 space-y-2">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg block">
              جديد
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg block">
              الأكثر مبيعاً
            </span>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div className="absolute top-3 left-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {/* Wishlist Button */}
            <button
              onClick={handleAddToWishlist}
              className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              title={isInWishlist ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}
            >
              <svg
                className={`w-4 h-4 transition-colors duration-300 ${
                  isInWishlist ? 'text-red-500 fill-current' : 'text-gray-700 hover:text-red-500'
                }`}
                fill={isInWishlist ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>

            {/* Quick View Button */}
            <button
              onClick={handleQuickView}
              className="bg-white bg-opacity-90 backdrop-blur-sm p-2 rounded-full hover:bg-opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              title="عرض سريع"
            >
              <svg className="w-4 h-4 text-gray-700 hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold shadow-lg">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Product Title */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          <Link 
            href={`/products/${product.id}`} 
            className="hover:text-blue-600 transition-colors duration-300"
            title={product.name}
          >
            {product.name}
          </Link>
        </h3>

        {/* Product Description */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center space-x-2 space-x-reverse mb-3">
          <span className="text-lg font-bold text-blue-600">
            {product.price.toLocaleString()} د.م.
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {product.originalPrice.toLocaleString()} د.م.
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 space-x-reverse mb-4">
          <div className="flex">{renderStars()}</div>
          <span className="text-sm text-gray-500 mr-1">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 space-x-reverse ${
            product.inStock
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5'
              : 'bg-gray-400 text-white cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          <span>{product.inStock ? 'إضافة للسلة' : 'غير متوفر'}</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
