<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('🌱 بدء إنشاء البيانات التجريبية...');

        // ترتيب الـ seeders مهم جداً بسبب العلاقات
        $this->call([
            // 1. المستخدمين والأدوار أولاً
            RolesAndUsersSeeder::class,

            // 2. البيانات الأساسية
            CategorySeeder::class,
            BrandSeeder::class,
            ColorSeeder::class,
            SizeSeeder::class,

            // 3. المنتجات والمتغيرات
            ProductSeeder::class,
            ProductVariantSeeder::class,

            // 4. الكوبونات وأسعار الشحن
            CouponSeeder::class,
            ShippingFeeSeeder::class,

            // 5. الطلبات (يجب أن تكون بعد المنتجات والمستخدمين)
            OrderSeeder::class,

            // 6. الشهور والإشعارات
            MonthSeeder::class,
            NotificationSeeder::class,
        ]);

        $this->command->info('✅ تم إنشاء جميع البيانات التجريبية بنجاح!');
    }
}
