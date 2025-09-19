<?php
require_once 'vendor/autoload.php';

// تحميل البيئة
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== إصلاح جدول product_variants ===\n\n";

// إضافة الأعمدة المفقودة باستخدام SQL مباشر
$pdo = DB::connection()->getPdo();

try {
    echo "إضافة عمود color_id...\n";
    $pdo->exec("ALTER TABLE product_variants ADD COLUMN color_id INTEGER");

    echo "إضافة عمود size_id...\n";
    $pdo->exec("ALTER TABLE product_variants ADD COLUMN size_id INTEGER");

    echo "تم إضافة الأعمدة بنجاح!\n\n";

    // فحص البنية الجديدة
    $query = "PRAGMA table_info(product_variants)";
    $result = $pdo->query($query);

    echo "بنية الجدول بعد التحديث:\n";
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        echo "- {$row['name']} ({$row['type']})\n";
    }

} catch (Exception $e) {
    echo "خطأ: " . $e->getMessage() . "\n";
}
