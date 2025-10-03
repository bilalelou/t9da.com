import { useState, useEffect } from 'react';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  type: 'gateway' | 'digital_wallet' | 'bank_transfer' | 'cash' | 'crypto';
  isEnabled: boolean;
  isBuiltIn: boolean;
  icon?: string;
  config: {
    apiKey?: string;
    secretKey?: string;
    webhookUrl?: string;
    merchantId?: string;
  };
  fees: {
    percentage: number;
    fixed: number;
  };
  supportedCurrencies: string[];
  minAmount?: number;
  maxAmount?: number;
  processingTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface UsePaymentMethodsReturn {
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
  fetchPaymentMethods: () => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; message?: string; data?: PaymentMethod }>;
  updatePaymentMethod: (id: string, method: Partial<PaymentMethod>) => Promise<{ success: boolean; message?: string; data?: PaymentMethod }>;
  deletePaymentMethod: (id: string) => Promise<{ success: boolean; message?: string }>;
  togglePaymentMethod: (id: string) => Promise<{ success: boolean; message?: string }>;
}

export const usePaymentMethods = (): UsePaymentMethodsReturn => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // محاكاة البيانات الأولية
  const initialPaymentMethods: PaymentMethod[] = [
    {
      id: 'credit_card',
      name: 'البطاقات الائتمانية',
      description: 'Visa, MasterCard, American Express',
      type: 'gateway',
      isEnabled: true,
      isBuiltIn: true,
      icon: '💳',
      config: {
        apiKey: 'pk_test_...',
        secretKey: 'sk_test_...'
      },
      fees: { percentage: 2.9, fixed: 0 },
      supportedCurrencies: ['SAR', 'USD', 'EUR', 'MAD'],
      minAmount: 10,
      maxAmount: 50000,
      processingTime: 'فوري',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'stc_pay',
      name: 'STC Pay',
      description: 'الدفع عبر محفظة STC Pay الرقمية',
      type: 'digital_wallet',
      isEnabled: true,
      isBuiltIn: false,
      icon: '📱',
      config: {
        merchantId: 'STC_MERCHANT_123'
      },
      fees: { percentage: 2.5, fixed: 0 },
      supportedCurrencies: ['SAR', 'MAD'],
      minAmount: 5,
      maxAmount: 10000,
      processingTime: 'فوري',
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: 'mada',
      name: 'مدى',
      description: 'الدفع عبر بطاقات مدى السعودية',
      type: 'gateway',
      isEnabled: true,
      isBuiltIn: false,
      icon: '🏦',
      config: {
        apiKey: 'mada_api_key',
        secretKey: 'mada_secret'
      },
      fees: { percentage: 1.75, fixed: 0 },
      supportedCurrencies: ['SAR', 'MAD'],
      minAmount: 1,
      maxAmount: 30000,
      processingTime: 'فوري',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-10T00:00:00Z'
    },
    {
      id: 'bank_transfer',
      name: 'التحويل البنكي',
      description: 'الدفع عبر التحويل البنكي المباشر',
      type: 'bank_transfer',
      isEnabled: true,
      isBuiltIn: true,
      icon: '🏛️',
      config: {},
      fees: { percentage: 0, fixed: 5 },
      supportedCurrencies: ['SAR', 'USD', 'MAD'],
      minAmount: 50,
      processingTime: '1-3 أيام عمل',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'cash_on_delivery',
      name: 'الدفع عند الاستلام',
      description: 'الدفع النقدي عند توصيل الطلب',
      type: 'cash',
      isEnabled: true,
      isBuiltIn: true,
      icon: '💵',
      config: {},
      fees: { percentage: 0, fixed: 10 },
      supportedCurrencies: ['SAR', 'MAD'],
      maxAmount: 5000,
      processingTime: 'عند التوصيل',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  const fetchPaymentMethods = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('💾 Setting initial payment methods:', initialPaymentMethods);
      
      // في التطبيق الحقيقي، ستكون هذه استدعاء API
      // const response = await fetch('/api/payment-methods');
      // const data = await response.json();
      
      setPaymentMethods(initialPaymentMethods);
      console.log('✅ Payment methods set successfully');
    } catch (err) {
      setError('فشل في تحميل طرق الدفع');
      console.error('Error fetching payment methods:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPaymentMethod = async (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newMethod: PaymentMethod = {
        ...method,
        id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setPaymentMethods(prev => [...prev, newMethod]);
      
      return { success: true, data: newMethod };
    } catch (err) {
      return { success: false, message: 'فشل في إضافة طريقة الدفع' };
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    try {
      setLoading(true);
      
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(prev => prev.map(method => 
        method.id === id 
          ? { ...method, ...updates, updatedAt: new Date().toISOString() }
          : method
      ));
      
      const updatedMethod = paymentMethods.find(m => m.id === id);
      return { success: true, data: updatedMethod };
    } catch (err) {
      return { success: false, message: 'فشل في تحديث طريقة الدفع' };
    } finally {
      setLoading(false);
    }
  };

  const deletePaymentMethod = async (id: string) => {
    try {
      setLoading(true);
      
      // محاكاة استدعاء API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      
      return { success: true };
    } catch (err) {
      return { success: false, message: 'فشل في حذف طريقة الدفع' };
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethod = async (id: string) => {
    try {
      const method = paymentMethods.find(m => m.id === id);
      if (!method) return { success: false, message: 'طريقة الدفع غير موجودة' };
      
      return await updatePaymentMethod(id, { isEnabled: !method.isEnabled });
    } catch (err) {
      return { success: false, message: 'فشل في تغيير حالة طريقة الدفع' };
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  console.log('📊 usePaymentMethods result:', { paymentMethods: paymentMethods.length, loading, error });
  
  return {
    paymentMethods,
    loading,
    error,
    fetchPaymentMethods,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    togglePaymentMethod
  };
};