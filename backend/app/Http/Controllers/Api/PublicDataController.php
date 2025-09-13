<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class PublicDataController extends Controller
{
    /**
     * جلب كل البيانات اللازمة للصفحة الرئيسية في طلب واحد.
     */
    public function home()
    {
        try {
            // 1. الشرائح (Slides) - بيانات وهمية حالياً
            $slides = [
                ['id' => 1, 'title' => 'اكتشف أحدث التشكيلات', 'subtitle' => 'تصاميم عصرية تلبي كل الأذواق', 'image_url' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop', 'link' => '/products'],
                ['id' => 2, 'title' => 'عروض خاصة لفترة محدودة', 'subtitle' => 'خصومات تصل إلى 50%', 'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop', 'link' => '/offers'],
            ];

            // 2. المنتجات المميزة (أحدث 4 منتجات)
            $featuredProducts = Product::latest()->take(4)->get()->map(fn($p) => $this->formatProduct($p));

            // 3. التصنيفات (أحدث 3 تصنيفات)
            $categories = Category::latest()->take(3)->get()->map(function($c) {
                $c->image = $c->image ? asset('storage/uploads/categories/' . $c->image) : 'https://placehold.co/600x400?text=' . urlencode($c->name);
                return $c;
            });

            return response()->json([
                'slides' => $slides,
                'featuredProducts' => $featuredProducts,
                'categories' => $categories,
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب بيانات الصفحة الرئيسية: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }

    /**
     * دالة مساعدة لتنسيق بيانات المنتج.
     */
    private function formatProduct(Product $product)
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'short_description' => $product->short_description,
            'regular_price' => (float)$product->regular_price,
            'sale_price' => isset($product->sale_price) ? (float)$product->sale_price : null,
            'image' => $product->image ? asset('storage/uploads/' . $product->image) : 'https://placehold.co/400x400?text=No+Image',
        ];
    }
}
