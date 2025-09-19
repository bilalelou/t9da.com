<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Color;
use App\Models\Size;
use App\Models\ProductVariant;

class TestProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء category و brand إذا لم يكونا موجودين
        $category = Category::firstOrCreate([
            'slug' => 'test-category'
        ], [
            'name' => 'تصنيف تجريبي'
        ]);

        $brand = Brand::firstOrCreate([
            'slug' => 'test-brand'
        ], [
            'name' => 'ماركة تجريبية'
        ]);

        // إنشاء منتج تجريبي
        $product = Product::updateOrCreate([
            'slug' => 'test-product'
        ], [
            'name' => 'منتج تجريبي رائع',
            'description' => 'وصف مفصل للمنتج التجريبي مع جميع المزايا والخصائص المهمة التي يبحث عنها العملاء.',
            'regular_price' => 150.00,
            'sale_price' => 120.00,
            'SKU' => 'TEST001',
            'stock_status' => 'instock',
            'quantity' => 100,
            'category_id' => $category->id,
            'brand_id' => $brand->id,
            'has_variants' => true,
            'thumbnail' => 'https://via.placeholder.com/600x600/4F46E5/ffffff?text=منتج+تجريبي',
            'featured' => true
        ]);

        // حذف variants القديمة إذا كانت موجودة
        ProductVariant::where('product_id', $product->id)->delete();

        // إنشاء variants للمنتج
        $colors = Color::take(4)->get();
        $sizes = Size::take(4)->get();

        foreach ($colors as $color) {
            foreach ($sizes as $size) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'color_id' => $color->id,
                    'size_id' => $size->id,
                    'sku' => "TEST001-{$color->name}-{$size->name}",
                    'price' => $product->sale_price ?: $product->regular_price,
                    'quantity' => rand(5, 20)
                ]);
            }
        }

        $this->command->info("Test product created successfully! Slug: {$product->slug}");
        $this->command->info("Variants created: " . ProductVariant::where('product_id', $product->id)->count());
    }
}
