<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order; // تأكد من وجود موديل الطلبات
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * عرض قائمة بجميع الطلبات.
     */
    public function index()
    {
        try {
            $orders = Order::with('user:id,name') // جلب بيانات المستخدم (العميل) مع الطلب
                ->latest()
                ->paginate(20);

            // تنسيق البيانات لتناسب الواجهة الأمامية
            $formattedOrders = $orders->getCollection()->transform(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number ?? "#" . $order->id, // استخدم رقم الطلب إن وجد
                    'customer_name' => $order->user->name ?? 'عميل غير مسجل',
                    'total_price' => $order->total_price ?? 0, // تأكد من وجود هذا الحقل
                    'status' => $order->status ?? 'pending', // تأكد من وجود هذا الحقل
                    'created_at' => $order->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedOrders,
                'pagination' => [
                    'total' => $orders->total(),
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                ]
            ]);
        } catch (Exception $e) {
            Log::error('خطأ في جلب الطلبات: ' . $e->getMessage());
            return response()->json(['success' => false, 'message' => 'حدث خطأ في الخادم.'], 500);
        }
    }
}
