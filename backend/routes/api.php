<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PublicDataController;
use App\Http\Controllers\Api\RegisterController;

Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'store']);
Route::get('/home', [PublicDataController::class, 'home']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    // Admin Dashboard
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

    // Resources
    Route::apiResource('customers', CustomerController::class)->only(['index']);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('categories', CategoryController::class);

    // [إضافة] Inventory Routes
    Route::get('/inventory', [InventoryController::class, 'index']);
    Route::put('/inventory/{product}', [InventoryController::class, 'update']);

    Route::get('/orders', [OrderController::class, 'index']);

    Route::get('/analytics', [AnalyticsController::class, 'index']);

});

