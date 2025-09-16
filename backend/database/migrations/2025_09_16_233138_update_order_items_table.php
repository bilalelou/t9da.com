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
        Schema::table('order_items', function (Blueprint $table) {
            // إضافة الحقول المطلوبة إذا لم تكن موجودة
            if (!Schema::hasColumn('order_items', 'price')) {
                $table->decimal('price', 8, 2)->after('quantity');
            }

            if (!Schema::hasColumn('order_items', 'total')) {
                $table->decimal('total', 10, 2)->after('price');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            if (Schema::hasColumn('order_items', 'price')) {
                $table->dropColumn('price');
            }

            if (Schema::hasColumn('order_items', 'total')) {
                $table->dropColumn('total');
            }
        });
    }
};
