'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, RotateCcw, Store, CreditCard, Truck, Bell, Users, Shield, Search, CheckCircle, AlertCircle, X, Info, Plus, Edit, Trash2 } from 'lucide-react';

// CSS Animation for Toast
const toastAnimationCSS = `
  @keyframes slide-down {
    from {
      opacity: 0;
      transform: translate(-50%, -100%);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
  
  .animate-slide-down {
    animation: slide-down 0.3s ease-out forwards;
  }
`;

// Inject CSS
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = toastAnimationCSS;
  document.head.appendChild(style);
}

// Toast Component
interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 border-green-500 text-green-800';
      case 'error':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'info':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div className={`flex items-center p-4 border-l-4 rounded-lg shadow-lg ${getToastStyles()}`}>
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="mr-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="mr-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Modal Components
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          {children}
        </div>
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'warning' | 'danger' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type = 'warning' 
}) => {
  const getIcon = () => {
    switch(type) {
      case 'danger':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'info':
        return <CheckCircle className="w-6 h-6 text-blue-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
    }
  };

  const getButtonColors = () => {
    switch(type) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700';
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700';
      default:
        return 'bg-yellow-600 hover:bg-yellow-700';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            {getIcon()}
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white ${getButtonColors()} sm:mr-3 sm:w-auto sm:text-sm`}
        >
          تأكيد
        </button>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
        >
          إلغاء
        </button>
      </div>
    </Modal>
  );
};

// Define interfaces
interface StoreSettings {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  timezone: string;
  language: string;
  logo: string;
  website: string;
  taxRate: number;
  allowGuestCheckout: boolean;
  maintenanceMode: boolean;
}

interface CustomPaymentMethod {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  apiKey?: string;
  secretKey?: string;
  webhookUrl?: string;
  supportedCurrencies: string[];
  fees: {
    percentage: number;
    fixed: number;
  };
  icon?: string;
  type: 'gateway' | 'digital_wallet' | 'bank_transfer' | 'cash' | 'crypto';
}

interface PaymentSettings {
  enableCreditCard: boolean;
  enablePayPal: boolean;
  enableBankTransfer: boolean;
  enableCashOnDelivery: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  paymentTimeout: number;
  customPaymentMethods: CustomPaymentMethod[];
}

interface ShippingSettings {
  freeShippingThreshold: number;
  standardShippingCost: number;
  expressShippingCost: number;
  shippingZones: string[];
  estimatedDeliveryDays: number;
  enableFreeShipping: boolean;
  enableExpressShipping: boolean;
  weightBasedShipping: boolean;
  internationalShipping: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  orderNotifications: boolean;
  inventoryNotifications: boolean;
  customerNotifications: boolean;
  marketingEmails: boolean;
  lowStockAlert: boolean;
  orderStatusUpdates: boolean;
  weeklyReports: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordExpiry: number;
  maxLoginAttempts: number;
  sessionTimeout: number;
  enableLoginAlerts: boolean;
  ipWhitelist: string[];
  enableSSL: boolean;
  backupFrequency: string;
}

interface SEOSettings {
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  twitterCardEnabled: boolean;
  openGraphEnabled: boolean;
  sitemapEnabled: boolean;
  robotsEnabled: boolean;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  color: string; // Changed to string to allow hex colors
  userCount: number;
  permissions: string[]; // Permission IDs
  isSystemRole: boolean; // Cannot be deleted
}

// Sample data
const initialStoreSettings: StoreSettings = {
  name: 'متجر التقنية الحديثة',
  description: 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية',
  email: 'info@techstore.com',
  phone: '+966 11 123 4567',
  address: 'الرياض، المملكة العربية السعودية',
  currency: 'SAR',
  timezone: 'Asia/Riyadh',
  language: 'ar',
  logo: '/logo.png',
  website: 'https://techstore.com',
  taxRate: 15,
  allowGuestCheckout: true,
  maintenanceMode: false
};

const initialPaymentSettings: PaymentSettings = {
  enableCreditCard: true,
  enablePayPal: false,
  enableBankTransfer: true,
  enableCashOnDelivery: true,
  stripePublicKey: 'pk_test_...',
  stripeSecretKey: 'sk_test_...',
  paypalClientId: '',
  minimumOrderAmount: 50,
  maximumOrderAmount: 10000,
  paymentTimeout: 30,
  customPaymentMethods: [
    {
      id: 'stcpay',
      name: 'STC Pay',
      description: 'الدفع عبر محفظة STC Pay الرقمية',
      isEnabled: true,
      supportedCurrencies: ['SAR'],
      fees: { percentage: 2.5, fixed: 0 },
      type: 'digital_wallet'
    },
    {
      id: 'mada',
      name: 'مدى',
      description: 'الدفع عبر بطاقات مدى السعودية',
      isEnabled: true,
      supportedCurrencies: ['SAR'],
      fees: { percentage: 1.75, fixed: 0 },
      type: 'gateway'
    }
  ]
};

const initialShippingSettings: ShippingSettings = {
  freeShippingThreshold: 200,
  standardShippingCost: 25,
  expressShippingCost: 50,
  shippingZones: ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة'],
  estimatedDeliveryDays: 3,
  enableFreeShipping: true,
  enableExpressShipping: true,
  weightBasedShipping: false,
  internationalShipping: false
};

const initialNotificationSettings: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: false,
  orderNotifications: true,
  inventoryNotifications: true,
  customerNotifications: false,
  marketingEmails: true,
  lowStockAlert: true,
  orderStatusUpdates: true,
  weeklyReports: false
};

const initialSecuritySettings: SecuritySettings = {
  twoFactorAuth: false,
  passwordExpiry: 90,
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  enableLoginAlerts: true,
  ipWhitelist: [],
  enableSSL: true,
  backupFrequency: 'daily'
};

const initialSEOSettings: SEOSettings = {
  metaTitle: 'متجر التقنية الحديثة - أحدث المنتجات التقنية',
  metaDescription: 'متجر إلكتروني متخصص في بيع أحدث المنتجات التقنية والإلكترونية بأفضل الأسعار',
  metaKeywords: 'تقنية, إلكترونيات, متجر إلكتروني, جوالات, حاسوب',
  googleAnalyticsId: '',
  facebookPixelId: '',
  twitterCardEnabled: true,
  openGraphEnabled: true,
  sitemapEnabled: true,
  robotsEnabled: true
};

const initialPermissions: Permission[] = [
  { id: 'products_view', name: 'عرض المنتجات', description: 'مشاهدة قائمة المنتجات', category: 'products' },
  { id: 'products_create', name: 'إضافة المنتجات', description: 'إضافة منتجات جديدة', category: 'products' },
  { id: 'products_edit', name: 'تعديل المنتجات', description: 'تعديل المنتجات الموجودة', category: 'products' },
  { id: 'products_delete', name: 'حذف المنتجات', description: 'حذف المنتجات', category: 'products' },
  
  { id: 'orders_view', name: 'عرض الطلبات', description: 'مشاهدة قائمة الطلبات', category: 'orders' },
  { id: 'orders_edit', name: 'إدارة الطلبات', description: 'تعديل حالة الطلبات', category: 'orders' },
  { id: 'orders_delete', name: 'حذف الطلبات', description: 'حذف الطلبات', category: 'orders' },
  
  { id: 'users_view', name: 'عرض المستخدمين', description: 'مشاهدة قائمة المستخدمين', category: 'users' },
  { id: 'users_create', name: 'إضافة المستخدمين', description: 'إضافة مستخدمين جدد', category: 'users' },
  { id: 'users_edit', name: 'إدارة المستخدمين', description: 'تعديل بيانات المستخدمين', category: 'users' },
  { id: 'users_delete', name: 'حذف المستخدمين', description: 'حذف المستخدمين', category: 'users' },
  
  { id: 'reports_view', name: 'عرض التقارير', description: 'مشاهدة التقارير والإحصائيات', category: 'reports' },
  { id: 'settings_view', name: 'عرض الإعدادات', description: 'مشاهدة إعدادات النظام', category: 'settings' },
  { id: 'settings_edit', name: 'إدارة الإعدادات', description: 'تعديل إعدادات النظام', category: 'settings' },
];

const initialRoles: Role[] = [
  {
    id: 'admin',
    name: 'مدير عام',
    description: 'صلاحيات كاملة للنظام',
    color: 'red',
    userCount: 3,
    permissions: initialPermissions.map(p => p.id), // All permissions
    isSystemRole: true
  },
  {
    id: 'sales_manager',
    name: 'مدير مبيعات',
    description: 'إدارة المبيعات والطلبات',
    color: 'blue',
    userCount: 5,
    permissions: ['products_view', 'products_create', 'products_edit', 'orders_view', 'orders_edit', 'reports_view'],
    isSystemRole: false
  },
  {
    id: 'support',
    name: 'موظف دعم',
    description: 'دعم العملاء والطلبات',
    color: 'gray',
    userCount: 8,
    permissions: ['products_view', 'orders_view', 'users_view'],
    isSystemRole: false
  }
];

// Payment Method Modal Component
interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: Omit<CustomPaymentMethod, 'id'> | CustomPaymentMethod) => void;
  editingMethod?: CustomPaymentMethod | null;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingMethod 
}) => {
  const [formData, setFormData] = useState<Omit<CustomPaymentMethod, 'id'>>({
    name: '',
    description: '',
    isEnabled: true,
    apiKey: '',
    secretKey: '',
    webhookUrl: '',
    supportedCurrencies: ['SAR'],
    fees: { percentage: 0, fixed: 0 },
    type: 'gateway'
  });

  useEffect(() => {
    if (editingMethod) {
      setFormData({
        name: editingMethod.name,
        description: editingMethod.description,
        isEnabled: editingMethod.isEnabled,
        apiKey: editingMethod.apiKey || '',
        secretKey: editingMethod.secretKey || '',
        webhookUrl: editingMethod.webhookUrl || '',
        supportedCurrencies: editingMethod.supportedCurrencies,
        fees: editingMethod.fees,
        type: editingMethod.type
      });
    } else {
      setFormData({
        name: '',
        description: '',
        isEnabled: true,
        apiKey: '',
        secretKey: '',
        webhookUrl: '',
        supportedCurrencies: ['SAR'],
        fees: { percentage: 0, fixed: 0 },
        type: 'gateway'
      });
    }
  }, [editingMethod, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMethod) {
      onSave({ ...editingMethod, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="bg-white">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            {editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}
          </h3>
        </div>
        
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">اسم طريقة الدفع</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مثال: Apple Pay"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="وصف مختصر لطريقة الدفع"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع طريقة الدفع</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as CustomPaymentMethod['type'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gateway">بوابة دفع</option>
                <option value="digital_wallet">محفظة رقمية</option>
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="cash">نقدي</option>
                <option value="crypto">عملة رقمية</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رسوم النسبة المئوية (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fees.percentage}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    fees: { ...formData.fees, percentage: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">رسوم ثابتة</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.fees.fixed}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    fees: { ...formData.fees, fixed: parseFloat(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key (اختياري)</label>
              <input
                type="text"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="مفتاح API الخاص بالطريقة"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key (اختياري)</label>
              <input
                type="password"
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="المفتاح السري"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Webhook URL (اختياري)</label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/webhook"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isEnabled"
                checked={formData.isEnabled}
                onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isEnabled" className="mr-2 block text-sm text-gray-900">
                تفعيل طريقة الدفع
              </label>
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {editingMethod ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// RoleModal Props
interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (role: Role | Omit<Role, 'id' | 'userCount'>) => void;
  role?: Role | null;
  permissions: Permission[];
}

const RoleModal: React.FC<RoleModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  role: editingRole, 
  permissions 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    permissions: [] as string[],
    isSystemRole: false
  });

  useEffect(() => {
    if (isOpen) {
      if (editingRole) {
        setFormData({
          name: editingRole.name,
          description: editingRole.description,
          color: editingRole.color,
          permissions: [...editingRole.permissions],
          isSystemRole: editingRole.isSystemRole
        });
      } else {
        setFormData({
          name: '',
          description: '',
          color: '#3B82F6',
          permissions: [],
          isSystemRole: false
        });
      }
    }
  }, [isOpen, editingRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      if (editingRole) {
        // For editing, pass the complete role with id and userCount
        onSave({
          ...formData,
          id: editingRole.id,
          userCount: editingRole.userCount
        });
      } else {
        // For adding, pass only the required fields
        onSave(formData);
      }
      onClose();
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const permissionsByCategory = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  const categoryTitles: Record<string, string> = {
    products: 'إدارة المنتجات',
    orders: 'إدارة الطلبات',
    users: 'إدارة المستخدمين',
    reports: 'التقارير',
    settings: 'إعدادات النظام'
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingRole ? 'تعديل الدور' : 'إضافة دور جديد'}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="space-y-4">
          {/* Role Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              اسم الدور *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="مثال: مدير المحتوى"
              required
            />
          </div>

          {/* Role Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              وصف الدور *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="وصف مختصر عن صلاحيات ومسؤوليات هذا الدور"
              rows={3}
              required
            />
          </div>

          {/* Role Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              لون الدور
            </label>
            <div className="flex items-center space-x-3 space-x-reverse">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
              />
              <span className="text-sm text-gray-600">اختر لوناً مميزاً للدور</span>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              الصلاحيات ({formData.permissions.length})
            </label>
            <div className="space-y-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {Object.entries(permissionsByCategory).map(([category, categoryPermissions]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-900 mb-2">{categoryTitles[category]}</h4>
                  <div className="space-y-2 pr-4">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onChange={() => togglePermission(permission.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={permission.id} className="mr-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                          <div className="text-xs text-gray-500">{permission.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3 space-x-reverse">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {editingRole ? 'تحديث' : 'إضافة'}
          </button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default function SettingsPage() {
  type TabType = 'store' | 'payment' | 'shipping' | 'notifications' | 'users' | 'security' | 'seo';
  
  const [activeTab, setActiveTab] = useState<TabType>('store');
  const [store, setStore] = useState(initialStoreSettings);
  const [payment, setPayment] = useState(initialPaymentSettings);
  const [shipping, setShipping] = useState(initialShippingSettings);
  const [notifications, setNotifications] = useState(initialNotificationSettings);
  const [security, setSecurity] = useState(initialSecuritySettings);
  const [seo, setSeo] = useState(initialSEOSettings);
  const [permissions, setPermissions] = useState(initialPermissions);
  const [roles, setRoles] = useState(initialRoles);
  
  // Saved versions for comparison
  const [savedStore, setSavedStore] = useState(initialStoreSettings);
  const [savedPayment, setSavedPayment] = useState(initialPaymentSettings);
  const [savedShipping, setSavedShipping] = useState(initialShippingSettings);
  const [savedNotifications, setSavedNotifications] = useState(initialNotificationSettings);
  const [savedSecurity, setSavedSecurity] = useState(initialSecuritySettings);
  const [savedSeo, setSavedSeo] = useState(initialSEOSettings);
  const [savedPermissions, setSavedPermissions] = useState(initialPermissions);
  const [savedRoles, setSavedRoles] = useState(initialRoles);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modal states
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<CustomPaymentMethod | null>(null);
  const [showDeletePaymentConfirm, setShowDeletePaymentConfirm] = useState(false);
  const [deletingPaymentMethodId, setDeletingPaymentMethodId] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showDeleteRoleConfirm, setShowDeleteRoleConfirm] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  // Toast states
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setToast({ isVisible: true, message, type });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Check for changes
  useEffect(() => {
    const checkChanges = () => {
      const hasStoreChanges = JSON.stringify(store) !== JSON.stringify(savedStore);
      const hasPaymentChanges = JSON.stringify(payment) !== JSON.stringify(savedPayment);
      const hasShippingChanges = JSON.stringify(shipping) !== JSON.stringify(savedShipping);
      const hasNotificationChanges = JSON.stringify(notifications) !== JSON.stringify(savedNotifications);
      const hasSecurityChanges = JSON.stringify(security) !== JSON.stringify(savedSecurity);
      const hasSeoChanges = JSON.stringify(seo) !== JSON.stringify(savedSeo);
      const hasRolesChanges = JSON.stringify(roles) !== JSON.stringify(savedRoles);
      const hasPermissionsChanges = JSON.stringify(permissions) !== JSON.stringify(savedPermissions);
      
      const hasAnyChanges = hasStoreChanges || hasPaymentChanges || hasShippingChanges || hasNotificationChanges || hasSecurityChanges || hasSeoChanges || hasRolesChanges || hasPermissionsChanges;
      
      setHasChanges(hasAnyChanges);
      
      // Debug: Show what changed
      if (hasAnyChanges) {
        console.log('Settings changed:', {
          store: hasStoreChanges,
          payment: hasPaymentChanges,
          shipping: hasShippingChanges,
          notifications: hasNotificationChanges,
          security: hasSecurityChanges,
          seo: hasSeoChanges,
          roles: hasRolesChanges,
          permissions: hasPermissionsChanges
        });
      }
    };
    
    checkChanges();
  }, [store, payment, shipping, notifications, security, seo, roles, permissions, savedStore, savedPayment, savedShipping, savedNotifications, savedSecurity, savedSeo, savedRoles, savedPermissions]);

  const saveSettings = async () => {
    setIsLoading(true);
    try {
      // Here you would make API calls to save settings
      console.log('Saving settings:', { store, payment, shipping, notifications, security, seo });
      
      // Show what's being saved
      const changesToSave = {
        store: JSON.stringify(store) !== JSON.stringify(savedStore),
        payment: JSON.stringify(payment) !== JSON.stringify(savedPayment),
        shipping: JSON.stringify(shipping) !== JSON.stringify(savedShipping),
        notifications: JSON.stringify(notifications) !== JSON.stringify(savedNotifications),
        security: JSON.stringify(security) !== JSON.stringify(savedSecurity),
        seo: JSON.stringify(seo) !== JSON.stringify(savedSeo)
      };
      
      console.log('Changes being saved:', changesToSave);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update saved values to current values after successful save
      setSavedStore({ ...store });
      setSavedPayment({ ...payment });
      setSavedShipping({ ...shipping });
      setSavedNotifications({ ...notifications });
      setSavedSecurity({ ...security });
      setSavedSeo({ ...seo });
      setSavedRoles([...roles]);
      setSavedPermissions([...permissions]);
      
      showToast('تم حفظ الإعدادات بنجاح!', 'success');
      setHasChanges(false);
      
      console.log('Settings saved successfully. New saved values updated.');
    } catch (error) {
      console.error('Error saving settings:', error);
      showToast('حدث خطأ أثناء حفظ الإعدادات', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = () => {
    setStore({ ...savedStore });
    setPayment({ ...savedPayment });
    setShipping({ ...savedShipping });
    setNotifications({ ...savedNotifications });
    setSecurity({ ...savedSecurity });
    setSeo({ ...savedSeo });
    setRoles([...savedRoles]);
    setPermissions([...savedPermissions]);
    
    showToast('تم إعادة تعيين جميع الإعدادات إلى القيم المحفوظة', 'info');
  };

  // Payment method management functions
  const addPaymentMethod = (newMethod: Omit<CustomPaymentMethod, 'id'>) => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const methodWithId: CustomPaymentMethod = { ...newMethod, id };
    
    setPayment(prev => ({
      ...prev,
      customPaymentMethods: [...prev.customPaymentMethods, methodWithId]
    }));
    
    showToast('تم إضافة طريقة الدفع بنجاح', 'success');
    setShowPaymentMethodModal(false);
    setEditingPaymentMethod(null);
  };

  const updatePaymentMethod = (updatedMethod: CustomPaymentMethod) => {
    setPayment(prev => ({
      ...prev,
      customPaymentMethods: prev.customPaymentMethods.map(method => 
        method.id === updatedMethod.id ? updatedMethod : method
      )
    }));
    
    showToast('تم تحديث طريقة الدفع بنجاح', 'success');
    setShowPaymentMethodModal(false);
    setEditingPaymentMethod(null);
  };

  const deletePaymentMethod = () => {
    if (deletingPaymentMethodId) {
      setPayment(prev => ({
        ...prev,
        customPaymentMethods: prev.customPaymentMethods.filter(
          method => method.id !== deletingPaymentMethodId
        )
      }));
      
      showToast('تم حذف طريقة الدفع بنجاح', 'success');
      setShowDeletePaymentConfirm(false);
      setDeletingPaymentMethodId(null);
    }
  };

  const togglePaymentMethod = (methodId: string) => {
    setPayment(prev => ({
      ...prev,
      customPaymentMethods: prev.customPaymentMethods.map(method => 
        method.id === methodId 
          ? { ...method, isEnabled: !method.isEnabled } 
          : method
      )
    }));
  };

  // Role management functions
  const addRole = (newRole: Omit<Role, 'id' | 'userCount'>) => {
    const id = `role_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const roleWithId: Role = { 
      ...newRole, 
      id, 
      userCount: 0,
      isSystemRole: false 
    };
    
    setRoles(prev => [...prev, roleWithId]);
    showToast('تم إضافة الدور بنجاح', 'success');
  };

  const updateRole = (updatedRole: Role) => {
    setRoles(prev => prev.map(role => 
      role.id === updatedRole.id ? updatedRole : role
    ));
    showToast('تم تحديث الدور بنجاح', 'success');
  };

  const deleteRole = () => {
    if (deletingRoleId) {
      const roleToDelete = roles.find(role => role.id === deletingRoleId);
      
      if (roleToDelete?.isSystemRole) {
        showToast('لا يمكن حذف الأدوار الأساسية للنظام', 'error');
        setShowDeleteRoleConfirm(false);
        setDeletingRoleId(null);
        return;
      }

      setRoles(prev => prev.filter(role => role.id !== deletingRoleId));
      
      showToast('تم حذف الدور بنجاح', 'success');
      setShowDeleteRoleConfirm(false);
      setDeletingRoleId(null);
    }
  };

  const openAddRole = () => {
    setEditingRole(null);
    setShowRoleModal(true);
  };

  const openEditRole = (role: Role) => {
    setEditingRole(role);
    setShowRoleModal(true);
  };

  const openDeleteRole = (roleId: string) => {
    setDeletingRoleId(roleId);
    setShowDeleteRoleConfirm(true);
  };

  const tabs = [
    { id: 'store' as const, name: 'إعدادات المتجر', icon: <Store size={20}/> },
    { id: 'payment' as const, name: 'طرق الدفع', icon: <CreditCard size={20}/> },
    { id: 'shipping' as const, name: 'الشحن والتوصيل', icon: <Truck size={20}/> },
    { id: 'notifications' as const, name: 'الإشعارات', icon: <Bell size={20}/> },
    { id: 'security' as const, name: 'الأمان والنسخ الاحتياطي', icon: <Shield size={20}/> },
    { id: 'seo' as const, name: 'SEO والتسويق', icon: <Search size={20}/> },
    { id: 'users' as const, name: 'المستخدمين والصلاحيات', icon: <Users size={20}/> }
  ];

  // Check if specific tab has changes
  const hasTabChanges = (tabId: TabType) => {
    switch (tabId) {
      case 'store':
        return JSON.stringify(store) !== JSON.stringify(savedStore);
      case 'payment':
        return JSON.stringify(payment) !== JSON.stringify(savedPayment);
      case 'shipping':
        return JSON.stringify(shipping) !== JSON.stringify(savedShipping);
      case 'notifications':
        return JSON.stringify(notifications) !== JSON.stringify(savedNotifications);
      case 'security':
        return JSON.stringify(security) !== JSON.stringify(savedSecurity);
      case 'seo':
        return JSON.stringify(seo) !== JSON.stringify(savedSeo);
      case 'users':
        return JSON.stringify(roles) !== JSON.stringify(savedRoles) || JSON.stringify(permissions) !== JSON.stringify(savedPermissions);
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">إعدادات المتجر</h1>
              <p className="text-sm text-gray-600">إدارة إعدادات المتجر والنظام</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              {hasChanges && (
                <div className="flex items-center bg-amber-50 border border-amber-200 rounded-lg px-3 py-1 text-amber-700 text-sm">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="font-medium">
                    تغييرات غير محفوظة
                    {/* Show which sections changed */}
                    {(hasTabChanges('store') || hasTabChanges('payment') || hasTabChanges('shipping') || 
                      hasTabChanges('notifications') || hasTabChanges('security') || hasTabChanges('seo')) && (
                      <span className="mr-1 text-xs">
                        ({[
                          hasTabChanges('store') && 'المتجر',
                          hasTabChanges('payment') && 'الدفع', 
                          hasTabChanges('shipping') && 'الشحن',
                          hasTabChanges('notifications') && 'الإشعارات',
                          hasTabChanges('security') && 'الأمان',
                          hasTabChanges('seo') && 'SEO'
                        ].filter(Boolean).join('، ')})
                      </span>
                    )}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setShowResetConfirm(true)}
                disabled={isLoading}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RotateCcw size={16} className="inline ml-2"/>
                إعادة تعيين
              </button>
              
              <button
                onClick={saveSettings}
                disabled={isLoading || !hasChanges}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16}/>
                )}
                <span>{isLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-right px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3 space-x-reverse">
                      {tab.icon}
                      <span>{tab.name}</span>
                    </div>
                    {hasTabChanges(tab.id) && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Store Settings Tab */}
            {activeTab === 'store' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات المتجر العامة</h2>
                
                <form className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">المعلومات الأساسية</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اسم المتجر</label>
                        <input
                          type="text"
                          value={store.name}
                          onChange={(e) => setStore({...store, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={store.email}
                          onChange={(e) => setStore({...store, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                        <input
                          type="tel"
                          value={store.phone}
                          onChange={(e) => setStore({...store, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">موقع الويب</label>
                        <input
                          type="url"
                          value={store.website}
                          onChange={(e) => setStore({...store, website: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                        <select
                          value={store.currency}
                          onChange={(e) => setStore({...store, currency: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="SAR">ريال سعودي (SAR)</option>
                          <option value="USD">دولار أمريكي (USD)</option>
                          <option value="EUR">يورو (EUR)</option>
                          <option value="AED">درهم إماراتي (AED)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المنطقة الزمنية</label>
                        <select
                          value={store.timezone}
                          onChange={(e) => setStore({...store, timezone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Asia/Riyadh">الرياض (GMT+3)</option>
                          <option value="Asia/Dubai">دبي (GMT+4)</option>
                          <option value="Africa/Cairo">القاهرة (GMT+2)</option>
                          <option value="Asia/Baghdad">بغداد (GMT+3)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">اللغة الافتراضية</label>
                        <select
                          value={store.language}
                          onChange={(e) => setStore({...store, language: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="ar">العربية</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">معدل الضريبة (%)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={store.taxRate}
                          onChange={(e) => setStore({...store, taxRate: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">الوصف والعنوان</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">وصف المتجر</label>
                        <textarea
                          value={store.description}
                          onChange={(e) => setStore({...store, description: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="وصف مختصر عن المتجر وما يقدمه"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                        <textarea
                          value={store.address}
                          onChange={(e) => setStore({...store, address: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="العنوان الكامل للمتجر"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات الطلبات</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">السماح بالدفع كضيف</h4>
                          <p className="text-sm text-gray-600">السماح للعملاء بالطلب دون إنشاء حساب</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={store.allowGuestCheckout}
                            onChange={(e) => setStore({...store, allowGuestCheckout: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">وضع الصيانة</h4>
                          <p className="text-sm text-gray-600">إغلاق المتجر مؤقتاً للصيانة</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={store.maintenanceMode}
                            onChange={(e) => setStore({...store, maintenanceMode: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">شعار المتجر</h3>
                    <div className="flex items-center space-x-6 space-x-reverse">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {store.logo ? (
                          <Image 
                            src={store.logo} 
                            alt="شعار المتجر" 
                            width={96}
                            height={96}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Store size={32} className="text-gray-400"/>
                        )}
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">رفع شعار جديد</label>
                        <div className="flex items-center space-x-4 space-x-reverse">
                          <button 
                            type="button"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            اختيار ملف
                          </button>
                          <span className="text-sm text-gray-500">PNG, JPG حتى 2MB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Payment Settings Tab */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات طرق الدفع</h2>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">طرق الدفع المتاحة</h3>
                      <button
                        onClick={() => setShowPaymentMethodModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        <Plus size={16} className="ml-2" />
                        إضافة طريقة دفع
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Built-in Payment Methods */}
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">البطاقات الائتمانية</h4>
                          <p className="text-sm text-gray-600">Visa, MasterCard, American Express</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            بوابة دفع
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payment.enableCreditCard}
                            onChange={(e) => setPayment({...payment, enableCreditCard: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">PayPal</h4>
                          <p className="text-sm text-gray-600">الدفع عبر PayPal</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            محفظة رقمية
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payment.enablePayPal}
                            onChange={(e) => setPayment({...payment, enablePayPal: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">التحويل البنكي</h4>
                          <p className="text-sm text-gray-600">الدفع عبر التحويل البنكي</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            تحويل بنكي
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payment.enableBankTransfer}
                            onChange={(e) => setPayment({...payment, enableBankTransfer: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">الدفع عند الاستلام</h4>
                          <p className="text-sm text-gray-600">الدفع النقدي عند التوصيل</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            نقدي
                          </span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={payment.enableCashOnDelivery}
                            onChange={(e) => setPayment({...payment, enableCashOnDelivery: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      {/* Dynamic Custom Payment Methods */}
                      {payment.customPaymentMethods.map((method) => (
                        <div key={method.id} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                <h4 className="font-medium text-gray-900">{method.name}</h4>
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                  method.isEnabled 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {method.isEnabled ? 'مُفعّل' : 'غير مُفعّل'}
                                </span>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                              
                              <div className="flex items-center space-x-3 space-x-reverse">
                                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                  method.type === 'gateway' ? 'bg-blue-100 text-blue-800' :
                                  method.type === 'digital_wallet' ? 'bg-purple-100 text-purple-800' :
                                  method.type === 'bank_transfer' ? 'bg-green-100 text-green-800' :
                                  method.type === 'cash' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-orange-100 text-orange-800'
                                }`}>
                                  {method.type === 'gateway' ? 'بوابة دفع' :
                                   method.type === 'digital_wallet' ? 'محفظة رقمية' :
                                   method.type === 'bank_transfer' ? 'تحويل بنكي' :
                                   method.type === 'cash' ? 'نقدي' : 'عملة رقمية'}
                                </span>
                                
                                {(method.fees.percentage > 0 || method.fees.fixed > 0) && (
                                  <span className="text-xs text-gray-500">
                                    رسوم: {method.fees.percentage > 0 && `${method.fees.percentage}%`}
                                    {method.fees.percentage > 0 && method.fees.fixed > 0 && ' + '}
                                    {method.fees.fixed > 0 && `${method.fees.fixed} ${store.currency}`}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {/* Toggle Switch */}
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={method.isEnabled}
                                  onChange={() => togglePaymentMethod(method.id)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                              </label>
                              
                              {/* Edit Button */}
                              <button
                                onClick={() => {
                                  setEditingPaymentMethod(method);
                                  setShowPaymentMethodModal(true);
                                }}
                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title="تعديل"
                              >
                                <Edit size={16} />
                              </button>
                              
                              {/* Delete Button */}
                              <button
                                onClick={() => {
                                  setDeletingPaymentMethodId(method.id);
                                  setShowDeletePaymentConfirm(true);
                                }}
                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                title="حذف"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Empty State for Custom Payment Methods */}
                      {payment.customPaymentMethods.length === 0 && (
                        <div className="md:col-span-2 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-sm font-medium text-gray-900 mb-2">لا توجد طرق دفع مخصصة</h3>
                          <p className="text-sm text-gray-500 mb-4">استخدم زر &quot;إضافة طريقة دفع&quot; لإضافة طرق دفع جديدة</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات Stripe</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Public Key</label>
                        <input
                          type="text"
                          value={payment.stripePublicKey}
                          onChange={(e) => setPayment({...payment, stripePublicKey: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="pk_test_..."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                        <input
                          type="password"
                          value={payment.stripeSecretKey}
                          onChange={(e) => setPayment({...payment, stripeSecretKey: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="sk_test_..."
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات PayPal</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Client ID</label>
                      <input
                        type="text"
                        value={payment.paypalClientId}
                        onChange={(e) => setPayment({...payment, paypalClientId: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="PayPal Client ID"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">حدود الطلبات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للطلب ({store.currency})</label>
                        <input
                          type="number"
                          value={payment.minimumOrderAmount}
                          onChange={(e) => setPayment({...payment, minimumOrderAmount: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى للطلب ({store.currency})</label>
                        <input
                          type="number"
                          value={payment.maximumOrderAmount}
                          onChange={(e) => setPayment({...payment, maximumOrderAmount: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مهلة الدفع (دقيقة)</label>
                        <input
                          type="number"
                          value={payment.paymentTimeout}
                          onChange={(e) => setPayment({...payment, paymentTimeout: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">معلومات مهمة</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• تأكد من صحة مفاتيح الدفع قبل التفعيل</li>
                      <li>• اختبر طرق الدفع في بيئة الاختبار أولاً</li>
                      <li>• راجع رسوم المعاملات لكل طريقة دفع</li>
                      <li>• فعل SSL للحماية الإضافية</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Settings Tab */}
            {activeTab === 'shipping' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات الشحن والتوصيل</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">خيارات الشحن</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">الشحن المجاني</h4>
                          <p className="text-sm text-gray-600">تفعيل الشحن المجاني عند تجاوز مبلغ معين</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shipping.enableFreeShipping}
                            onChange={(e) => setShipping({...shipping, enableFreeShipping: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">الشحن السريع</h4>
                          <p className="text-sm text-gray-600">تفعيل خيار الشحن السريع</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shipping.enableExpressShipping}
                            onChange={(e) => setShipping({...shipping, enableExpressShipping: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">الشحن حسب الوزن</h4>
                          <p className="text-sm text-gray-600">حساب تكلفة الشحن حسب وزن المنتجات</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shipping.weightBasedShipping}
                            onChange={(e) => setShipping({...shipping, weightBasedShipping: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">الشحن الدولي</h4>
                          <p className="text-sm text-gray-600">تفعيل الشحن خارج البلد</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shipping.internationalShipping}
                            onChange={(e) => setShipping({...shipping, internationalShipping: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">تكاليف الشحن</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى للشحن المجاني ({store.currency})</label>
                        <input
                          type="number"
                          value={shipping.freeShippingThreshold}
                          onChange={(e) => setShipping({...shipping, freeShippingThreshold: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">تكلفة الشحن العادي ({store.currency})</label>
                        <input
                          type="number"
                          value={shipping.standardShippingCost}
                          onChange={(e) => setShipping({...shipping, standardShippingCost: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">تكلفة الشحن السريع ({store.currency})</label>
                        <input
                          type="number"
                          value={shipping.expressShippingCost}
                          onChange={(e) => setShipping({...shipping, expressShippingCost: parseFloat(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">مناطق الشحن</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">المناطق المتاحة للشحن</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {shipping.shippingZones.map((zone, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                              <span className="text-sm text-gray-700">{zone}</span>
                              <button 
                                onClick={() => {
                                  const newZones = shipping.shippingZones.filter((_, i) => i !== index);
                                  setShipping({...shipping, shippingZones: newZones});
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex space-x-2 space-x-reverse">
                          <input
                            type="text"
                            placeholder="إضافة منطقة جديدة"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = (e.target as HTMLInputElement).value.trim();
                                if (value && !shipping.shippingZones.includes(value)) {
                                  setShipping({...shipping, shippingZones: [...shipping.shippingZones, value]});
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            إضافة
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات التوصيل</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">مدة التوصيل المتوقعة (أيام)</label>
                        <input
                          type="number"
                          value={shipping.estimatedDeliveryDays}
                          onChange={(e) => setShipping({...shipping, estimatedDeliveryDays: parseInt(e.target.value)})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">نصائح الشحن</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• احرص على دقة حساب تكاليف الشحن</li>
                      <li>• راجع مناطق الشحن بانتظام</li>
                      <li>• قدم خيارات شحن متنوعة للعملاء</li>
                      <li>• اعتبر الشحن المجاني كعامل جذب للعملاء</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings Tab */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات الإشعارات</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إشعارات النظام</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">إشعارات البريد الإلكتروني</h4>
                          <p className="text-sm text-gray-600">تلقي الإشعارات عبر البريد الإلكتروني</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.emailNotifications}
                            onChange={(e) => setNotifications({...notifications, emailNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">إشعارات الرسائل النصية</h4>
                          <p className="text-sm text-gray-600">تلقي الإشعارات عبر SMS</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.smsNotifications}
                            onChange={(e) => setNotifications({...notifications, smsNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إشعارات الطلبات</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">الطلبات الجديدة</h4>
                          <p className="text-sm text-gray-600">إشعار عند وصول طلبات جديدة</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.orderNotifications}
                            onChange={(e) => setNotifications({...notifications, orderNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">تحديثات حالة الطلب</h4>
                          <p className="text-sm text-gray-600">إشعار عند تغيير حالة الطلبات</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.orderStatusUpdates}
                            onChange={(e) => setNotifications({...notifications, orderStatusUpdates: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إشعارات المخزون</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">تنبيهات المخزون</h4>
                          <p className="text-sm text-gray-600">إشعار عند تغيير حالة المخزون</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.inventoryNotifications}
                            onChange={(e) => setNotifications({...notifications, inventoryNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">تنبيه نفاد المخزون</h4>
                          <p className="text-sm text-gray-600">إشعار عند انخفاض كمية المنتجات</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.lowStockAlert}
                            onChange={(e) => setNotifications({...notifications, lowStockAlert: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إشعارات العملاء والتسويق</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">إشعارات العملاء</h4>
                          <p className="text-sm text-gray-600">إشعار عند تسجيل عملاء جدد</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.customerNotifications}
                            onChange={(e) => setNotifications({...notifications, customerNotifications: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">رسائل التسويق</h4>
                          <p className="text-sm text-gray-600">إرسال رسائل ترويجية وتسويقية</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.marketingEmails}
                            onChange={(e) => setNotifications({...notifications, marketingEmails: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">التقارير الأسبوعية</h4>
                          <p className="text-sm text-gray-600">إرسال تقارير أسبوعية عن أداء المتجر</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications.weeklyReports}
                            onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-900 mb-2">ملاحظة مهمة</h4>
                    <p className="text-sm text-yellow-700">
                      تأكد من تكوين إعدادات البريد الإلكتروني بشكل صحيح لضمان وصول الإشعارات. 
                      يمكنك اختبار الإشعارات من قسم الاختبارات في إعدادات البريد الإلكتروني.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات الأمان والنسخ الاحتياطي</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">مدة انتهاء كلمة المرور (أيام)</label>
                      <input
                        type="number"
                        value={security.passwordExpiry}
                        onChange={(e) => setSecurity({...security, passwordExpiry: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">عدد محاولات تسجيل الدخول المسموحة</label>
                      <input
                        type="number"
                        value={security.maxLoginAttempts}
                        onChange={(e) => setSecurity({...security, maxLoginAttempts: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">مهلة انتهاء الجلسة (دقيقة)</label>
                      <input
                        type="number"
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">تكرار النسخ الاحتياطي</label>
                      <select
                        value={security.backupFrequency}
                        onChange={(e) => setSecurity({...security, backupFrequency: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="daily">يومي</option>
                        <option value="weekly">أسبوعي</option>
                        <option value="monthly">شهري</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">المصادقة الثنائية</h4>
                        <p className="text-sm text-gray-600">تفعيل المصادقة الثنائية للأمان الإضافي</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.twoFactorAuth}
                          onChange={(e) => setSecurity({...security, twoFactorAuth: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">تنبيهات تسجيل الدخول</h4>
                        <p className="text-sm text-gray-600">إرسال تنبيهات عند تسجيل دخول جديد</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.enableLoginAlerts}
                          onChange={(e) => setSecurity({...security, enableLoginAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">SSL مفعل</h4>
                        <p className="text-sm text-gray-600">تأمين الاتصال بالموقع باستخدام SSL</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.enableSSL}
                          onChange={(e) => setSecurity({...security, enableSSL: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">نصائح الأمان</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• استخدم كلمات مرور قوية ومختلفة</li>
                      <li>• فعل المصادقة الثنائية للحماية الإضافية</li>
                      <li>• راجع سجل تسجيل الدخول بانتظام</li>
                      <li>• تأكد من تحديث النظام بانتظام</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* SEO Settings Tab */}
            {activeTab === 'seo' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">إعدادات SEO والتسويق الرقمي</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Tags</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">عنوان الموقع (Meta Title)</label>
                        <input
                          type="text"
                          value={seo.metaTitle}
                          onChange={(e) => setSeo({...seo, metaTitle: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="عنوان يصف موقعك بشكل جذاب"
                        />
                        <p className="text-xs text-gray-500 mt-1">الطول المثالي: 50-60 حرف</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">وصف الموقع (Meta Description)</label>
                        <textarea
                          value={seo.metaDescription}
                          onChange={(e) => setSeo({...seo, metaDescription: e.target.value})}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="وصف مختصر وجذاب لموقعك"
                        />
                        <p className="text-xs text-gray-500 mt-1">الطول المثالي: 150-160 حرف</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">الكلمات المفتاحية</label>
                        <input
                          type="text"
                          value={seo.metaKeywords}
                          onChange={(e) => setSeo({...seo, metaKeywords: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="كلمة1, كلمة2, كلمة3"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">أدوات التتبع والتحليل</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Google Analytics ID</label>
                        <input
                          type="text"
                          value={seo.googleAnalyticsId}
                          onChange={(e) => setSeo({...seo, googleAnalyticsId: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="G-XXXXXXXXXX"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Facebook Pixel ID</label>
                        <input
                          type="text"
                          value={seo.facebookPixelId}
                          onChange={(e) => setSeo({...seo, facebookPixelId: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="123456789012345"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات وسائل التواصل الاجتماعي</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Open Graph (Facebook)</h4>
                          <p className="text-sm text-gray-600">تحسين مظهر الروابط في فيسبوك</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={seo.openGraphEnabled}
                            onChange={(e) => setSeo({...seo, openGraphEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">Twitter Cards</h4>
                          <p className="text-sm text-gray-600">تحسين مظهر الروابط في تويتر</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={seo.twitterCardEnabled}
                            onChange={(e) => setSeo({...seo, twitterCardEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">إعدادات محركات البحث</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">خريطة الموقع (Sitemap)</h4>
                          <p className="text-sm text-gray-600">توليد خريطة موقع تلقائية لمحركات البحث</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={seo.sitemapEnabled}
                            onChange={(e) => setSeo({...seo, sitemapEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">ملف Robots.txt</h4>
                          <p className="text-sm text-gray-600">توجيه محركات البحث حول الصفحات المسموح فهرستها</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={seo.robotsEnabled}
                            onChange={(e) => setSeo({...seo, robotsEnabled: e.target.checked})}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">نصائح SEO</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• استخدم كلمات مفتاحية ذات صلة بمحتوى موقعك</li>
                      <li>• اكتب عناوين ووصوف جذابة ومفيدة</li>
                      <li>• تأكد من سرعة تحميل الموقع</li>
                      <li>• استخدم الصور المُحسنة للويب</li>
                      <li>• أنشئ محتوى عالي الجودة بانتظام</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Users Settings Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* User Management Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">إدارة المستخدمين والصلاحيات</h2>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse">
                      <Users size={16}/>
                      <span>إضافة مستخدم جديد</span>
                    </button>
                  </div>

                  {/* Users List */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-right py-3 text-sm font-medium text-gray-600">المستخدم</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-600">الدور</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-600">آخر دخول</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-600">الحالة</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-600">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">أ</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">أحمد محمد</p>
                                <p className="text-sm text-gray-500">ahmed@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              مدير عام
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">منذ ساعتين</td>
                          <td className="py-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              نشط
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">تعديل</button>
                              <button className="text-red-600 hover:text-red-700 text-sm">حذف</button>
                            </div>
                          </td>
                        </tr>
                        
                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-medium">ف</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">فاطمة علي</p>
                                <p className="text-sm text-gray-500">fatima@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                              مدير مبيعات
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">أمس</td>
                          <td className="py-4">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              نشط
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">تعديل</button>
                              <button className="text-red-600 hover:text-red-700 text-sm">حذف</button>
                            </div>
                          </td>
                        </tr>

                        <tr className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center space-x-3 space-x-reverse">
                              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <span className="text-yellow-600 font-medium">م</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">محمد السالم</p>
                                <p className="text-sm text-gray-500">mohammed@example.com</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                              موظف دعم
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-600">منذ 3 أيام</td>
                          <td className="py-4">
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              معلق
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <button className="text-blue-600 hover:text-blue-700 text-sm">تعديل</button>
                              <button className="text-red-600 hover:text-red-700 text-sm">حذف</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Roles Management */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">إدارة الأدوار والصلاحيات</h3>
                    <button 
                      onClick={openAddRole}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
                    >
                      <Plus size={16}/>
                      <span>إضافة دور جديد</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roles.map((role) => (
                      <div key={role.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">{role.name}</h4>
                          <span 
                            className={`px-2 py-1 rounded-full text-xs font-medium`}
                            style={{ 
                              backgroundColor: `${role.color}20`, 
                              color: role.color 
                            }}
                          >
                            {role.userCount} مستخدمين
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{role.description}</p>
                        
                        <div className="space-y-2 mb-4">
                          {role.permissions.slice(0, 4).map((permissionId) => {
                            const permission = permissions.find(p => p.id === permissionId);
                            if (!permission) return null;
                            
                            return (
                              <div key={permissionId} className="flex items-center space-x-2 space-x-reverse">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-600">{permission.name}</span>
                              </div>
                            );
                          })}
                          {role.permissions.length > 4 && (
                            <div className="flex items-center space-x-2 space-x-reverse">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <span className="text-xs text-gray-400">
                                +{role.permissions.length - 4} صلاحيات أخرى
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 space-x-reverse">
                          <button 
                            onClick={() => openEditRole(role)}
                            className="flex-1 text-blue-600 hover:text-blue-700 text-sm font-medium py-2 px-3 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            تعديل
                          </button>
                          {!role.isSystemRole && (
                            <button 
                              onClick={() => openDeleteRole(role.id)}
                              className="text-red-600 hover:text-red-700 text-sm font-medium py-2 px-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              حذف
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security Audit Log */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">سجل أمان النظام</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">تسجيل دخول ناجح</p>
                          <p className="text-sm text-gray-500">أحمد محمد - من IP: 192.168.1.100</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">منذ 5 دقائق</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">محاولة تسجيل دخول فاشلة</p>
                          <p className="text-sm text-gray-500">unknown@example.com - من IP: 10.0.0.50</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">منذ ساعة</span>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">تحديث صلاحيات مستخدم</p>
                          <p className="text-sm text-gray-500">فاطمة علي - تم تعديل الدور إلى مدير مبيعات</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">منذ يومين</span>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      عرض السجل الكامل
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={resetSettings}
        title="إعادة تعيين الإعدادات"
        message="هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى القيم الافتراضية؟ سيتم فقدان جميع التغييرات غير المحفوظة."
        type="warning"
      />

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showPaymentMethodModal}
        onClose={() => {
          setShowPaymentMethodModal(false);
          setEditingPaymentMethod(null);
        }}
        onSave={(method) => {
          if (editingPaymentMethod && 'id' in method) {
            updatePaymentMethod(method as CustomPaymentMethod);
          } else {
            addPaymentMethod(method as Omit<CustomPaymentMethod, 'id'>);
          }
        }}
        editingMethod={editingPaymentMethod}
      />

      {/* Role Modal */}
      <RoleModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setEditingRole(null);
        }}
        onSave={(role) => {
          if ('id' in role) {
            // It's a complete role (editing)
            updateRole(role as Role);
          } else {
            // It's a new role (adding)
            addRole(role as Omit<Role, 'id' | 'userCount'>);
          }
        }}
        role={editingRole}
        permissions={permissions}
      />

      {/* Delete Role Confirmation */}
      <ConfirmModal
        isOpen={showDeleteRoleConfirm}
        onClose={() => {
          setShowDeleteRoleConfirm(false);
          setDeletingRoleId(null);
        }}
        onConfirm={deleteRole}
        title="حذف الدور"
        message="هل أنت متأكد من حذف هذا الدور؟ لا يمكن التراجع عن هذا الإجراء."
        type="danger"
      />

      {/* Delete Payment Method Confirmation */}
      <ConfirmModal
        isOpen={showDeletePaymentConfirm}
        onClose={() => {
          setShowDeletePaymentConfirm(false);
          setDeletingPaymentMethodId(null);
        }}
        onConfirm={deletePaymentMethod}
        title="حذف طريقة الدفع"
        message="هل أنت متأكد من حذف طريقة الدفع هذه؟ لا يمكن التراجع عن هذا الإجراء."
        type="danger"
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </div>
  );
}