<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Setting;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            // Store Settings
            [
                'key' => 'store.name',
                'value' => 'متجر التقنية الحديثة',
                'type' => 'string',
                'group' => 'store',
                'description' => 'اسم المتجر'
            ],
            [
                'key' => 'store.description',
                'value' => 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية',
                'type' => 'string',
                'group' => 'store',
                'description' => 'وصف المتجر'
            ],
            [
                'key' => 'store.email',
                'value' => 'info@techstore.com',
                'type' => 'string',
                'group' => 'store',
                'description' => 'البريد الإلكتروني للمتجر'
            ],
            [
                'key' => 'store.phone',
                'value' => '+212 5 22 123 456',
                'type' => 'string',
                'group' => 'store',
                'description' => 'رقم هاتف المتجر'
            ],
            [
                'key' => 'store.address',
                'value' => 'الدار البيضاء، المملكة المغربية',
                'type' => 'string',
                'group' => 'store',
                'description' => 'عنوان المتجر'
            ],
            [
                'key' => 'store.currency',
                'value' => 'MAD',
                'type' => 'string',
                'group' => 'store',
                'description' => 'العملة الافتراضية'
            ],
            [
                'key' => 'store.timezone',
                'value' => 'Africa/Casablanca',
                'type' => 'string',
                'group' => 'store',
                'description' => 'المنطقة الزمنية'
            ],
            [
                'key' => 'store.language',
                'value' => 'ar',
                'type' => 'string',
                'group' => 'store',
                'description' => 'اللغة الافتراضية'
            ],
            [
                'key' => 'store.logo',
                'value' => '/logo.png',
                'type' => 'string',
                'group' => 'store',
                'description' => 'شعار المتجر'
            ],
            [
                'key' => 'store.website',
                'value' => 'https://techstore.com',
                'type' => 'string',
                'group' => 'store',
                'description' => 'موقع المتجر'
            ],
            [
                'key' => 'store.tax_rate',
                'value' => 15,
                'type' => 'number',
                'group' => 'store',
                'description' => 'معدل الضريبة'
            ],
            [
                'key' => 'store.allow_guest_checkout',
                'value' => true,
                'type' => 'boolean',
                'group' => 'store',
                'description' => 'السماح بالدفع كضيف'
            ],
            [
                'key' => 'store.maintenance_mode',
                'value' => false,
                'type' => 'boolean',
                'group' => 'store',
                'description' => 'وضع الصيانة'
            ],

            // Payment Settings
            [
                'key' => 'payment.enable_credit_card',
                'value' => true,
                'type' => 'boolean',
                'group' => 'payment',
                'description' => 'تفعيل البطاقات الائتمانية'
            ],
            [
                'key' => 'payment.enable_paypal',
                'value' => false,
                'type' => 'boolean',
                'group' => 'payment',
                'description' => 'تفعيل PayPal'
            ],
            [
                'key' => 'payment.enable_bank_transfer',
                'value' => true,
                'type' => 'boolean',
                'group' => 'payment',
                'description' => 'تفعيل التحويل البنكي'
            ],
            [
                'key' => 'payment.enable_cash_on_delivery',
                'value' => true,
                'type' => 'boolean',
                'group' => 'payment',
                'description' => 'تفعيل الدفع عند الاستلام'
            ],
            [
                'key' => 'payment.stripe_public_key',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Stripe Public Key'
            ],
            [
                'key' => 'payment.stripe_secret_key',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'Stripe Secret Key'
            ],
            [
                'key' => 'payment.paypal_client_id',
                'value' => '',
                'type' => 'string',
                'group' => 'payment',
                'description' => 'PayPal Client ID'
            ],
            [
                'key' => 'payment.minimum_order_amount',
                'value' => 50,
                'type' => 'number',
                'group' => 'payment',
                'description' => 'الحد الأدنى للطلب'
            ],
            [
                'key' => 'payment.maximum_order_amount',
                'value' => 10000,
                'type' => 'number',
                'group' => 'payment',
                'description' => 'الحد الأقصى للطلب'
            ],
            [
                'key' => 'payment.payment_timeout',
                'value' => 30,
                'type' => 'number',
                'group' => 'payment',
                'description' => 'مهلة الدفع بالدقائق'
            ],

            // Shipping Settings
            [
                'key' => 'shipping.free_shipping_threshold',
                'value' => 200,
                'type' => 'number',
                'group' => 'shipping',
                'description' => 'الحد الأدنى للشحن المجاني'
            ],
            [
                'key' => 'shipping.standard_shipping_cost',
                'value' => 25,
                'type' => 'number',
                'group' => 'shipping',
                'description' => 'تكلفة الشحن العادي'
            ],
            [
                'key' => 'shipping.express_shipping_cost',
                'value' => 50,
                'type' => 'number',
                'group' => 'shipping',
                'description' => 'تكلفة الشحن السريع'
            ],
            [
                'key' => 'shipping.shipping_zones',
                'value' => ['الدار البيضاء', 'الرباط', 'فاس', 'مراكش', 'طنجة', 'أكادير'],
                'type' => 'array',
                'group' => 'shipping',
                'description' => 'مناطق الشحن'
            ],
            [
                'key' => 'shipping.estimated_delivery_days',
                'value' => 3,
                'type' => 'number',
                'group' => 'shipping',
                'description' => 'مدة التوصيل المتوقعة'
            ],
            [
                'key' => 'shipping.enable_free_shipping',
                'value' => true,
                'type' => 'boolean',
                'group' => 'shipping',
                'description' => 'تفعيل الشحن المجاني'
            ],
            [
                'key' => 'shipping.enable_express_shipping',
                'value' => true,
                'type' => 'boolean',
                'group' => 'shipping',
                'description' => 'تفعيل الشحن السريع'
            ],
            [
                'key' => 'shipping.weight_based_shipping',
                'value' => false,
                'type' => 'boolean',
                'group' => 'shipping',
                'description' => 'الشحن حسب الوزن'
            ],
            [
                'key' => 'shipping.international_shipping',
                'value' => false,
                'type' => 'boolean',
                'group' => 'shipping',
                'description' => 'الشحن الدولي'
            ],

            // Notification Settings
            [
                'key' => 'notifications.email_notifications',
                'value' => true,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'إشعارات البريد الإلكتروني'
            ],
            [
                'key' => 'notifications.sms_notifications',
                'value' => false,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'إشعارات الرسائل النصية'
            ],
            [
                'key' => 'notifications.order_notifications',
                'value' => true,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'إشعارات الطلبات'
            ],
            [
                'key' => 'notifications.inventory_notifications',
                'value' => true,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'إشعارات المخزون'
            ],
            [
                'key' => 'notifications.customer_notifications',
                'value' => false,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'إشعارات العملاء'
            ],
            [
                'key' => 'notifications.marketing_emails',
                'value' => true,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'رسائل التسويق'
            ],
            [
                'key' => 'notifications.low_stock_alert',
                'value' => true,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'تنبيه نفاد المخزون'
            ],
            [
                'key' => 'notifications.order_status_updates',
                'value' => true,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'تحديثات حالة الطلب'
            ],
            [
                'key' => 'notifications.weekly_reports',
                'value' => false,
                'type' => 'boolean',
                'group' => 'notifications',
                'description' => 'التقارير الأسبوعية'
            ],

            // Security Settings
            [
                'key' => 'security.two_factor_auth',
                'value' => false,
                'type' => 'boolean',
                'group' => 'security',
                'description' => 'المصادقة الثنائية'
            ],
            [
                'key' => 'security.password_expiry',
                'value' => 90,
                'type' => 'number',
                'group' => 'security',
                'description' => 'مدة انتهاء كلمة المرور'
            ],
            [
                'key' => 'security.max_login_attempts',
                'value' => 5,
                'type' => 'number',
                'group' => 'security',
                'description' => 'عدد محاولات تسجيل الدخول'
            ],
            [
                'key' => 'security.session_timeout',
                'value' => 60,
                'type' => 'number',
                'group' => 'security',
                'description' => 'مهلة انتهاء الجلسة'
            ],
            [
                'key' => 'security.enable_login_alerts',
                'value' => true,
                'type' => 'boolean',
                'group' => 'security',
                'description' => 'تنبيهات تسجيل الدخول'
            ],
            [
                'key' => 'security.ip_whitelist',
                'value' => [],
                'type' => 'array',
                'group' => 'security',
                'description' => 'قائمة IP المسموحة'
            ],
            [
                'key' => 'security.enable_ssl',
                'value' => true,
                'type' => 'boolean',
                'group' => 'security',
                'description' => 'تفعيل SSL'
            ],
            [
                'key' => 'security.backup_frequency',
                'value' => 'daily',
                'type' => 'string',
                'group' => 'security',
                'description' => 'تكرار النسخ الاحتياطي'
            ],

            // SEO Settings
            [
                'key' => 'seo.meta_title',
                'value' => 'متجر التقنية الحديثة - أحدث المنتجات التقنية',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'عنوان الموقع'
            ],
            [
                'key' => 'seo.meta_description',
                'value' => 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية بأفضل الأسعار',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'وصف الموقع'
            ],
            [
                'key' => 'seo.meta_keywords',
                'value' => 'تقنية, إلكترونيات, متجر إلكتروني, جوالات, حاسوب',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'الكلمات المفتاحية'
            ],
            [
                'key' => 'seo.google_analytics_id',
                'value' => '',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Google Analytics ID'
            ],
            [
                'key' => 'seo.facebook_pixel_id',
                'value' => '',
                'type' => 'string',
                'group' => 'seo',
                'description' => 'Facebook Pixel ID'
            ],
            [
                'key' => 'seo.twitter_card_enabled',
                'value' => true,
                'type' => 'boolean',
                'group' => 'seo',
                'description' => 'تفعيل Twitter Cards'
            ],
            [
                'key' => 'seo.open_graph_enabled',
                'value' => true,
                'type' => 'boolean',
                'group' => 'seo',
                'description' => 'تفعيل Open Graph'
            ],
            [
                'key' => 'seo.sitemap_enabled',
                'value' => true,
                'type' => 'boolean',
                'group' => 'seo',
                'description' => 'تفعيل خريطة الموقع'
            ],
            [
                'key' => 'seo.robots_enabled',
                'value' => true,
                'type' => 'boolean',
                'group' => 'seo',
                'description' => 'تفعيل ملف Robots'
            ]
        ];

        foreach ($settings as $setting) {
            Setting::updateOrCreate(
                ['key' => $setting['key']],
                $setting
            );
        }
    }
}