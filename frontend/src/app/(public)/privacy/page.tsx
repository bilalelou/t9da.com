'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Define interfaces
interface PrivacySection {
  id: string;
  title: string;
  content: string[];
  icon: React.ReactNode;
}

// Privacy policy data
const privacyData: PrivacySection[] = [
  {
    id: 'introduction',
    title: 'مقدمة',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content: [
      'نحن في متجري نقدر خصوصيتكم ونلتزم بحماية بياناتكم الشخصية.',
      'هذه السياسة توضح كيفية جمعنا واستخدامنا وحماية معلوماتكم الشخصية.',
      'نحن ملتزمون بالامتثال لقوانين حماية البيانات المعمول بها في المملكة العربية السعودية.',
      'باستخدام خدماتنا، فإنكم توافقون على ممارسات جمع واستخدام المعلومات الموضحة في هذه السياسة.',
      'نحتفظ بالحق في تحديث هذه السياسة من وقت لآخر، وسنقوم بإشعاركم بأي تغييرات مهمة.'
    ]
  },
  {
    id: 'data-collection',
    title: 'البيانات التي نجمعها',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    content: [
      'المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان.',
      'معلومات الحساب: اسم المستخدم، كلمة المرور المشفرة، تفضيلات الحساب.',
      'بيانات الطلبات: تاريخ الطلبات، المنتجات المشتراة، طرق الدفع.',
      'المعلومات التقنية: عنوان IP، نوع المتصفح، نظام التشغيل، بيانات الجهاز.',
      'بيانات الاستخدام: صفحات الموقع المزارة، وقت الزيارة، مدة البقاء.',
      'معلومات الموقع: عند تفعيل خدمات الموقع لتحسين خدمة التوصيل.'
    ]
  },
  {
    id: 'data-usage',
    title: 'كيف نستخدم بياناتكم',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    content: [
      'معالجة الطلبات: لتنفيذ طلباتكم وتوصيل المنتجات.',
      'خدمة العملاء: للرد على استفساراتكم وحل المشاكل.',
      'التسويق: لإرسال عروض وإشعارات حول منتجات قد تهمكم (بموافقتكم).',
      'تحسين الخدمة: لتطوير موقعنا وتحسين تجربة المستخدم.',
      'الأمان: لحماية حساباتكم ومنع الاحتيال.',
      'الامتثال القانوني: للوفاء بالالتزامات القانونية والتنظيمية.'
    ]
  },
  {
    id: 'data-sharing',
    title: 'مشاركة البيانات',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
    ),
    content: [
      'شركات الشحن: نشارك عنوان التوصيل ومعلومات الاتصال لتوصيل الطلبات.',
      'معالجات الدفع: معلومات الدفع الضرورية لمعالجة المعاملات المالية.',
      'مقدمو الخدمات: شركات تقدم خدمات تقنية أو تسويقية نيابة عنا.',
      'السلطات القانونية: عند الطلب القانوني أو لحماية حقوقنا.',
      'لا نبيع أو نؤجر بياناتكم الشخصية لأطراف ثالثة لأغراض تجارية.',
      'جميع الشركاء ملزمون بحماية بياناتكم وفقاً لمعايير الأمان العالية.'
    ]
  },
  {
    id: 'data-security',
    title: 'أمان البيانات',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    content: [
      'التشفير: نستخدم تشفير SSL/TLS لحماية البيانات أثناء النقل.',
      'التخزين الآمن: البيانات محفوظة في خوادم آمنة مع ضوابط وصول صارمة.',
      'المراقبة المستمرة: نراقب أنظمتنا باستمرار للكشف عن أي نشاط مشبوه.',
      'التحديثات الأمنية: نحدث أنظمتنا بانتظام لضمان أعلى مستويات الأمان.',
      'تدريب الموظفين: فريقنا مدرب على أفضل ممارسات أمان البيانات.',
      'النسخ الاحتياطية: نحتفظ بنسخ احتياطية آمنة لضمان استمرارية الخدمة.'
    ]
  },
  {
    id: 'cookies',
    title: 'ملفات الارتباط (Cookies)',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    content: [
      'ملفات الارتباط الأساسية: ضرورية لعمل الموقع وتذكر تفضيلاتكم.',
      'ملفات الارتباط التحليلية: لفهم كيفية استخدام الموقع وتحسين الأداء.',
      'ملفات الارتباط التسويقية: لعرض إعلانات مخصصة (بموافقتكم).',
      'يمكنكم إدارة إعدادات ملفات الارتباط من خلال متصفحكم.',
      'رفض ملفات الارتباط قد يؤثر على بعض وظائف الموقع.',
      'نحترم اختياراتكم ونوفر أدوات للتحكم في هذه الملفات.'
    ]
  },
  {
    id: 'user-rights',
    title: 'حقوقكم',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    content: [
      'الوصول: يمكنكم طلب نسخة من بياناتكم الشخصية المحفوظة لدينا.',
      'التصحيح: يمكنكم طلب تصحيح أي معلومات غير دقيقة.',
      'الحذف: يمكنكم طلب حذف بياناتكم في ظروف معينة.',
      'التقييد: يمكنكم طلب تقييد معالجة بياناتكم.',
      'النقل: يمكنكم طلب نقل بياناتكم إلى خدمة أخرى.',
      'الاعتراض: يمكنكم الاعتراض على معالجة بياناتكم لأغراض تسويقية.'
    ]
  },
  {
    id: 'data-retention',
    title: 'الاحتفاظ بالبيانات',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    content: [
      'نحتفظ ببياناتكم فقط للمدة اللازمة لتحقيق الأغراض المحددة.',
      'بيانات الحساب: تُحفظ طالما كان حسابكم نشطاً.',
      'بيانات الطلبات: تُحفظ لمدة 7 سنوات للأغراض المحاسبية والقانونية.',
      'البيانات التسويقية: تُحذف عند إلغاء الاشتراك.',
      'البيانات التقنية: تُحذف تلقائياً بعد فترات محددة.',
      'يمكنكم طلب حذف بياناتكم في أي وقت (مع مراعاة الالتزامات القانونية).'
    ]
  },
  {
    id: 'children-privacy',
    title: 'خصوصية الأطفال',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    content: [
      'خدماتنا مخصصة للأشخاص البالغين (18 عاماً فأكثر).',
      'لا نجمع عمداً معلومات شخصية من الأطفال دون سن 18 عاماً.',
      'إذا علمنا أننا جمعنا معلومات من طفل، سنحذفها فوراً.',
      'نشجع الآباء على مراقبة أنشطة أطفالهم على الإنترنت.',
      'في حالة اكتشاف أي انتهاك، يرجى التواصل معنا فوراً.',
      'نلتزم بحماية خصوصية الأطفال وفقاً للقوانين المعمول بها.'
    ]
  },
  {
    id: 'contact-updates',
    title: 'التواصل والتحديثات',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    content: [
      'لأي استفسارات حول هذه السياسة، تواصلوا معنا على: privacy@mystore.com',
      'سنقوم بإشعاركم بأي تغييرات مهمة في هذه السياسة.',
      'التحديثات ستُنشر على موقعنا مع تاريخ التحديث الجديد.',
      'استمراركم في استخدام خدماتنا يعني موافقتكم على السياسة المحدثة.',
      'يمكنكم دائماً مراجعة أحدث نسخة من السياسة على موقعنا.',
      'نحن ملتزمون بالشفافية والوضوح في جميع ممارساتنا.'
    ]
  }
];

export default function PrivacyPage() {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-500">
            <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900">سياسة الخصوصية</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            سياسة الخصوصية
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-6">
            نحن ملتزمون بحماية خصوصيتكم وأمان بياناتكم الشخصية
          </p>
          <div className="text-sm text-blue-200">
            آخر تحديث: {new Date().toLocaleDateString('ar-SA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">المحتويات</h2>
              <nav className="space-y-2">
                {privacyData.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-right px-3 py-2 rounded-lg transition-colors flex items-center space-x-3 space-x-reverse ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className={`${activeSection === section.id ? 'text-blue-600' : 'text-gray-400'}`}>
                      {section.icon}
                    </div>
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
              
              {/* Quick Contact */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">أسئلة حول الخصوصية؟</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <a href="mailto:privacy@mystore.com" className="block text-blue-600 hover:text-blue-700">
                    privacy@mystore.com
                  </a>
                  <a href="tel:+966501234567" className="block text-blue-600 hover:text-blue-700">
                    +966 50 123 4567
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg">
              {privacyData.map((section) => (
                <div
                  key={section.id}
                  className={`p-6 sm:p-8 ${
                    activeSection === section.id ? 'block' : 'hidden'
                  }`}
                >
                  <div className="flex items-center space-x-3 space-x-reverse mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {section.icon}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-gray-700 leading-relaxed">
                        • {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => {
                  const currentIndex = privacyData.findIndex(section => section.id === activeSection);
                  if (currentIndex > 0) {
                    setActiveSection(privacyData[currentIndex - 1].id);
                  }
                }}
                disabled={privacyData.findIndex(section => section.id === activeSection) === 0}
                className="flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>القسم السابق</span>
              </button>

              <button
                onClick={() => {
                  const currentIndex = privacyData.findIndex(section => section.id === activeSection);
                  if (currentIndex < privacyData.length - 1) {
                    setActiveSection(privacyData[currentIndex + 1].id);
                  }
                }}
                disabled={privacyData.findIndex(section => section.id === activeSection) === privacyData.length - 1}
                className="flex items-center justify-center space-x-2 space-x-reverse px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>القسم التالي</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Data Protection Notice */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start space-x-3 space-x-reverse">
                <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">التزامنا بحماية البيانات</h3>
                  <p className="text-green-700 leading-relaxed">
                    نحن ملتزمون بأعلى معايير حماية البيانات ونستخدم أحدث التقنيات لضمان أمان معلوماتكم. 
                    بياناتكم محمية بتشفير متقدم ونحن نراجع ممارساتنا الأمنية بانتظام.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Resources */}
            <div className="mt-8 bg-gray-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">موارد ذات صلة</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  href="/terms"
                  className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">الشروط والأحكام</h4>
                    <p className="text-xs text-gray-600">قوانين الاستخدام</p>
                  </div>
                </Link>

                <Link
                  href="/contact"
                  className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">اتصل بنا</h4>
                    <p className="text-xs text-gray-600">للاستفسارات</p>
                  </div>
                </Link>

                <div className="flex items-center space-x-3 space-x-reverse p-4 bg-white rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">أمان البيانات</h4>
                    <p className="text-xs text-gray-600">حماية متقدمة</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
