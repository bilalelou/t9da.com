'use client';

import React, { useState, useEffect } from 'react';
import { 
    Settings,
    ShoppingBag,
    CreditCard,
    Truck,
    Globe,
    Mail,
    Phone,
    MapPin,
    Save,
    RefreshCw,
    DollarSign,
    Package,
    Clock,
    Shield
} from 'lucide-react';

interface ShoppingSettings {
    // إعدادات عامة
    store_name: string;
    store_description: string;
    store_currency: string;
    store_timezone: string;
    
    // إعدادات الشحن
    free_shipping_threshold: number;
    default_shipping_cost: number;
    shipping_zones: ShippingZone[];
    
    // إعدادات الدفع
    payment_methods: PaymentMethod[];
    tax_rate: number;
    
    // إعدادات التواصل
    contact_email: string;
    contact_phone: string;
    store_address: string;
    
    // إعدادات المنتجات
    products_per_page: number;
    allow_reviews: boolean;
    require_login_for_checkout: boolean;
    auto_approve_reviews: boolean;
    
    // إعدادات المخزون
    track_inventory: boolean;
    low_stock_threshold: number;
    out_of_stock_behavior: 'hide' | 'show' | 'allow_backorder';
}

interface ShippingZone {
    id: number;
    name: string;
    cities: string[];
    cost: number;
    delivery_time: string;
}

interface PaymentMethod {
    id: string;
    name: string;
    enabled: boolean;
    description: string;
}

export default function ShoppingPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState<ShoppingSettings>({
        // إعدادات عامة
        store_name: 'T9DA Store',
        store_description: 'متجرك الإلكتroني المفضل للتسوق عبر الإنترنت',
        store_currency: 'MAD',
        store_timezone: 'Africa/Casablanca',
        
        // إعدادات الشحن
        free_shipping_threshold: 500,
        default_shipping_cost: 40,
        shipping_zones: [
            { id: 1, name: 'الدار البيضاء', cities: ['الدار البيضاء'], cost: 30, delivery_time: '1-2 أيام' },
            { id: 2, name: 'الرباط', cities: ['الرباط', 'سلا'], cost: 35, delivery_time: '1-3 أيام' },
            { id: 3, name: 'مراكش', cities: ['مراكش'], cost: 45, delivery_time: '2-4 أيام' },
        ],
        
        // إعدادات الدفع
        payment_methods: [
            { id: 'cod', name: 'الدفع عند الاستلام', enabled: true, description: 'ادفع عند استلام الطلب' },
            { id: 'card', name: 'بطاقة ائتمانية', enabled: false, description: 'Visa, Mastercard' },
            { id: 'paypal', name: 'PayPal', enabled: false, description: 'الدفع عبر PayPal' },
        ],
        tax_rate: 20,
        
        // إعدادات التواصل
        contact_email: 'info@t9da.com',
        contact_phone: '+212 6 12 34 56 78',
        store_address: 'الدار البيضاء، المغرب',
        
        // إعدادات المنتجات
        products_per_page: 12,
        allow_reviews: true,
        require_login_for_checkout: false,
        auto_approve_reviews: false,
        
        // إعدادات المخزون
        track_inventory: true,
        low_stock_threshold: 10,
        out_of_stock_behavior: 'show'
    });

    useEffect(() => {
        // محاكاة تحميل الإعدادات
        setTimeout(() => setLoading(false), 1000);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        
        // محاكاة حفظ الإعدادات
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('تم حفظ الإعدادات بنجاح!');
        } catch (error) {
            alert('حدث خطأ في حفظ الإعدادات');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', name: 'إعدادات عامة', icon: Settings },
        { id: 'shipping', name: 'الشحن والتوصيل', icon: Truck },
        { id: 'payment', name: 'طرق الدفع', icon: CreditCard },
        { id: 'products', name: 'إعدادات المنتجات', icon: Package },
        { id: 'inventory', name: 'إدارة المخزون', icon: ShoppingBag },
        { id: 'contact', name: 'معلومات التواصل', icon: Phone }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6" dir="rtl">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">إعدادات التسوق</h1>
                        <p className="text-gray-600 mt-2">إدارة إعدادات المتجر والشحن والدفع</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <RefreshCw size={20} className="animate-spin" />
                                جاري الحفظ...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                حفظ الإعدادات
                            </>
                        )}
                    </button>
                </div>

                {/* إحصائيات سريعة */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">طرق الدفع النشطة</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {settings.payment_methods.filter(pm => pm.enabled).length}
                                </p>
                            </div>
                            <CreditCard className="text-green-600" size={32} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">مناطق الشحن</p>
                                <p className="text-2xl font-bold text-blue-600">{settings.shipping_zones.length}</p>
                            </div>
                            <Truck className="text-blue-600" size={32} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">الشحن المجاني من</p>
                                <p className="text-2xl font-bold text-purple-600">{settings.free_shipping_threshold} درهم</p>
                            </div>
                            <DollarSign className="text-purple-600" size={32} />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl border">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">معدل الضريبة</p>
                                <p className="text-2xl font-bold text-orange-600">{settings.tax_rate}%</p>
                            </div>
                            <Shield className="text-orange-600" size={32} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* قائمة التبويبات */}
                <div className="lg:w-1/4">
                    <div className="bg-white rounded-xl border overflow-hidden">
                        <div className="p-4 border-b">
                            <h2 className="font-semibold text-gray-900">أقسام الإعدادات</h2>
                        </div>
                        <div className="space-y-1 p-2">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-right rounded-lg transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="font-medium">{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* محتوى التبويب */}
                <div className="lg:w-3/4">
                    <div className="bg-white rounded-xl border p-6">
                        
                        {/* إعدادات عامة */}
                        {activeTab === 'general' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الإعدادات العامة للمتجر</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            اسم المتجر
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.store_name}
                                            onChange={(e) => setSettings({...settings, store_name: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            العملة
                                        </label>
                                        <select
                                            value={settings.store_currency}
                                            onChange={(e) => setSettings({...settings, store_currency: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="MAD">درهم مغربي (MAD)</option>
                                            <option value="USD">دولار أمريكي (USD)</option>
                                            <option value="EUR">يورو (EUR)</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        وصف المتجر
                                    </label>
                                    <textarea
                                        value={settings.store_description}
                                        onChange={(e) => setSettings({...settings, store_description: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={4}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        المنطقة الزمنية
                                    </label>
                                    <select
                                        value={settings.store_timezone}
                                        onChange={(e) => setSettings({...settings, store_timezone: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Africa/Casablanca">الدار البيضاء (GMT+1)</option>
                                        <option value="Europe/Paris">باريس (GMT+1)</option>
                                        <option value="UTC">التوقيت العالمي (UTC)</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* إعدادات الشحن */}
                        {activeTab === 'shipping' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الشحن والتوصيل</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            الحد الأدنى للشحن المجاني (درهم)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.free_shipping_threshold}
                                            onChange={(e) => setSettings({...settings, free_shipping_threshold: Number(e.target.value)})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            تكلفة الشحن الافتراضية (درهم)
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.default_shipping_cost}
                                            onChange={(e) => setSettings({...settings, default_shipping_cost: Number(e.target.value)})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">مناطق الشحن</h4>
                                    <div className="space-y-4">
                                        {settings.shipping_zones.map((zone) => (
                                            <div key={zone.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            اسم المنطقة
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={zone.name}
                                                            onChange={(e) => {
                                                                const updatedZones = settings.shipping_zones.map(z =>
                                                                    z.id === zone.id ? {...z, name: e.target.value} : z
                                                                );
                                                                setSettings({...settings, shipping_zones: updatedZones});
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            التكلفة (درهم)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={zone.cost}
                                                            onChange={(e) => {
                                                                const updatedZones = settings.shipping_zones.map(z =>
                                                                    z.id === zone.id ? {...z, cost: Number(e.target.value)} : z
                                                                );
                                                                setSettings({...settings, shipping_zones: updatedZones});
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            مدة التوصيل
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={zone.delivery_time}
                                                            onChange={(e) => {
                                                                const updatedZones = settings.shipping_zones.map(z =>
                                                                    z.id === zone.id ? {...z, delivery_time: e.target.value} : z
                                                                );
                                                                setSettings({...settings, shipping_zones: updatedZones});
                                                            }}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                        />
                                                    </div>
                                                    <div className="flex items-end">
                                                        <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded border border-red-200">
                                                            حذف
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* إعدادات الدفع */}
                        {activeTab === 'payment' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">طرق الدفع والضرائب</h3>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        معدل الضريبة (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={settings.tax_rate}
                                        onChange={(e) => setSettings({...settings, tax_rate: Number(e.target.value)})}
                                        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                    />
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-4">طرق الدفع المتاحة</h4>
                                    <div className="space-y-4">
                                        {settings.payment_methods.map((method) => (
                                            <div key={method.id} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={method.enabled}
                                                            onChange={(e) => {
                                                                const updatedMethods = settings.payment_methods.map(m =>
                                                                    m.id === method.id ? {...m, enabled: e.target.checked} : m
                                                                );
                                                                setSettings({...settings, payment_methods: updatedMethods});
                                                            }}
                                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                        <div>
                                                            <h5 className="font-medium text-gray-900">{method.name}</h5>
                                                            <p className="text-sm text-gray-600">{method.description}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${
                                                        method.enabled 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {method.enabled ? 'مفعل' : 'معطل'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* إعدادات المنتجات */}
                        {activeTab === 'products' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات المنتجات والتقييمات</h3>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        عدد المنتجات في الصفحة الواحدة
                                    </label>
                                    <select
                                        value={settings.products_per_page}
                                        onChange={(e) => setSettings({...settings, products_per_page: Number(e.target.value)})}
                                        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={8}>8 منتجات</option>
                                        <option value={12}>12 منتج</option>
                                        <option value={16}>16 منتج</option>
                                        <option value={24}>24 منتج</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">السماح بالتقييمات</h4>
                                            <p className="text-sm text-gray-600">يمكن للعملاء إضافة تقييمات على المنتجات</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.allow_reviews}
                                                onChange={(e) => setSettings({...settings, allow_reviews: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">الموافقة التلقائية على التقييمات</h4>
                                            <p className="text-sm text-gray-600">التقييمات تظهر مباشرة دون مراجعة</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.auto_approve_reviews}
                                                onChange={(e) => setSettings({...settings, auto_approve_reviews: e.target.checked})}
                                                className="sr-only peer"
                                                disabled={!settings.allow_reviews}
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                                        </label>
                                    </div>
                                    
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div>
                                            <h4 className="font-medium text-gray-900">يتطلب تسجيل دخول للدفع</h4>
                                            <p className="text-sm text-gray-600">المستخدمون يجب أن يكونوا مسجلين لإتمام الطلب</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={settings.require_login_for_checkout}
                                                onChange={(e) => setSettings({...settings, require_login_for_checkout: e.target.checked})}
                                                className="sr-only peer"
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* إعدادات المخزون */}
                        {activeTab === 'inventory' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إدارة المخزون والمنتجات</h3>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div>
                                        <h4 className="font-medium text-gray-900">تتبع المخزون</h4>
                                        <p className="text-sm text-gray-600">مراقبة كمية المنتجات المتوفرة</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.track_inventory}
                                            onChange={(e) => setSettings({...settings, track_inventory: e.target.checked})}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                    </label>
                                </div>
                                
                                {settings.track_inventory && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                حد التنبيه للمخزون المنخفض
                                            </label>
                                            <input
                                                type="number"
                                                value={settings.low_stock_threshold}
                                                onChange={(e) => setSettings({...settings, low_stock_threshold: Number(e.target.value)})}
                                                className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                min="0"
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                ستحصل على تنبيه عندما تصل كمية المنتج لهذا الحد
                                            </p>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                سلوك المنتجات النافدة
                                            </label>
                                            <select
                                                value={settings.out_of_stock_behavior}
                                                onChange={(e) => setSettings({...settings, out_of_stock_behavior: e.target.value as 'hide' | 'show' | 'allow_backorder'})}
                                                className="w-full max-w-sm px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="show">إظهار المنتج مع رسالة "نفدت الكمية"</option>
                                                <option value="hide">إخفاء المنتج من المتجر</option>
                                                <option value="allow_backorder">السماح بالطلب المسبق</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {/* معلومات التواصل */}
                        {activeTab === 'contact' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">معلومات التواصل والعنوان</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Mail className="inline ml-2" size={16} />
                                            البريد الإلكتروني
                                        </label>
                                        <input
                                            type="email"
                                            value={settings.contact_email}
                                            onChange={(e) => setSettings({...settings, contact_email: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Phone className="inline ml-2" size={16} />
                                            رقم الهاتف
                                        </label>
                                        <input
                                            type="tel"
                                            value={settings.contact_phone}
                                            onChange={(e) => setSettings({...settings, contact_phone: e.target.value})}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <MapPin className="inline ml-2" size={16} />
                                        عنوان المتجر
                                    </label>
                                    <textarea
                                        value={settings.store_address}
                                        onChange={(e) => setSettings({...settings, store_address: e.target.value})}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}