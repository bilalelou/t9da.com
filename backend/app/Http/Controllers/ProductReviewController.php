<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ProductReviewController extends Controller
{
    /**
     * Get all reviews for a specific product.
     */
    public function index(Request $request, Product $product): JsonResponse
    {
        $perPage = $request->get('per_page', 10);
        $rating = $request->get('rating');
        $sortBy = $request->get('sort_by', 'newest'); // newest, oldest, helpful, rating_high, rating_low

        $query = $product->verifiedReviews()
            ->with(['user:id,name']);

        // Filter by rating if specified
        if ($rating) {
            $query->where('rating', $rating);
        }

        // Apply sorting
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'helpful':
                $query->orderByHelpful();
                break;
            case 'rating_high':
                $query->orderBy('rating', 'desc');
                break;
            case 'rating_low':
                $query->orderBy('rating', 'asc');
                break;
            default: // newest
                $query->newest();
                break;
        }

        $reviews = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => [
                'reviews' => $reviews,
                'average_rating' => round($product->average_rating, 1),
                'total_reviews' => $product->total_reviews,
                'rating_breakdown' => $product->rating_breakdown,
            ],
        ]);
    }

    /**
     * Store a new review for a product.
     */
    public function store(Request $request, Product $product): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        // Check if user already reviewed this product
        $existingReview = ProductReview::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existingReview) {
            return response()->json([
                'success' => false,
                'message' => 'You have already reviewed this product. You can update your existing review.',
            ], 409);
        }

        $review = ProductReview::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_verified' => false, // Admin will verify later
        ]);

        $review->load(['user:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Review submitted successfully. It will be visible after admin approval.',
            'data' => $review,
        ], 201);
    }

    /**
     * Update user's existing review.
     */
    public function update(Request $request, Product $product, ProductReview $review): JsonResponse
    {
        $user = Auth::user();

        // Check if user owns this review
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only update your own reviews.',
            ], 403);
        }

        $validator = Validator::make($request->all(), [
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_verified' => false, // Reset verification status after update
        ]);

        $review->load(['user:id,name']);

        return response()->json([
            'success' => true,
            'message' => 'Review updated successfully.',
            'data' => $review,
        ]);
    }

    /**
     * Delete user's review.
     */
    public function destroy(Product $product, ProductReview $review): JsonResponse
    {
        $user = Auth::user();

        // Check if user owns this review
        if ($review->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You can only delete your own reviews.',
            ], 403);
        }

        $review->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully.',
        ]);
    }

    /**
     * Get user's review for a specific product.
     */
    public function getUserReview(Product $product): JsonResponse
    {
        $user = Auth::user();

        $review = ProductReview::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->with(['user:id,name'])
            ->first();

        return response()->json([
            'success' => true,
            'data' => $review,
        ]);
    }

    /**
     * Mark a review as helpful.
     */
    public function markHelpful(ProductReview $review): JsonResponse
    {
        $review->increment('helpful_count');
        $review->update(['is_helpful' => true]);

        return response()->json([
            'success' => true,
            'message' => 'Review marked as helpful.',
            'helpful_count' => $review->helpful_count,
        ]);
    }
}
