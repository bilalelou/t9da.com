<?php
require_once 'vendor/autoload.php';

// تحميل البيئة
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== فحص API للمنتج التجريبي ===\n\n";

$productSlug = 'test-cotton-tshirt-1758310328';
$productId = 12;

// محاكاة API call للمنتج
echo "1. فحص بيانات المنتج الأساسية:\n";
$product = App\Models\Product::where('slug', $productSlug)->first();

if ($product) {
    echo "✅ تم العثور على المنتج: {$product->name}\n";
    echo "   - ID: {$product->id}\n";
    echo "   - Slug: {$product->slug}\n";
    echo "   - has_variants: " . ($product->has_variants ? 'true' : 'false') . "\n";

    // فحص العلاقات المحملة
    echo "\n2. فحص الـ variants:\n";
    $variants = App\Models\ProductVariant::where('product_id', $product->id)->get();
    echo "   - عدد الـ variants في قاعدة البيانات: " . $variants->count() . "\n";

    if ($variants->count() > 0) {
        echo "\n   تفاصيل الـ variants:\n";
        foreach ($variants as $index => $variant) {
            $color = App\Models\Color::find($variant->color_id);
            $size = App\Models\Size::find($variant->size_id);

            echo "   [{$index}] Color ID: {$variant->color_id} (" .
                 ($color ? $color->name : 'لا يوجد') . "), " .
                 "Size ID: {$variant->size_id} (" .
                 ($size ? $size->name : 'لا يوجد') . "), " .
                 "السعر: {$variant->price}\n";
        }

        // استخراج الألوان والأحجام المتاحة
        echo "\n3. استخراج الألوان والأحجام المتاحة:\n";
        $colors = new \Illuminate\Support\Collection();
        $sizes = new \Illuminate\Support\Collection();

        foreach ($variants as $variant) {
            if ($variant->color_id) {
                $color = App\Models\Color::find($variant->color_id);
                if ($color && !$colors->contains('id', $color->id)) {
                    $colors->push($color);
                }
            }
            if ($variant->size_id) {
                $size = App\Models\Size::find($variant->size_id);
                if ($size && !$sizes->contains('id', $size->id)) {
                    $sizes->push($size);
                }
            }
        }

        echo "   - الألوان المتاحة: " . $colors->pluck('name')->implode(', ') . "\n";
        echo "   - الأحجام المتاحة: " . $sizes->pluck('name')->implode(', ') . "\n";

    } else {
        echo "❌ لا توجد variants للمنتج!\n";
    }

} else {
    echo "❌ لم يتم العثور على المنتج بالـ slug: {$productSlug}\n";
}

echo "\n=== فحص API Controller ===\n";

// فحص ما يرجعه ProductController
try {
    // محاكاة ما يحدث في ProductController
    $product = App\Models\Product::where('slug', $productSlug)->first();

    if ($product && $product->has_variants) {
        echo "4. محاكاة API call للـ variants:\n";

        // محاولة جلب variants من API endpoint
        $variants = App\Models\ProductVariant::where('product_id', $product->id)->get();

        echo "   - تم جلب {$variants->count()} variants\n";

        // محاكاة استخراج الألوان والأحجام (نفس المنطق في frontend)
        $colors = new \Illuminate\Database\Eloquent\Collection();
        $sizes = new \Illuminate\Database\Eloquent\Collection();

        foreach ($variants as $variant) {
            if ($variant->color_id) {
                $color = App\Models\Color::find($variant->color_id);
                if ($color) {
                    $existingColor = $colors->firstWhere('id', $color->id);
                    if (!$existingColor) {
                        $colors->push($color);
                    }
                }
            }
            if ($variant->size_id) {
                $size = App\Models\Size::find($variant->size_id);
                if ($size) {
                    $existingSize = $sizes->firstWhere('id', $size->id);
                    if (!$existingSize) {
                        $sizes->push($size);
                    }
                }
            }
        }

        echo "   - استخراج الألوان: " . $colors->pluck('name')->implode(', ') . "\n";
        echo "   - استخراج الأحجام: " . $sizes->pluck('name')->implode(', ') . "\n";

        // محاكاة البيانات التي ترسل للـ frontend
        $productData = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'has_variants' => $product->has_variants,
            'variants' => $variants->toArray(),
            'available_colors' => $colors->toArray(),
            'available_sizes' => $sizes->toArray()
        ];

        echo "\n5. البيانات المرسلة للـ frontend:\n";
        echo "   - has_variants: " . ($productData['has_variants'] ? 'true' : 'false') . "\n";
        echo "   - عدد variants: " . count($productData['variants']) . "\n";
        echo "   - عدد available_colors: " . count($productData['available_colors']) . "\n";
        echo "   - عدد available_sizes: " . count($productData['available_sizes']) . "\n";

    } else {
        echo "❌ المنتج لا يحتوي على variants أو غير موجود\n";
    }

} catch (Exception $e) {
    echo "❌ خطأ في API: " . $e->getMessage() . "\n";
}
