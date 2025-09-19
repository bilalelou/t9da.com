<?php

namespace Database\Seeders;

use App\Models\ProductReview;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all products and customer users
        $products = Product::all();
        $customers = User::role('customer')->get();

        if ($products->isEmpty() || $customers->isEmpty()) {
            $this->command->info('No products or customers found. Skipping reviews seeding.');
            return;
        }

        $reviews = [
            // Samsung Galaxy S24 Ultra Reviews
            [
                'product_slug' => 'samsung-galaxy-s24-ultra',
                'reviews' => [
                    [
                        'rating' => 5,
                        'comment' => 'هاتف رائع جداً! جودة الكاميرا ممتازة والأداء سريع للغاية. أنصح بشرائه بقوة.',
                        'helpful_count' => 15,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 4,
                        'comment' => 'منتج جيد ولكن السعر مرتفع قليلاً. البطارية تدوم طوال اليوم.',
                        'helpful_count' => 8,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 5,
                        'comment' => 'الشاشة واضحة جداً وألوانها حيوية. الكاميرا تلتقط صور احترافية.',
                        'helpful_count' => 12,
                        'is_verified' => true,
                    ],
                ],
            ],
            // iPhone 15 Pro Max Reviews
            [
                'product_slug' => 'iphone-15-pro-max',
                'reviews' => [
                    [
                        'rating' => 5,
                        'comment' => 'iPhone ممتاز كالعادة! سرعة وأداء لا مثيل لهما. نظام iOS سلس ومتطور.',
                        'helpful_count' => 20,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 4,
                        'comment' => 'الجهاز ممتاز ولكن أتمنى لو كانت البطارية أفضل. الكاميرا رائعة.',
                        'helpful_count' => 6,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 5,
                        'comment' => 'أفضل استثمار! الجهاز يستحق كل درهم. جودة التصوير خيالية.',
                        'helpful_count' => 18,
                        'is_verified' => true,
                    ],
                ],
            ],
            // MacBook Pro 16 Reviews
            [
                'product_slug' => 'macbook-pro-16-inch',
                'reviews' => [
                    [
                        'rating' => 5,
                        'comment' => 'أفضل لابتوب للمطورين والمصممين! الأداء خيالي والشاشة مذهلة.',
                        'helpful_count' => 25,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 4,
                        'comment' => 'جهاز ممتاز للعمل. البطارية تدوم طويلاً والكيبورد مريح.',
                        'helpful_count' => 14,
                        'is_verified' => true,
                    ],
                ],
            ],
            // Google Pixel 8 Pro Reviews
            [
                'product_slug' => 'google-pixel-8-pro',
                'reviews' => [
                    [
                        'rating' => 4,
                        'comment' => 'الكاميرا رائعة والذكاء الاصطناعي مفيد جداً. نظام أندرويد نظيف.',
                        'helpful_count' => 10,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 5,
                        'comment' => 'أفضل هاتف أندرويد جربته! التحديثات سريعة والأداء ممتاز.',
                        'helpful_count' => 9,
                        'is_verified' => true,
                    ],
                ],
            ],
            // Leather Jacket Reviews
            [
                'product_slug' => 'leather-jacket-premium',
                'reviews' => [
                    [
                        'rating' => 5,
                        'comment' => 'جاكيت جلد أصلي وعالي الجودة! التصميم أنيق والخامة ممتازة.',
                        'helpful_count' => 7,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 4,
                        'comment' => 'الجودة جيدة والتصميم جميل. يناسب الشتاء بشكل مثالي.',
                        'helpful_count' => 5,
                        'is_verified' => true,
                    ],
                ],
            ],
            // Nike Air Max Reviews
            [
                'product_slug' => 'nike-air-max-270',
                'reviews' => [
                    [
                        'rating' => 5,
                        'comment' => 'حذاء مريح جداً للجري والرياضة! الوسادة الهوائية ممتازة.',
                        'helpful_count' => 16,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 4,
                        'comment' => 'تصميم رائع ومريح للمشي الطويل. الجودة جيدة.',
                        'helpful_count' => 11,
                        'is_verified' => true,
                    ],
                ],
            ],
            // AirPods Pro Reviews
            [
                'product_slug' => 'airpods-pro-2nd-gen',
                'reviews' => [
                    [
                        'rating' => 5,
                        'comment' => 'أفضل سماعات لاسلكية! إلغاء الضوضاء ممتاز وجودة الصوت رائعة.',
                        'helpful_count' => 22,
                        'is_verified' => true,
                    ],
                    [
                        'rating' => 4,
                        'comment' => 'سماعات ممتازة ولكن السعر مرتفع. البطارية تدوم طويلاً.',
                        'helpful_count' => 8,
                        'is_verified' => true,
                    ],
                ],
            ],
        ];

        foreach ($reviews as $productReviews) {
            $product = Product::where('slug', $productReviews['product_slug'])->first();

            if (!$product) {
                continue;
            }

            // Shuffle customers to ensure different users for each product
            $shuffledCustomers = $customers->shuffle();

            foreach ($productReviews['reviews'] as $index => $reviewData) {
                // Get a customer that hasn't reviewed this product yet
                $customer = $shuffledCustomers->get($index);

                if (!$customer) {
                    continue; // Skip if no more customers available
                }

                // Check if this customer already reviewed this product
                $existingReview = ProductReview::where('user_id', $customer->id)
                    ->where('product_id', $product->id)
                    ->first();

                if ($existingReview) {
                    continue; // Skip if customer already reviewed this product
                }

                ProductReview::create([
                    'user_id' => $customer->id,
                    'product_id' => $product->id,
                    'rating' => $reviewData['rating'],
                    'comment' => $reviewData['comment'],
                    'is_verified' => $reviewData['is_verified'],
                    'helpful_count' => $reviewData['helpful_count'],
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now()->subDays(rand(1, 30)),
                ]);
            }
        }

        $this->command->info('Product reviews seeded successfully!');
    }
}
