<?php

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
        Schema::table('product_variants', function (Blueprint $table) {
            // حذف الأعمدة القديمة
            $table->dropColumn(['color', 'size']);

            // إضافة أعمدة جديدة
            $table->foreignId('color_id')->nullable()->after('product_id')->constrained()->onDelete('set null');
            $table->foreignId('size_id')->nullable()->after('color_id')->constrained()->onDelete('set null');
            $table->string('sku')->unique()->after('size_id');
            $table->decimal('compare_price', 10, 2)->nullable()->after('price');
            $table->string('image')->nullable()->after('quantity');
            $table->boolean('is_active')->default(true)->after('image');

            // تحديث أعمدة موجودة
            $table->decimal('price', 10, 2)->change();

            // فهرس مركب لضمان عدم تكرار نفس التركيبة
            $table->unique(['product_id', 'color_id', 'size_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_variants', function (Blueprint $table) {
            $table->dropUnique(['product_id', 'color_id', 'size_id']);
            $table->dropForeign(['color_id']);
            $table->dropForeign(['size_id']);
            $table->dropColumn(['color_id', 'size_id', 'sku', 'compare_price', 'image', 'is_active']);
        });
    }
};
