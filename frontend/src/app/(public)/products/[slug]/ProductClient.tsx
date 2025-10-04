"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Loader2, ShoppingCart, Heart, Share2 } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';
import ProductReviews from '@/components/reviews/ProductReviews';

export interface ProductVariant {
  id: number;
  price: number;
  stock_quantity: number;
  color: { id: number; name: string; hex_code: string } | null;
  size: { id: number; name: string } | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  regular_price: number;
  sale_price: number | null;
  images: string[];
  thumbnail: string;
  stock_status: string;
  quantity: number;
  has_variants: boolean;
  category: { id: number; name: string; slug: string } | null;
  brand: { id: number; name: string; slug: string } | null;
  variants?: ProductVariant[];
  average_rating: number;
  total_reviews: number;
}

const formatCurrency = (amount: number): string => {
  if (isNaN(amount)) return 'ليس رقماً د.م.';
  return `${amount.toFixed(2)} د.م.`;
};

interface ProductClientProps {
  product: Product;
}

export const ProductClient: React.FC<ProductClientProps> = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(product.variants?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleAddToCart = () => {
    alert(`تم إضافة ${product.name} إلى السلة!`);
  };

  const getCurrentPrice = () => {
    if (selectedVariant) return selectedVariant.price;
    return product.sale_price || product.regular_price || 0;
  };

  const getOriginalPrice = () => {
    if (selectedVariant) return null; // لا عروض سعرية مباشرة للمتغيرات
    return product.sale_price ? product.regular_price : null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images && product.images.length > 0 ? product.images[activeImageIndex] : product.thumbnail}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        activeImageIndex === index ? 'border-blue-500' : 'border-transparent'
                      }`}
                      aria-label={`صورة رقم ${index + 1}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span>{product.category?.name || 'غير مصنف'}</span>
                  <span>•</span>
                  <span>{product.brand?.name || 'غير محدد'}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={product.average_rating} size="md" showValue />
                  <span className="text-sm text-gray-600">({product.total_reviews} تقييم)</span>
                </div>
                <p className="text-gray-600">{product.short_description}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-blue-600">{formatCurrency(getCurrentPrice())}</span>
                {getOriginalPrice() && (
                  <span className="text-xl text-gray-500 line-through">{formatCurrency(getOriginalPrice()!)}</span>
                )}
              </div>

              {product.has_variants && product.variants && product.variants.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">اختر المواصفات:</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`p-3 border rounded-lg text-sm transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        aria-label={`اختيار المتغير ${variant.id}`}
                      >
                        <div className="flex items-center gap-2">
                          {variant.color && (
                            <>
                              <div
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: variant.color.hex_code }}
                              />
                              <span>{variant.color.name}</span>
                            </>
                          )}
                          {variant.color && variant.size && <span>•</span>}
                          {variant.size && <span>{variant.size.name}</span>}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{formatCurrency(variant.price)}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg" aria-label="تحديد الكمية">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    aria-label="إنقاص الكمية"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x" aria-live="polite">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    aria-label="زيادة الكمية"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  إضافة إلى السلة
                </button>

                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="إضافة للمفضلة">
                  <Heart className="w-5 h-5" />
                </button>

                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" aria-label="مشاركة المنتج">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  product.stock_status === 'instock' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-sm">
                  {product.stock_status === 'instock' ? 'متوفر في المخزن' : 'غير متوفر'}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">وصف المنتج</h3>
                <div className="prose max-w-none text-gray-700">
                  {product.description}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">التقييمات والمراجعات</h3>
                <ProductReviews productId={product.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductClient;
