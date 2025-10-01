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
use App\Http\Controllers\Api\SliderController;
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
Route::get('/search', [PublicDataController::class, 'search']);
Route::get('/offers', [PublicDataController::class, 'offers']);
Route::get('/products/{slug}', [PublicDataController::class, 'show']);
Route::post('/products-by-ids', [PublicDataController::class, 'productsByIds']);
Route::post('/contact', [ContactController::class, 'store']);

// Public Sliders Route
Route::get('/sliders/active', [SliderController::class, 'active']);

// Public routes
Route::get('/public/colors', [ColorController::class, 'index']);
Route::get('/public/sizes', [SizeController::class, 'index']);
Route::get('/public/categories', [CategoryController::class, 'index']);
Route::get('/public/brands', [BrandController::class, 'index']);
Route::get('/public/products/{product}', [ProductController::class, 'showPublic']);
Route::get('/public/products/{product}/variants', [ProductVariantController::class, 'getProductVariants']);

// Product Reviews Public Routes
Route::get('/products/{product}/reviews', [ProductReviewController::class, 'index']);

// Product Videos Public Routes
Route::get('/products/{product}/videos', [ProductVideoController::class, 'index']);

// Public Checkout Routes (لا تحتاج authentication)
Route::post('/validate-coupon', [OrderController::class, 'validateCoupon']);
Route::post('/shipping-costs', [OrderController::class, 'getShippingCosts']);

// Test authentication endpoint (no middleware)
Route::get('/test-auth-debug', function(Request $request) {
    $token = $request->bearerToken();
    $user = null;
    $tokenValid = false;

    if ($token) {
        try {
            $personalAccessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token);
            if ($personalAccessToken) {
                $user = $personalAccessToken->tokenable;
                $tokenValid = true;
            }
        } catch (Exception $e) {
            // Token validation failed
        }
    }

    return response()->json([
        'success' => true,
        'token_present' => !!$token,
        'token_preview' => $token ? substr($token, 0, 20) . '...' : null,
        'token_valid' => $tokenValid,
        'user' => $user ? ['id' => $user->id, 'name' => $user->name, 'email' => $user->email] : null,
        'auth_check' => Auth::check(),
        'sanctum_guard' => config('sanctum.guard')
    ]);
});

// Test authentication endpoint
Route::get('/test-auth', function(Request $request) {
    return response()->json([
        'success' => true,
        'authenticated' => Auth::check(),
        'user' => Auth::user(),
        'token_present' => $request->hasHeader('Authorization'),
        'token_preview' => $request->header('Authorization') ? substr($request->header('Authorization'), 0, 20) . '...' : null
    ]);
})->middleware('auth:sanctum');

// Simple order test endpoint
Route::post('/test-order', function(Request $request) {
    Log::info('Test order request received', [
        'has_auth_header' => $request->hasHeader('Authorization'),
        'auth_header' => $request->header('Authorization') ? substr($request->header('Authorization'), 0, 20) . '...' : null,
        'user_id' => Auth::id(),
        'user' => Auth::user() ? ['id' => Auth::user()->id, 'name' => Auth::user()->name] : null,
        'request_data' => $request->all()
    ]);

    if (!Auth::check()) {
        return response()->json([
            'success' => false,
            'message' => 'غير مصادق عليه',
            'debug' => [
                'token_present' => $request->hasHeader('Authorization'),
                'token_preview' => $request->header('Authorization') ? substr($request->header('Authorization'), 0, 20) . '...' : null
            ]
        ], 401);
    }

    return response()->json([
        'success' => true,
        'message' => 'تم الاختبار بنجاح',
        'user' => Auth::user()
    ]);
})->middleware('auth:sanctum');

// Orders Route with optional authentication
Route::post('/orders', [OrderController::class, 'store'])->middleware('auth:sanctum');

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

    // Sliders Routes
    Route::apiResource('sliders', SliderController::class);
    Route::post('sliders/{slider}/toggle-active', [SliderController::class, 'toggleActive']);
    Route::post('sliders/update-order', [SliderController::class, 'updateOrder']);

    // Colors & Sizes & Product Variants Routes
    Route::apiResource('colors', ColorController::class);
    Route::apiResource('sizes', SizeController::class);
    Route::apiResource('product-variants', ProductVariantController::class);
    Route::post('/product-variants/bulk', [ProductVariantController::class, 'storeBulk']);

    // [إضافة] Inventory Routes
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::put('/inventory/{product}', [InventoryController::class, 'update']);

    // Orders Routes (للقراءة والتحديث فقط)
    Route::get('/orders', [OrderController::class, 'index']);
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

