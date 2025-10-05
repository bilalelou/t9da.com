<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // For SQLite, we need to recreate the table
        if (DB::getDriverName() === 'sqlite') {
            // Create temporary table
            Schema::create('transactions_temp', function (Blueprint $table) {
                $table->id();
                $table->bigInteger('user_id')->unsigned();
                $table->bigInteger('order_id')->unsigned();
                $table->string('mode', 50); // Changed to string to allow 'bank'
                $table->enum('status',['pending','approved','declined','refunded'])->default('pending');
                $table->timestamps();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            });

            // Copy data
            DB::statement('INSERT INTO transactions_temp SELECT * FROM transactions');

            // Drop old table
            Schema::dropIfExists('transactions');

            // Rename temp table
            Schema::rename('transactions_temp', 'transactions');
        } else {
            // For other databases
            DB::statement("ALTER TABLE transactions MODIFY COLUMN mode VARCHAR(50)");
        }
    }

    public function down()
    {
        // Revert back to enum if needed
        if (DB::getDriverName() === 'sqlite') {
            Schema::create('transactions_temp', function (Blueprint $table) {
                $table->id();
                $table->bigInteger('user_id')->unsigned();
                $table->bigInteger('order_id')->unsigned();
                $table->enum('mode',['cod','card','paypal']);
                $table->enum('status',['pending','approved','declined','refunded'])->default('pending');
                $table->timestamps();
                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            });

            DB::statement('INSERT INTO transactions_temp SELECT * FROM transactions WHERE mode IN ("cod", "card", "paypal")');
            Schema::dropIfExists('transactions');
            Schema::rename('transactions_temp', 'transactions');
        }
    }
};