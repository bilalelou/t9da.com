<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Slider;
use Illuminate\Support\Facades\DB;

class SliderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Vider la table avant de la remplir pour éviter les doublons
        DB::table('sliders')->delete();

        Slider::create([
            'title' => 'اكتشف عالم من التكنولوجيا',
            'description' => 'أحدث الهواتف، اللابتوبات، والإكسسوارات بأسعار لا تقاوم.',
            'image_url' => 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1925&auto=format&fit=crop',
            'button_text' => 'تسوق الإلكترونيات',
            'button_link' => '/category/electronics',
            'order' => 1,
            'is_active' => true,
        ]);

        Slider::create([
            'title' => 'أناقتك تبدأ من هنا',
            'description' => 'تشكيلة جديدة من الأزياء العصرية للرجال والنساء لموسم 2025.',
            'image_url' => 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop',
            'button_text' => 'اكتشف المجموعة',
            'button_link' => '/category/fashion',
            'order' => 2,
            'is_active' => true,
        ]);

        Slider::create([
            'title' => 'تخفيضات نهاية الأسبوع',
            'description' => 'خصومات تصل إلى 50% على منتجات مختارة. لا تفوت الفرصة!',
            'image_url' => 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9e?q=80&w=2070&auto=format&fit=crop',
            'button_text' => 'شاهد العروض',
            'button_link' => '/sale',
            'order' => 3,
            'is_active' => false, // يمكنك تغييرها إلى true لتظهر في الصفحة
        ]);
    }
}

