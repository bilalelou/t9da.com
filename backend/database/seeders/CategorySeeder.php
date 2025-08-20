<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
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

        // حذف البيانات القديمة من الجداول ذات الصلة
        // ملاحظة: جدول المنتجات يتم حذفه أيضاً في BrandSeeder
        // لكن من الجيد التأكد من حذفه هنا أيضاً لضمان الترتيب الصحيح
        DB::table('products')->truncate();
        DB::table('categories')->truncate();

        // إعادة تفعيل قيود المفتاح الخارجي
        Schema::enableForeignKeyConstraints();

        // إضافة الفئات الرئيسية
        DB::table('categories')->insert([
            [
                'name' => 'Electronics',
                'slug' => Str::slug('Electronics'),
                'image' => 'electronics.png',
                'parent_id' => null, // هذه فئة رئيسية
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Fashion',
                'slug' => Str::slug('Fashion'),
                'image' => 'fashion.png',
                'parent_id' => null, // هذه فئة رئيسية
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // إضافة فئات فرعية
        // لنفترض أن ID فئة "Electronics" هو 1
        DB::table('categories')->insert([
            [
                'name' => 'Smartphones',
                'slug' => Str::slug('Smartphones'),
                'image' => 'smartphones.png',
                'parent_id' => 1, // تابعة لـ Electronics
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Laptops',
                'slug' => Str::slug('Laptops'),
                'image' => 'laptops.png',
                'parent_id' => 1, // تابعة لـ Electronics
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // لنفترض أن ID فئة "Fashion" هو 2
        DB::table('categories')->insert([
            [
                'name' => 'Men\'s Fashion',
                'slug' => Str::slug('Men\'s Fashion'),
                'image' => 'men-fashion.png',
                'parent_id' => 2, // تابعة لـ Fashion
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
