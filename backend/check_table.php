<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo "Columns in product_reviews table:\n";
try {
    $columns = DB::select('DESCRIBE product_reviews');
    foreach($columns as $column) {
        echo "- " . $column->Field . " (" . $column->Type . ")\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

echo "\nTesting if table exists:\n";
if (Schema::hasTable('product_reviews')) {
    echo "✅ Table 'product_reviews' exists\n";
    
    echo "\nChecking specific columns:\n";
    if (Schema::hasColumn('product_reviews', 'rating')) {
        echo "✅ Column 'rating' exists\n";
    } else {
        echo "❌ Column 'rating' does not exist\n";
    }
    
    if (Schema::hasColumn('product_reviews', 'is_verified')) {
        echo "✅ Column 'is_verified' exists\n";
    } else {
        echo "❌ Column 'is_verified' does not exist\n";
    }
} else {
    echo "❌ Table 'product_reviews' does not exist\n";
}