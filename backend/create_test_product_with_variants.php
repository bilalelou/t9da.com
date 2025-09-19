<?php
require_once 'vendor/autoload.php';

// تحميل البيئة
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== إنشاء منتج تجريبي مع ألوان وأحجام ===\n\n";

// إنشاء منتج جديد
$product = App\Models\Product::create([
    'name' => 'تيشيرت قطني تجريبي',
    'slug' => 'test-cotton-tshirt-' . time(),
    'description' => 'تيشيرت قطني عالي الجودة متوفر بألوان وأحجام متعددة. مثالي للاستخدام اليومي.',
    'short_description' => 'تيشيرت قطني بألوان وأحجام متعددة',
    'regular_price' => 89.99,
    'sale_price' => 69.99,
    'thumbnail' => 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=T-Shirt',
    'category' => 'ملابس',
    'SKU' => 'TST-' . time(),
    'stock' => 100,
    'stock_status' => 'instock',
    'has_variants' => true,
    'status' => 'active'
]);

echo "تم إنشاء المنتج: {$product->name} (ID: {$product->id})\n";

// الحصول على بعض الألوان
$redColor = App\Models\Color::where('name', 'أحمر')->first();
$blueColor = App\Models\Color::where('name', 'أزرق')->first();
$blackColor = App\Models\Color::where('name', 'أسود')->first();

// الحصول على بعض الأحجام
$sizeS = App\Models\Size::where('name', 'S')->first();
$sizeM = App\Models\Size::where('name', 'M')->first();
$sizeL = App\Models\Size::where('name', 'L')->first();

if (!$redColor || !$blueColor || !$blackColor || !$sizeS || !$sizeM || !$sizeL) {
    echo "خطأ: لم يتم العثور على الألوان أو الأحجام المطلوبة\n";
    exit;
}

echo "الألوان المستخدمة:\n";
echo "- {$redColor->name} ({$redColor->hex_code})\n";
echo "- {$blueColor->name} ({$blueColor->hex_code})\n";
echo "- {$blackColor->name} ({$blackColor->hex_code})\n";

echo "\nالأحجام المستخدمة:\n";
echo "- {$sizeS->name} ({$sizeS->display_name})\n";
echo "- {$sizeM->name} ({$sizeM->display_name})\n";
echo "- {$sizeL->name} ({$sizeL->display_name})\n";

// إنشاء variants للمنتج
$colors = [$redColor, $blueColor, $blackColor];
$sizes = [$sizeS, $sizeM, $sizeL];
$variantCount = 0;

foreach ($colors as $color) {
    foreach ($sizes as $size) {
        $variant = App\Models\ProductVariant::create([
            'product_id' => $product->id,
            'sku' => "TST-{$color->name}-{$size->name}-" . time() . "-" . $variantCount,
            'price' => $product->sale_price + rand(0, 20), // سعر متغير قليلاً
            'quantity' => rand(10, 50), // استخدام quantity بدلاً من stock
            'color_id' => $color->id,
            'size_id' => $size->id,
        ]);

        echo "تم إنشاء variant: {$color->name} - {$size->name} (السعر: {$variant->price}, المخزون: {$variant->quantity})\n";
        $variantCount++;
    }
}

echo "\n=== تم الانتهاء ===\n";
echo "تم إنشاء منتج بـ {$variantCount} variants\n";
echo "رابط المنتج: /shop/{$product->slug}\n";
echo "ID المنتج: {$product->id}\n";
