<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // For SQLite, we need to recreate the table to update the CHECK constraint
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', [
                'pending',      // في الانتظار
                'confirmed',    // مؤكد
                'processing',   // قيد المعالجة
                'shipped',      // تم الشحن
                'delivered',    // تم التسليم
                'cancelled'     // ملغي
            ])->default('pending');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn('status');
        });

        Schema::table('orders', function (Blueprint $table) {
            $table->enum('status', ['ordered', 'delivered', 'canceled'])->default('ordered');
        });
    }
};
