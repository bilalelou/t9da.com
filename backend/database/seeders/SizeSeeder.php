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
            ['name' => 'XS', 'display_name' => 'صغير جداً', 'sort_order' => 1],
            ['name' => 'S', 'display_name' => 'صغير', 'sort_order' => 2],
            ['name' => 'M', 'display_name' => 'متوسط', 'sort_order' => 3],
            ['name' => 'L', 'display_name' => 'كبير', 'sort_order' => 4],
            ['name' => 'XL', 'display_name' => 'كبير جداً', 'sort_order' => 5],
            ['name' => 'XXL', 'display_name' => 'كبير جداً جداً', 'sort_order' => 6],
            ['name' => '32', 'display_name' => 'مقاس 32', 'sort_order' => 7],
            ['name' => '34', 'display_name' => 'مقاس 34', 'sort_order' => 8],
            ['name' => '36', 'display_name' => 'مقاس 36', 'sort_order' => 9],
            ['name' => '38', 'display_name' => 'مقاس 38', 'sort_order' => 10],
            ['name' => '40', 'display_name' => 'مقاس 40', 'sort_order' => 11],
            ['name' => '42', 'display_name' => 'مقاس 42', 'sort_order' => 12],
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
