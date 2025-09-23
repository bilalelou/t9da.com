<?php
/**
 * ملف لإصلاح جدول product_reviews على الخادم
 * قم بتشغيل هذا الملف عبر: php fix_product_reviews_table.php
 */

require_once 'vendor/autoload.php';

use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

// قراءة إعدادات قاعدة البيانات
$config = require 'config/database.php';
$dbConfig = $config['connections'][$config['default']];

// إعداد Capsule
$capsule = new Capsule;
$capsule->addConnection([
    'driver' => $dbConfig['driver'],
    'host' => $dbConfig['host'],
    'database' => $dbConfig['database'],
    'username' => $dbConfig['username'],
    'password' => $dbConfig['password'],
    'charset' => $dbConfig['charset'] ?? 'utf8mb4',
    'collation' => $dbConfig['collation'] ?? 'utf8mb4_unicode_ci',
    'prefix' => $dbConfig['prefix'] ?? '',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();

$schema = $capsule->schema();

echo "🔧 بدء إصلاح جدول product_reviews...\n";

try {
    // التحقق من وجود الجدول
    if (!$schema->hasTable('product_reviews')) {
        echo "📋 إنشاء جدول product_reviews...\n";
        
        $schema->create('product_reviews', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('product_id');
            $table->tinyInteger('rating')->unsigned()->comment('Rating from 1 to 5');
            $table->text('comment')->nullable();
            $table->boolean('is_verified')->default(false)->comment('Whether the review is verified/approved');
            $table->boolean('is_helpful')->default(false)->comment('Whether this review was marked as helpful');
            $table->integer('helpful_count')->default(0)->comment('Number of users who found this review helpful');
            $table->timestamps();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_id')->references('id')->on('products')->onDelete('cascade');
            
            // Ensure one review per user per product
            $table->unique(['user_id', 'product_id']);

            // Index for better performance
            $table->index(['product_id', 'is_verified']);
            $table->index(['rating']);
        });
        
        echo "✅ تم إنشاء جدول product_reviews بنجاح!\n";
    } else {
        echo "📋 جدول product_reviews موجود، التحقق من الأعمدة...\n";
        
        // التحقق من الأعمدة المطلوبة
        $columnsToCheck = [
            'rating' => 'tinyInteger',
            'comment' => 'text',
            'is_verified' => 'boolean', 
            'is_helpful' => 'boolean',
            'helpful_count' => 'integer'
        ];
        
        foreach ($columnsToCheck as $column => $type) {
            if (!$schema->hasColumn('product_reviews', $column)) {
                echo "➕ إضافة عمود $column...\n";
                
                $schema->table('product_reviews', function (Blueprint $table) use ($column, $type) {
                    switch ($column) {
                        case 'rating':
                            $table->tinyInteger('rating')->unsigned()->comment('Rating from 1 to 5');
                            break;
                        case 'comment':
                            $table->text('comment')->nullable();
                            break;
                        case 'is_verified':
                            $table->boolean('is_verified')->default(false)->comment('Whether the review is verified/approved');
                            break;
                        case 'is_helpful':
                            $table->boolean('is_helpful')->default(false)->comment('Whether this review was marked as helpful');
                            break;
                        case 'helpful_count':
                            $table->integer('helpful_count')->default(0)->comment('Number of users who found this review helpful');
                            break;
                    }
                });
                
                echo "✅ تم إضافة عمود $column بنجاح!\n";
            } else {
                echo "✓ عمود $column موجود\n";
            }
        }
        
        // التحقق من الفهارس
        echo "📑 التحقق من الفهارس...\n";
        
        // لا يمكننا التحقق من الفهارس بسهولة مع Capsule، لذا سنتجاهل هذا الجزء
        echo "✓ تم تجاهل فحص الفهارس (يتطلب فحص يدوي)\n";
    }
    
    echo "\n🎉 تم إصلاح جدول product_reviews بنجاح!\n";
    echo "📝 يمكنك الآن تشغيل الموقع بدون أخطاء في التقييمات.\n";
    
} catch (Exception $e) {
    echo "\n❌ حدث خطأ أثناء إصلاح الجدول:\n";
    echo "Error: " . $e->getMessage() . "\n";
    echo "\n📋 تفاصيل الخطأ:\n";
    echo $e->getTraceAsString() . "\n";
    
    echo "\n🔧 حلول بديلة:\n";
    echo "1. تشغيل: php artisan migrate\n";
    echo "2. تشغيل: php artisan migrate:fresh\n";
    echo "3. إنشاء الجدول يدوياً في phpMyAdmin\n";
    
    exit(1);
}