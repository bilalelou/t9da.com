<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProductReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);

        $user = Auth::user();

        // Check if the user has purchased the product
        $hasPurchased = Order::where('user_id', $user->id)
            ->where('status', 'delivered')
            ->whereHas('orderItems', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        if (!$hasPurchased) {
            return redirect()->back()->with('error', 'You can only review products you have purchased.');
        }

        // Check if the user has already reviewed the product
        $hasReviewed = ProductReview::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->exists();

        if ($hasReviewed) {
            return redirect()->back()->with('error', 'You have already reviewed this product.');
        }

        ProductReview::create([
            'user_id' => $user->id,
            'product_id' => $product->id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->back()->with('success', 'Your review has been submitted and is pending approval.');
    }
}
