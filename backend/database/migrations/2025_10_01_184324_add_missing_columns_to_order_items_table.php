<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $columns = [
                'product_sku' => 'string',
                'product_image' => 'string',
                'product_description' => 'text',
                'discount_amount' => 'decimal',
                'tax_amount' => 'decimal'
            ];
            
            foreach ($columns as $column => $type) {
                if (!Schema::hasColumn('order_items', $column)) {
                    if ($type === 'decimal') {
                        $table->decimal($column, 10, 2)->default(0);
                    } elseif ($type === 'text') {
                        $table->text($column)->nullable();
                    } else {
                        $table->string($column)->nullable();
                    }
                }
            }
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $columns = ['product_sku', 'product_image', 'product_description', 'discount_amount', 'tax_amount'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('order_items', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};