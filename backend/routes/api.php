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
use App\Http\Controllers\Api\SettingController;

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

// Public Products by Type Routes (يجب أن تكون قبل المسار العام)
Route::get('/public/products/featured', [ProductController::class, 'getFeaturedProducts']);
Route::get('/public/products/today-offers', [ProductController::class, 'getTodayOffers']);
Route::get('/public/products/new-arrivals', [ProductController::class, 'getNewArrivals']);
Route::get('/public/products/petits-prix', [ProductController::class, 'getPetitsPrix']);
Route::get('/public/products/trending', [ProductController::class, 'getTrendingProducts']);
Route::get('/public/products/electronics', [ProductController::class, 'getElectronicsProducts']);

// مسار تشخيص للتأكد من عمل API
Route::get('/public/products/test', function() {
    try {
        $productsCount = \App\Models\Product::count();
        $featuredCount = \App\Models\Product::where('is_featured', true)->count();
        $saleCount = \App\Models\Product::whereNotNull('sale_price')->where('sale_price', '>', 0)->count();
        $trendingCount = \App\Models\Product::where('quantity', '>', 10)->count();
        $electronicsCount = \App\Models\Product::where('name', 'like', '%هاتف%')
            ->orWhere('name', 'like', '%لابتوب%')
            ->orWhere('name', 'like', '%سماعة%')
            ->count();

        return response()->json([
            'success' => true,
            'message' => 'API يعمل بشكل صحيح',
            'timestamp' => now(),
            'database_connection' => 'متصل',
            'products_count' => $productsCount,
            'featured_products' => $featuredCount,
            'sale_products' => $saleCount,
            'trending_products' => $trendingCount,
            'electronics_products' => $electronicsCount,
            'sample_products' => \App\Models\Product::limit(3)->get(['id', 'name', 'regular_price', 'sale_price', 'is_featured', 'quantity'])
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'خطأ في قاعدة البيانات',
            'error' => $e->getMessage()
        ], 500);
    }
});

// مسارات تشخيص للقسمين الجديدين
Route::get('/public/products/test-trending', function() {
    try {
        $products = \App\Models\Product::where('quantity', '>', 10)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'quantity', 'created_at']);

        return response()->json([
            'success' => true,
            'message' => 'اختبار المنتجات الرائجة',
            'count' => $products->count(),
            'products' => $products
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

Route::get('/public/products/test-electronics', function() {
    try {
        $products = \App\Models\Product::where('name', 'like', '%هاتف%')
            ->orWhere('name', 'like', '%لابتوب%')
            ->orWhere('name', 'like', '%سماعة%')
            ->limit(5)
            ->get(['id', 'name']);

        return response()->json([
            'success' => true,
            'message' => 'اختبار منتجات الإلكترونيات',
            'count' => $products->count(),
            'products' => $products
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// المسارات العامة للمنتجات (يجب أن تكون في النهاية)
Route::get('/public/products/{product}', [ProductController::class, 'showPublic']);
Route::get('/public/products/{product}/variants', [ProductVariantController::class, 'getProductVariants']);

// Product Reviews Public Routes
Route::get('/products/{product}/reviews', [ProductReviewController::class, 'index']);

// Product Videos Public Routes
Route::get('/products/{product}/videos', [ProductVideoController::class, 'index']);

// Public Checkout Routes (لا تحتاج authentication)
Route::post('/validate-coupon', [OrderController::class, 'validateCoupon']);
Route::post('/shipping-costs', [OrderController::class, 'getShippingCosts']);

// Orders Route with optional authentication
Route::post('/orders', [OrderController::class, 'store'])->middleware('auth:sanctum');

// Public Cities Routes (للعرض العام)
Route::get('/cities/active', [CityController::class, 'active']);
Route::get('/shipping-costs', [CityController::class, 'getShippingCosts']);

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

    // Settings Routes
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'store']);
    Route::get('/settings/{key}', [SettingController::class, 'show']);
    Route::put('/settings/{key}', [SettingController::class, 'update']);
    Route::delete('/settings/{key}', [SettingController::class, 'destroy']);
    Route::get('/settings/defaults/all', [SettingController::class, 'getDefaults']);
    Route::post('/settings/initialize/defaults', [SettingController::class, 'initializeDefaults']);
});

