'use client';

import React from 'react';
import { Star } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

interface ReviewsSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  isLoading?: boolean;
}

const ReviewsSummary: React.FC<ReviewsSummaryProps> = ({
  averageRating,
  totalReviews,
  ratingBreakdown,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-32 mb-4"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 bg-gray-300 rounded"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
              <div className="h-2 bg-gray-300 rounded flex-1"></div>
              <div className="h-3 w-6 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        ملخص التقييمات
      </h3>

      {totalReviews === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-600">لا توجد تقييمات بعد</p>
        </div>
      ) : (
        <>
          {/* Overall Rating */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {averageRating.toFixed(1)}
              </div>
              <StarRating rating={averageRating} size="md" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 mb-1">
                متوسط التقييم
              </p>
              <p className="text-sm text-gray-500">
                بناءً على {totalReviews} تقييم
              </p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingBreakdown[star as keyof typeof ratingBreakdown];
              const percentage = getPercentage(count);
              
              return (
                <div key={star} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm text-gray-700">{star}</span>
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8 text-left">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsSummary;