'use client';

import React from 'react';
import { ThumbsUp, User, Star } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

interface Review {
  id: number;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
}

interface ReviewsListProps {
  reviews: Review[];
  isLoading?: boolean;
  onMarkHelpful?: (reviewId: number) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  isLoading = false,
  onMarkHelpful,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-32"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="text-gray-400 mb-4">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد تقييمات بعد
          </h3>
          <p className="text-gray-600">
            كن أول من يقيم هذا المنتج
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {review.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{review.user.name}</h4>
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-gray-500">
                    {formatDate(review.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <div className="mb-3">
              <p className="text-gray-700 leading-relaxed">
                {review.comment}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              onClick={() => onMarkHelpful?.(review.id)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>مفيد ({review.helpful_count})</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewsList;