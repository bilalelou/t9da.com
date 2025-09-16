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
        Schema::table('coupons', function (Blueprint $table) {
            if (!Schema::hasColumn('coupons', 'description')) {
                $table->text('description')->nullable()->after('code');
            }

            if (!Schema::hasColumn('coupons', 'min_amount')) {
                $table->decimal('min_amount', 8, 2)->default(0)->after('value');
            }

            if (!Schema::hasColumn('coupons', 'max_amount')) {
                $table->decimal('max_amount', 8, 2)->nullable()->after('min_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $columns = ['description', 'min_amount', 'max_amount'];

            foreach ($columns as $column) {
                if (Schema::hasColumn('coupons', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
