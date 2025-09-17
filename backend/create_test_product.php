<?php

require 'vendor/autoload.php';

$app = require 'bootstrap/app.php';

try {
    // First, let's check if we have any categories
    $category = App\Models\Category::first();

    if (!$category) {
        echo "No categories found. Creating a test category...\n";
        $category = App\Models\Category::create([
            'name' => 'Electronics',
            'slug' => 'electronics',
            'description' => 'Electronic products'
        ]);
        echo "Category created with ID: {$category->id}\n";
    } else {
        echo "Using existing category: {$category->name} (ID: {$category->id})\n";
    }

    // Create a test product
    $product = App\Models\Product::create([
        'name' => 'Test Product',
        'slug' => 'test-product-' . time(),
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

    echo "Test product created successfully!\n";
    echo "Product ID: {$product->id}\n";
    echo "Product Name: {$product->name}\n";
    echo "You can now test editing at: http://localhost:3000/admin/products/edit/{$product->id}\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
