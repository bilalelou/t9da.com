<?php

namespace App\Observers;

use App\Models\Order;
use App\Models\Notification;

class OrderObserver
{
    /**
     * Handle the Order "created" event.
     */
    public function created(Order $order): void
    {
        // إنشاء إشعار عند إنشاء طلب جديد
        Notification::createOrderNotification(
            $order->id,
            'طلب جديد',
            "تم استلام طلب جديد برقم #{$order->id} بقيمة {$order->total} ريال",
            'high'
        );

        // إشعار إضافي إذا كان الطلب بقيمة عالية
        if ($order->total >= 1000) {
            Notification::createOrderNotification(
                $order->id,
                'طلب بقيمة عالية',
                "تنبيه: طلب بقيمة عالية #{$order->id} - {$order->total} ريال",
                'urgent'
            );
        }
    }

    /**
     * Handle the Order "updated" event.
     */
    public function updated(Order $order): void
    {
        // إنشاء إشعار عند تغيير حالة الطلب
        if ($order->isDirty('status')) {
            $oldStatus = $order->getOriginal('status');
            $newStatus = $order->status;

            $statusLabels = [
                'pending' => 'في الانتظار',
                'confirmed' => 'مؤكد',
                'processing' => 'قيد التحضير',
                'shipped' => 'تم الشحن',
                'delivered' => 'تم التسليم',
                'cancelled' => 'ملغي'
            ];

            $priority = $newStatus === 'cancelled' ? 'high' : 'medium';

            Notification::createOrderNotification(
                $order->id,
                'تحديث حالة الطلب',
                "تم تغيير حالة الطلب #{$order->id} من \"{$statusLabels[$oldStatus]}\" إلى \"{$statusLabels[$newStatus]}\"",
                $priority
            );
        }

        // إشعار إذا تم تحديث قيمة الطلب
        if ($order->isDirty('total')) {
            $oldTotal = $order->getOriginal('total');
            $newTotal = $order->total;

            Notification::createOrderNotification(
                $order->id,
                'تحديث قيمة الطلب',
                "تم تحديث قيمة الطلب #{$order->id} من {$oldTotal} ريال إلى {$newTotal} ريال",
                'medium'
            );
        }
    }

    /**
     * Handle the Order "deleted" event.
     */
    public function deleted(Order $order): void
    {
        Notification::createSystemNotification(
            'حذف طلب',
            "تم حذف الطلب #{$order->id}",
            'warning',
            'medium'
        );
    }

    /**
     * Handle the Order "restored" event.
     */
    public function restored(Order $order): void
    {
        Notification::createOrderNotification(
            $order->id,
            'استعادة طلب',
            "تم استعادة الطلب #{$order->id}",
            'medium'
        );
    }

    /**
     * Handle the Order "force deleted" event.
     */
    public function forceDeleted(Order $order): void
    {
        Notification::createSystemNotification(
            'حذف نهائي للطلب',
            "تم الحذف النهائي للطلب #{$order->id}",
            'error',
            'high'
        );
    }
}
