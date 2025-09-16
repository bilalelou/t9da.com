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
        Schema::table('shipping_fees', function (Blueprint $table) {
            if (!Schema::hasColumn('shipping_fees', 'city')) {
                $table->string('city')->after('region');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shipping_fees', function (Blueprint $table) {
            if (Schema::hasColumn('shipping_fees', 'city')) {
                $table->dropColumn('city');
            }
        });
    }
};
