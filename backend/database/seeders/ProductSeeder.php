<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
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

        // حذف البيانات القديمة من الجداول ذات الصلة بالترتيب الصحيح
        DB::table('order_items')->truncate(); // حذف عناصر الطلبات أولاً
        DB::table('products')->truncate();    // الآن يمكن حذف المنتجات

        // إعادة تفعيل قيود المفتاح الخارجي
        Schema::enableForeignKeyConstraints();

        // إضافة المنتجات
        DB::table('products')->insert([
            [
                'name' => 'Samsung Galaxy S22',
                'slug' => Str::slug('Samsung Galaxy S22'),
                'short_description' => 'The latest flagship from Samsung.',
                'description' => 'Full description of the Samsung Galaxy S22 with all its amazing features, camera quality, and performance specs.',
                'regular_price' => 12000,
                'sale_price' => 11500,
                'SKU' => 'SM-S901E',
                'stock_status' => 'instock',
                'featured' => true,
                'quantity' => 50,
                'image' => 's22.jpg',
                'images' => json_encode(['s22_1.jpg', 's22_2.jpg']), // تخزين صور متعددة كـ JSON
                'category_id' => 3, // ID لفئة Smartphones
                'brand_id' => 1, // ID لعلامة Samsung
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'iPhone 14 Pro',
                'slug' => Str::slug('iPhone 14 Pro'),
                'short_description' => 'Experience the new iPhone 14 Pro.',
                'description' => 'Full description of the iPhone 14 Pro, featuring the Dynamic Island, a new 48MP camera, and Always-On display.',
                'regular_price' => 14000,
                'sale_price' => null, // لا يوجد سعر تخفيض
                'SKU' => 'APL-14PRO',
                'stock_status' => 'instock',
                'featured' => true,
                'quantity' => 30,
                'image' => 'iphone14.jpg',
                'images' => json_encode(['iphone14_1.jpg', 'iphone14_2.jpg']),
                'category_id' => 3, // ID لفئة Smartphones
                'brand_id' => 2, // ID لعلامة Apple
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MacBook Pro 14"',
                'slug' => Str::slug('MacBook Pro 14'),
                'short_description' => 'Supercharged by M2 Pro or M2 Max.',
                'description' => 'The 14-inch MacBook Pro with M2 Pro or M2 Max takes its power and efficiency further than ever. It delivers exceptional performance whether it’s plugged in or not, and now has even longer battery life.',
                'regular_price' => 25000,
                'sale_price' => 24500,
                'SKU' => 'APL-MBP14',
                'stock_status' => 'instock',
                'featured' => false,
                'quantity' => 20,
                'image' => 'macbook14.jpg',
                'images' => null, // لا توجد صور إضافية
                'category_id' => 4, // ID لفئة Laptops
                'brand_id' => 2, // ID لعلامة Apple
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
