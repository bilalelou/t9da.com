<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema; // تم استيراد كلاس Schema
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // تعطيل قيود المفتاح الخارجي مؤقتاً
        Schema::disableForeignKeyConstraints();

        // حذف البيانات القديمة لتجنب التكرار
        DB::table('products')->truncate(); // حذف المنتجات القديمة أولاً
        DB::table('brands')->truncate();   // الآن يمكن حذف العلامات التجارية

        // إعادة تفعيل قيود المفتاح الخارجي
        Schema::enableForeignKeyConstraints();

        // إضافة العلامات التجارية
        DB::table('brands')->insert([
            [
                'name' => 'Samsung',
                'slug' => Str::slug('Samsung'),
                'image' => 'samsung.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Apple',
                'slug' => Str::slug('Apple'),
                'image' => 'apple.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sony',
                'slug' => Str::slug('Sony'),
                'image' => 'sony.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Huawei',
                'slug' => Str::slug('Huawei'),
                'image' => 'huawei.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Nike',
                'slug' => Str::slug('Nike'),
                'image' => 'nike.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Adidas',
                'slug' => Str::slug('Adidas'),
                'image' => 'adidas.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dell',
                'slug' => Str::slug('Dell'),
                'image' => 'dell.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'HP',
                'slug' => Str::slug('HP'),
                'image' => 'hp.png',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
