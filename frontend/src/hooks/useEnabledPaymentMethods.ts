import { useState, useEffect } from 'react';
import { PaymentMethod, usePaymentMethods } from './usePaymentMethods';

interface UseEnabledPaymentMethodsReturn {
  enabledPaymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
}

export const useEnabledPaymentMethods = (): UseEnabledPaymentMethodsReturn => {
  const { paymentMethods, loading, error } = usePaymentMethods();
  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    console.log('🔍 All payment methods:', paymentMethods);
    // تصفية طرق الدفع المُفعّلة فقط
    const enabled = paymentMethods.filter(method => method.isEnabled);
    console.log('✅ Enabled payment methods:', enabled);
    setEnabledPaymentMethods(enabled);
  }, [paymentMethods]);

  console.log('📊 Hook result:', { enabledPaymentMethods, loading, error });
  
  return {
    enabledPaymentMethods,
    loading,
    error
  };
};