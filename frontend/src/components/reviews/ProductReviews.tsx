'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Filter, ChevronDown } from 'lucide-react';
import useReviews from '@/hooks/useReviews';
import ReviewsSummary from './ReviewsSummary';
import ReviewsList from './ReviewsList';
import AddReview from './AddReview';
import StarRating from '@/components/ui/StarRating';

interface ProductReviewsProps {
  productId: number;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  // Mock user for now - replace with actual auth when needed
  const user = null;
  
  const {
    reviews,
    reviewsData,
    userReview,
    loading,
    submitting,
    currentPage,
    fetchReviews,
    submitReview,
    updateReview,
    deleteReview,
    markHelpful,
  } = useReviews(productId);

  const [showAddReview, setShowAddReview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmitReview = async (reviewData: { rating: number; comment: string }) => {
    try {
      if (isEditing && userReview) {
        await updateReview(userReview.id, reviewData);
      } else {
        await submitReview(reviewData);
      }
      setShowAddReview(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      // You can add a toast notification here
    }
  };

  const handleDeleteReview = async () => {
    if (!userReview) return;
    
    if (window.confirm('هل أنت متأكد من حذف التقييم؟')) {
      try {
        await deleteReview(userReview.id);
      } catch (error) {
        console.error('Error deleting review:', error);
        // You can add a toast notification here
      }
    }
  };

  const handleFilterChange = (rating: number | null) => {
    setFilterRating(rating);
    fetchReviews(1, rating || undefined, sortBy);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    fetchReviews(currentPage, filterRating || undefined, newSortBy);
  };

  const handlePageChange = (page: number) => {
    fetchReviews(page, filterRating || undefined, sortBy);
  };

  const sortOptions = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'helpful', label: 'الأكثر فائدة' },
    { value: 'rating_high', label: 'التقييم الأعلى' },
    { value: 'rating_low', label: 'التقييم الأقل' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary */}
      {reviewsData && (
        <ReviewsSummary
          averageRating={reviewsData.average_rating}
          totalReviews={reviewsData.total_reviews}
          ratingBreakdown={reviewsData.rating_breakdown}
          isLoading={loading}
        />
      )}

      {/* User Review Section */}
      {user && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            تقييمك
          </h3>
          
          {userReview ? (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <StarRating rating={userReview.rating} size="md" />
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowAddReview(true);
                      }}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      تعديل
                    </button>
                    <button
                      onClick={handleDeleteReview}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
                <p className="text-gray-700">{userReview.comment}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                  <span>
                    {userReview.is_verified ? '✅ تم التحقق' : '⏳ في انتظار المراجعة'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">لم تقم بتقييم هذا المنتج بعد</p>
              <button
                onClick={() => setShowAddReview(true)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                إضافة تقييم
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Review Form */}
      {showAddReview && (
        <AddReview
          productId={productId}
          onSubmit={handleSubmitReview}
          onCancel={() => {
            setShowAddReview(false);
            setIsEditing(false);
          }}
          isLoading={submitting}
          existingReview={isEditing ? userReview : null}
          isEditing={isEditing}
        />
      )}

      {/* Reviews Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            التقييمات ({reviewsData?.total_reviews || 0})
          </h3>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>فلترة وترتيب</span>
            <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  فلترة حسب التقييم
                </label>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleFilterChange(null)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filterRating === null
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    الكل
                  </button>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange(rating)}
                      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${
                        filterRating === rating
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {rating} ⭐
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ترتيب حسب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <ReviewsList
          reviews={reviews}
          isLoading={loading}
          onMarkHelpful={markHelpful}
        />

        {/* Pagination */}
        {reviewsData && reviewsData.reviews.last_page > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex gap-2">
              {Array.from({ length: reviewsData.reviews.last_page }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    currentPage === i + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;