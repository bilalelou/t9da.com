<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // نظف البيانات الموجودة
        DB::table('product_variants')->truncate();

        // احصل على IDs للمنتجات والألوان والأحجام
        $samsungS22 = DB::table('products')->where('name', 'Samsung Galaxy S22')->first();
        $iphone14 = DB::table('products')->where('name', 'iPhone 14 Pro')->first();

        $blackColor = DB::table('colors')->where('name', 'أسود')->first();
        $whiteColor = DB::table('colors')->where('name', 'أبيض')->first();
        $blueColor = DB::table('colors')->where('name', 'أزرق')->first();

        $size128 = DB::table('sizes')->where('name', '128GB')->first();
        $size256 = DB::table('sizes')->where('name', '256GB')->first();
        $size512 = DB::table('sizes')->where('name', '512GB')->first();

        if ($samsungS22 && $blackColor && $size128) {
            // Variants للSamsung Galaxy S22
            DB::table('product_variants')->insert([
                [
                    'product_id' => $samsungS22->id,
                    'color_id' => $blackColor->id,
                    'size_id' => $size128->id,
                    'sku' => 'SM-S901E-BLACK-128',
                    'price' => 11500,
                    'quantity' => 20,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'product_id' => $samsungS22->id,
                    'color_id' => $blackColor->id,
                    'size_id' => $size256->id,
                    'sku' => 'SM-S901E-BLACK-256',
                    'price' => 12500,
                    'quantity' => 15,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'product_id' => $samsungS22->id,
                    'color_id' => $whiteColor->id,
                    'size_id' => $size128->id,
                    'sku' => 'SM-S901E-WHITE-128',
                    'price' => 11500,
                    'quantity' => 18,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'product_id' => $samsungS22->id,
                    'color_id' => $whiteColor->id,
                    'size_id' => $size256->id,
                    'sku' => 'SM-S901E-WHITE-256',
                    'price' => 12500,
                    'quantity' => 12,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        if ($iphone14 && $blueColor && $size256) {
            // Variants للiPhone 14 Pro
            DB::table('product_variants')->insert([
                [
                    'product_id' => $iphone14->id,
                    'color_id' => $blueColor->id,
                    'size_id' => $size256->id,
                    'sku' => 'APL-14PRO-BLUE-256',
                    'price' => 14000,
                    'quantity' => 10,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'product_id' => $iphone14->id,
                    'color_id' => $blueColor->id,
                    'size_id' => $size512->id,
                    'sku' => 'APL-14PRO-BLUE-512',
                    'price' => 15500,
                    'quantity' => 8,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
                [
                    'product_id' => $iphone14->id,
                    'color_id' => $blackColor->id,
                    'size_id' => $size256->id,
                    'sku' => 'APL-14PRO-BLACK-256',
                    'price' => 14000,
                    'quantity' => 12,
                    'created_at' => now(),
                    'updated_at' => now(),
                ],
            ]);
        }

        // تفعيل has_variants للمنتجات التي لديها variants
        DB::table('products')
            ->whereIn('id', [$samsungS22->id ?? 0, $iphone14->id ?? 0])
            ->update(['has_variants' => true]);
    }
}
