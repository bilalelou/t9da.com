<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Order;
use Carbon\Carbon;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // إنشاء إشعارات متنوعة للاختبار
        $notifications = [
            // إشعارات الطلبات
            [
                'title' => 'طلب جديد',
                'message' => 'تم استلام طلب جديد بقيمة 850 ريال',
                'type' => 'order',
                'priority' => 'high',
                'user_id' => User::where('email', 'customer@t9da.com')->first()?->id,
                'order_id' => Order::first()?->id,
                'action_url' => '/admin/orders/' . (Order::first()?->id ?? 1),
                'created_at' => Carbon::now()->subMinutes(30),
            ],
            [
                'title' => 'تحديث حالة الطلب',
                'message' => 'تم تغيير حالة الطلب #1001 إلى "قيد التحضير"',
                'type' => 'order',
                'priority' => 'medium',
                'order_id' => Order::first()?->id,
                'action_url' => '/admin/orders/' . (Order::first()?->id ?? 1),
                'created_at' => Carbon::now()->subHours(2),
            ],

            // إشعارات المستخدمين
            [
                'title' => 'مستخدم جديد',
                'message' => 'انضم مستخدم جديد: أحمد محمد',
                'type' => 'user',
                'priority' => 'medium',
                'user_id' => User::where('email', 'customer@t9da.com')->first()?->id,
                'action_url' => '/admin/users/' . (User::where('email', 'customer@t9da.com')->first()?->id ?? 1),
                'created_at' => Carbon::now()->subHours(6),
            ],
            [
                'title' => 'طلب تفعيل حساب',
                'message' => 'يطلب المستخدم "سارة أحمد" تفعيل حسابها',
                'type' => 'user',
                'priority' => 'high',
                'user_id' => User::where('email', 'bilal.12elou@gmail.com')->first()?->id,
                'action_url' => '/admin/users/' . (User::where('email', 'bilal.12elou@gmail.com')->first()?->id ?? 1),
                'created_at' => Carbon::now()->subHours(8),
            ],

            // إشعارات المنتجات
            [
                'title' => 'نفاد المخزون',
                'message' => 'تحذير: المنتج "iPhone 15 Pro" أوشك على النفاد (متبقي 3 قطع)',
                'type' => 'product',
                'priority' => 'urgent',
                'data' => json_encode(['product_id' => 1, 'stock' => 3]),
                'action_url' => '/admin/inventory',
                'created_at' => Carbon::now()->subHours(12),
            ],
            [
                'title' => 'منتج جديد',
                'message' => 'تم إضافة منتج جديد: "سماعات AirPods Pro 2"',
                'type' => 'product',
                'priority' => 'medium',
                'data' => json_encode(['product_id' => 2]),
                'action_url' => '/admin/products',
                'created_at' => Carbon::now()->subDay(),
            ],

            // إشعارات النظام
            [
                'title' => 'تحديث النظام',
                'message' => 'تم تحديث النظام بنجاح إلى الإصدار 2.1.0',
                'type' => 'success',
                'priority' => 'low',
                'data' => json_encode(['version' => '2.1.0']),
                'created_at' => Carbon::now()->subDays(2),
                'is_read' => true,
                'read_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'نسخة احتياطية',
                'message' => 'تم إنشاء النسخة الاحتياطية اليومية بنجاح',
                'type' => 'info',
                'priority' => 'low',
                'created_at' => Carbon::now()->subDays(3),
                'is_read' => true,
                'read_at' => Carbon::now()->subDays(2),
            ],

            // إشعارات التحذير
            [
                'title' => 'محاولة دخول مشبوهة',
                'message' => 'تم اكتشاف محاولة دخول غير مصرح بها من IP: 192.168.1.100',
                'type' => 'warning',
                'priority' => 'urgent',
                'data' => json_encode(['ip' => '192.168.1.100', 'country' => 'Unknown']),
                'created_at' => Carbon::now()->subDays(4),
            ],
            [
                'title' => 'خطأ في النظام',
                'message' => 'حدث خطأ في معالجة الدفع للطلب #1055',
                'type' => 'error',
                'priority' => 'high',
                'data' => json_encode(['order_id' => 1055, 'error_code' => 'PAYMENT_FAILED']),
                'action_url' => '/admin/orders/1055',
                'created_at' => Carbon::now()->subDays(5),
                'is_read' => true,
                'read_at' => Carbon::now()->subDays(4),
            ],

            // إشعارات قديمة
            [
                'title' => 'تقرير المبيعات الأسبوعي',
                'message' => 'تقرير المبيعات للأسبوع الماضي: 25,500 ريال',
                'type' => 'info',
                'priority' => 'medium',
                'data' => json_encode(['total_sales' => 25500, 'period' => 'weekly']),
                'action_url' => '/admin/analytics',
                'created_at' => Carbon::now()->subWeek(),
                'is_read' => true,
                'read_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => 'عرض خاص منتهي',
                'message' => 'انتهى العرض الخاص على الهواتف الذكية',
                'type' => 'info',
                'priority' => 'low',
                'created_at' => Carbon::now()->subWeeks(2),
                'is_read' => true,
                'read_at' => Carbon::now()->subWeeks(2),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create($notification);
        }

        $this->command->info('تم إنشاء ' . count($notifications) . ' إشعار تجريبي بنجاح.');
    }
}
