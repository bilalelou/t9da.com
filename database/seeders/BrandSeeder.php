<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;


class BrandSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
public function run(): void
{
    $brands = [
        ['name' => 'Apple', 'image' => 'apple.png'],
        ['name' => 'Samsung', 'image' => 'samsung.png'],
        ['name' => 'Dell', 'image' => 'dell.png'],
    ];

    foreach ($brands as $data) {
        $brand = new Brand();
        $brand->name = $data['name'];
        $brand->slug = Str::slug($data['name']);
        $brand->image = $data['image'];
        $brand->save();
    }
}

}
