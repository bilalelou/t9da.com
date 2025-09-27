<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\City;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cities = [
            ['name' => 'الدار البيضاء', 'price' => 30.00, 'duration' => '1-2 أيام', 'is_active' => true],
            ['name' => 'الرباط', 'price' => 35.00, 'duration' => '1-3 أيام', 'is_active' => true],
            ['name' => 'مراكش', 'price' => 45.00, 'duration' => '2-4 أيام', 'is_active' => true],
            ['name' => 'فاس', 'price' => 40.00, 'duration' => '2-3 أيام', 'is_active' => true],
            ['name' => 'طنجة', 'price' => 50.00, 'duration' => '3-5 أيام', 'is_active' => true],
            ['name' => 'أكادير', 'price' => 55.00, 'duration' => '3-5 أيام', 'is_active' => true],
            ['name' => 'وجدة', 'price' => 48.00, 'duration' => '2-4 أيام', 'is_active' => true],
            ['name' => 'القنيطرة', 'price' => 38.00, 'duration' => '2-3 أيام', 'is_active' => true],
            ['name' => 'تطوان', 'price' => 52.00, 'duration' => '3-5 أيام', 'is_active' => true],
            ['name' => 'الجديدة', 'price' => 42.00, 'duration' => '2-4 أيام', 'is_active' => true],
        ];

        foreach ($cities as $city) {
            City::create($city);
        }
    }
}
