<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Color;

class ColorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colors = [
            ['name' => 'أحمر', 'hex_code' => '#FF0000'],
            ['name' => 'أزرق', 'hex_code' => '#0000FF'],
            ['name' => 'أخضر', 'hex_code' => '#008000'],
            ['name' => 'أصفر', 'hex_code' => '#FFFF00'],
            ['name' => 'أسود', 'hex_code' => '#000000'],
            ['name' => 'أبيض', 'hex_code' => '#FFFFFF'],
            ['name' => 'رمادي', 'hex_code' => '#808080'],
            ['name' => 'بني', 'hex_code' => '#A52A2A'],
            ['name' => 'بنفسجي', 'hex_code' => '#800080'],
            ['name' => 'وردي', 'hex_code' => '#FFC0CB'],
            ['name' => 'برتقالي', 'hex_code' => '#FFA500'],
            ['name' => 'كحلي', 'hex_code' => '#000080'],
            ['name' => 'فضي', 'hex_code' => '#C0C0C0'],
            ['name' => 'ذهبي', 'hex_code' => '#FFD700'],
        ];

        foreach ($colors as $color) {
            Color::create([
                'name' => $color['name'],
                'hex_code' => $color['hex_code'],
                'is_active' => true,
            ]);
        }
    }
}
