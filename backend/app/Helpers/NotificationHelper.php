<?php

namespace App\Helpers;

use App\Models\Notification;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;

class NotificationHelper
{
    /**
     * إنشاء إشعار طلب جديد
     */
    public static function newOrder(Order $order)
    {
        return Notification::createOrderNotification(
            $order->id,
            'طلب جديد',
            "تم استلام طلب جديد برقم #{$order->id} بقيمة {$order->total} ريال من العميل {$order->user->name}",
            'high'
        );
    }

    /**
     * إنشاء إشعار تحديث حالة الطلب
     */
    public static function orderStatusUpdated(Order $order, $oldStatus, $newStatus)
    {
        $statusLabels = [
            'pending' => 'في الانتظار',
            'confirmed' => 'مؤكد',
            'processing' => 'قيد التحضير',
            'shipped' => 'تم الشحن',
            'delivered' => 'تم التسليم',
            'cancelled' => 'ملغي'
        ];

        $priority = $newStatus === 'cancelled' ? 'high' : 'medium';

        return Notification::createOrderNotification(
            $order->id,
            'تحديث حالة الطلب',
            "تم تغيير حالة الطلب #{$order->id} من \"{$statusLabels[$oldStatus]}\" إلى \"{$statusLabels[$newStatus]}\"",
            $priority
        );
    }

    /**
     * إنشاء إشعار مستخدم جديد
     */
    public static function newUser(User $user)
    {
        return Notification::createUserNotification(
            $user->id,
            'مستخدم جديد',
            "انضم مستخدم جديد: {$user->name} ({$user->email})",
            'medium'
        );
    }

    /**
     * إنشاء إشعار نفاد المخزون
     */
    public static function lowStock(Product $product, $currentStock)
    {
        $priority = $currentStock == 0 ? 'urgent' : 'high';
        $message = $currentStock == 0
            ? "تحذير عاجل: المنتج \"{$product->name}\" نفد من المخزن!"
            : "تحذير: المنتج \"{$product->name}\" أوشك على النفاد (متبقي {$currentStock} قطع)";

        return Notification::create([
            'title' => $currentStock == 0 ? 'نفاد المخزون' : 'نقص المخزون',
            'message' => $message,
            'type' => 'product',
            'priority' => $priority,
            'data' => json_encode(['product_id' => $product->id, 'stock' => $currentStock]),
            'action_url' => "/admin/inventory"
        ]);
    }

    /**
     * إنشاء إشعار منتج جديد
     */
    public static function newProduct(Product $product)
    {
        return Notification::create([
            'title' => 'منتج جديد',
            'message' => "تم إضافة منتج جديد: \"{$product->name}\"",
            'type' => 'product',
            'priority' => 'medium',
            'data' => json_encode(['product_id' => $product->id]),
            'action_url' => "/admin/products/{$product->id}/edit"
        ]);
    }

    /**
     * إنشاء إشعار طلب بقيمة عالية
     */
    public static function highValueOrder(Order $order)
    {
        return Notification::createOrderNotification(
            $order->id,
            'طلب بقيمة عالية',
            "تنبيه: طلب بقيمة عالية #{$order->id} - {$order->total} ريال من العميل {$order->user->name}",
            'urgent'
        );
    }

    /**
     * إنشاء إشعار خطأ في النظام
     */
    public static function systemError($title, $message, $data = null)
    {
        return Notification::create([
            'title' => $title,
            'message' => $message,
            'type' => 'error',
            'priority' => 'high',
            'data' => $data ? json_encode($data) : null
        ]);
    }

    /**
     * إنشاء إشعار نجاح في النظام
     */
    public static function systemSuccess($title, $message, $data = null)
    {
        return Notification::create([
            'title' => $title,
            'message' => $message,
            'type' => 'success',
            'priority' => 'low',
            'data' => $data ? json_encode($data) : null
        ]);
    }

    /**
     * إنشاء إشعار تحذير في النظام
     */
    public static function systemWarning($title, $message, $data = null)
    {
        return Notification::create([
            'title' => $title,
            'message' => $message,
            'type' => 'warning',
            'priority' => 'medium',
            'data' => $data ? json_encode($data) : null
        ]);
    }

    /**
     * إنشاء إشعار معلومات في النظام
     */
    public static function systemInfo($title, $message, $data = null)
    {
        return Notification::create([
            'title' => $title,
            'message' => $message,
            'type' => 'info',
            'priority' => 'low',
            'data' => $data ? json_encode($data) : null
        ]);
    }

    /**
     * تنظيف الإشعارات القديمة (حذف الإشعارات المقروءة الأقدم من شهر)
     */
    public static function cleanupOldNotifications()
    {
        $deletedCount = Notification::where('is_read', true)
            ->where('created_at', '<', now()->subMonth())
            ->delete();

        if ($deletedCount > 0) {
            self::systemInfo(
                'تنظيف الإشعارات',
                "تم حذف {$deletedCount} إشعار قديم من النظام",
                ['deleted_count' => $deletedCount]
            );
        }

        return $deletedCount;
    }

    /**
     * إحصائيات سريعة للإشعارات
     */
    public static function getQuickStats()
    {
        return [
            'total' => Notification::count(),
            'unread' => Notification::unread()->count(),
            'urgent' => Notification::byPriority('urgent')->unread()->count(),
            'today' => Notification::whereDate('created_at', today())->count(),
            'by_type' => Notification::selectRaw('type, COUNT(*) as count')
                ->groupBy('type')
                ->pluck('count', 'type')
                ->toArray()
        ];
    }
}
