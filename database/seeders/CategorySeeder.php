<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
  public function run(): void
    {
        $category= new Category();
        $category->name = 'Electronics';
        $category->slug = 'electronics';
        $category->image = 'electronics.png';
        $category->save();
        $category= new Category();
        $category->name = 'Home Appliances';
        $category->slug = 'home-appliances';
        $category->image = 'home-appliances.png';
        $category->save();
    }

    }
