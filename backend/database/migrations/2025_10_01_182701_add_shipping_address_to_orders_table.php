<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = [
                'shipping_address' => 'text',
                'shipping_city' => 'string',
                'shipping_state' => 'string',
                'shipping_postal_code' => 'string',
                'shipping_method' => 'string',
                'payment_status' => 'string',
                'notes' => 'text'
            ];
            
            foreach ($columns as $column => $type) {
                if (!Schema::hasColumn('orders', $column)) {
                    if ($type === 'text') {
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
        Schema::table('orders', function (Blueprint $table) {
            $columns = ['shipping_address', 'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_method', 'payment_status', 'notes'];
            foreach ($columns as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};