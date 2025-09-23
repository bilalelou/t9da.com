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
        // أولاً، نحدث القيم الموجودة لتتطابق مع النظام الجديد
        DB::table('coupons')
            ->where('type', 'percentage')
            ->update(['type' => 'percent']);
            
        // تأكد من أن جميع القيم الآن صحيحة
        DB::statement("UPDATE coupons SET type = 'fixed' WHERE type NOT IN ('fixed', 'percent')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // إعادة القيم للحالة السابقة
        DB::table('coupons')
            ->where('type', 'percent')
            ->update(['type' => 'percentage']);
    }
};
