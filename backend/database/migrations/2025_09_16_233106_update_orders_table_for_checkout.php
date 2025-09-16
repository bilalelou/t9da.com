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
        Schema::table('orders', function (Blueprint $table) {
            // إضافة الحقول الجديدة إذا لم تكن موجودة
            if (!Schema::hasColumn('orders', 'order_number')) {
                $table->string('order_number')->unique()->after('id');
            }

            if (!Schema::hasColumn('orders', 'status')) {
                $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
                      ->default('pending')->after('order_number');
            }

            if (!Schema::hasColumn('orders', 'subtotal')) {
                $table->decimal('subtotal', 10, 2)->default(0)->after('total_price');
            }

            if (!Schema::hasColumn('orders', 'shipping_cost')) {
                $table->decimal('shipping_cost', 8, 2)->default(0)->after('subtotal');
            }

            if (!Schema::hasColumn('orders', 'tax_amount')) {
                $table->decimal('tax_amount', 8, 2)->default(0)->after('shipping_cost');
            }

            if (!Schema::hasColumn('orders', 'discount_amount')) {
                $table->decimal('discount_amount', 8, 2)->default(0)->after('tax_amount');
            }

            // معلومات الشحن
            if (!Schema::hasColumn('orders', 'shipping_name')) {
                $table->string('shipping_name')->after('discount_amount');
            }

            if (!Schema::hasColumn('orders', 'shipping_email')) {
                $table->string('shipping_email')->after('shipping_name');
            }

            if (!Schema::hasColumn('orders', 'shipping_phone')) {
                $table->string('shipping_phone')->after('shipping_email');
            }

            if (!Schema::hasColumn('orders', 'shipping_address')) {
                $table->text('shipping_address')->after('shipping_phone');
            }

            if (!Schema::hasColumn('orders', 'shipping_city')) {
                $table->string('shipping_city')->after('shipping_address');
            }

            if (!Schema::hasColumn('orders', 'shipping_state')) {
                $table->string('shipping_state')->after('shipping_city');
            }

            if (!Schema::hasColumn('orders', 'shipping_postal_code')) {
                $table->string('shipping_postal_code')->after('shipping_state');
            }

            if (!Schema::hasColumn('orders', 'shipping_method')) {
                $table->string('shipping_method')->default('standard')->after('shipping_postal_code');
            }

            if (!Schema::hasColumn('orders', 'payment_method')) {
                $table->string('payment_method')->after('shipping_method');
            }

            if (!Schema::hasColumn('orders', 'payment_status')) {
                $table->enum('payment_status', ['pending', 'paid', 'failed', 'refunded'])
                      ->default('pending')->after('payment_method');
            }

            if (!Schema::hasColumn('orders', 'notes')) {
                $table->text('notes')->nullable()->after('payment_status');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = [
                'order_number', 'status', 'subtotal', 'shipping_cost', 'tax_amount', 'discount_amount',
                'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address', 'shipping_city',
                'shipping_state', 'shipping_postal_code', 'shipping_method', 'payment_method',
                'payment_status', 'notes'
            ];

            foreach ($columns as $column) {
                if (Schema::hasColumn('orders', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
