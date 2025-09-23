<?php
/**
 * Script لإصلاح مشكلة عمود rating في جدول product_reviews
 * يتم تشغيله على الخادم لحل المشكلة
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // التحقق من وجود الجدول أولاً
        if (!Schema::hasTable('product_reviews')) {
            // إنشاء الجدول كاملاً إذا لم يكن موجوداً
            Schema::create('product_reviews', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('product_id')->constrained()->onDelete('cascade');
                $table->tinyInteger('rating')->unsigned()->comment('Rating from 1 to 5');
                $table->text('comment')->nullable();
                $table->boolean('is_verified')->default(false)->comment('Whether the review is verified/approved');
                $table->boolean('is_helpful')->default(false)->comment('Whether this review was marked as helpful');
                $table->integer('helpful_count')->default(0)->comment('Number of users who found this review helpful');
                $table->timestamps();

                // Ensure one review per user per product
                $table->unique(['user_id', 'product_id']);

                // Index for better performance
                $table->index(['product_id', 'is_verified']);
                $table->index(['rating']);
            });
        } else {
            // إذا كان الجدول موجوداً، تحقق من الأعمدة المفقودة وأضفها
            if (!Schema::hasColumn('product_reviews', 'rating')) {
                Schema::table('product_reviews', function (Blueprint $table) {
                    $table->tinyInteger('rating')->unsigned()->comment('Rating from 1 to 5')->after('product_id');
                });
            }
            
            if (!Schema::hasColumn('product_reviews', 'comment')) {
                Schema::table('product_reviews', function (Blueprint $table) {
                    $table->text('comment')->nullable()->after('rating');
                });
            }
            
            if (!Schema::hasColumn('product_reviews', 'is_verified')) {
                Schema::table('product_reviews', function (Blueprint $table) {
                    $table->boolean('is_verified')->default(false)->comment('Whether the review is verified/approved')->after('comment');
                });
            }
            
            if (!Schema::hasColumn('product_reviews', 'is_helpful')) {
                Schema::table('product_reviews', function (Blueprint $table) {
                    $table->boolean('is_helpful')->default(false)->comment('Whether this review was marked as helpful')->after('is_verified');
                });
            }
            
            if (!Schema::hasColumn('product_reviews', 'helpful_count')) {
                Schema::table('product_reviews', function (Blueprint $table) {
                    $table->integer('helpful_count')->default(0)->comment('Number of users who found this review helpful')->after('is_helpful');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};