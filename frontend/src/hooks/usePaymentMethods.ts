import { useState, useEffect } from 'react';

export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  type: 'gateway' | 'digital_wallet' | 'bank_transfer' | 'cash';
  icon?: string;
  fees: {
    percentage: number;
    fixed: number;
  };
  minAmount?: number;
  maxAmount?: number;
  supportedCurrencies: string[];
  processingTime: string;
  isEnabled: boolean;
}

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock data for now - replace with actual API call
    const mockPaymentMethods: PaymentMethod[] = [
      {
        id: '1',
        name: 'الدفع عند الاستلام',
        description: 'ادفع نقداً عند استلام الطلب',
        type: 'cash',
        fees: { percentage: 0, fixed: 0 },
        supportedCurrencies: ['MAD'],
        processingTime: 'فوري',
        isEnabled: true
      },
      {
        id: '2', 
        name: 'تحويل بنكي',
        description: 'تحويل مباشر إلى الحساب البنكي',
        type: 'bank_transfer',
        fees: { percentage: 0, fixed: 5 },
        supportedCurrencies: ['MAD'],
        processingTime: '1-3 أيام عمل',
        isEnabled: true
      }
    ];

    setTimeout(() => {
      setPaymentMethods(mockPaymentMethods);
      setLoading(false);
    }, 1000);
  }, []);

  const addPaymentMethod = (method: Omit<PaymentMethod, 'id'>) => {
    const newMethod = {
      ...method,
      id: Date.now().toString()
    };
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id ? { ...method, ...updates } : method
      )
    );
  };

  const deletePaymentMethod = (id: string) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };

  return {
    paymentMethods,
    loading,
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  };
};