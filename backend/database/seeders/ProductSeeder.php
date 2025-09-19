<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;
use App\Models\Brand;
use App\Models\ProductVideo;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->command->info('🛍️ إنشاء المنتجات...');

        // تعطيل قيود المفتاح الخارجي مؤقتاً
        Schema::disableForeignKeyConstraints();

        // حذف البيانات القديمة
        DB::table('product_videos')->truncate();
        DB::table('order_items')->truncate();
        DB::table('products')->truncate();

        // إعادة تفعيل قيود المفتاح الخارجي
        Schema::enableForeignKeyConstraints();

        // الحصول على التصنيفات والعلامات التجارية
        $smartphones = Category::where('slug', 'smartphones')->first();
        $laptops = Category::where('slug', 'laptops')->first();
        $fashion = Category::where('slug', 'fashion')->first();
        $accessories = Category::where('slug', 'accessories')->first();

        $samsung = Brand::where('slug', 'samsung')->first();
        $apple = Brand::where('slug', 'apple')->first();
        $sony = Brand::where('slug', 'sony')->first();
        $nike = Brand::where('slug', 'nike')->first();
        $adidas = Brand::where('slug', 'adidas')->first();
        $dell = Brand::where('slug', 'dell')->first();
        $hp = Brand::where('slug', 'hp')->first();

        // قائمة المنتجات المتنوعة
        $products = [
            // === الهواتف الذكية ===
            [
                'name' => 'Samsung Galaxy S24 Ultra',
                'slug' => 'samsung-galaxy-s24-ultra',
                'SKU' => 'SAM-S24U-2024',
                'category_id' => $smartphones->id,
                'brand_id' => $samsung->id,
                'short_description' => 'أحدث هاتف Samsung مع قلم S Pen وكاميرا 200 ميجابكسل',
                'description' => 'تجربة Samsung Galaxy S24 Ultra الرائدة مع شاشة Dynamic AMOLED 2X مقاس 6.8 بوصة، ومعالج Snapdragon 8 Gen 3، وذاكرة تخزين تصل إلى 1TB. استمتع بالتصوير الاحترافي مع كاميرا 200MP والذكاء الاصطناعي المدمج.',
                'regular_price' => 15999,
                'sale_price' => 14499,
                'quantity' => 45,
                'stock_status' => 'instock',
                'featured' => true,
                'thumbnail' => 's24-ultra-main.jpg',
                'images' => json_encode(['s24-ultra-1.jpg', 's24-ultra-2.jpg', 's24-ultra-3.jpg', 's24-ultra-4.jpg']),
                'videos' => [
                    [
                        'title' => 'مراجعة Samsung Galaxy S24 Ultra',
                        'description' => 'مراجعة شاملة لأحدث هاتف من Samsung',
                        'video_type' => 'youtube',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'duration' => 720
                    ]
                ]
            ],
            [
                'name' => 'iPhone 15 Pro Max',
                'slug' => 'iphone-15-pro-max',
                'SKU' => 'APL-15PM-2024',
                'category_id' => $smartphones->id,
                'brand_id' => $apple->id,
                'short_description' => 'iPhone الأقوى مع شريحة A17 Pro ومواد التيتانيوم',
                'description' => 'اكتشف iPhone 15 Pro Max مع شريحة A17 Pro المصنوعة بتقنية 3 نانومتر، وكاميرا جديدة 48MP مع تقريب بصري 5x، وتصميم من التيتانيوم خفيف الوزن وقوي.',
                'regular_price' => 16999,
                'sale_price' => null,
                'quantity' => 32,
                'stock_status' => 'instock',
                'featured' => true,
                'thumbnail' => 'iphone15-pro-max-main.jpg',
                'images' => json_encode(['iphone15-pro-max-1.jpg', 'iphone15-pro-max-2.jpg', 'iphone15-pro-max-3.jpg']),
                'videos' => [
                    [
                        'title' => 'iPhone 15 Pro Max - المراجعة الأولى',
                        'description' => 'تعرف على كل جديد في iPhone 15 Pro Max',
                        'video_type' => 'youtube',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'duration' => 600
                    ]
                ]
            ],
            [
                'name' => 'Google Pixel 8 Pro',
                'slug' => 'google-pixel-8-pro',
                'SKU' => 'GOO-P8P-2024',
                'category_id' => $smartphones->id,
                'brand_id' => $sony->id,
                'short_description' => 'هاتف Google الذكي مع أفضل كاميرا للتصوير الليلي',
                'description' => 'Pixel 8 Pro مع شريحة Tensor G3 المخصصة من Google، وكاميرا محسنة بالذكاء الاصطناعي، وشاشة Super Actua مقاس 6.7 بوصة مع معدل تحديث 120Hz.',
                'regular_price' => 13999,
                'sale_price' => 12499,
                'quantity' => 28,
                'stock_status' => 'instock',
                'featured' => false,
                'thumbnail' => 'pixel8-pro-main.jpg',
                'images' => json_encode(['pixel8-pro-1.jpg', 'pixel8-pro-2.jpg', 'pixel8-pro-3.jpg']),
                'videos' => []
            ],

            // === أجهزة الكمبيوتر المحمولة ===
            [
                'name' => 'MacBook Pro 16 M3 Max',
                'slug' => 'macbook-pro-16-m3-max',
                'SKU' => 'APL-MBP16-M3MAX',
                'category_id' => $laptops->id,
                'brand_id' => $apple->id,
                'short_description' => 'أقوى MacBook للمحترفين مع شريحة M3 Max',
                'description' => 'MacBook Pro 16 بوصة مع شريحة Apple M3 Max، ذاكرة وصول عشوائي تصل إلى 128GB، وذاكرة تخزين SSD تصل إلى 8TB. مثالي للمطورين والمصممين ومحرري الفيديو.',
                'regular_price' => 35999,
                'sale_price' => 33999,
                'quantity' => 15,
                'stock_status' => 'instock',
                'featured' => true,
                'thumbnail' => 'macbook-pro-16-main.jpg',
                'images' => json_encode(['macbook-pro-16-1.jpg', 'macbook-pro-16-2.jpg', 'macbook-pro-16-3.jpg']),
                'videos' => [
                    [
                        'title' => 'MacBook Pro M3 Max - مراجعة الأداء',
                        'description' => 'اختبار أداء MacBook Pro الجديد في المهام الاحترافية',
                        'video_type' => 'youtube',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'duration' => 900
                    ]
                ]
            ],
            [
                'name' => 'Dell XPS 15 OLED',
                'slug' => 'dell-xps-15-oled',
                'SKU' => 'DEL-XPS15-OLED',
                'category_id' => $laptops->id,
                'brand_id' => $samsung->id,
                'short_description' => 'لابتوب Dell XPS 15 مع شاشة OLED 4K الرائعة',
                'description' => 'Dell XPS 15 مع شاشة OLED 4K مقاس 15.6 بوصة، معالج Intel Core i9، وكارت جرافيك NVIDIA RTX 4070. تصميم أنيق وأداء قوي للعمل والإبداع.',
                'regular_price' => 28999,
                'sale_price' => null,
                'quantity' => 12,
                'stock_status' => 'instock',
                'featured' => false,
                'thumbnail' => 'dell-xps-15-main.jpg',
                'images' => json_encode(['dell-xps-15-1.jpg', 'dell-xps-15-2.jpg']),
                'videos' => []
            ],

            // === الأزياء ===
            [
                'name' => 'جاكيت جلد أنيق - أسود',
                'slug' => 'leather-jacket-black',
                'SKU' => 'FASH-LJ-BLK',
                'category_id' => $fashion->id,
                'brand_id' => $nike->id,
                'short_description' => 'جاكيت جلد طبيعي عالي الجودة للرجال',
                'description' => 'جاكيت جلد أنيق مصنوع من الجلد الطبيعي عالي الجودة، مناسب للمناسبات الرسمية والكاجوال. تصميم عصري مع تفاصيل أنيقة وجيوب عملية.',
                'regular_price' => 1299,
                'sale_price' => 999,
                'quantity' => 25,
                'stock_status' => 'instock',
                'featured' => false,
                'thumbnail' => 'leather-jacket-main.jpg',
                'images' => json_encode(['leather-jacket-1.jpg', 'leather-jacket-2.jpg', 'leather-jacket-3.jpg']),
                'videos' => []
            ],
            [
                'name' => 'فستان صيفي أزرق',
                'slug' => 'summer-dress-blue',
                'SKU' => 'FASH-SD-BLU',
                'category_id' => $fashion->id,
                'brand_id' => $nike->id,
                'short_description' => 'فستان صيفي أنيق للنساء بلون أزرق فاتح',
                'description' => 'فستان صيفي مريح وأنيق مصنوع من القطن الطبيعي، مثالي للطقس الحار. تصميم عصري مع طبعات جميلة وقصة مريحة.',
                'regular_price' => 599,
                'sale_price' => 449,
                'quantity' => 40,
                'stock_status' => 'instock',
                'featured' => false,
                'thumbnail' => 'summer-dress-main.jpg',
                'images' => json_encode(['summer-dress-1.jpg', 'summer-dress-2.jpg']),
                'videos' => []
            ],

            // === الإكسسوارات ===
            [
                'name' => 'ساعة ذكية Apple Watch Series 9',
                'slug' => 'apple-watch-series-9',
                'SKU' => 'APL-AW-S9',
                'category_id' => $accessories->id,
                'brand_id' => $apple->id,
                'short_description' => 'ساعة Apple الذكية الأحدث مع شاشة أكثر إشراقاً',
                'description' => 'Apple Watch Series 9 مع شريحة S9 السريعة، وشاشة Retina الأكثر إشراقاً، ومقاومة للماء حتى 50 متر. تتبع الصحة واللياقة مع GPS مدمج.',
                'regular_price' => 4999,
                'sale_price' => 4499,
                'quantity' => 35,
                'stock_status' => 'instock',
                'featured' => true,
                'thumbnail' => 'apple-watch-s9-main.jpg',
                'images' => json_encode(['apple-watch-s9-1.jpg', 'apple-watch-s9-2.jpg', 'apple-watch-s9-3.jpg']),
                'videos' => [
                    [
                        'title' => 'Apple Watch Series 9 - كل ما تحتاج معرفته',
                        'description' => 'مراجعة شاملة لساعة Apple الذكية الجديدة',
                        'video_type' => 'youtube',
                        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        'duration' => 480
                    ]
                ]
            ],
            [
                'name' => 'سماعات Sony WH-1000XM5',
                'slug' => 'sony-wh-1000xm5',
                'SKU' => 'SON-WH1000XM5',
                'category_id' => $accessories->id,
                'brand_id' => $sony->id,
                'short_description' => 'سماعات لاسلكية مع إلغاء الضوضاء الأفضل',
                'description' => 'سماعات Sony WH-1000XM5 اللاسلكية مع تقنية إلغاء الضوضاء الرائدة في الصناعة، جودة صوت عالية الدقة، وبطارية تدوم 30 ساعة.',
                'regular_price' => 2999,
                'sale_price' => null,
                'quantity' => 50,
                'stock_status' => 'instock',
                'featured' => false,
                'thumbnail' => 'sony-wh1000xm5-main.jpg',
                'images' => json_encode(['sony-wh1000xm5-1.jpg', 'sony-wh1000xm5-2.jpg']),
                'videos' => []
            ],

            // منتجات إضافية
            [
                'name' => 'حقيبة ظهر ذكية مقاومة للماء',
                'slug' => 'smart-waterproof-backpack',
                'SKU' => 'ACC-SWB-001',
                'category_id' => $accessories->id,
                'brand_id' => $samsung->id,
                'short_description' => 'حقيبة ظهر ذكية مع شاحن USB ومقاومة للماء',
                'description' => 'حقيبة ظهر عملية ومتطورة مع منفذ شحن USB مدمج، مقاومة للماء IPX5، ومقصورات منظمة للكمبيوتر المحمول والأجهزة الإلكترونية.',
                'regular_price' => 899,
                'sale_price' => 699,
                'quantity' => 60,
                'stock_status' => 'instock',
                'featured' => false,
                'thumbnail' => 'smart-backpack-main.jpg',
                'images' => json_encode(['smart-backpack-1.jpg', 'smart-backpack-2.jpg', 'smart-backpack-3.jpg']),
                'videos' => []
            ]
        ];

        foreach ($products as $productData) {
            $videos = $productData['videos'] ?? [];
            unset($productData['videos']);

            // إنشاء المنتج
            $product = Product::create($productData);

            // إضافة الفيديوهات إذا كانت موجودة
            foreach ($videos as $videoData) {
                ProductVideo::create([
                    'product_id' => $product->id,
                    'title' => $videoData['title'],
                    'description' => $videoData['description'],
                    'video_type' => $videoData['video_type'],
                    'video_url' => $videoData['video_url'],
                    'duration' => $videoData['duration'],
                    'is_active' => true,
                    'sort_order' => 1
                ]);
            }
        }

        $this->command->info('✅ تم إنشاء ' . count($products) . ' منتج مع صور وفيديوهات');
    }
}
