<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function __construct()
    {
        // تطبيق middleware المصادقة على جميع الطرق ما عدا publicSettings
        $this->middleware('auth:sanctum')->except(['publicSettings', 'getBankSettings']);
    }
    
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Setting::query();
            
            // إذا تم تمرير مفاتيح محددة
            if ($request->has('keys')) {
                $keys = explode(',', $request->get('keys'));
                $query->whereIn('key', $keys);
            }
            
            $settings = $query->get();
            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب الإعدادات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'key' => 'required|string',
                'value' => 'required',
                'type' => 'string',
                'group' => 'string',
                'description' => 'string'
            ]);

            $setting = Setting::set(
                $request->key,
                $request->value,
                $request->type ?? 'string',
                $request->group ?? 'general',
                $request->description
            );

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ الإعداد بنجاح',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في حفظ الإعداد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(string $key): JsonResponse
    {
        try {
            $setting = Setting::where('key', $key)->first();

            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'الإعداد غير موجود'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب الإعداد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateSetting(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'key' => 'required|string',
                'value' => 'required'
            ]);

            $setting = Setting::set($request->key, $request->value);

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الإعداد بنجاح',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث الإعداد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function publicSettings(): JsonResponse
    {
        try {
            // جلب الإعدادات العامة فقط
            $publicSettings = Setting::whereIn('key', [
                'shipping.free_shipping_threshold',
                'store.currency',
                'store.name',
                'bank_name',
                'bank_account_number',
                'bank_account_holder',
            ])->get();

            return response()->json([
                'success' => true,
                'data' => $publicSettings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب الإعدادات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getBankSettings(): JsonResponse
    {
        try {
            $bankSettings = Setting::whereIn('key', [
                'bank_name',
                'bank_account_number', 
                'bank_account_holder'
            ])->get()->keyBy('key');

            return response()->json([
                'success' => true,
                'data' => [
                    'bank_name' => $bankSettings['bank_name']->value ?? '',
                    'account_number' => $bankSettings['bank_account_number']->value ?? '',
                    'account_holder' => $bankSettings['bank_account_holder']->value ?? ''
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في جلب إعدادات البنك',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateBankSettings(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'bank_name' => 'required|string|max:255',
                'account_number' => 'required|string|max:255',
                'account_holder' => 'required|string|max:255'
            ]);

            Setting::updateOrCreate(
                ['key' => 'bank_name'], 
                [
                    'value' => $request->bank_name,
                    'type' => 'string',
                    'group' => 'payment',
                    'description' => 'اسم البنك للتحويل البنكي'
                ]
            );
            
            Setting::updateOrCreate(
                ['key' => 'bank_account_number'], 
                [
                    'value' => $request->account_number,
                    'type' => 'string',
                    'group' => 'payment',
                    'description' => 'رقم الحساب البنكي'
                ]
            );
            
            Setting::updateOrCreate(
                ['key' => 'bank_account_holder'], 
                [
                    'value' => $request->account_holder,
                    'type' => 'string',
                    'group' => 'payment',
                    'description' => 'اسم صاحب الحساب البنكي'
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث إعدادات البنك بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في تحديث إعدادات البنك',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    public function initializeBankSettings(): JsonResponse
    {
        try {
            $bankSettings = [
                [
                    'key' => 'bank_name',
                    'value' => '',
                    'type' => 'string',
                    'group' => 'payment',
                    'description' => 'اسم البنك للتحويل البنكي'
                ],
                [
                    'key' => 'bank_account_number',
                    'value' => '',
                    'type' => 'string',
                    'group' => 'payment',
                    'description' => 'رقم الحساب البنكي'
                ],
                [
                    'key' => 'bank_account_holder',
                    'value' => '',
                    'type' => 'string',
                    'group' => 'payment',
                    'description' => 'اسم صاحب الحساب البنكي'
                ]
            ];

            foreach ($bankSettings as $setting) {
                Setting::updateOrCreate(
                    ['key' => $setting['key']],
                    $setting
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تهيئة إعدادات البنك بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'فشل في تهيئة إعدادات البنك',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
