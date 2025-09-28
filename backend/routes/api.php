<?php

use App\Http\Controllers\Api\AddressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\BrandController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PublicDataController;
use App\Http\Controllers\Api\RegisterController;
use App\Http\Controllers\Api\UserDashboardController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Admin\ProductVideoController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ColorController;
use App\Http\Controllers\Api\SizeController;
use App\Http\Controllers\Api\ProductVariantController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\Api\CityController;

use App\Http\Controllers\Api\UserController;

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'store']);
Route::get('/home', [PublicDataController::class, 'home']);
Route::get('/shop', [PublicDataController::class, 'shop']);
Route::get('/products/{slug}', [PublicDataController::class, 'show']);
Route::post('/products-by-ids', [PublicDataController::class, 'productsByIds']);
Route::post('/contact', [ContactController::class, 'store']);

// Public routes
Route::get('/public/colors', [ColorController::class, 'index']);
Route::get('/public/sizes', [SizeController::class, 'index']);
Route::get('/public/products/{product}/variants', [ProductVariantController::class, 'getProductVariants']);

// Product Reviews Public Routes
Route::get('/products/{product}/reviews', [ProductReviewController::class, 'index']);

// Product Videos Public Routes
Route::get('/products/{product}/videos', [ProductVideoController::class, 'index']);

// Public Checkout Routes (لا تحتاج authentication)
Route::post('/validate-coupon', [OrderController::class, 'validateCoupon']);
Route::post('/shipping-costs', [OrderController::class, 'getShippingCosts']);

// Public Cities Routes (للعرض العام)
Route::get('/cities/active', [CityController::class, 'active']);

// Public Free Shipping Routes
Route::get('/products/free-shipping/public', [ProductController::class, 'freeShippingProducts']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user()->load('roles'));

    // Admin Dashboard

    Route::get('/user/dashboard', [UserDashboardController::class, 'index']);

    Route::apiResource('addresses', AddressController::class);

    // Resources
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

    Route::apiResource('users', UserController::class);
    Route::post('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
    Route::apiResource('products', ProductController::class);
    Route::post('/products/bulk-store', [ProductController::class, 'storeBulk']);

    // Product Videos Routes
    Route::prefix('products/{product}')->group(function () {
        // Route::get('videos', [ProductVideoController::class, 'index']); // Moved to public routes
        Route::post('videos', [ProductVideoController::class, 'store']);
        Route::post('videos/upload', [ProductVideoController::class, 'uploadVideo']); // رفع فيديو محلي
        Route::get('videos/{video}', [ProductVideoController::class, 'show']);
        Route::put('videos/{video}', [ProductVideoController::class, 'update']);
        Route::delete('videos/{video}', [ProductVideoController::class, 'destroy']);
        Route::put('videos-order', [ProductVideoController::class, 'updateOrder']);
    });
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('brands', BrandController::class);

    // Colors & Sizes & Product Variants Routes
    Route::apiResource('colors', ColorController::class);
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('product-variants', ProductVariantController::class);
    Route::post('/product-variants/bulk', [ProductVariantController::class, 'storeBulk']);

    // [إضافة] Inventory Routes
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::put('/inventory/{product}', [InventoryController::class, 'update']);

    // Orders Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    Route::get('/analytics', [AnalyticsController::class, 'index']);
    Route::apiResource('coupons', CouponController::class);

    // Notifications Routes
    Route::apiResource('notifications', NotificationController::class);
    Route::post('/notifications/{notification}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/{notification}/mark-as-unread', [NotificationController::class, 'markAsUnread']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/delete-read', [NotificationController::class, 'deleteRead']);
    Route::get('/notifications-recent', [NotificationController::class, 'recent']);

    // Product Reviews Routes (Authenticated)
    Route::prefix('products/{product}')->group(function () {
        Route::post('reviews', [ProductReviewController::class, 'store']);
        Route::get('reviews/user', [ProductReviewController::class, 'getUserReview']);
        Route::put('reviews/{review}', [ProductReviewController::class, 'update']);
        Route::delete('reviews/{review}', [ProductReviewController::class, 'destroy']);
    });
    Route::post('/reviews/{review}/helpful', [ProductReviewController::class, 'markHelpful']);

    // Cities Routes (Admin only)
    Route::apiResource('cities', CityController::class);
    Route::post('/cities/{city}/toggle-status', [CityController::class, 'toggleStatus']);

    // Free Shipping Routes
    Route::get('/products/free-shipping', [ProductController::class, 'freeShippingProducts']);
    Route::post('/products/{product}/toggle-free-shipping', [ProductController::class, 'toggleFreeShipping']);
});

