<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\CustomerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| تم تنظيم هذا الملف ليكون أكثر وضوحاً وأماناً.
|
*/

// --- 1. المسارات العامة (للمتجر) ---
// هذه المسارات يمكن لأي زائر الوصول إليها بدون تسجيل دخول.
Route::get('/products/featured', [ProductController::class, 'featured']);
// يمكنك إضافة مسارات عامة أخرى هنا، مثل عرض كل المنتجات للزبائن.

// --- 2. مسارات المصادقة (Authentication) ---
Route::post('/login', [LoginController::class, 'login']);

// --- 3. المسارات المحمية (تتطلب تسجيل دخول) ---
// جميع المسارات داخل هذه المجموعة تتطلب إرسال "توكن" صالح.
Route::middleware('auth:sanctum')->group(function () {

    // تسجيل الخروج والحصول على بيانات المستخدم الحالي
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/user', fn(Request $request) => $request->user());

    // لوحة تحكم المدير
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index']);

    // إدارة العملاء
    Route::get('/customers', [CustomerController::class, 'index']);

    // إدارة التصنيفات
    Route::apiResource('categories', CategoryController::class);

    // --- إدارة المنتجات (CRUD) ---
    // جلب كل المنتجات (للوحة التحكم)
    Route::get('/products', [ProductController::class, 'index']);

    // إضافة منتج جديد
    Route::post('/products', [ProductController::class, 'store']);

    // جلب بيانات منتج واحد (لعرضها في صفحة التعديل)
    Route::get('/products/{product}', [ProductController::class, 'show']);

    // [تصحيح] تحديث منتج موجود. تم إضافة Route::put لحل المشكلة
    Route::put('/products/{product}', [ProductController::class, 'update']);
    // هذا السطر يدعم أيضاً إرسال التحديثات كـ POST مع حقل _method=PUT
    Route::post('/products/{product}', [ProductController::class, 'update']);

});

