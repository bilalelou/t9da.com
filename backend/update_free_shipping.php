<?php

require_once __DIR__ . '/vendor/autoload.php';

use App\Models\Product;

echo "=== تحديث المنتجات بميزة الشحن المجاني ===\n\n";

try {
    // جلب أول 3 منتجات وجعل الشحن مجاني لها
    $products = Product::limit(3)->get();
    
    foreach ($products as $product) {
        $product->update([
            'has_free_shipping' => true,
            'free_shipping_note' => 'شحن مجاني لهذا المنتج في جميع أنحاء المملكة'
        ]);
        
        echo "✓ تم تحديث المنتج: {$product->name} - شحن مجاني\n";
    }
    
    // جلب باقي المنتجات وجعل الشحن مدفوع
    $paidShippingProducts = Product::skip(3)->limit(5)->get();
    
    foreach ($paidShippingProducts as $product) {
        $product->update([
            'has_free_shipping' => false,
            'free_shipping_note' => null
        ]);
        
        echo "✓ تم تحديث المنتج: {$product->name} - شحن مدفوع\n";
    }
    
    echo "\n=== إحصائيات الشحن ===\n";
    echo "المنتجات مع شحن مجاني: " . Product::freeShipping()->count() . "\n";
    echo "المنتجات مع شحن مدفوع: " . Product::paidShipping()->count() . "\n";
    
    echo "\n✅ تم تحديث المنتجات بنجاح!\n";

} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}

?>