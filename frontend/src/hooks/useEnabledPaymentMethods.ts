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

export const useEnabledPaymentMethods = () => {
  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        setError(null);

        // بيانات وهمية لطرق الدفع (يمكن استبدالها بـ API call)
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: 'cod',
            name: 'الدفع عند الاستلام',
            description: 'ادفع نقداً عند استلام طلبك',
            type: 'cash',
            fees: { percentage: 0, fixed: 0 },
            supportedCurrencies: ['MAD'],
            processingTime: 'فوري',
            isEnabled: true
          },
          {
            id: 'bank_transfer',
            name: 'تحويل بنكي',
            description: 'تحويل مباشر إلى الحساب البنكي',
            type: 'bank_transfer',
            fees: { percentage: 0, fixed: 10 },
            supportedCurrencies: ['MAD'],
            processingTime: '1-2 أيام عمل',
            isEnabled: true
          },
          {
            id: 'credit_card',
            name: 'بطاقة ائتمان',
            description: 'ادفع بأمان باستخدام بطاقتك الائتمانية',
            type: 'gateway',
            fees: { percentage: 2.5, fixed: 5 },
            supportedCurrencies: ['MAD', 'USD', 'EUR'],
            processingTime: 'فوري',
            isEnabled: true
          }
        ];

        // محاكاة تأخير API
        await new Promise(resolve => setTimeout(resolve, 500));

        setEnabledPaymentMethods(mockPaymentMethods.filter(method => method.isEnabled));
      } catch (err) {
        setError('فشل في تحميل طرق الدفع');
        console.error('Error fetching payment methods:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  return { enabledPaymentMethods, loading, error };
};