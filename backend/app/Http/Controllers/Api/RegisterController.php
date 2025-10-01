<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;

class RegisterController extends Controller
{
    /**
     * Handle an incoming registration request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
$validator = Validator::make($request->all(), [
    'name' => ['required', 'string', 'max:255'],
    'phone' => ['required', 'string', 'max:20', 'unique:users,mobile'],
    'password' => ['required', 'confirmed', Rules\Password::defaults()],
    'email' => ['nullable', 'string', 'email', 'max:255', 'unique:'.User::class],
    'address' => ['nullable', 'string', 'max:500'],
    'city' => ['nullable', 'string', 'max:100'],
    'postal_code' => ['nullable', 'string', 'max:20'],
]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في التحقق من البيانات',
                'errors' => $validator->errors()
            ], 422); // 422 Unprocessable Entity
        }

$user = User::create([
    'name' => $request->name,
    'email' => $request->email ?? null,
    'mobile' => $request->phone,
    'password' => Hash::make($request->password),
    'address' => $request->address,
    'city' => $request->city,
    'postal_code' => $request->postal_code,
]);

        // تعيين دور "customer" للمستخدم الجديد تلقائياً
        $user->assignRole('customer');

        // إنشاء توكن للمستخدم الجديد (اختياري، لتسجيل الدخول التلقائي)
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'تم إنشاء الحساب بنجاح!',
            'user' => $user,
            'token' => $token
        ], 201); // 201 Created
    }
}
