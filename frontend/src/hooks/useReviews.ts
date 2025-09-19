'use client';

import { useState, useEffect } from 'react';

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

interface ReviewsResponse {
  reviews: {
    data: Review[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

interface UserReview {
  id: number;
  rating: number;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

const useReviews = (productId: number) => {
  // Mock user data for now - replace with actual auth when needed
  const user = null;
  const token = null;
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [userReview, setUserReview] = useState<UserReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReviews = async (page = 1, rating?: number, sortBy?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '10',
      });
      
      if (rating) params.append('rating', rating.toString());
      if (sortBy) params.append('sort_by', sortBy);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews?${params}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReviewsData(data.data);
          setReviews(data.data.reviews.data);
          setCurrentPage(page);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserReview = async () => {
    if (!user || !token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews/user`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserReview(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user review:', error);
    }
  };

  const submitReview = async (reviewData: { rating: number; comment: string }) => {
    if (!user || !token) {
      throw new Error('يجب تسجيل الدخول لإضافة تقييم');
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchReviews(currentPage);
        await fetchUserReview();
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'فشل في إضافة التقييم');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateReview = async (reviewId: number, reviewData: { rating: number; comment: string }) => {
    if (!user || !token) {
      throw new Error('يجب تسجيل الدخول لتعديل التقييم');
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews/${reviewId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(reviewData),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchReviews(currentPage);
        await fetchUserReview();
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'فشل في تعديل التقييم');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (reviewId: number) => {
    if (!user || !token) {
      throw new Error('يجب تسجيل الدخول لحذف التقييم');
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/reviews/${reviewId}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        await fetchReviews(currentPage);
        await fetchUserReview();
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'فشل في حذف التقييم');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  };

  const markHelpful = async (reviewId: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${reviewId}/helpful`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the helpful count in the local state
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? { ...review, helpful_count: data.helpful_count }
              : review
          )
        );
        return { success: true, message: data.message };
      } else {
        throw new Error(data.message || 'فشل في تحديث التقييم');
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  useEffect(() => {
    if (user && token) {
      fetchUserReview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, productId]);

  return {
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
  };
};

export default useReviews;