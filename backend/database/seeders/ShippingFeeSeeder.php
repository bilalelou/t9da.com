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
        $shippingFees = [
            ['region' => 'الدار البيضاء-سطات', 'city' => 'الدار البيضاء', 'cost' => 30.00],
            ['region' => 'الدار البيضاء-سطات', 'city' => 'المحمدية', 'cost' => 35.00],
            ['region' => 'الرباط-سلا-القنيطرة', 'city' => 'الرباط', 'cost' => 40.00],
            ['region' => 'الرباط-سلا-القنيطرة', 'city' => 'سلا', 'cost' => 40.00],
            ['region' => 'فاس-مكناس', 'city' => 'فاس', 'cost' => 50.00],
            ['region' => 'فاس-مكناس', 'city' => 'مكناس', 'cost' => 50.00],
            ['region' => 'مراكش-آسفي', 'city' => 'مراكش', 'cost' => 45.00],
            ['region' => 'مراكش-آسفي', 'city' => 'آسفي', 'cost' => 55.00],
            ['region' => 'طنجة-تطوان-الحسيمة', 'city' => 'طنجة', 'cost' => 60.00],
            ['region' => 'طنجة-تطوان-الحسيمة', 'city' => 'تطوان', 'cost' => 65.00],
            ['region' => 'أخرى', 'city' => 'أخرى', 'cost' => 70.00],
        ];

        foreach ($shippingFees as $fee) {
            ShippingFee::create($fee);
        }

        $this->command->info('تم إنشاء ' . count($shippingFees) . ' رسوم شحن تجريبية');
    }
}
