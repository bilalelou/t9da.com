import { useState, useEffect } from 'react';

interface Setting {
  key: string;
  value: any;
  type: string;
  group: string;
  description?: string;
}

interface SettingsData {
  store: Record<string, any>;
  payment: Record<string, any>;
  shipping: Record<string, any>;
  notifications: Record<string, any>;
  security: Record<string, any>;
  seo: Record<string, any>;
}

export const useSettings = () => {
  // Default settings structure to prevent undefined values
  const defaultSettings: SettingsData = {
    store: {
      name: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
      language: 'ar',
      logo: '',
      website: '',
      tax_rate: 0,
      allow_guest_checkout: false,
      maintenance_mode: false
    },
    payment: {
      enable_credit_card: false,
      enable_paypal: false,
      enable_bank_transfer: false,
      enable_cash_on_delivery: false,
      stripe_public_key: '',
      stripe_secret_key: '',
      paypal_client_id: '',
      minimum_order_amount: 0,
      maximum_order_amount: 0,
      payment_timeout: 30
    },
    shipping: {
      free_shipping_threshold: 0,
      standard_shipping_cost: 0,
      express_shipping_cost: 0,
      shipping_zones: [],
      estimated_delivery_days: 0,
      enable_free_shipping: false,
      enable_express_shipping: false,
      weight_based_shipping: false,
      international_shipping: false
    },
    notifications: {
      email_notifications: false,
      sms_notifications: false,
      order_notifications: false,
      inventory_notifications: false,
      customer_notifications: false,
      marketing_emails: false,
      low_stock_alert: false,
      order_status_updates: false,
      weekly_reports: false
    },
    security: {
      two_factor_auth: false,
      password_expiry: 90,
      max_login_attempts: 5,
      session_timeout: 60,
      enable_login_alerts: false,
      ip_whitelist: [],
      enable_ssl: false,
      backup_frequency: 'daily'
    },
    seo: {
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      google_analytics_id: '',
      facebook_pixel_id: '',
      twitter_card_enabled: false,
      open_graph_enabled: false,
      sitemap_enabled: false,
      robots_enabled: false
    }
  };

  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Get auth token
  const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('api_token') || localStorage.getItem('token');
    }
    return null;
  };

  // Fetch settings from API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('لا يوجد رمز مصادقة');
      }

      const response = await fetch(`${API_BASE_URL}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في استرجاع الإعدادات');
      }

      const data = await response.json();
      
      if (data.success) {
        // Transform flat settings to grouped structure with defaults
        const groupedSettings: SettingsData = { ...defaultSettings };

        Object.entries(data.data).forEach(([key, value]) => {
          const [group, settingKey] = key.split('.');
          if (group && settingKey && groupedSettings[group as keyof SettingsData]) {
            groupedSettings[group as keyof SettingsData][settingKey] = value;
          }
        });

        setSettings(groupedSettings);
      } else {
        throw new Error(data.message || 'خطأ في استرجاع الإعدادات');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err instanceof Error ? err.message : 'خطأ غير معروف');
    } finally {
      setLoading(false);
    }
  };

  // Save settings to API
  const saveSettings = async (settingsToSave: SettingsData) => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('لا يوجد رمز مصادقة');
      }

      // Transform grouped settings to flat structure
      const flatSettings: Setting[] = [];
      
      Object.entries(settingsToSave).forEach(([group, groupSettings]) => {
        Object.entries(groupSettings).forEach(([key, value]) => {
          flatSettings.push({
            key: `${group}.${key}`,
            value,
            type: getValueType(value),
            group
          });
        });
      });

      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          settings: flatSettings
        })
      });

      if (!response.ok) {
        throw new Error('فشل في حفظ الإعدادات');
      }

      const data = await response.json();
      
      if (data.success) {
        // Merge with defaults to ensure all fields have values
        const mergedSettings = {
          store: { ...defaultSettings.store, ...settingsToSave.store },
          payment: { ...defaultSettings.payment, ...settingsToSave.payment },
          shipping: { ...defaultSettings.shipping, ...settingsToSave.shipping },
          notifications: { ...defaultSettings.notifications, ...settingsToSave.notifications },
          security: { ...defaultSettings.security, ...settingsToSave.security },
          seo: { ...defaultSettings.seo, ...settingsToSave.seo }
        };
        setSettings(mergedSettings);
        return { success: true, message: 'تم حفظ الإعدادات بنجاح' };
      } else {
        throw new Error(data.message || 'خطأ في حفظ الإعدادات');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Initialize default settings
  const initializeDefaults = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      
      if (!token) {
        throw new Error('لا يوجد رمز مصادقة');
      }

      const response = await fetch(`${API_BASE_URL}/settings/initialize/defaults`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('فشل في تهيئة الإعدادات الافتراضية');
      }

      const data = await response.json();
      
      if (data.success) {
        await fetchSettings(); // Refresh settings after initialization
        return { success: true, message: 'تم تهيئة الإعدادات الافتراضية بنجاح' };
      } else {
        throw new Error(data.message || 'خطأ في تهيئة الإعدادات الافتراضية');
      }
    } catch (err) {
      console.error('Error initializing defaults:', err);
      const errorMessage = err instanceof Error ? err.message : 'خطأ غير معروف';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine value type
  const getValueType = (value: any): string => {
    if (typeof value === 'boolean') return 'boolean';
    if (typeof value === 'number') return 'number';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'string';
  };

  // Load settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    saveSettings,
    initializeDefaults,
    setError
  };
};