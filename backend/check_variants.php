<?php
require_once 'vendor/autoload.php';

// تحميل البيئة
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== فحص المنتجات والـ Variants ===\n\n";

// فحص المنتجات
$totalProducts = App\Models\Product::count();
echo "عدد المنتجات الإجمالي: $totalProducts\n";

$productsWithVariants = App\Models\Product::where('has_variants', true)->count();
echo "المنتجات مع has_variants = true: $productsWithVariants\n";

// فحص الألوان والأحجام
$totalColors = App\Models\Color::count();
echo "عدد الألوان المتاحة: $totalColors\n";

$totalSizes = App\Models\Size::count();
echo "عدد الأحجام المتاحة: $totalSizes\n";

// فحص الـ variants
$totalVariants = App\Models\ProductVariant::count();
echo "عدد الـ variants الإجمالي: $totalVariants\n";

$variantsWithColors = App\Models\ProductVariant::whereNotNull('color_id')->count();
echo "Variants مع ألوان: $variantsWithColors\n";

$variantsWithSizes = App\Models\ProductVariant::whereNotNull('size_id')->count();
echo "Variants مع أحجام: $variantsWithSizes\n";

$variantsWithBoth = App\Models\ProductVariant::whereNotNull('color_id')->whereNotNull('size_id')->count();
echo "Variants مع ألوان وأحجام معاً: $variantsWithBoth\n\n";

// عرض بعض الأمثلة
echo "=== أمثلة على المنتجات ===\n";
$productsWithVariantsExamples = App\Models\Product::where('has_variants', true)->limit(3)->get();

foreach ($productsWithVariantsExamples as $product) {
    echo "منتج: {$product->name} (ID: {$product->id})\n";
    $variants = App\Models\ProductVariant::where('product_id', $product->id)->get();
    echo "  عدد الـ variants: " . $variants->count() . "\n";

    foreach ($variants as $variant) {
        $colorName = $variant->color ? $variant->color->name : 'بدون لون';
        $sizeName = $variant->size ? $variant->size->name : 'بدون حجم';
        echo "    Variant: {$colorName} - {$sizeName} (السعر: {$variant->price})\n";
    }
    echo "\n";
}

// فحص الألوان والأحجام المتاحة
echo "=== الألوان المتاحة ===\n";
$colors = App\Models\Color::all();
foreach ($colors as $color) {
    echo "لون: {$color->name} ({$color->hex_code})\n";
}

echo "\n=== الأحجام المتاحة ===\n";
$sizes = App\Models\Size::all();
foreach ($sizes as $size) {
    echo "حجم: {$size->name} ({$size->display_name})\n";
}
