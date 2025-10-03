<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SettingController extends Controller
{
    /**
     * Get all settings or settings by group
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $group = $request->query('group');
            
            if ($group) {
                $settings = Setting::getByGroup($group);
            } else {
                $settings = Setting::getAllSettings();
            }

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في استرجاع الإعدادات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get specific setting by key
     */
    public function show($key): JsonResponse
    {
        try {
            $value = Setting::get($key);
            
            if ($value === null) {
                return response()->json([
                    'success' => false,
                    'message' => 'الإعداد غير موجود'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'key' => $key,
                    'value' => $value
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في استرجاع الإعداد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update or create settings
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'settings' => 'required|array',
                'settings.*.key' => 'required|string',
                'settings.*.value' => 'required',
                'settings.*.type' => 'sometimes|string|in:string,number,boolean,array,object',
                'settings.*.group' => 'sometimes|string',
                'settings.*.description' => 'sometimes|string|nullable'
            ]);

            $updatedSettings = [];

            foreach ($request->settings as $settingData) {
                $setting = Setting::set(
                    $settingData['key'],
                    $settingData['value'],
                    $settingData['type'] ?? 'string',
                    $settingData['group'] ?? 'general',
                    $settingData['description'] ?? null
                );

                $updatedSettings[] = $setting;
            }

            return response()->json([
                'success' => true,
                'message' => 'تم حفظ الإعدادات بنجاح',
                'data' => $updatedSettings
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حفظ الإعدادات',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update single setting
     */
    public function update(Request $request, $key): JsonResponse
    {
        try {
            $request->validate([
                'value' => 'required',
                'type' => 'sometimes|string|in:string,number,boolean,array,object',
                'group' => 'sometimes|string',
                'description' => 'sometimes|string|nullable'
            ]);

            $setting = Setting::set(
                $key,
                $request->value,
                $request->type ?? 'string',
                $request->group ?? 'general',
                $request->description ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'تم تحديث الإعداد بنجاح',
                'data' => $setting
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تحديث الإعداد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete setting
     */
    public function destroy($key): JsonResponse
    {
        try {
            $setting = Setting::where('key', $key)->first();
            
            if (!$setting) {
                return response()->json([
                    'success' => false,
                    'message' => 'الإعداد غير موجود'
                ], 404);
            }

            $setting->delete();

            return response()->json([
                'success' => true,
                'message' => 'تم حذف الإعداد بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في حذف الإعداد',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get default store settings structure
     */
    public function getDefaults(): JsonResponse
    {
        $defaults = [
            'store' => [
                'name' => 'متجر التقنية الحديثة',
                'description' => 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية',
                'email' => 'info@techstore.com',
                'phone' => '+966 11 123 4567',
                'address' => 'الرياض، المملكة العربية السعودية',
                'currency' => 'SAR',
                'timezone' => 'Asia/Riyadh',
                'language' => 'ar',
                'logo' => '/logo.png',
                'website' => 'https://techstore.com',
                'tax_rate' => 15,
                'allow_guest_checkout' => true,
                'maintenance_mode' => false
            ],
            'payment' => [
                'enable_credit_card' => true,
                'enable_paypal' => false,
                'enable_bank_transfer' => true,
                'enable_cash_on_delivery' => true,
                'stripe_public_key' => '',
                'stripe_secret_key' => '',
                'paypal_client_id' => '',
                'minimum_order_amount' => 50,
                'maximum_order_amount' => 10000,
                'payment_timeout' => 30
            ],
            'shipping' => [
                'free_shipping_threshold' => 200,
                'standard_shipping_cost' => 25,
                'express_shipping_cost' => 50,
                'shipping_zones' => ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'],
                'estimated_delivery_days' => 3,
                'enable_free_shipping' => true,
                'enable_express_shipping' => true,
                'weight_based_shipping' => false,
                'international_shipping' => false
            ],
            'notifications' => [
                'email_notifications' => true,
                'sms_notifications' => false,
                'order_notifications' => true,
                'inventory_notifications' => true,
                'customer_notifications' => false,
                'marketing_emails' => true,
                'low_stock_alert' => true,
                'order_status_updates' => true,
                'weekly_reports' => false
            ],
            'security' => [
                'two_factor_auth' => false,
                'password_expiry' => 90,
                'max_login_attempts' => 5,
                'session_timeout' => 60,
                'enable_login_alerts' => true,
                'ip_whitelist' => [],
                'enable_ssl' => true,
                'backup_frequency' => 'daily'
            ],
            'seo' => [
                'meta_title' => 'متجر التقنية الحديثة - أحدث المنتجات التقنية',
                'meta_description' => 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية بأفضل الأسعار',
                'meta_keywords' => 'تقنية, إلكترونيات, متجر إلكتروني, جوالات, حاسوب',
                'google_analytics_id' => '',
                'facebook_pixel_id' => '',
                'twitter_card_enabled' => true,
                'open_graph_enabled' => true,
                'sitemap_enabled' => true,
                'robots_enabled' => true
            ]
        ];

        return response()->json([
            'success' => true,
            'data' => $defaults
        ]);
    }

    /**
     * Initialize default settings
     */
    public function initializeDefaults(): JsonResponse
    {
        try {
            $defaults = $this->getDefaults()->getData()->data;
            
            foreach ($defaults as $group => $settings) {
                foreach ($settings as $key => $value) {
                    $fullKey = "{$group}.{$key}";
                    
                    // Only create if doesn't exist
                    if (!Setting::where('key', $fullKey)->exists()) {
                        Setting::set(
                            $fullKey,
                            $value,
                            $this->getValueType($value),
                            $group,
                            "إعداد {$key} في مجموعة {$group}"
                        );
                    }
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'تم تهيئة الإعدادات الافتراضية بنجاح'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'خطأ في تهيئة الإعدادات الافتراضية',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get value type for setting
     */
    private function getValueType($value): string
    {
        if (is_bool($value)) {
            return 'boolean';
        } elseif (is_numeric($value)) {
            return 'number';
        } elseif (is_array($value)) {
            return 'array';
        } elseif (is_object($value)) {
            return 'object';
        } else {
            return 'string';
        }
    }
}