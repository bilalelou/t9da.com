'use client';

import React, { useState } from 'react';

// Define interfaces
interface Report {
  id: string;
  name: string;
  description: string;
  type: 'sales' | 'inventory' | 'customers' | 'financial';
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
  size: string;
  format: 'pdf' | 'excel' | 'csv';
}

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  popular: boolean;
}

// Sample data
const reports: Report[] = [
  {
    id: '1',
    name: 'تقرير المبيعات الشهري',
    description: 'تقرير شامل للمبيعات والإيرادات الشهرية',
    type: 'sales',
    frequency: 'monthly',
    lastGenerated: '2024-01-15T10:30:00',
    status: 'ready',
    size: '2.4 MB',
    format: 'pdf'
  },
  {
    id: '2',
    name: 'تقرير المخزون الأسبوعي',
    description: 'حالة المخزون ومستويات التجديد',
    type: 'inventory',
    frequency: 'weekly',
    lastGenerated: '2024-01-14T14:20:00',
    status: 'ready',
    size: '1.8 MB',
    format: 'excel'
  },
  {
    id: '3',
    name: 'تقرير العملاء الجدد',
    description: 'إحصائيات العملاء الجدد وسلوكهم',
    type: 'customers',
    frequency: 'weekly',
    lastGenerated: '2024-01-13T09:15:00',
    status: 'generating',
    size: '-',
    format: 'pdf'
  },
  {
    id: '4',
    name: 'التقرير المالي السنوي',
    description: 'تقرير مالي شامل للأرباح والخسائر',
    type: 'financial',
    frequency: 'yearly',
    lastGenerated: '2024-01-01T00:00:00',
    status: 'ready',
    size: '5.2 MB',
    format: 'pdf'
  },
  {
    id: '5',
    name: 'تقرير المنتجات الأكثر مبيعاً',
    description: 'أفضل المنتجات أداءً في المبيعات',
    type: 'sales',
    frequency: 'monthly',
    lastGenerated: '2024-01-12T16:00:00',
    status: 'error',
    size: '-',
    format: 'excel'
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'تقرير المبيعات اليومي',
    description: 'ملخص المبيعات والطلبات اليومية',
    category: 'المبيعات',
    icon: '📊',
    popular: true
  },
  {
    id: '2',
    name: 'تحليل سلوك العملاء',
    description: 'تحليل مفصل لسلوك وتفضيلات العملاء',
    category: 'العملاء',
    icon: '👥',
    popular: true
  },
  {
    id: '3',
    name: 'تقرير حركة المخزون',
    description: 'تتبع حركة المخزون والمنتجات',
    category: 'المخزون',
    icon: '📦',
    popular: false
  },
  {
    id: '4',
    name: 'تقرير الأرباح والخسائر',
    description: 'تحليل مالي للأرباح والمصروفات',
    category: 'المالية',
    icon: '💰',
    popular: true
  },
  {
    id: '5',
    name: 'تقرير أداء المنتجات',
    description: 'تحليل أداء المنتجات والفئات',
    category: 'المنتجات',
    icon: '🏷️',
    popular: false
  },
  {
    id: '6',
    name: 'تقرير التسويق والحملات',
    description: 'فعالية الحملات التسويقية والعروض',
    category: 'التسويق',
    icon: '📈',
    popular: false
  }
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'inventory':
        return 'bg-blue-100 text-blue-800';
      case 'customers':
        return 'bg-purple-100 text-purple-800';
      case 'financial':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeText = (type: Report['type']) => {
    switch (type) {
      case 'sales':
        return 'المبيعات';
      case 'inventory':
        return 'المخزون';
      case 'customers':
        return 'العملاء';
      case 'financial':
        return 'المالية';
      default:
        return type;
    }
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'ready':
        return 'جاهز';
      case 'generating':
        return 'قيد الإنشاء';
      case 'error':
        return 'خطأ';
      default:
        return status;
    }
  };

  const getFrequencyText = (frequency: Report['frequency']) => {
    switch (frequency) {
      case 'daily':
        return 'يومي';
      case 'weekly':
        return 'أسبوعي';
      case 'monthly':
        return 'شهري';
      case 'yearly':
        return 'سنوي';
      default:
        return frequency;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesType && matchesStatus;
  });

  const downloadReport = (reportId: string) => {
    console.log('Download report:', reportId);
  };

  const regenerateReport = (reportId: string) => {
    console.log('Regenerate report:', reportId);
  };

  const deleteReport = (reportId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا التقرير؟')) {
      console.log('Delete report:', reportId);
    }
  };

  const createReport = (templateId: string) => {
    console.log('Create report from template:', templateId);
    setShowCreateModal(false);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">التقارير</h1>
              <p className="text-sm text-gray-600">إنشاء وإدارة التقارير المختلفة</p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 space-x-reverse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>جدولة التقارير</span>
              </button>
              
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>إنشاء تقرير جديد</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">إجمالي التقارير</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">التقارير الجاهزة</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'ready').length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">قيد الإنشاء</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'generating').length}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">أخطاء</p>
                <p className="text-2xl font-bold text-gray-900">{reports.filter(r => r.status === 'error').length}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الأنواع</option>
                <option value="sales">المبيعات</option>
                <option value="inventory">المخزون</option>
                <option value="customers">العملاء</option>
                <option value="financial">المالية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">جميع الحالات</option>
                <option value="ready">جاهز</option>
                <option value="generating">قيد الإنشاء</option>
                <option value="error">خطأ</option>
              </select>
            </div>

            <div className="flex items-end">
              <button className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">التقارير المحفوظة</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredReports.map((report) => (
              <div key={report.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 space-x-reverse mb-2">
                      <h4 className="text-lg font-medium text-gray-900">{report.name}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {getTypeText(report.type)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusText(report.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    <div className="flex items-center space-x-6 space-x-reverse text-sm text-gray-500">
                      <span>التكرار: {getFrequencyText(report.frequency)}</span>
                      <span>آخر إنشاء: {formatDate(report.lastGenerated)}</span>
                      <span>الحجم: {report.size}</span>
                      <span>النوع: {report.format.toUpperCase()}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 space-x-reverse">
                    {report.status === 'ready' && (
                      <button
                        onClick={() => downloadReport(report.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>تحميل</span>
                      </button>
                    )}

                    {report.status === 'generating' && (
                      <div className="flex items-center space-x-2 space-x-reverse text-yellow-600">
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm">جاري الإنشاء...</span>
                      </div>
                    )}

                    <button
                      onClick={() => regenerateReport(report.id)}
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      إعادة إنشاء
                    </button>

                    <button
                      onClick={() => deleteReport(report.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
