<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log; // استيراد الواجهة للتعامل مع السجلات
use Exception; // استيراد الفئة الأساسية للاستثناءات

class CustomerController extends Controller
{
    /**
     * عرض قائمة العملاء.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            // [تعديل] تم إيقاف الحسابات التلقائية التي تسبب الخطأ مؤقتاً
            $customers = User::role(['customer', 'user'])
                // ->withCount('orders')      // سيتم تفعيل هذه الأسطر لاحقاً
                // ->withSum('orders', 'total_price')
                ->get();

            $formattedCustomers = $customers->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'avatar' => $customer->avatar ?? 'https://ui-avatars.com/api/?name=' . urlencode($customer->name),
                    'joinDate' => $customer->created_at->toDateString(),

                    // [تعديل] استخدام قيم مزيفة ومؤقتة
                    'totalOrders' => rand(1, 35),       // قيمة مزيفة لعدد الطلبات
                    'totalSpent' => rand(500, 25000),   // قيمة مزيفة لإجمالي المشتريات

                    'status' => $customer->status ?? 'active',
                    'city' => $customer->city ?? 'غير محدد',
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedCustomers,
            ]);

        } catch (Exception $e) {
            Log::error('خطأ في جلب العملاء: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'حدث خطأ في الخادم أثناء جلب بيانات العملاء.',
            ], 500); // إرجاع رمز الحالة 500 (خطأ في الخادم)
        }
    }
}

