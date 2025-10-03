"use client";

import React from 'react';
import { formatPrice, formatDiscount, calculateDiscount } from '@/utils/currency';

interface PriceProps {
  price: number | string;
  originalPrice?: number | string;
  className?: string;
  showDiscount?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Price: React.FC<PriceProps> = ({ 
  price, 
  originalPrice, 
  className = '', 
  showDiscount = true,
  size = 'md'
}) => {
  const currentPrice = typeof price === 'string' ? parseFloat(price) : price;
  const oldPrice = originalPrice ? (typeof originalPrice === 'string' ? parseFloat(originalPrice) : originalPrice) : null;
  
  const hasDiscount = oldPrice && oldPrice > currentPrice;
  const discountPercentage = hasDiscount ? calculateDiscount(oldPrice, currentPrice) : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} dir="rtl">
      {/* السعر الحالي */}
      <span className={`font-bold text-green-600 ${sizeClasses[size]}`}>
        {formatPrice(currentPrice)}
      </span>
      
      {/* السعر الأصلي والخصم */}
      {hasDiscount && (
        <>
          <span className={`text-gray-500 line-through ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
            {formatPrice(oldPrice)}
          </span>
          {showDiscount && discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              -{discountPercentage}%
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default Price;