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
        // حذف الجدول الموجود والإنشاء من جديد
        Schema::dropIfExists('product_reviews');
        
        // إنشاء الجدول كاملاً
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
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_reviews');
    }
};
