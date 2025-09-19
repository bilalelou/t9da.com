<?php
require_once 'vendor/autoload.php';

// تحميل البيئة
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== اختبار النظام ===\n\n";

// فحص المنتج الجديد
$product = App\Models\Product::find(12);

if ($product) {
    echo "✅ تم العثور على المنتج: {$product->name}\n";
    echo "   - has_variants: " . ($product->has_variants ? 'نعم' : 'لا') . "\n";
    
    // فحص الـ variants
    $variants = $product->variants;
    echo "   - عدد الـ variants: " . $variants->count() . "\n";
    
    if ($variants->count() > 0) {
        $firstVariant = $variants->first();
        echo "   - أول variant: " . ($firstVariant->color ? $firstVariant->color->name : 'بدون لون') . 
             " - " . ($firstVariant->size ? $firstVariant->size->name : 'بدون حجم') . 
             " (السعر: {$firstVariant->price})\n";
        
        // فحص الألوان والأحجام المتاحة
        $colors = collect($variants->pluck('color')->filter());
        $sizes = collect($variants->pluck('size')->filter());
        
        echo "   - الألوان المتاحة: " . $colors->pluck('name')->unique()->implode(', ') . "\n";
        echo "   - الأحجام المتاحة: " . $sizes->pluck('name')->unique()->implode(', ') . "\n";
    }
    
    // محاولة جلب التقييمات (للتأكد من أن جدول product_reviews يعمل)
    try {
        $avgRating = $product->reviews()->where('is_verified', true)->avg('rating');
        echo "   - متوسط التقييم: " . ($avgRating ? round($avgRating, 1) : 'لا توجد تقييمات') . "\n";
        echo "✅ جدول product_reviews يعمل بشكل صحيح\n";
    } catch (Exception $e) {
        echo "❌ خطأ في جدول product_reviews: " . $e->getMessage() . "\n";
    }
    
} else {
    echo "❌ لم يتم العثور على المنتج 12\n";
}

echo "\n=== اختبار API ===\n";

// محاكاة طلب API للمنتج
$baseUrl = 'http://localhost:8000'; // تعديل هذا حسب الحاجة
$slug = 'test-cotton-tshirt-1758310328';

echo "رابط المنتج: {$baseUrl}/shop/{$slug}\n";
echo "API endpoint: {$baseUrl}/api/products/{$slug}\n";
echo "Variants endpoint: {$baseUrl}/api/public/products/12/variants\n";

echo "\n✅ النظام جاهز للاختبار!\n";