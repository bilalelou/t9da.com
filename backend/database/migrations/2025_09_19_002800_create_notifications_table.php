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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // عنوان الإشعار
            $table->text('message'); // محتوى الإشعار
            $table->enum('type', ['info', 'success', 'warning', 'error', 'order', 'user', 'product'])->default('info'); // نوع الإشعار
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium'); // أولوية الإشعار
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade'); // المستخدم المرتبط (إن وجد)
            $table->foreignId('order_id')->nullable()->constrained()->onDelete('cascade'); // الطلب المرتبط (إن وجد)
            $table->json('data')->nullable(); // بيانات إضافية
            $table->timestamp('read_at')->nullable(); // وقت قراءة الإشعار
            $table->boolean('is_read')->default(false); // هل تم قراءة الإشعار
            $table->string('action_url')->nullable(); // رابط للانتقال عند النقر
            $table->timestamps();

            // Indexes للبحث السريع
            $table->index(['is_read', 'created_at']);
            $table->index(['type', 'created_at']);
            $table->index(['priority', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
