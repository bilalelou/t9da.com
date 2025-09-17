<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\Category;

class CreateTestProduct extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'product:create-test';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a test product for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        try {
            // First, let's check if we have any categories
            $category = Category::first();

            if (!$category) {
                $this->info('No categories found. Creating a test category...');
                $category = Category::create([
                    'name' => 'Electronics',
                    'slug' => 'electronics',
                    'description' => 'Electronic products'
                ]);
                $this->info("Category created with ID: {$category->id}");
            } else {
                $this->info("Using existing category: {$category->name} (ID: {$category->id})");
            }

            // Create a test product
            $product = Product::create([
                'name' => 'Test Product',
                'slug' => 'test-product-' . time(),
                'SKU' => 'TEST-' . time(),
                'short_description' => 'This is a test product description',
                'description' => 'This is a detailed description of the test product',
                'regular_price' => 100.00,
                'sale_price' => 80.00,
                'quantity' => 50,
                'category_id' => $category->id,
                'image' => null,
                'images' => json_encode([]),
                'is_active' => 1
            ]);

            $this->info("Test product created successfully!");
            $this->info("Product ID: {$product->id}");
            $this->info("Product Name: {$product->name}");
            $this->info("You can now test editing at: http://localhost:3000/admin/products/edit/{$product->id}");

            return 0;
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
            return 1;
        }
    }
}
