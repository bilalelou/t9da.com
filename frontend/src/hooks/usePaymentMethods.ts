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

// يمكن إضافة hooks أخرى هنا مستقبلاً