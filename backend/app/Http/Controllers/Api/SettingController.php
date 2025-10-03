<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $settings = Setting::all();
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
                'store.name'
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
}