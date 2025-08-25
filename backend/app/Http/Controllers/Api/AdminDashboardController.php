<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;

class AdminDashboardController extends Controller
{
    /**
     * جلب إحصائيات لوحة تحكم الأدمن
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // التأكد من أن المستخدم الحالي هو أدمن
        if (!auth()->user()->hasRole('admin')) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }

            // جلب إحصائيات بسيطة كبداية
            $stats = [
                'users_count' => User::count(),
                'products_count' => Product::count(),
                'revenue' => '15,750', // بيانات ثابتة حالياً
                'sales' => 320,         // بيانات ثابتة حالياً
            ];

            return response()->json($stats);
        }
    }
