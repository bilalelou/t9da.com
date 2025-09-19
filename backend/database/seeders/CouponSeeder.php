<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Coupon;
use Illuminate\Support\Facades\DB;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🎫 إنشاء كوبونات الخصم...');

        // نظف البيانات الموجودة
        DB::table('coupons')->truncate();

        $coupons = [
            [
                'code' => 'WELCOME20',
                'type' => 'percentage',
                'value' => 20.00,
                'min_amount' => 200.00,
                'is_active' => true,
                'expires_at' => now()->addMonths(3),
                'description' => 'خصم 20% للعملاء الجدد - الحد الأدنى 200 درهم'
            ],
            [
                'code' => 'SAVE50',
                'type' => 'fixed',
                'value' => 50.00,
                'min_amount' => 300.00,
                'is_active' => true,
                'expires_at' => now()->addMonths(2),
                'description' => 'خصم 50 درهم - الحد الأدنى 300 درهم'
            ],
            [
                'code' => 'BLACKFRIDAY',
                'type' => 'percentage',
                'value' => 30.00,
                'min_amount' => 500.00,
                'is_active' => true,
                'expires_at' => now()->addDays(30),
                'description' => 'عرض الجمعة السوداء - خصم 30% على الطلبات أكثر من 500 درهم'
            ],
            [
                'code' => 'SUMMER25',
                'type' => 'percentage',
                'value' => 25.00,
                'min_amount' => 150.00,
                'is_active' => true,
                'expires_at' => now()->addMonths(1),
                'description' => 'عرض الصيف - خصم 25% على جميع المنتجات'
            ],
            [
                'code' => 'FREESHIP',
                'type' => 'fixed',
                'value' => 30.00,
                'min_amount' => 100.00,
                'is_active' => true,
                'expires_at' => now()->addWeeks(2),
                'description' => 'شحن مجاني - وفر 30 درهم من رسوم الشحن'
            ],
            [
                'code' => 'VIP100',
                'type' => 'fixed',
                'value' => 100.00,
                'min_amount' => 1000.00,
                'is_active' => true,
                'expires_at' => now()->addMonths(6),
                'description' => 'خصم VIP 100 درهم للطلبات الكبيرة أكثر من 1000 درهم'
            ],
            [
                'code' => 'MOBILE15',
                'type' => 'percentage',
                'value' => 15.00,
                'min_amount' => 0.00,
                'is_active' => true,
                'expires_at' => now()->addDays(45),
                'description' => 'خصم خاص للتسوق من الجوال - 15% على جميع المنتجات'
            ],
            [
                'code' => 'EXPIRED10',
                'type' => 'percentage',
                'value' => 10.00,
                'min_amount' => 100.00,
                'is_active' => false,
                'expires_at' => now()->subDays(10),
                'description' => 'كوبون منتهي الصلاحية - للاختبار'
            ],
            [
                'code' => 'STUDENT20',
                'type' => 'percentage',
                'value' => 20.00,
                'min_amount' => 250.00,
                'is_active' => true,
                'expires_at' => now()->addMonths(4),
                'description' => 'خصم الطلاب - 20% على جميع منتجات التكنولوجيا'
            ],
            [
                'code' => 'RAMADAN30',
                'type' => 'percentage',
                'value' => 30.00,
                'min_amount' => 400.00,
                'is_active' => true,
                'expires_at' => now()->addDays(60),
                'description' => 'عرض رمضان الكريم - خصم 30% على الطلبات أكثر من 400 درهم'
            ]
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }

        $this->command->info('✅ تم إنشاء ' . count($coupons) . ' كوبون خصم متنوع');
    }
}
