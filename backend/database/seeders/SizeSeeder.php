<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Size;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sizes = [
            // أحجام الملابس
            ['name' => 'XS', 'display_name' => 'صغير جداً', 'sort_order' => 1],
            ['name' => 'S', 'display_name' => 'صغير', 'sort_order' => 2],
            ['name' => 'M', 'display_name' => 'متوسط', 'sort_order' => 3],
            ['name' => 'L', 'display_name' => 'كبير', 'sort_order' => 4],
            ['name' => 'XL', 'display_name' => 'كبير جداً', 'sort_order' => 5],
            ['name' => 'XXL', 'display_name' => 'كبير جداً جداً', 'sort_order' => 6],
            
            // أحجام الأحذية
            ['name' => '32', 'display_name' => 'مقاس 32', 'sort_order' => 7],
            ['name' => '34', 'display_name' => 'مقاس 34', 'sort_order' => 8],
            ['name' => '36', 'display_name' => 'مقاس 36', 'sort_order' => 9],
            ['name' => '38', 'display_name' => 'مقاس 38', 'sort_order' => 10],
            ['name' => '40', 'display_name' => 'مقاس 40', 'sort_order' => 11],
            ['name' => '42', 'display_name' => 'مقاس 42', 'sort_order' => 12],
            
            // أحجام الهواتف والأجهزة
            ['name' => '128GB', 'display_name' => '128 جيجابايت', 'sort_order' => 13],
            ['name' => '256GB', 'display_name' => '256 جيجابايت', 'sort_order' => 14],
            ['name' => '512GB', 'display_name' => '512 جيجابايت', 'sort_order' => 15],
            ['name' => '1TB', 'display_name' => '1 تيرابايت', 'sort_order' => 16],
            ['name' => '2TB', 'display_name' => '2 تيرابايت', 'sort_order' => 17],
            
            // أحجام الساعات
            ['name' => '38mm', 'display_name' => '38 مليمتر', 'sort_order' => 18],
            ['name' => '41mm', 'display_name' => '41 مليمتر', 'sort_order' => 19],
            ['name' => '42mm', 'display_name' => '42 مليمتر', 'sort_order' => 20],
            ['name' => '45mm', 'display_name' => '45 مليمتر', 'sort_order' => 21],
            
            // أحجام عامة
            ['name' => 'عادي', 'display_name' => 'حجم عادي', 'sort_order' => 22],
        ];

        foreach ($sizes as $size) {
            Size::create([
                'name' => $size['name'],
                'display_name' => $size['display_name'],
                'sort_order' => $size['sort_order'],
                'is_active' => true,
            ]);
        }
    }
}
