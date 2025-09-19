<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Color;
use App\Models\Size;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;

class ProductVariantSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🎨 إنشاء متغيرات المنتجات...');

        // نظف البيانات الموجودة
        DB::table('product_variants')->truncate();

        // === متغيرات الهواتف الذكية ===
        $this->createSmartphoneVariants();
        
        // === متغيرات أجهزة الكمبيوتر ===
        $this->createLaptopVariants();
        
        // === متغيرات الأزياء ===
        $this->createFashionVariants();
        
        // === متغيرات الإكسسوارات ===
        $this->createAccessoryVariants();

        $this->command->info('✅ تم إنشاء جميع متغيرات المنتجات بنجاح');
    }

    private function createSmartphoneVariants()
    {
        // Samsung Galaxy S24 Ultra
        $s24Ultra = Product::where('slug', 'samsung-galaxy-s24-ultra')->first();
        if ($s24Ultra) {
            $this->createVariantsForProduct($s24Ultra, [
                ['color' => 'أسود', 'size' => '256GB', 'price' => 14499, 'stock' => 25],
                ['color' => 'أسود', 'size' => '512GB', 'price' => 15999, 'stock' => 20],
                ['color' => 'أسود', 'size' => '1TB', 'price' => 17999, 'stock' => 10],
                ['color' => 'أبيض', 'size' => '256GB', 'price' => 14499, 'stock' => 20],
                ['color' => 'أبيض', 'size' => '512GB', 'price' => 15999, 'stock' => 15],
                ['color' => 'بنفسجي', 'size' => '256GB', 'price' => 14699, 'stock' => 15],
                ['color' => 'بنفسجي', 'size' => '512GB', 'price' => 16199, 'stock' => 12],
            ]);
        }

        // iPhone 15 Pro Max
        $iphone15ProMax = Product::where('slug', 'iphone-15-pro-max')->first();
        if ($iphone15ProMax) {
            $this->createVariantsForProduct($iphone15ProMax, [
                ['color' => 'أسود', 'size' => '256GB', 'price' => 16999, 'stock' => 18],
                ['color' => 'أسود', 'size' => '512GB', 'price' => 18999, 'stock' => 12],
                ['color' => 'أسود', 'size' => '1TB', 'price' => 20999, 'stock' => 8],
                ['color' => 'أبيض', 'size' => '256GB', 'price' => 16999, 'stock' => 15],
                ['color' => 'أبيض', 'size' => '512GB', 'price' => 18999, 'stock' => 10],
                ['color' => 'أزرق', 'size' => '256GB', 'price' => 16999, 'stock' => 12],
                ['color' => 'أزرق', 'size' => '512GB', 'price' => 18999, 'stock' => 8],
            ]);
        }

        // Google Pixel 8 Pro
        $pixel8Pro = Product::where('slug', 'google-pixel-8-pro')->first();
        if ($pixel8Pro) {
            $this->createVariantsForProduct($pixel8Pro, [
                ['color' => 'أسود', 'size' => '128GB', 'price' => 12499, 'stock' => 20],
                ['color' => 'أسود', 'size' => '256GB', 'price' => 13499, 'stock' => 15],
                ['color' => 'أبيض', 'size' => '128GB', 'price' => 12499, 'stock' => 18],
                ['color' => 'أبيض', 'size' => '256GB', 'price' => 13499, 'stock' => 12],
                ['color' => 'أزرق', 'size' => '128GB', 'price' => 12499, 'stock' => 15],
            ]);
        }
    }

    private function createLaptopVariants()
    {
        // MacBook Pro 16 M3 Max
        $macbookPro16 = Product::where('slug', 'macbook-pro-16-m3-max')->first();
        if ($macbookPro16) {
            $this->createVariantsForProduct($macbookPro16, [
                ['color' => 'فضي', 'size' => '512GB', 'price' => 33999, 'stock' => 8],
                ['color' => 'فضي', 'size' => '1TB', 'price' => 35999, 'stock' => 6],
                ['color' => 'فضي', 'size' => '2TB', 'price' => 39999, 'stock' => 4],
                ['color' => 'رمادي', 'size' => '512GB', 'price' => 33999, 'stock' => 7],
                ['color' => 'رمادي', 'size' => '1TB', 'price' => 35999, 'stock' => 5],
            ]);
        }

        // Dell XPS 15 OLED
        $dellXps15 = Product::where('slug', 'dell-xps-15-oled')->first();
        if ($dellXps15) {
            $this->createVariantsForProduct($dellXps15, [
                ['color' => 'فضي', 'size' => '512GB', 'price' => 28999, 'stock' => 6],
                ['color' => 'فضي', 'size' => '1TB', 'price' => 30999, 'stock' => 4],
                ['color' => 'أسود', 'size' => '512GB', 'price' => 28999, 'stock' => 5],
                ['color' => 'أسود', 'size' => '1TB', 'price' => 30999, 'stock' => 3],
            ]);
        }
    }

    private function createFashionVariants()
    {
        // جاكيت جلد
        $leatherJacket = Product::where('slug', 'leather-jacket-black')->first();
        if ($leatherJacket) {
            $this->createVariantsForProduct($leatherJacket, [
                ['color' => 'أسود', 'size' => 'S', 'price' => 999, 'stock' => 8],
                ['color' => 'أسود', 'size' => 'M', 'price' => 999, 'stock' => 10],
                ['color' => 'أسود', 'size' => 'L', 'price' => 999, 'stock' => 12],
                ['color' => 'أسود', 'size' => 'XL', 'price' => 999, 'stock' => 8],
                ['color' => 'بني', 'size' => 'M', 'price' => 1099, 'stock' => 6],
                ['color' => 'بني', 'size' => 'L', 'price' => 1099, 'stock' => 8],
                ['color' => 'بني', 'size' => 'XL', 'price' => 1099, 'stock' => 5],
            ]);
        }

        // فستان صيفي
        $summerDress = Product::where('slug', 'summer-dress-blue')->first();
        if ($summerDress) {
            $this->createVariantsForProduct($summerDress, [
                ['color' => 'أزرق', 'size' => 'S', 'price' => 449, 'stock' => 12],
                ['color' => 'أزرق', 'size' => 'M', 'price' => 449, 'stock' => 15],
                ['color' => 'أزرق', 'size' => 'L', 'price' => 449, 'stock' => 18],
                ['color' => 'أزرق', 'size' => 'XL', 'price' => 449, 'stock' => 10],
                ['color' => 'وردي', 'size' => 'S', 'price' => 449, 'stock' => 8],
                ['color' => 'وردي', 'size' => 'M', 'price' => 449, 'stock' => 12],
                ['color' => 'وردي', 'size' => 'L', 'price' => 449, 'stock' => 15],
                ['color' => 'أبيض', 'size' => 'M', 'price' => 449, 'stock' => 10],
                ['color' => 'أبيض', 'size' => 'L', 'price' => 449, 'stock' => 12],
            ]);
        }
    }

    private function createAccessoryVariants()
    {
        // Apple Watch Series 9
        $appleWatch = Product::where('slug', 'apple-watch-series-9')->first();
        if ($appleWatch) {
            $this->createVariantsForProduct($appleWatch, [
                ['color' => 'أسود', 'size' => '41mm', 'price' => 4499, 'stock' => 20],
                ['color' => 'أسود', 'size' => '45mm', 'price' => 4999, 'stock' => 18],
                ['color' => 'فضي', 'size' => '41mm', 'price' => 4499, 'stock' => 15],
                ['color' => 'فضي', 'size' => '45mm', 'price' => 4999, 'stock' => 12],
                ['color' => 'أحمر', 'size' => '41mm', 'price' => 4499, 'stock' => 10],
                ['color' => 'أحمر', 'size' => '45mm', 'price' => 4999, 'stock' => 8],
            ]);
        }

        // سماعات Sony
        $sonyHeadphones = Product::where('slug', 'sony-wh-1000xm5')->first();
        if ($sonyHeadphones) {
            $this->createVariantsForProduct($sonyHeadphones, [
                ['color' => 'أسود', 'size' => 'عادي', 'price' => 2999, 'stock' => 25],
                ['color' => 'فضي', 'size' => 'عادي', 'price' => 2999, 'stock' => 20],
                ['color' => 'أبيض', 'size' => 'عادي', 'price' => 2999, 'stock' => 15],
            ]);
        }

        // حقيبة ظهر ذكية
        $smartBackpack = Product::where('slug', 'smart-waterproof-backpack')->first();
        if ($smartBackpack) {
            $this->createVariantsForProduct($smartBackpack, [
                ['color' => 'أسود', 'size' => 'عادي', 'price' => 699, 'stock' => 30],
                ['color' => 'رمادي', 'size' => 'عادي', 'price' => 699, 'stock' => 25],
                ['color' => 'أزرق', 'size' => 'عادي', 'price' => 699, 'stock' => 20],
            ]);
        }
    }

    private function createVariantsForProduct($product, $variants)
    {
        foreach ($variants as $variantData) {
            $color = Color::where('name', $variantData['color'])->first();
            $size = Size::where('name', $variantData['size'])->first();
            
            if ($color && $size) {
                ProductVariant::create([
                    'product_id' => $product->id,
                    'color_id' => $color->id,
                    'size_id' => $size->id,
                    'sku' => $product->SKU . '-' . strtoupper($color->name) . '-' . strtoupper($size->name),
                    'price' => $variantData['price'],
                    'quantity' => $variantData['stock'],
                    'is_active' => true,
                ]);
            }
        }
    }
}