<?php

require 'vendor/autoload.php';
require 'bootstrap/app.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

// Create admin user
DB::table('users')->insert([
    'name' => 'Admin',
    'email' => 'admin@t9da.com',
    'email_verified_at' => now(),
    'password' => Hash::make('password'),
    'phone' => '0600000000',
    'is_active' => true,
    'created_at' => now(),
    'updated_at' => now(),
]);

// Create a brand
$brandId = DB::table('brands')->insertGetId([
    'name' => 'علامة تجارية',
    'description' => 'علامة تجارية تجريبية',
    'created_at' => now(),
    'updated_at' => now(),
]);

// Create a category
$categoryId = DB::table('categories')->insertGetId([
    'name' => 'فئة تجريبية',
    'description' => 'فئة للاختبار',
    'created_at' => now(),
    'updated_at' => now(),
]);

echo "✅ تم إنشاء البيانات الأساسية بنجاح!\n";
echo "- المستخدم الإداري: admin@t9da.com / password\n";
echo "- معرف العلامة التجارية: $brandId\n";
echo "- معرف الفئة: $categoryId\n";