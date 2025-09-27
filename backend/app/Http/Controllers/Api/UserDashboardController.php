<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use Exception;
use Illuminate\Support\Facades\Log;

class UserDashboardController extends Controller
{
    /**
     * جلب البيانات اللازمة للوحة تحكم المستخدم.
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();

            // إضافة logs للتحقق
            Log::info('UserDashboard: المستخدم المصادق عليه', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'user_name' => $user->name
            ]);

            // جلب إحصائيات المستخدم باستخدام الـ Query Builder مباشرة
            $stats = [
                'total_orders' => Order::where('user_id', $user->id)->count(),
                'total_spent' => Order::where('user_id', $user->id)->where('status', 'delivered')->sum('total_price'),
                'loyalty_points' => $user->loyalty_points ?? 0,
            ];

            // جلب كل الطلبات مع نظام الصفحات
            $orders = Order::where('user_id', $user->id)
                ->withCount('items')
                ->latest()
                ->paginate(10);

            Log::info('UserDashboard: عدد الطلبات الخاصة بالمستخدم', [
                'total_orders' => $orders->total(),
                'current_page_orders' => $orders->count(),
                'user_id' => $user->id
            ]);

            return response()->json([
                'user' => [
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->mobile,
                    'avatar' => $user->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($user->name),
                    'joinDate' => $user->created_at,
                ],
                'stats' => $stats,
                // إرسال بيانات الطلبات مع معلومات نظام الصفحات
                'orders' => [
                    'data' => $orders->getCollection()->map(function($order){
                        return [
                            'id' => $order->id,
                            'total' => $order->total,
                            'status' => $order->status,
                            'created_at' => $order->created_at,
                            'items_count' => $order->items_count,
                        ];
                    }),
                    'pagination' => [
                        'total' => $orders->total(),
                        'per_page' => $orders->perPage(),
                        'current_page' => $orders->currentPage(),
                        'last_page' => $orders->lastPage(),
                    ],
                ],
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب بيانات لوحة تحكم المستخدم: ' . $e->getMessage());
            return response()->json(['message' => 'حدث خطأ في الخادم.'], 500);
        }
    }
}

