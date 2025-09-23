<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use Illuminate\Support\Facades\DB;

try {
    echo "🔍 فحص بنية جدول product_reviews:\n";
    
    $columns = DB::select('DESCRIBE product_reviews');
    
    if (empty($columns)) {
        echo "❌ الجدول فارغ أو غير موجود\n";
    } else {
        echo "📋 الأعمدة الموجودة:\n";
        foreach ($columns as $column) {
            echo "  - " . $column->Field . " (" . $column->Type . ")\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ خطأ: " . $e->getMessage() . "\n";
    
    // محاولة إنشاء الجدول من الصفر
    echo "\n🛠️ محاولة إنشاء الجدول من جديد...\n";
    
    try {
        DB::statement("DROP TABLE IF EXISTS product_reviews");
        
        DB::statement("
            CREATE TABLE product_reviews (
                id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
                user_id BIGINT UNSIGNED NOT NULL,
                product_id BIGINT UNSIGNED NOT NULL,
                rating TINYINT UNSIGNED NOT NULL COMMENT 'Rating from 1 to 5',
                comment TEXT NULL,
                is_verified BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether the review is verified/approved',
                is_helpful BOOLEAN NOT NULL DEFAULT FALSE COMMENT 'Whether this review was marked as helpful',
                helpful_count INT NOT NULL DEFAULT 0 COMMENT 'Number of users who found this review helpful',
                created_at TIMESTAMP NULL,
                updated_at TIMESTAMP NULL,
                
                UNIQUE KEY unique_user_product (user_id, product_id),
                INDEX idx_product_verified (product_id, is_verified),
                INDEX idx_rating (rating),
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        echo "✅ تم إنشاء جدول product_reviews بنجاح!\n";
        
    } catch (Exception $createError) {
        echo "❌ فشل في إنشاء الجدول: " . $createError->getMessage() . "\n";
    }
}