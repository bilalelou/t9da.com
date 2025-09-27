<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\DB;

class FreeShippingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // تحديث أول 3 منتجات ليكون لها شحن مجاني
        DB::table('products')
            ->limit(3)
            ->update([
                'has_free_shipping' => true,
                'free_shipping_note' => 'شحن مجاني لهذا المنتج في جميع أنحاء المملكة',
                'updated_at' => now()
            ]);

        // تحديث باقي المنتجات لتكون بشحن مدفوع
        DB::table('products')
            ->where('id', '>', 3)
            ->update([
                'has_free_shipping' => false,
                'free_shipping_note' => null,
                'updated_at' => now()
            ]);

        $this->command->info('تم تحديث المنتجات بميزة الشحن المجاني بنجاح!');
    }
}
