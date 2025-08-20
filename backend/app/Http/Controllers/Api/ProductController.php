<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Resources\ProductResource;

class ProductController extends Controller
{
    /**
     * عرض جميع المنتجات (لصفحة المنتجات الكاملة مستقبلاً)
     */
    public function index()
    {
        $products = Product::all();
        return ProductResource::collection($products);
    }

    /**
     * عرض منتج واحد محدد
     */
    public function show(Product $product)
    {
        // Laravel سيقوم تلقائياً بجلب المنتج المطابق للـ ID
        // ثم سنقوم بتنسيقه باستخدام ProductResource
        return new ProductResource($product);
    }

    /**
     * عرض قائمة بالمنتجات المميزة (الأكثر طلباً)
     */
    public function featured()
    {
        // لم نعد بحاجة لـ with('images') إذا كانت الصور مخزنة كنص في جدول المنتجات
        $products = Product::latest()->take(3)->get();

        // استخدام الـ Resource لتنسيق البيانات قبل إرسالها
        return ProductResource::collection($products);
    }
}
