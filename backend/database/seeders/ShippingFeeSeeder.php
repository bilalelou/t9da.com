<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ShippingFee;

class ShippingFeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🚚 إنشاء رسوم الشحن...');

        // نظف البيانات الموجودة
        \Illuminate\Support\Facades\DB::table('shipping_fees')->truncate();

        $shippingFees = [
            // المدن الرئيسية - أرخص الأسعار
            ['region' => 'الدار البيضاء-سطات', 'city' => 'الدار البيضاء', 'cost' => 25.00],
            ['region' => 'الدار البيضاء-سطات', 'city' => 'المحمدية', 'cost' => 30.00],
            ['region' => 'الدار البيضاء-سطات', 'city' => 'سطات', 'cost' => 35.00],

            ['region' => 'الرباط-سلا-القنيطرة', 'city' => 'الرباط', 'cost' => 30.00],
            ['region' => 'الرباط-سلا-القنيطرة', 'city' => 'سلا', 'cost' => 30.00],
            ['region' => 'الرباط-سلا-القنيطرة', 'city' => 'القنيطرة', 'cost' => 40.00],
            ['region' => 'الرباط-سلا-القنيطرة', 'city' => 'تمارة', 'cost' => 35.00],

            // فاس ومكناس
            ['region' => 'فاس-مكناس', 'city' => 'فاس', 'cost' => 45.00],
            ['region' => 'فاس-مكناس', 'city' => 'مكناس', 'cost' => 45.00],
            ['region' => 'فاس-مكناس', 'city' => 'إفران', 'cost' => 55.00],

            // مراكش
            ['region' => 'مراكش-آسفي', 'city' => 'مراكش', 'cost' => 40.00],
            ['region' => 'مراكش-آسفي', 'city' => 'آسفي', 'cost' => 50.00],
            ['region' => 'مراكش-آسفي', 'city' => 'الصويرة', 'cost' => 55.00],

            // طنجة والشمال
            ['region' => 'طنجة-تطوان-الحسيمة', 'city' => 'طنجة', 'cost' => 50.00],
            ['region' => 'طنجة-تطوان-الحسيمة', 'city' => 'تطوان', 'cost' => 55.00],
            ['region' => 'طنجة-تطوان-الحسيمة', 'city' => 'الحسيمة', 'cost' => 65.00],
            ['region' => 'طنجة-تطوان-الحسيمة', 'city' => 'أصيلة', 'cost' => 60.00],

            // أغادير والجنوب
            ['region' => 'سوس-ماسة', 'city' => 'أغادير', 'cost' => 55.00],
            ['region' => 'سوس-ماسة', 'city' => 'إنزكان', 'cost' => 55.00],
            ['region' => 'سوس-ماسة', 'city' => 'تارودانت', 'cost' => 65.00],

            // الشرق
            ['region' => 'الشرق', 'city' => 'وجدة', 'cost' => 60.00],
            ['region' => 'الشرق', 'city' => 'الناظور', 'cost' => 65.00],
            ['region' => 'الشرق', 'city' => 'بركان', 'cost' => 65.00],

            // بني ملال
            ['region' => 'بني ملال-خنيفرة', 'city' => 'بني ملال', 'cost' => 50.00],
            ['region' => 'بني ملال-خنيفرة', 'city' => 'خنيفرة', 'cost' => 55.00],
            ['region' => 'بني ملال-خنيفرة', 'city' => 'خريبكة', 'cost' => 45.00],

            // الداخلة والعيون
            ['region' => 'الداخلة-وادي الذهب', 'city' => 'الداخلة', 'cost' => 100.00],
            ['region' => 'العيون-الساقية الحمراء', 'city' => 'العيون', 'cost' => 90.00],

            // درعة تافيلالت
            ['region' => 'درعة-تافيلالت', 'city' => 'الراشيدية', 'cost' => 70.00],
            ['region' => 'درعة-تافيلالت', 'city' => 'ورزازات', 'cost' => 65.00],
            ['region' => 'درعة-تافيلالت', 'city' => 'زاكورة', 'cost' => 75.00],

            // كلميم
            ['region' => 'كلميم-واد نون', 'city' => 'كلميم', 'cost' => 80.00],
            ['region' => 'كلميم-واد نون', 'city' => 'طانطان', 'cost' => 85.00],

            // للمناطق غير المحددة
            ['region' => 'أخرى', 'city' => 'مدن أخرى', 'cost' => 75.00],
        ];

        foreach ($shippingFees as $fee) {
            ShippingFee::create($fee);
        }

        $this->command->info('✅ تم إنشاء ' . count($shippingFees) . ' سعر شحن لمختلف المدن المغربية');
    }
}
