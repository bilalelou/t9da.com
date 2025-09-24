<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🔍 اختبار API endpoints...\n\n";

// اختبار الألوان
echo "🎨 اختبار الألوان:\n";
try {
    $colors = \App\Models\Color::active()->get();
    echo "  ✅ تم جلب " . $colors->count() . " لون\n";
    foreach ($colors as $color) {
        echo "    - {$color->name} ({$color->hex_code})\n";
    }
} catch (Exception $e) {
    echo "  ❌ خطأ في الألوان: " . $e->getMessage() . "\n";
}

echo "\n📏 اختبار الأحجام:\n";
try {
    $sizes = \App\Models\Size::active()->get();
    echo "  ✅ تم جلب " . $sizes->count() . " حجم\n";
    foreach ($sizes as $size) {
        echo "    - {$size->name}\n";
    }
} catch (Exception $e) {
    echo "  ❌ خطأ في الأحجام: " . $e->getMessage() . "\n";
}

echo "\n🛍️ اختبار المنتجات:\n";
try {
    $products = \App\Models\Product::take(3)->get();
    echo "  ✅ تم جلب " . $products->count() . " منتج\n";
    foreach ($products as $product) {
        echo "    - {$product->name}\n";
    }
} catch (Exception $e) {
    echo "  ❌ خطأ في المنتجات: " . $e->getMessage() . "\n";
}

echo "\n" . str_repeat("=", 50) . "\n";
echo "🌐 endpoints المتوقعة:\n";
echo "  - GET /api/public/colors\n";
echo "  - GET /api/public/sizes\n";
echo "  - GET /returns\n";
echo "  - GET /support\n";
echo str_repeat("=", 50) . "\n";
