<?php

// المسار: app/Http/Controllers/Api/LoginController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // التحقق من وجود البريد الإلكتروني أولاً
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'البريد الإلكتروني غير مسجل في النظام',
                'error_type' => 'email_not_found',
                'field' => 'email'
            ], 422);
        }

        // التحقق من كلمة المرور
        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'كلمة المرور غير صحيحة',
                'error_type' => 'invalid_password',
                'field' => 'password'
            ], 422);
        }

        // التحقق من حالة المستخدم (إذا كان محظوراً)
        if (isset($user->is_active) && !$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'حسابك معطل. يرجى التواصل مع الإدارة',
                'error_type' => 'account_disabled',
                'field' => 'account'
            ], 422);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم تسجيل الدخول بنجاح',
            'user' => $user->load('roles'),
            'token' => $token
        ]);
    }
    /**
     * Handle a logout request to the application.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoke the current token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'تم تسجيل الخروج بنجاح']);
    }
}
