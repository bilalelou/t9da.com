<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function index()
    {
        // إحصائيات عامة
        $total_revenue = Order::where('status', 'completed')->sum('total');
        $total_orders = Order::count();
        $new_customers = User::role('customer')->where('created_at', '>=', Carbon::now()->subDays(30))->count();
        $avg_order_value = Order::where('status', 'completed')->avg('total');

        // بيانات المبيعات لآخر 30 يوم
        $sales_over_time = Order::where('status', 'completed')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->orderBy('date', 'ASC')
            ->get([
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total) as sales')
            ])
            ->map(function ($item) {
                // تحويل المجموع إلى رقم عشري
                $item->sales = (float) $item->sales;
                return $item;
            });

        // التصنيفات الأكثر مبيعاً
        $top_categories = Category::withSum(['products as total_sales' => function ($query) {
                $query->join('order_items', 'products.id', '=', 'order_items.product_id')
                      ->select(DB::raw('SUM(order_items.price * order_items.quantity)'));
            }], 'total_sales')
            ->orderBy('total_sales', 'desc')
            ->take(5)
            ->get()
            ->map(function ($category) {
                 return [
                    'name' => $category->name,
                    'total_sales' => (float) $category->total_sales ?? 0
                 ];
            });


        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_revenue' => (float) $total_revenue,
                    'total_orders' => $total_orders,
                    'new_customers' => $new_customers,
                    'avg_order_value' => (float) $avg_order_value,
                ],
                'sales_over_time' => $sales_over_time,
                'top_categories' => $top_categories,
            ]
        ]);
    }
}
