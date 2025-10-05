'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Save, RotateCcw, Store, CreditCard, Truck, Bell, Users, Shield, Search, CheckCircle, AlertCircle, X, Info, Plus, Edit, Trash2, Loader2, Building2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { usePaymentMethods, PaymentMethod } from '@/hooks/usePaymentMethods';
import PaymentMethodCard from '@/components/PaymentMethodCard';
import PaymentMethodModal from '@/components/PaymentMethodModal';
import PaymentMethodSkeleton from '@/components/PaymentMethodSkeleton';
import '@/styles/payment-methods.css';

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
  
  const [activeTab, setActiveTab] = useState<TabType>('payment');
  const { settings, loading: settingsLoading, error: settingsError, saveSettings, fetchSettings, initializeDefaults } = useSettings();
  const { 
    paymentMethods, 
    loading: paymentMethodsLoading, 
    error: paymentMethodsError,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethod
  } = usePaymentMethods();
  
  // Local state for form data with default values to prevent uncontrolled to controlled warning
  const [store, setStore] = useState(() => ({ ...initialStoreSettings, ...settings.store }));
  const [payment, setPayment] = useState(() => ({ ...initialPaymentSettings, ...settings.payment }));
  const [shipping, setShipping] = useState(() => ({ ...initialShippingSettings, ...settings.shipping }));
  const [notifications, setNotifications] = useState(() => ({ ...initialNotificationSettings, ...settings.notifications }));
  const [security, setSecurity] = useState(() => ({ ...initialSecuritySettings, ...settings.security }));
  const [seo, setSeo] = useState(() => ({ ...initialSEOSettings, ...settings.seo }));
  const [permissions, setPermissions] = useState(initialPermissions);
  const [roles, setRoles] = useState(initialRoles);
  
  // Bank Settings State
  const [bankSettings, setBankSettings] = useState({
    bank_name: '',
    bank_account_number: '',
    bank_account_holder: ''
  });
  const [savedBankSettings, setSavedBankSettings] = useState({
    bank_name: '',
    bank_account_number: '',
    bank_account_holder: ''
  });
  const [loadingBankSettings, setLoadingBankSettings] = useState(false);
  
  // Saved versions for comparison with default values
  const [savedStore, setSavedStore] = useState(() => ({ ...initialStoreSettings, ...settings.store }));
  const [savedPayment, setSavedPayment] = useState(() => ({ ...initialPaymentSettings, ...settings.payment }));
  const [savedShipping, setSavedShipping] = useState(() => ({ ...initialShippingSettings, ...settings.shipping }));
  const [savedNotifications, setSavedNotifications] = useState(() => ({ ...initialNotificationSettings, ...settings.notifications }));
  const [savedSecurity, setSavedSecurity] = useState(() => ({ ...initialSecuritySettings, ...settings.security }));
  const [savedSeo, setSavedSeo] = useState(() => ({ ...initialSEOSettings, ...settings.seo }));
  const [savedPermissions, setSavedPermissions] = useState(initialPermissions);
  const [savedRoles, setSavedRoles] = useState(initialRoles);
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Modal states
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethod | null>(null);
  const [showDeletePaymentConfirm, setShowDeletePaymentConfirm] = useState(false);
  const [deletingPaymentMethodId, setDeletingPaymentMethodId] = useState<string | null>(null);
  const [paymentMethodActionLoading, setPaymentMethodActionLoading] = useState<string | null>(null);
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

  // Fetch Bank Settings
  const fetchBankSettings = async () => {
    setLoadingBankSettings(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('api_token');
      
      console.log('🔄 جاري جلب إعدادات البنك...');
      
      const response = await fetch(`${API_BASE_URL}/admin/settings?keys=bank_name,bank_account_number,bank_account_holder`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('📡 استجابة الخادم:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('📊 بيانات الاستجابة:', result);
        
        if (result.success && result.data) {
          const settings = result.data.reduce((acc: any, setting: any) => {
            acc[setting.key] = setting.value;
            return acc;
          }, {});
          
          console.log('⚙️ الإعدادات المستخرجة:', settings);
          
          const bankData = {
            bank_name: settings.bank_name || '',
            bank_account_number: settings.bank_account_number || '',
            bank_account_holder: settings.bank_account_holder || ''
          };
          
          console.log('🏦 بيانات البنك النهائية:', bankData);
          
          setBankSettings(bankData);
          setSavedBankSettings(bankData);
          showToast('تم جلب إعدادات البنك بنجاح', 'success');
        } else {
          console.warn('⚠️ لا توجد بيانات في الاستجابة');
          showToast('لا توجد إعدادات بنك محفوظة', 'info');
        }
      } else {
        const errorText = await response.text();
        console.error('❌ خطأ في الاستجابة:', errorText);
        showToast('فشل في جلب إعدادات البنك', 'error');
      }
    } catch (error) {
      console.error('❌ خطأ في جلب إعدادات البنك:', error);
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setLoadingBankSettings(false);
    }
  };

  // Save Bank Settings
  const handleSaveBankSettings = async () => {
    setLoadingBankSettings(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('api_token');

      console.log('💾 جاري حفظ إعدادات البنك:', bankSettings);

      // التحقق من صحة البيانات
      if (!bankSettings.bank_name.trim()) {
        showToast('يرجى إدخال اسم البنك', 'error');
        return;
      }
      if (!bankSettings.bank_account_number.trim()) {
        showToast('يرجى إدخال رقم الحساب البنكي', 'error');
        return;
      }
      if (!bankSettings.bank_account_holder.trim()) {
        showToast('يرجى إدخال اسم صاحب الحساب', 'error');
        return;
      }

      // Save each setting
      const settingsToSave = [
        { key: 'bank_name', value: bankSettings.bank_name.trim() },
        { key: 'bank_account_number', value: bankSettings.bank_account_number.trim() },
        { key: 'bank_account_holder', value: bankSettings.bank_account_holder.trim() }
      ];

      let allSuccess = true;
      const results = [];

      for (const setting of settingsToSave) {
        console.log(`💾 حفظ ${setting.key}:`, setting.value);
        
        const response = await fetch(`${API_BASE_URL}/admin/settings`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            key: setting.key,
            value: setting.value,
            type: 'string',
            group: 'payment',
            description: setting.key === 'bank_name' ? 'اسم البنك للتحويل البنكي' : 
                        setting.key === 'bank_account_number' ? 'رقم الحساب البنكي' : 
                        'اسم صاحب الحساب البنكي'
          })
        });

        const result = await response.json();
        results.push({ key: setting.key, success: result.success, result });
        
        console.log(`📊 نتيجة حفظ ${setting.key}:`, result);
        
        if (!result.success) {
          allSuccess = false;
          console.error(`❌ فشل في حفظ ${setting.key}:`, result.message);
        }
      }

      if (allSuccess) {
        setSavedBankSettings({ ...bankSettings });
        showToast('تم حفظ إعدادات البنك بنجاح', 'success');
        console.log('✅ تم حفظ جميع إعدادات البنك بنجاح');
        
        // إعادة جلب البيانات للتأكد
        setTimeout(() => {
          fetchBankSettings();
        }, 1000);
      } else {
        showToast('فشل في حفظ بعض إعدادات البنك', 'error');
        console.error('❌ فشل في حفظ بعض الإعدادات:', results);
      }
    } catch (error) {
      console.error('❌ خطأ في حفظ إعدادات البنك:', error);
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setLoadingBankSettings(false);
    }
  };

  // Initialize Bank Settings
  const handleInitializeBankSettings = async () => {
    setLoadingBankSettings(true);
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const token = localStorage.getItem('api_token');
      
      console.log('🔄 جاري تهيئة إعدادات البنك...');
      
      const response = await fetch(`${API_BASE_URL}/admin/bank-settings/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();
      
      if (result.success) {
        showToast('تم تهيئة إعدادات البنك بنجاح', 'success');
        // إعادة جلب البيانات
        setTimeout(() => {
          fetchBankSettings();
        }, 1000);
      } else {
        showToast(result.message || 'فشل في تهيئة إعدادات البنك', 'error');
      }
    } catch (error) {
      console.error('❌ خطأ في تهيئة إعدادات البنك:', error);
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setLoadingBankSettings(false);
    }
  };

  // Load bank settings on mount
  useEffect(() => {
    fetchBankSettings();
  }, []);

  // Update local state when settings are loaded from API
  useEffect(() => {
    // Always merge with defaults to ensure all properties exist
    setStore({ ...initialStoreSettings, ...settings.store });
    setSavedStore({ ...initialStoreSettings, ...settings.store });
    
    setPayment({ ...initialPaymentSettings, ...settings.payment });
    setSavedPayment({ ...initialPaymentSettings, ...settings.payment });
    
    setShipping({ ...initialShippingSettings, ...settings.shipping });
    setSavedShipping({ ...initialShippingSettings, ...settings.shipping });
    
    setNotifications({ ...initialNotificationSettings, ...settings.notifications });
    setSavedNotifications({ ...initialNotificationSettings, ...settings.notifications });
    
    setSecurity({ ...initialSecuritySettings, ...settings.security });
    setSavedSecurity({ ...initialSecuritySettings, ...settings.security });
    
    setSeo({ ...initialSEOSettings, ...settings.seo });
    setSavedSeo({ ...initialSEOSettings, ...settings.seo });
  }, [settings]);

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

  // Show loading state
  if (settingsLoading && Object.keys(settings.store || {}).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (settingsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">خطأ في تحميل الإعدادات</h2>
          <p className="text-gray-600 mb-4">{settingsError}</p>
          <button
            onClick={fetchSettings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      const settingsToSave = {
        store,
        payment,
        shipping,
        notifications,
        security,
        seo
      };
      
      const result = await saveSettings(settingsToSave);
      
      if (result.success) {
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
      } else {
        showToast(result.message || 'حدث خطأ أثناء حفظ الإعدادات', 'error');
      }
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
  const handleAddPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    const result = await addPaymentMethod(method);
    if (result.success) {
      showToast('تم إضافة طريقة الدفع بنجاح', 'success');
      setShowPaymentMethodModal(false);
      setEditingPaymentMethod(null);
    } else {
      showToast(result.message || 'فشل في إضافة طريقة الدفع', 'error');
    }
    return result;
  };

  const handleUpdatePaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingPaymentMethod) return { success: false };
    
    const result = await updatePaymentMethod(editingPaymentMethod.id, method);
    if (result.success) {
      showToast('تم تحديث طريقة الدفع بنجاح', 'success');
      setShowPaymentMethodModal(false);
      setEditingPaymentMethod(null);
    } else {
      showToast(result.message || 'فشل في تحديث طريقة الدفع', 'error');
    }
    return result;
  };

  const handleDeletePaymentMethod = async () => {
    if (!deletingPaymentMethodId) return;
    
    const result = await deletePaymentMethod(deletingPaymentMethodId);
    if (result.success) {
      showToast('تم حذف طريقة الدفع بنجاح', 'success');
    } else {
      showToast(result.message || 'فشل في حذف طريقة الدفع', 'error');
    }
    
    setShowDeletePaymentConfirm(false);
    setDeletingPaymentMethodId(null);
  };

  const handleTogglePaymentMethod = async (methodId: string) => {
    setPaymentMethodActionLoading(methodId);
    
    const result = await togglePaymentMethod(methodId);
    if (result.success) {
      showToast('تم تحديث حالة طريقة الدفع', 'success');
    } else {
      showToast(result.message || 'فشل في تحديث حالة طريقة الدفع', 'error');
    }
    
    setPaymentMethodActionLoading(null);
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
                onClick={handleSaveSettings}
                disabled={isLoading || !hasChanges || settingsLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save size={16}/>
                )}
                <span>{isLoading || settingsLoading ? 'جاري الحفظ...' : 'حفظ التغييرات'}</span>
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
                          value={store.name || ''}
                          onChange={(e) => setStore({...store, name: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
                        <input
                          type="email"
                          value={store.email || ''}
                          onChange={(e) => setStore({...store, email: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
                        <input
                          type="tel"
                          value={store.phone || ''}
                          onChange={(e) => setStore({...store, phone: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">موقع الويب</label>
                        <input
                          type="url"
                          value={store.website || ''}
                          onChange={(e) => setStore({...store, website: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العملة</label>
                        <select
                          value={store.currency || 'SAR'}
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
                          value={store.timezone || 'Asia/Riyadh'}
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
                          value={store.language || 'ar'}
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
                          value={store.taxRate || 0}
                          onChange={(e) => setStore({...store, taxRate: parseFloat(e.target.value) || 0})}
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
                          value={store.description || ''}
                          onChange={(e) => setStore({...store, description: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="وصف مختصر عن المتجر وما يقدمه"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">العنوان</label>
                        <textarea
                          value={store.address || ''}
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
                            checked={store.allowGuestCheckout || false}
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
                            checked={store.maintenanceMode || false}
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
              <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">إدارة طرق الدفع</h2>
                      <p className="text-blue-100">إدارة وتكوين طرق الدفع المتاحة في متجرك</p>
                    </div>
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="text-center">
                        <div className="text-2xl font-bold">{paymentMethods.length}</div>
                        <div className="text-sm text-blue-100">طريقة دفع</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{paymentMethods.filter(m => m.isEnabled).length}</div>
                        <div className="text-sm text-blue-100">مُفعّلة</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Methods Grid */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">طرق الدفع المتاحة</h3>
                    <button
                      onClick={() => {
                        setEditingPaymentMethod(null);
                        setShowPaymentMethodModal(true);
                      }}
                      className="btn-primary flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-lg text-sm font-medium"
                    >
                      <Plus size={16} className="ml-2" />
                      إضافة طريقة دفع
                    </button>
                  </div>

                  {/* Loading State */}
                  {paymentMethodsLoading && paymentMethods.length === 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <PaymentMethodSkeleton key={index} />
                      ))}
                    </div>
                  )}

                  {/* Error State */}
                  {paymentMethodsError && (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">خطأ في تحميل طرق الدفع</h3>
                      <p className="text-gray-600 mb-4">{paymentMethodsError}</p>
                      <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        إعادة المحاولة
                      </button>
                    </div>
                  )}

                  {/* Payment Methods Grid */}
                  {!paymentMethodsLoading && !paymentMethodsError && (
                    <>
                      {paymentMethods.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {paymentMethods.map((method) => (
                            <PaymentMethodCard
                              key={method.id}
                              method={method}
                              onEdit={(method) => {
                                setEditingPaymentMethod(method);
                                setShowPaymentMethodModal(true);
                              }}
                              onDelete={(id) => {
                                setDeletingPaymentMethodId(id);
                                setShowDeletePaymentConfirm(true);
                              }}
                              onToggle={handleTogglePaymentMethod}
                              isLoading={paymentMethodActionLoading === method.id}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طرق دفع</h3>
                          <p className="text-gray-600 mb-6">ابدأ بإضافة طرق الدفع التي تريد توفيرها لعملائك</p>
                          <button
                            onClick={() => {
                              setEditingPaymentMethod(null);
                              setShowPaymentMethodModal(true);
                            }}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            إضافة طريقة دفع
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Bank Settings Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">إعدادات الحساب البنكي</h3>
                        <p className="text-sm text-gray-600">معلومات الحساب البنكي للتحويلات المباشرة</p>
                      </div>
                    </div>
                    <button
                      onClick={handleInitializeBankSettings}
                      disabled={loadingBankSettings}
                      className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      تهيئة الإعدادات
                    </button>
                  </div>

                  {loadingBankSettings ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Bank Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسم البنك <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={bankSettings.bank_name}
                            onChange={(e) => setBankSettings({ ...bankSettings, bank_name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="مثال: البنك الأهلي المغربي"
                          />
                        </div>

                        {/* Account Holder */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            اسم صاحب الحساب <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={bankSettings.bank_account_holder}
                            onChange={(e) => setBankSettings({ ...bankSettings, bank_account_holder: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="مثال: شركة التقنية الحديثة"
                          />
                        </div>
                      </div>

                      {/* Account Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          رقم الحساب البنكي <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={bankSettings.bank_account_number}
                          onChange={(e) => setBankSettings({ ...bankSettings, bank_account_number: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
                          placeholder="مثال: 1234567890123456"
                          dir="ltr"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          سيتم عرض هذا الرقم في الفواتير للعملاء الذين يختارون التحويل البنكي
                        </p>
                      </div>

                      {/* Preview */}
                      {(bankSettings.bank_name || bankSettings.bank_account_number || bankSettings.bank_account_holder) && (
                        <div className="bg-gradient-to-br from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Info className="w-4 h-4 text-blue-600" />
                            معاينة المعلومات البنكية
                          </h4>
                          <div className="space-y-2 text-sm">
                            {bankSettings.bank_name && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">اسم البنك:</span>
                                <span className="font-semibold text-gray-900">{bankSettings.bank_name}</span>
                              </div>
                            )}
                            {bankSettings.bank_account_holder && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">صاحب الحساب:</span>
                                <span className="font-semibold text-gray-900">{bankSettings.bank_account_holder}</span>
                              </div>
                            )}
                            {bankSettings.bank_account_number && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">رقم الحساب:</span>
                                <span className="font-mono font-semibold text-gray-900 text-base" dir="ltr">{bankSettings.bank_account_number}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Save Button */}
                      {JSON.stringify(bankSettings) !== JSON.stringify(savedBankSettings) && (
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                          <button
                            onClick={() => setBankSettings(savedBankSettings)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            إلغاء
                          </button>
                          <button
                            onClick={handleSaveBankSettings}
                            disabled={loadingBankSettings}
                            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {loadingBankSettings ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                جاري الحفظ...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                حفظ إعدادات البنك
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">إجمالي طرق الدفع</p>
                        <p className="text-2xl font-bold text-gray-900">{paymentMethods.length}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">طرق مُفعّلة</p>
                        <p className="text-2xl font-bold text-green-600">{paymentMethods.filter(m => m.isEnabled).length}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">طرق مُعطّلة</p>
                        <p className="text-2xl font-bold text-red-600">{paymentMethods.filter(m => !m.isEnabled).length}</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <X className="w-6 h-6 text-red-600" />
                      </div>
                    </div>
                  </div>

                  <div className="stats-card bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">طرق مخصصة</p>
                        <p className="text-2xl font-bold text-purple-600">{paymentMethods.filter(m => !m.isBuiltIn).length}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Plus className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips and Best Practices */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">نصائح وأفضل الممارسات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                        <Shield className="w-5 h-5 ml-2" />
                        الأمان
                      </h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• تأكد من صحة مفاتيح الدفع قبل التفعيل</li>
                        <li>• استخدم بيئة الاختبار قبل التشغيل الفعلي</li>
                        <li>• فعّل SSL للحماية الإضافية</li>
                        <li>• راجع إعدادات الأمان بانتظام</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-green-900 mb-2 flex items-center">
                        <CheckCircle className="w-5 h-5 ml-2" />
                        التحسين
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• وفّر خيارات دفع متنوعة للعملاء</li>
                        <li>• راجع رسوم المعاملات لكل طريقة</li>
                        <li>• اختبر تجربة الدفع بانتظام</li>
                        <li>• راقب معدلات نجاح المعاملات</li>
                      </ul>
                    </div>
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
        onSave={editingPaymentMethod ? handleUpdatePaymentMethod : handleAddPaymentMethod}
        editingMethod={editingPaymentMethod}
        isLoading={paymentMethodsLoading}
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
        onConfirm={handleDeletePaymentMethod}
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