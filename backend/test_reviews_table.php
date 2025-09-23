<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    echo "🔍 اختبار جدول product_reviews...\n";
    $count = DB::table('product_reviews')->count();
    echo "✅ الجدول يعمل بشكل صحيح! العدد: $count\n";
    
    // اختبار الأعمدة
    $columns = DB::select("SHOW COLUMNS FROM product_reviews");
    echo "\n📋 الأعمدة الموجودة:\n";
    foreach ($columns as $column) {
        echo "  ✓ " . $column->Field . " (" . $column->Type . ")\n";
    }
    
} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
}