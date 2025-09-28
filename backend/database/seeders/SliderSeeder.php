<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Slider;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sliders = [
            [
                'title' => 'عروض الصيف الحصرية',
                'description' => 'خصومات تصل إلى 70% على جميع المنتجات',
                'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
                'button_text' => 'تسوق الآن',
                'button_link' => '/shop',
                'order' => 1,
                'is_active' => true
            ],
            [
                'title' => 'منتجات إلكترونية حديثة',
                'description' => 'أحدث الأجهزة الذكية بأسعار مناسبة',
                'image_url' => 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
                'button_text' => 'اكتشف المزيد',
                'button_link' => '/shop?category=electronics',
                'order' => 2,
                'is_active' => true
            ],
            [
                'title' => 'موضة وأزياء عصرية',
                'description' => 'كولكشن جديد من أفضل الماركات العالمية',
                'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
                'button_text' => 'تسوق الموضة',
                'button_link' => '/shop?category=fashion',
                'order' => 3,
                'is_active' => true
            ],
            [
                'title' => 'شحن مجاني',
                'description' => 'شحن مجاني لجميع الطلبات فوق 200 درهم',
                'image_url' => 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800',
                'button_text' => 'اطلب الآن',
                'button_link' => '/shop',
                'order' => 4,
                'is_active' => false // غير نشط كمثال
            ]
        ];

        foreach ($sliders as $slider) {
            Slider::create($slider);
        }
    }
}
