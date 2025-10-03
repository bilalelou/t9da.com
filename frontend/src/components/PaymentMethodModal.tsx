import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, Building, Banknote, Bitcoin, Eye, EyeOff } from 'lucide-react';
import { PaymentMethod } from '@/hooks/usePaymentMethods';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (method: Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>) => Promise<{ success: boolean; message?: string }>;
  editingMethod?: PaymentMethod | null;
  isLoading?: boolean;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingMethod,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    type: 'gateway',
    isEnabled: true,
    isBuiltIn: false,
    config: {},
    fees: { percentage: 0, fixed: 0 },
    supportedCurrencies: ['SAR'],
    processingTime: 'فوري'
  });

  const [showSecrets, setShowSecrets] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (editingMethod) {
        setFormData({
          name: editingMethod.name,
          description: editingMethod.description,
          type: editingMethod.type,
          isEnabled: editingMethod.isEnabled,
          isBuiltIn: editingMethod.isBuiltIn,
          icon: editingMethod.icon,
          config: editingMethod.config,
          fees: editingMethod.fees,
          supportedCurrencies: editingMethod.supportedCurrencies,
          minAmount: editingMethod.minAmount,
          maxAmount: editingMethod.maxAmount,
          processingTime: editingMethod.processingTime || 'فوري'
        });
      } else {
        setFormData({
          name: '',
          description: '',
          type: 'gateway',
          isEnabled: true,
          isBuiltIn: false,
          config: {},
          fees: { percentage: 0, fixed: 0 },
          supportedCurrencies: ['SAR'],
          processingTime: 'فوري'
        });
      }
      setErrors({});
    }
  }, [isOpen, editingMethod]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'اسم طريقة الدفع مطلوب';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'وصف طريقة الدفع مطلوب';
    }

    if (formData.fees.percentage < 0 || formData.fees.percentage > 100) {
      newErrors.percentage = 'النسبة المئوية يجب أن تكون بين 0 و 100';
    }

    if (formData.fees.fixed < 0) {
      newErrors.fixed = 'الرسوم الثابتة لا يمكن أن تكون سالبة';
    }

    if (formData.minAmount && formData.maxAmount && formData.minAmount >= formData.maxAmount) {
      newErrors.maxAmount = 'الحد الأقصى يجب أن يكون أكبر من الحد الأدنى';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await onSave(formData);
      if (result.success) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving payment method:', error);
    }
  };

  const getTypeIcon = (type: PaymentMethod['type']) => {
    switch (type) {
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

  const currencyOptions = [
    { value: 'SAR', label: 'ريال سعودي (SAR)' },
    { value: 'USD', label: 'دولار أمريكي (USD)' },
    { value: 'EUR', label: 'يورو (EUR)' },
    { value: 'AED', label: 'درهم إماراتي (AED)' },
    { value: 'KWD', label: 'دينار كويتي (KWD)' },
    { value: 'BHD', label: 'دينار بحريني (BHD)' },
    { value: 'QAR', label: 'ريال قطري (QAR)' },
    { value: 'OMR', label: 'ريال عماني (OMR)' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {editingMethod ? 'تعديل طريقة الدفع' : 'إضافة طريقة دفع جديدة'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    اسم طريقة الدفع *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="مثال: Apple Pay"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع طريقة الدفع *
                  </label>
                  <div className="relative">
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as PaymentMethod['type'] })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="gateway">بوابة دفع</option>
                      <option value="digital_wallet">محفظة رقمية</option>
                      <option value="bank_transfer">تحويل بنكي</option>
                      <option value="cash">نقدي</option>
                      <option value="crypto">عملة رقمية</option>
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      {getTypeIcon(formData.type)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الوصف *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="وصف مختصر لطريقة الدفع"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الأيقونة (اختياري)
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="🍎 أو رابط صورة"
                />
              </div>

              {/* Fees */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">الرسوم والعمولات</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      النسبة المئوية (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.fees.percentage}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, percentage: parseFloat(e.target.value) || 0 }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.percentage ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.percentage && <p className="mt-1 text-sm text-red-600">{errors.percentage}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرسوم الثابتة (ر.س)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.fees.fixed}
                      onChange={(e) => setFormData({
                        ...formData,
                        fees: { ...formData.fees, fixed: parseFloat(e.target.value) || 0 }
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.fixed ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.fixed && <p className="mt-1 text-sm text-red-600">{errors.fixed}</p>}
                  </div>
                </div>
              </div>

              {/* Amount Limits */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">حدود المبالغ</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأدنى (ر.س)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minAmount || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        minAmount: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="اختياري"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأقصى (ر.س)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maxAmount || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        maxAmount: e.target.value ? parseFloat(e.target.value) : undefined
                      })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.maxAmount ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="اختياري"
                    />
                    {errors.maxAmount && <p className="mt-1 text-sm text-red-600">{errors.maxAmount}</p>}
                  </div>
                </div>
              </div>

              {/* Processing Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  وقت المعالجة
                </label>
                <select
                  value={formData.processingTime}
                  onChange={(e) => setFormData({ ...formData, processingTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="فوري">فوري</option>
                  <option value="1-3 دقائق">1-3 دقائق</option>
                  <option value="5-10 دقائق">5-10 دقائق</option>
                  <option value="1-24 ساعة">1-24 ساعة</option>
                  <option value="1-3 أيام عمل">1-3 أيام عمل</option>
                  <option value="3-7 أيام عمل">3-7 أيام عمل</option>
                </select>
              </div>

              {/* Supported Currencies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  العملات المدعومة
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {currencyOptions.map((currency) => (
                    <label key={currency.value} className="flex items-center space-x-2 space-x-reverse">
                      <input
                        type="checkbox"
                        checked={formData.supportedCurrencies.includes(currency.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              supportedCurrencies: [...formData.supportedCurrencies, currency.value]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              supportedCurrencies: formData.supportedCurrencies.filter(c => c !== currency.value)
                            });
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{currency.value}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900">إعدادات الاتصال</h4>
                  <button
                    type="button"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="flex items-center space-x-1 space-x-reverse text-sm text-blue-600 hover:text-blue-700"
                  >
                    {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showSecrets ? 'إخفاء' : 'إظهار'} المفاتيح</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key (اختياري)
                    </label>
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      value={formData.config.apiKey || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, apiKey: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مفتاح API"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secret Key (اختياري)
                    </label>
                    <input
                      type={showSecrets ? 'text' : 'password'}
                      value={formData.config.secretKey || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, secretKey: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="المفتاح السري"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Merchant ID (اختياري)
                    </label>
                    <input
                      type="text"
                      value={formData.config.merchantId || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, merchantId: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="معرف التاجر"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Webhook URL (اختياري)
                    </label>
                    <input
                      type="url"
                      value={formData.config.webhookUrl || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        config: { ...formData.config, webhookUrl: e.target.value }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com/webhook"
                    />
                  </div>
                </div>
              </div>

              {/* Enable Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">تفعيل طريقة الدفع</h4>
                  <p className="text-sm text-gray-600">جعل طريقة الدفع متاحة للعملاء</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 space-x-reverse mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse disabled:opacity-50"
              >
                {isLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                <span>{editingMethod ? 'تحديث' : 'إضافة'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;