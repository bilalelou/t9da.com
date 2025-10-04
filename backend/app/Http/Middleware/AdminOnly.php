<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminOnly
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'غير مصرح لك بالوصول'
            ], 401);
        }

        // التحقق من أن المستخدم admin
        if (!$user->hasRole('admin')) {
            return response()->json([
                'success' => false,
                'message' => 'هذه الصفحة مخصصة للمديرين فقط'
            ], 403);
        }

        return $next($request);
    }
}