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

use App\Http\Controllers\Api\UserController;

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'store']);
Route::get('/home', [PublicDataController::class, 'home']);
Route::get('/shop', [PublicDataController::class, 'shop']);
Route::get('/products/{slug}', [PublicDataController::class, 'show']);
Route::post('/products-by-ids', [PublicDataController::class, 'productsByIds']);
Route::post('/contact', [ContactController::class, 'store']);


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
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('brands', BrandController::class);


    // [إضافة] Inventory Routes
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::put('/inventory/{product}', [InventoryController::class, 'update']);

    Route::get('/orders', [OrderController::class, 'index']);

    Route::get('/analytics', [AnalyticsController::class, 'index']);
    Route::apiResource('coupons', CouponController::class);
});

