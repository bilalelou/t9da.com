<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Coupon;
use Carbon\Carbon;

class CouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'WELCOME10',
                'description' => 'خصم 10% للعملاء الجدد',
                'type' => 'percentage',
                'value' => 10.00,
                'min_amount' => 100.00,
                'max_amount' => 50.00,
                'usage_limit' => 100,
                'times_used' => 0,
                'expires_at' => Carbon::now()->addMonth(),
                'is_active' => true,
            ],
            [
                'code' => 'SAVE50',
                'description' => 'خصم 50 درهم على الطلبات أكثر من 300 درهم',
                'type' => 'fixed',
                'value' => 50.00,
                'min_amount' => 300.00,
                'max_amount' => null,
                'usage_limit' => 50,
                'times_used' => 0,
                'expires_at' => Carbon::now()->addWeeks(2),
                'is_active' => true,
            ],
            [
                'code' => 'BIGDEAL',
                'description' => 'خصم 20% على الطلبات أكثر من 500 درهم (حد أقصى 100 درهم)',
                'type' => 'percentage',
                'value' => 20.00,
                'min_amount' => 500.00,
                'max_amount' => 100.00,
                'usage_limit' => 25,
                'times_used' => 0,
                'expires_at' => Carbon::now()->addDays(10),
                'is_active' => true,
            ],
            [
                'code' => 'FREESHIP',
                'description' => 'شحن مجاني على جميع الطلبات',
                'type' => 'fixed',
                'value' => 30.00,
                'min_amount' => 0.00,
                'max_amount' => null,
                'usage_limit' => 1000, // تغيير من null إلى رقم كبير
                'times_used' => 0,
                'expires_at' => Carbon::now()->addMonth(),
                'is_active' => true,
            ],
            [
                'code' => 'EXPIRED',
                'description' => 'كوبون منتهي الصلاحية للاختبار',
                'type' => 'percentage',
                'value' => 15.00,
                'min_amount' => 50.00,
                'max_amount' => null,
                'usage_limit' => 10,
                'times_used' => 0,
                'expires_at' => Carbon::now()->subDays(5),
                'is_active' => false,
            ]
        ];

        foreach ($coupons as $coupon) {
            Coupon::create($coupon);
        }

        $this->command->info('تم إنشاء ' . count($coupons) . ' كوبون تجريبي');
    }
}
