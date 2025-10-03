import React, { useState } from 'react';
import { Edit, Trash2, MoreVertical, Clock, CreditCard, Smartphone, Building, Banknote, Bitcoin } from 'lucide-react';
import { PaymentMethod } from '@/hooks/usePaymentMethods';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onEdit: (method: PaymentMethod) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  isLoading?: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  onEdit,
  onDelete,
  onToggle,
  isLoading = false
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getTypeIcon = () => {
    switch (method.type) {
      case 'gateway':
        return <CreditCard className="w-5 h-5" />;
      case 'digital_wallet':
        return <Smartphone className="w-5 h-5" />;
      case 'bank_transfer':
        return <Building className="w-5 h-5" />;
      case 'cash':
        return <Banknote className="w-5 h-5" />;
      case 'crypto':
        return <Bitcoin className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getTypeLabel = () => {
    switch (method.type) {
      case 'gateway':
        return 'بوابة دفع';
      case 'digital_wallet':
        return 'محفظة رقمية';
      case 'bank_transfer':
        return 'تحويل بنكي';
      case 'cash':
        return 'نقدي';
      case 'crypto':
        return 'عملة رقمية';
      default:
        return 'غير محدد';
    }
  };

  const getTypeColor = () => {
    switch (method.type) {
      case 'gateway':
        return 'bg-blue-100 text-blue-800';
      case 'digital_wallet':
        return 'bg-purple-100 text-purple-800';
      case 'bank_transfer':
        return 'bg-green-100 text-green-800';
      case 'cash':
        return 'bg-yellow-100 text-yellow-800';
      case 'crypto':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFees = () => {
    const { percentage, fixed } = method.fees;
    if (percentage === 0 && fixed === 0) return 'مجاني';
    
    const parts = [];
    if (percentage > 0) parts.push(`${percentage}%`);
    if (fixed > 0) parts.push(`${fixed} ر.س`);
    
    return parts.join(' + ');
  };

  return (
    <div className={`payment-method-card relative bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-300 ${
      method.isEnabled ? 'opacity-100' : 'opacity-60'
    } ${isLoading ? 'pointer-events-none' : ''}`}>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="payment-method-icon w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl transition-transform duration-300">
            {method.icon || getTypeIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{method.name}</h3>
            <p className="text-sm text-gray-600">{method.description}</p>
          </div>
        </div>

        {/* Menu Button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
              <button
                onClick={() => {
                  onEdit(method);
                  setShowMenu(false);
                }}
                className="w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 space-x-reverse"
              >
                <Edit className="w-4 h-4" />
                <span>تعديل</span>
              </button>
              
              {!method.isBuiltIn && (
                <button
                  onClick={() => {
                    onDelete(method.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 space-x-reverse"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>حذف</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status and Type */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className={`status-indicator inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor()} ${method.isEnabled ? 'enabled' : ''}`}>
            {getTypeIcon()}
            <span className="mr-1">{getTypeLabel()}</span>
          </span>
          
          {method.isBuiltIn && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              مدمج
            </span>
          )}
        </div>

        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={method.isEnabled}
            onChange={() => onToggle(method.id)}
            className="sr-only peer"
            disabled={isLoading}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Details */}
      <div className="space-y-3">
        {/* Fees */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">الرسوم:</span>
          <span className="font-medium text-gray-900">{formatFees()}</span>
        </div>

        {/* Processing Time */}
        {method.processingTime && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center space-x-1 space-x-reverse">
              <Clock className="w-4 h-4" />
              <span>وقت المعالجة:</span>
            </span>
            <span className="font-medium text-gray-900">{method.processingTime}</span>
          </div>
        )}

        {/* Amount Limits */}
        {(method.minAmount || method.maxAmount) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">حدود المبلغ:</span>
            <span className="font-medium text-gray-900">
              {method.minAmount && `من ${method.minAmount}`}
              {method.minAmount && method.maxAmount && ' - '}
              {method.maxAmount && `إلى ${method.maxAmount}`}
              {' ر.س'}
            </span>
          </div>
        )}

        {/* Supported Currencies */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">العملات المدعومة:</span>
          <div className="flex space-x-1 space-x-reverse">
            {method.supportedCurrencies.slice(0, 3).map((currency) => (
              <span
                key={currency}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {currency}
              </span>
            ))}
            {method.supportedCurrencies.length > 3 && (
              <span className="text-xs text-gray-500">
                +{method.supportedCurrencies.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className={`mt-4 pt-4 border-t border-gray-100 flex items-center justify-between`}>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className={`w-2 h-2 rounded-full ${method.isEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          <span className={`text-sm font-medium ${method.isEnabled ? 'text-green-700' : 'text-gray-500'}`}>
            {method.isEnabled ? 'مُفعّل' : 'غير مُفعّل'}
          </span>
        </div>
        
        <span className="text-xs text-gray-400">
          آخر تحديث: {new Date(method.updatedAt).toLocaleDateString('ar-SA')}
        </span>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default PaymentMethodCard;