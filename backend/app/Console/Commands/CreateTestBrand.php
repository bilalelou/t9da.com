<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Brand;

class CreateTestBrand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'brand:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create test brands for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            $brands = [
                ['name' => 'Apple', 'slug' => 'apple'],
                ['name' => 'Samsung', 'slug' => 'samsung'],
                ['name' => 'Sony', 'slug' => 'sony'],
                ['name' => 'LG', 'slug' => 'lg'],
                ['name' => 'Huawei', 'slug' => 'huawei'],
            ];

            foreach ($brands as $brandData) {
                // Check if brand already exists
                if (!Brand::where('slug', $brandData['slug'])->exists()) {
                    Brand::create($brandData);
                    $this->info("Created brand: {$brandData['name']}");
                } else {
                    $this->info("Brand {$brandData['name']} already exists");
                }
            }

            $this->info("Test brands created successfully!");
            $this->info("Total brands: " . Brand::count());

            return 0;
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
    }
}
