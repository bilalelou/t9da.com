import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Banknote, Loader2, AlertCircle } from 'lucide-react';
import { useEnabledPaymentMethods } from '@/hooks/useEnabledPaymentMethods';
import { PaymentMethod } from '@/hooks/usePaymentMethods';

interface CheckoutPaymentMethodsProps {
  selectedMethod: string | null;
  onMethodSelect: (methodId: string) => void;
  orderTotal: number;
  currency?: string;
}

const CheckoutPaymentMethods: React.FC<CheckoutPaymentMethodsProps> = ({
  selectedMethod,
  onMethodSelect,
  orderTotal,
  currency = 'MAD'
}) => {
  const { enabledPaymentMethods, loading, error } = useEnabledPaymentMethods();
  
  console.log('💳 CheckoutPaymentMethods - enabledPaymentMethods:', enabledPaymentMethods);
  console.log('💳 CheckoutPaymentMethods - loading:', loading);
  console.log('💳 CheckoutPaymentMethods - error:', error);

  const getMethodIcon = (method: PaymentMethod) => {
    if (method.icon) return method.icon;
    
    switch (method.type) {
      case 'gateway':
        return <CreditCard className="w-6 h-6" />;
      case 'digital_wallet':
        return <Smartphone className="w-6 h-6" />;
      case 'bank_transfer':
        return <Building className="w-6 h-6" />;
      case 'cash':
        return <Banknote className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const calculateFees = (method: PaymentMethod) => {
    const percentageFee = (orderTotal * method.fees.percentage) / 100;
    const totalFees = percentageFee + method.fees.fixed;
    return totalFees;
  };

  const isMethodAvailable = (method: PaymentMethod) => {
    // التحقق من حدود المبلغ
    if (method.minAmount && orderTotal < method.minAmount) return false;
    if (method.maxAmount && orderTotal > method.maxAmount) return false;
    
    // التحقق من العملة المدعومة
    if (!method.supportedCurrencies.includes(currency)) return false;
    
    return true;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">طرق الدفع</h3>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin ml-2" />
          <span className="text-gray-600">جاري تحميل طرق الدفع...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">طرق الدفع</h3>
        <div className="flex items-center justify-center py-8 text-red-600">
          <AlertCircle className="w-6 h-6 ml-2" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const availableMethods = enabledPaymentMethods.filter(isMethodAvailable);
  console.log('✅ Available methods after filtering:', availableMethods);

  if (availableMethods.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">طرق الدفع</h3>
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">لا توجد طرق دفع متاحة لهذا الطلب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        طرق الدفع ({availableMethods.length})
      </h3>
      
      <div className="space-y-3">
        {availableMethods.map((method) => {
          const fees = calculateFees(method);
          const totalWithFees = orderTotal + fees;
          
          return (
            <div
              key={method.id}
              className={`relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onMethodSelect(method.id)}
            >
              <div className="flex items-start space-x-3 space-x-reverse">
                {/* Radio Button */}
                <div className="flex items-center h-6">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={() => onMethodSelect(method.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                </div>

                {/* Method Icon */}
                <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                  {getMethodIcon(method)}
                </div>

                {/* Method Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-base font-medium text-gray-900">{method.name}</h4>
                    {fees > 0 && (
                      <span className="text-sm text-gray-600">
                        +{fees.toFixed(2)} {currency}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{method.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>وقت المعالجة: {method.processingTime}</span>
                    {fees > 0 && (
                      <span>المجموع: {totalWithFees.toFixed(2)} {currency}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Selected Indicator */}
              {selectedMethod === method.id && (
                <div className="absolute top-2 left-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment Summary */}
      {selectedMethod && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">المجموع الفرعي:</span>
            <span className="font-medium">{orderTotal.toFixed(2)} {currency}</span>
          </div>
          
          {(() => {
            const selectedMethodData = availableMethods.find(m => m.id === selectedMethod);
            if (!selectedMethodData) return null;
            
            const fees = calculateFees(selectedMethodData);
            if (fees > 0) {
              return (
                <>
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-gray-600">رسوم الدفع:</span>
                    <span className="font-medium">{fees.toFixed(2)} {currency}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center font-semibold">
                    <span>المجموع الإجمالي:</span>
                    <span>{(orderTotal + fees).toFixed(2)} {currency}</span>
                  </div>
                </>
              );
            }
            
            return (
              <div className="flex justify-between items-center font-semibold mt-2">
                <span>المجموع الإجمالي:</span>
                <span>{orderTotal.toFixed(2)} {currency}</span>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default CheckoutPaymentMethods;