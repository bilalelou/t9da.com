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
        Schema::create('product_videos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('title')->nullable(); // عنوان الفيديو
            $table->text('description')->nullable(); // وصف الفيديو
            $table->string('video_url'); // رابط الفيديو (يمكن أن يكون مخزن محلياً أو YouTube/Vimeo)
            $table->string('video_type')->default('file'); // file, youtube, vimeo
            $table->string('thumbnail')->nullable(); // صورة مصغرة للفيديو
            $table->integer('duration')->nullable(); // مدة الفيديو بالثواني
            $table->string('file_size')->nullable(); // حجم الملف
            $table->string('resolution')->nullable(); // جودة الفيديو (1080p, 720p, etc.)
            $table->integer('sort_order')->default(0); // ترتيب الفيديوهات
            $table->boolean('is_featured')->default(false); // فيديو مميز
            $table->boolean('is_active')->default(true); // فعال أم لا
            $table->timestamps();

            // فهرسة للأداء
            $table->index(['product_id', 'is_active']);
            $table->index(['product_id', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_videos');
    }
};
