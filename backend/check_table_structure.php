<?php
require_once 'vendor/autoload.php';

// تحميل البيئة
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== فحص بنية جدول product_variants ===\n\n";

// إنشاء اتصال قاعدة البيانات
$pdo = DB::connection()->getPdo();

// الحصول على معلومات الجدول
$query = "PRAGMA table_info(product_variants)";
$result = $pdo->query($query);

echo "أعمدة جدول product_variants:\n";
while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    echo "- {$row['name']} ({$row['type']}) - " . ($row['notnull'] ? 'مطلوب' : 'اختياري') . "\n";
}

// فحص ProductVariant model
echo "\n=== فحص ProductVariant Model ===\n";
$model = new App\Models\ProductVariant();
echo "Fillable fields: " . implode(', ', $model->getFillable()) . "\n";
