'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import StarRating from '@/components/ui/StarRating';

interface AddReviewProps {
  productId: number;
  onSubmit: (reviewData: { rating: number; comment: string }) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  existingReview?: {
    rating: number;
    comment: string;
  } | null;
  isEditing?: boolean;
}

const AddReview: React.FC<AddReviewProps> = ({
  productId,
  onSubmit,
  onCancel,
  isLoading = false,
  existingReview = null,
  isEditing = false,
}) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});

  const validateForm = () => {
    const newErrors: { rating?: string; comment?: string } = {};

    if (rating === 0) {
      newErrors.rating = 'يجب اختيار تقييم';
    }

    if (comment.trim().length < 10) {
      newErrors.comment = 'يجب أن يكون التعليق 10 أحرف على الأقل';
    }

    if (comment.trim().length > 1000) {
      newErrors.comment = 'التعليق طويل جداً (الحد الأقصى 1000 حرف)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        rating,
        comment: comment.trim(),
      });
    }
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    if (errors.rating) {
      setErrors({ ...errors, rating: undefined });
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (errors.comment) {
      setErrors({ ...errors, comment: undefined });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {isEditing ? 'تعديل التقييم' : 'إضافة تقييم'}
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التقييم *
          </label>
          <div className="flex items-center gap-2">
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={handleRatingChange}
              size="lg"
            />
            {rating > 0 && (
              <span className="text-sm text-gray-600">
                ({rating} من 5)
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-red-600 text-sm mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            التعليق *
          </label>
          <textarea
            value={comment}
            onChange={handleCommentChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            placeholder="شاركنا رأيك في هذا المنتج..."
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment && (
              <p className="text-red-600 text-sm">{errors.comment}</p>
            )}
            <p className="text-sm text-gray-500 mr-auto">
              {comment.length}/1000
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Send className="w-4 h-4" />
            )}
            {isEditing ? 'تحديث التقييم' : 'إرسال التقييم'}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إلغاء
            </button>
          )}
        </div>
      </form>

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          ℹ️ سيتم مراجعة تقييمك من قبل الإدارة قبل نشره
        </p>
      </div>
    </div>
  );
};

export default AddReview;